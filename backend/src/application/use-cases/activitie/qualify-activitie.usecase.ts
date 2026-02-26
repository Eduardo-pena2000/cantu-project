import {
  ActivitieAssignmentEntity,
  ActivitieRepository,
  FileRepository,
  IQualifyActivitieRequest,
  NotificationRepository,
  RoleRepository,
} from "../../../domain";
import { envs, PushNotificationService, SocketAdapter } from "../../../infraestructure";
import { AppError, safeUrlEncode } from "../../../shared";

export class QualifyActivitieUseCase {
  constructor(
    private readonly activitieRepository: ActivitieRepository,
    private readonly fileRepository: FileRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly roleRepository: RoleRepository,
    private readonly socketAdapter: SocketAdapter
  ) { }

  async execute(request: IQualifyActivitieRequest): Promise<void> {
    const { body, file } = request;
    const { assignment_activitie_id } = body;

    const activitie = await this.findActivitieOrFail(assignment_activitie_id!);

    const { activitie_image_name, activitie_image_url } = await this.handleImageUpload(activitie, file);

    this.updateCompletionData(body, activitie);

    await this.activitieRepository.qualify({
      ...body,
      activitie_image_name,
      activitie_image_url,
    });

    // CRITICAL FIX: Update the activitie object with the new image URL so the notification logic sees it
    if (activitie_image_url) {
      activitie.activitie_image_url = activitie_image_url;
    }

    console.log("Activity updated. Calling notification services...");

    await this.notifyShiftManagerIfNeeded(body, activitie, assignment_activitie_id!);

    await this.notifyGeneralManagersIfNeeded(body, activitie, assignment_activitie_id!);

    await this.sendNotificationIfApplicable(activitie, assignment_activitie_id!);

    await this.notifySupervisorIfNeeded(activitie, assignment_activitie_id!, request.user);
  }

  private async findActivitieOrFail(assignmentActivitieId: number) {
    const activitie = await this.activitieRepository.findAssignedActivitieById(assignmentActivitieId);

    if (!activitie) {
      throw AppError.notFound("Actividad asignada no encontrada");
    }

    return activitie;
  }

  private async handleImageUpload(
    activitie: ActivitieAssignmentEntity,
    file?: { buffer: Buffer }
  ): Promise<{ activitie_image_name: string | null; activitie_image_url: string | null }> {
    if (activitie.activitie_image_name && activitie.activitie_image_url) {
      return {
        activitie_image_name: activitie.activitie_image_name,
        activitie_image_url: activitie.activitie_image_url,
      };
    }

    if (file?.buffer) {
      const { file_name, url } = await this.fileRepository.uploadImage(file.buffer, `/images/qualified_activities`);

      return { activitie_image_name: file_name, activitie_image_url: url };
    }

    return { activitie_image_name: null, activitie_image_url: null };
  }

  private updateCompletionData(body: any, activitie: ActivitieAssignmentEntity): void {
    if (activitie.date_completed) return;

    const now = new Date();
    const timeCompleted = `${now.getHours()}:${now.getMinutes()}`;

    body.date_completed = timeCompleted;
    body.is_late = timeCompleted > activitie.deadline;
  }

  private async sendNotificationIfApplicable(
    activitie: ActivitieAssignmentEntity,
    assignment_activitie_id: number
  ): Promise<void> {
    const tokens = activitie.assistance?.taken_employee?.devices_tokens;

    if (!tokens?.length) return;

    const notification = new PushNotificationService();

    const activityAssigmentEncoded = safeUrlEncode(assignment_activitie_id);

    await notification.send({
      body: `La actividad ${activitie.activity?.name} ha sido calificada.`,
      title: "Actividad revisada por el encargado de turno",
      tokens: tokens.map((t) => t.token),
      url: `${envs.APP_FRONT_HOST}/assignment/rate/${activityAssigmentEncoded}`,
    });
  }

