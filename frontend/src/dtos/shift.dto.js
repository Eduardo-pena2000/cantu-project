import { scheduleDto } from "./schedule.dto";

export function shiftDto({ id, name, schedules }) {
  return {
    id,
    name,
    schedules: schedules
      .map((schedule) => scheduleDto(schedule))
      .sort((a, b) => a.weekDay - b.weekDay),
  };
}

export function shiftSchedulesObjectDto(schedules) {
  const obj = {};

  for (let i = 0; i < schedules.length; i++) {
    const schedule = schedules[i];

    obj[schedule.weekDay] = schedule;
  }

  return obj;
}
