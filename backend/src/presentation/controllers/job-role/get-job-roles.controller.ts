import { GetJobRolesUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetJobRolesController implements Controller {
  constructor(private getJobRolesUseCase: GetJobRolesUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const jobRoles = await this.getJobRolesUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Roles de Trabajo obtenida exitosamente",
        body: jobRoles,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
