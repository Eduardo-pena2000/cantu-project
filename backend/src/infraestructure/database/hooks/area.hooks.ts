import { generateCode } from "../../../shared";

import Area from "../models/area.model";

class AreaHooks {
  static async generateCode(areaData: Area) {
    const code = generateCode("area");

    areaData.code = code;
  }

  static register() {
    Area.addHook("beforeCreate", AreaHooks.generateCode);
  }
}

export default AreaHooks;
