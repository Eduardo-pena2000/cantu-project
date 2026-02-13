import { GetJobRolesByAreaUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetJobRolesByAreaController implements Controller {
  constructor(private getJobRolesByAreaUseCase: GetJobRolesByAreaUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const { id } = httpRequest.params;

      const jobRoles = await this.getJobRolesByAreaUseCase.execute(id);

      return {
        statusCode: 200,
        message: "Roles de trabajo obtenidos exitosamente",
        body: jobRoles,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
