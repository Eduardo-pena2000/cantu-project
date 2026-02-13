import { getUserFullName, getUserShortFullName } from "@/utils";

function getManager(managers) {
  const manager = managers.find((user) => user.manager_info.is_main_manager);

  if (manager) {
    const { id, avatar_url, names, last_names, email } = manager;

    return {
      id,
      image: avatar_url ?? null,
      names,
      lastNames: last_names,
      fullName: getUserFullName(names, last_names),
      shortFullName: getUserShortFullName(names, last_names),
      email,
    };
  }

  return null;
}

function getTemporalManager(managers) {
  const temporalManager = managers.find((user) => !user.manager_info.is_main_manager);

  if (temporalManager) {
    const { id, avatar_url, names, last_names, email, manager_info } = temporalManager;

    return {
      id,
      image: avatar_url ?? null,
      names,
      lastNames: last_names,
      fullName: getUserFullName(names, last_names),
      shortFullName: getUserShortFullName(names, last_names),
      email,
      startDate: manager_info.start_date,
      endDate: manager_info.end_date,
    };
  }

  return null;
}

export function teamDto({ id, name, code, shift, managers, is_active }) {
  return {
    id,
    name,
    code,
    shift: shift
      ? {
          id: shift.id,
          name: shift.name,
          schedules: shift.schedules
            .map((schedule) => ({
              id: schedule.id,
              day: schedule.day,
              startTime: schedule.start_time,
              endTime: schedule.end_time,
            }))
            .sort((a, b) => a.weekDay - b.weekDay),
        }
      : null,
    manager: getManager(managers),
    temporalManager: getTemporalManager(managers),
    isActive: is_active,
  };
}

export function teamWithUsersDto({ id, name, code, shift, managers, users, is_active }) {
  return {
    id,
    name,
    code,
    shift: shift
      ? {
          id: shift.id,
          name: shift.name,
          schedules: shift.schedules
            .map((schedule) => ({
              id: schedule.id,
              day: schedule.day,
              weekDay: schedule.week_day,
              startTime: schedule.start_time,
              endTime: schedule.end_time,
            }))
            .sort((a, b) => a.weekDay - b.weekDay),
        }
      : null,
    manager: getManager(managers),
    temporalManager: getTemporalManager(managers),
    users: users.map((user) => ({
      id: user.id,
      image: user.avatar_url ?? null,
      names: user.names,
      lastNames: user.last_names,
      fullName: getUserFullName(user.names, user.last_names),
      shortFullName: getUserShortFullName(user.names, user.last_names),
      email: user.email,
      schedules: user.schedules
        .map((schedule) => ({
          id: schedule.id,
          day: schedule.day,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          weekDay: schedule.week_day,
        }))
        .sort((a, b) => a.weekDay - b.weekDay),
    })),
    isActive: is_active,
  };
}
