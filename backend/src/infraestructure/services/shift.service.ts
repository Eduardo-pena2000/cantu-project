import { AppError } from "../../shared";

import { createSchedulesDto } from "../../domain/dtos";

export class ShiftService {
  validateSchadules(schedules: createSchedulesDto[]) {
    const intervals = schedules.map((s) => ({
      start: parseInt(s.start_time.split(":")[0], 10) * 60 + parseInt(s.start_time.split(":")[1], 10),
      end: parseInt(s.end_time.split(":")[0], 10) * 60 + parseInt(s.end_time.split(":")[1], 10),
      week_day: s.week_day,
    }));

    intervals.sort((a, b) => a.start - b.start);

    for (let i = 0; i < intervals.length - 1; i++) {
      if (intervals[i].end > intervals[i + 1].start && intervals[i].week_day === intervals[i + 1].week_day) {
        throw AppError.notFound("Los horarios de los turnos se intercalan. Por favor revisa los intervalos.");
      }
    }
  }
}
