import { generateCode } from "../../../shared";

import Team from "../models/team.model";

class TeamHooks {
  static async generateCode(areaData: Team) {
    const code = generateCode("area");

    areaData.code = code;
  }

  static register() {
    Team.addHook("beforeCreate", TeamHooks.generateCode);
  }
}

export default TeamHooks;
