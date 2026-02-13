export function scheduleDto({ id, day, week_day, is_weekend, start_time, end_time }) {
  return {
    id,
    day,
    weekDay: week_day,
    isWeekend: is_weekend,
    startTime: start_time,
    endTime: end_time,
  };
}

export function activeScheduleDto(schedule) {
  if (schedule === null) return null;

  const { id, day, week_day, is_weekend, start_time, end_time, shift } = schedule;

  return {
    id,
    day,
    weekDay: week_day,
    isWeekend: is_weekend,
    startTime: start_time,
    endTime: end_time,
    shift: {
      id: shift.id,
      name: shift.name,
      team: shift.team
        ? {
            id: shift.team.id,
            name: shift.team.name,
          }
        : null,
    },
  };
}