  private async notifyShiftManagerIfNeeded(
    body: any,
    activitie: ActivitieAssignmentEntity,
    assignment_activitie_id: number
  ) {
    if (body.manager_note === undefined) return;

    const shiftManagerId = activitie.assistance?.taken_employee?.id;

    if (!shiftManagerId) return;

    await this.createAndSendNotification(shiftManagerId, activitie, assignment_activitie_id);
  }

  private async notifyGeneralManagersIfNeeded(
    body: any,
    activitie: ActivitieAssignmentEntity,
    assignment_activitie_id: number
  ) {
    if (body.shift_manager_note === undefined) return;

    const managerRole = await this.roleRepository.findBySlug("general_manager");

    const managersIds = managerRole?.users?.map((user) => user.id) ?? [];

    if (managersIds.length === 0) return;

    await Promise.all(
      managersIds.map(
        async (managerId) => await this.createAndSendNotification(managerId, activitie, assignment_activitie_id)
      )
    );
  }

  private async createAndSendNotification(
    user_id: number,
    activitie: ActivitieAssignmentEntity,
    assignment_activitie_id: number
  ) {
    const notification = await this.notificationRepository.create({
      title: "Actividad calificada",
      description: `La actividad ${activitie.activity?.name} ha sido calificada.`,
      user_id,
      type: "ACTIVITIE_QUALIFIED",
      metadata: { assignment_activitie_id },
      date: new Date(),
    });

    this.socketAdapter.emitToUser(user_id, "recent-notification", notification);

    const notifications = await this.notificationRepository.findAllByUser(user_id);

    this.socketAdapter.emitToUser(user_id, "notifications", notifications);
  }

  private async notifySupervisorIfNeeded(
    activitie: ActivitieAssignmentEntity,
    assignment_activitie_id: number,
    currentUser: any
  ) {
    // 1. Verify if image exists (evidence)
    console.log("Checking for evidence...");
    console.log("Image URL:", activitie.activitie_image_url);
    if (!activitie.activitie_image_url) {
      console.log("No evidence (image) found. Skipping notification.");
      return;
    }

    // 2. Get Supervisor and Admin Roles and Users
    const supervisorRole = await this.roleRepository.findBySlug("supervisor");
    const adminRole = await this.roleRepository.findBySlug("admin");

    const supervisors = supervisorRole?.users ?? [];
    const admins = adminRole?.users ?? [];

    const recipients = [...supervisors, ...admins];

    // Remove duplicates using Set and map by ID
    const uniqueRecipients = Array.from(new Map(recipients.map((user) => [user.id, user])).values());

    console.log(`Found ${uniqueRecipients.length} recipients for notification.`);

    if (uniqueRecipients.length === 0) return;

    // 3. Prepare Notification Data
    const storeName = activitie.assistance?.store?.name || "Tienda desconocida";
    const workerName = activitie.assistance?.employee?.names || "Trabajador";
    const managerName = currentUser?.names || "Encargado";

    const title = "Nueva evidencia cargada";
    const description = `El encargado ${managerName} subió evidencia en ${storeName} para la tarea asignada a ${workerName}.`;

    console.log("Creating notifications for:", uniqueRecipients.map(u => u.email));

    // 4. Send Notifications
    await Promise.all(
      uniqueRecipients.map(async (recipient) => {
        try {
          const notification = await this.notificationRepository.create({
            title,
            description,
            user_id: recipient.id,
            type: "EVIDENCE_UPLOADED",
            metadata: {
              assignment_activitie_id,
              store_id: activitie.assistance?.store?.id,
              worker_id: activitie.assistance?.employee?.id,
              manager_id: currentUser?.id,
            },
            date: new Date(),
          });

          console.log(`Notification created for user ${recipient.id}: ${notification.id}`);

          this.socketAdapter.emitToUser(recipient.id, "recent-notification", notification);
          const notifications = await this.notificationRepository.findAllByUser(recipient.id);
          this.socketAdapter.emitToUser(recipient.id, "notifications", notifications);
        } catch (error) {
          console.error(`Error sending notification to user ${recipient.id}:`, error);
        }
      })
    );
  }
}
