import { ICreateShiftRequest } from "../../../domain/dtos";
import { ShiftEntity } from "../../../domain/entities";
import { ShiftRepository } from "../../../domain/repositories";
import { ShiftService } from "../../../infraestructure/services";

export class CreateShiftUseCase {
  constructor(private shiftRepository: ShiftRepository, private shiftService: ShiftService) {}

  async execute(request: ICreateShiftRequest): Promise<ShiftEntity> {
    const { body } = request;

    const { name, schedules, store_id } = body;

    if (schedules) {
      this.shiftService.validateSchadules(schedules);
    }

    const shift = await this.shiftRepository.create({
      name,
      store_id,
    });

    if (schedules) {
      await Promise.all(
        schedules.map(async (schedule) => {
          await this.shiftRepository.createSchedule({ ...schedule, shift_id: shift.id });
        })
      );
    }

    return shift;
  }
}
