import { IRotateTeamsRequest } from "../../../domain/dtos";

import { TeamRepository, ShiftRepository } from "../../../domain/repositories";

export class RotateTeamsUseCase {
  constructor(private teamRepository: TeamRepository, private shiftRepository: ShiftRepository) {}

  async execute(request: IRotateTeamsRequest) {
    const {
      body: { store_id },
    } = request;

    const [oldTeam01, oldTeam02] = await this.teamRepository.findAllActivesByStore(true, store_id);

    const newTeam01 = {
      name: oldTeam01.name,
      store_id,
      shift_id: oldTeam02.shift?.id!,
    };

    const newTeamCreated01 = await this.teamRepository.create(newTeam01);

    await this.teamRepository.assignManager({
      team_id: newTeamCreated01.id,
      user_id: oldTeam01.managers?.find((manager) => manager.manager_info?.is_main_manager)?.id!,
      is_main_manager: true,
    });

    const newTeam01Shift = (await this.teamRepository.findById(newTeamCreated01.id))?.shift;

    const newTeam02 = {
      name: oldTeam02.name,
      store_id,
      shift_id: oldTeam01.shift?.id!,
      manager_id: oldTeam02.managers?.find((manager) => manager.manager_info?.is_main_manager)?.id,
    };

    const newTeamCreated02 = await this.teamRepository.create(newTeam02);

    await this.teamRepository.assignManager({
      team_id: newTeamCreated02.id,
      user_id: oldTeam02.managers?.find((manager) => manager.manager_info?.is_main_manager)?.id!,
      is_main_manager: true,
    });

    const newTeam02Shift = (await this.teamRepository.findById(newTeamCreated02.id))?.shift;

    const usersTeam01 = oldTeam01.users?.map((user) => ({
      team_id: newTeamCreated01.id,
      user_id: user.id,
    }))!;

    const usersTeam02 = oldTeam02.users?.map((user) => ({
      team_id: newTeamCreated02.id,
      user_id: user.id,
    }))!;

    await this.teamRepository.assignUsersBulk(usersTeam01);

    await this.teamRepository.assignUsersBulk(usersTeam02);

    const newTeam01Map = new Map(newTeam01Shift?.schedules.map((schedule) => [schedule.week_day, schedule.id]));

    const newTeam02Map = new Map(newTeam02Shift?.schedules.map((schedule) => [schedule.week_day, schedule.id]));

    const usersShiftSchedule = [];

    for (const user of oldTeam01.users || []) {
      for (const schedule of user.schedules || []) {
        const newScheduleId = newTeam01Map.get(schedule.week_day);

        if (newScheduleId) {
          usersShiftSchedule.push({
            user_id: user.id,
            schedule_id: newScheduleId,
            team_id: newTeamCreated01.id,
          });
        }
      }
    }

    for (const user of oldTeam02.users || []) {
      for (const schedule of user.schedules || []) {
        const newScheduleId = newTeam02Map.get(schedule.week_day);

        if (newScheduleId) {
          usersShiftSchedule.push({
            user_id: user.id,
            schedule_id: newScheduleId,
            team_id: newTeamCreated02.id,
          });
        }
      }
    }

    await this.shiftRepository.deleteShiftSchedules();

    await this.shiftRepository.assignScheduleToUsersBulk(usersShiftSchedule);

    const oldUsersToUnassign: { team_id: number; user_id: number }[] = [];

    oldTeam01.users?.map((user) => {
      oldUsersToUnassign.push({
        team_id: oldTeam01.id,
        user_id: user.id,
      });
    });

    oldTeam02.users?.map((user) => {
      oldUsersToUnassign.push({
        team_id: oldTeam02.id,
        user_id: user.id,
      });
    });

    for (const user of oldUsersToUnassign) {
      await this.teamRepository.unassignUser(user.user_id, user.team_id);
    }

    await this.teamRepository.update(oldTeam01.id, { is_active: false });

    await this.teamRepository.update(oldTeam02.id, { is_active: false });
  }
}
