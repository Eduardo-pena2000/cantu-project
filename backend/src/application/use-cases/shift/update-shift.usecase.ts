import { AppError } from "../../../shared";

import { IUpdateShiftRequest } from "../../../domain/dtos";
import { ShiftRepository } from "../../../domain/repositories";
import { ShiftService } from "../../../infraestructure/services";

export class UpdateShiftUseCase {
  constructor(private shiftRepository: ShiftRepository, private shiftService: ShiftService) {}

  async execute(request: IUpdateShiftRequest): Promise<void> {
    const { body, params } = request;

    const { name, schedules } = body;

    const shift = await this.shiftRepository.findById(params.id);

    if (!shift) {
      throw AppError.notFound("El turno no existe");
    }

    await this.shiftRepository.update(shift.id, { name });

    if (schedules) {
      this.shiftService.validateSchadules(schedules);

      const schedulesIds = schedules.map((schedule) => schedule.id);

      const currentSchedules = shift.schedules.map((schedule) => schedule.id);

      const schedulesToAdd = schedules.filter((schedule) => !currentSchedules.includes(schedule.id!));

      const schedulesToRemove = currentSchedules.filter((id) => !schedulesIds.includes(id));

      if (schedulesToAdd.length > 0) {
        await Promise.all(
          schedulesToAdd.map(async (schedule) => {
            await this.shiftRepository.createSchedule({ ...schedule, shift_id: shift.id });
          })
        );
      }

      if (schedulesToRemove.length > 0) {
        await Promise.all(
          schedulesToRemove.map(async (schedule) => {
            await this.shiftRepository.deleteSchedule(schedule);
          })
        );
      }

      schedules.map((schedule) => {
        if (schedule.id) {
          return this.shiftRepository.updateSchedule(schedule.id, {
            ...schedule,
            shift_id: shift.id,
          });
        }
      });
    }
  }
}
