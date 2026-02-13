import { ShiftScheduleEntity, ShiftRepository, TeamRepository, UserRepository } from "../../../domain";

import { AppError, Roles } from "../../../shared";

export class GetActiveShiftUseCase {
  constructor(
    private shiftRepository: ShiftRepository,
    private teamRepository: TeamRepository,
    private userRepository: UserRepository
  ) {}

  async execute(store_id: number, user_id: number): Promise<ShiftScheduleEntity | null> {
    const schedules = await this.shiftRepository.findAllSchedules(store_id);

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw AppError.notFound("El usuario no existe");
    }

    const now = new Date();

    let currentDay = now.getDay();

    const currentTime = now.toTimeString().slice(0, 5);
    const currentMinutes = this.timeToMinutes(currentTime);

    if (user.roles.some((role) =>
        [
          Roles.admin,
          Roles.general_manager,
          Roles.store_manager,
          Roles.shift_manager,
          Roles.temporary_shift_manager,
        ].includes(role.id)
      )) {
      return (
        schedules.find(
          ({ end_time, start_time, week_day }) =>
            week_day === currentDay && this.isCurrentTimeInSchedule(currentMinutes, start_time, end_time)
        ) || null
      );
    }

    if (user.roles.some((role) => role.id === Roles.shift_manager)) {
      const activeSchedule = schedules.find(
        ({ end_time, start_time, week_day }) =>
          week_day === currentDay && this.isCurrentTimeInSchedule(currentMinutes, start_time, end_time)
      );

      if (!activeSchedule) return null;

      const teams = await this.teamRepository.findByActiveShift(activeSchedule.id);

      if (teams?.managers?.some((user) => user.id === user_id)) {
        return activeSchedule;
      }

      return null;
    }

    return null;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  private isCurrentTimeInSchedule(currentMinutes: number, start: string, end: string): boolean {
    const startMinutes = this.timeToMinutes(start);
    const endMinutes = this.timeToMinutes(end);

    if (endMinutes > startMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }

    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
}
