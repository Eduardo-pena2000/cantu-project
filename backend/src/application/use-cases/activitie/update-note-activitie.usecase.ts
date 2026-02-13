import { ActivitieRepository, IUpdateActivitieNoteRequest } from "../../../domain";

import { AppError } from "../../../shared";

export class UpdateActivitieNoteUseCase {
  constructor(private activitieRepository: ActivitieRepository) {}

  async execute(request: IUpdateActivitieNoteRequest): Promise<void> {
    const { body, params } = request;

    const { manager_comments, manager_note, shift_manager_comments, shift_manager_note } = body;

    const activitie = await this.activitieRepository.findAssignedActivitieById(+params.id);

    if (!activitie) {
      throw AppError.notFound("Actividad asignada no encontrada");
    }

    await this.activitieRepository.qualify({
      assignment_activitie_id: +params.id,
      manager_note,
      shift_manager_note,
      manager_comments,
      shift_manager_comments,
    });
  }
}
