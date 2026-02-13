import { generateCode } from "../../../shared";

import JobRole from "../models/job-role.model";

class JobRoleHooks {
  static async generateCode(jobRoleData: JobRole) {
    const code = generateCode("job_role");

    jobRoleData.code = code;
  }

  static register() {
    JobRole.addHook("beforeCreate", JobRoleHooks.generateCode);
  }
}

export default JobRoleHooks;
