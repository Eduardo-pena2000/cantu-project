import { generateCode } from "../../../shared";

import Store from "../models/store.model";

class StoreHooks {
  static async generateCode(storeData: Store) {
    const code = generateCode("area");

    storeData.code = code;
  }

  static register() {
    Store.addHook("beforeCreate", StoreHooks.generateCode);
  }
}

export default StoreHooks;
