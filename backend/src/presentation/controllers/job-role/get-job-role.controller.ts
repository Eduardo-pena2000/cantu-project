import { GetJobRoleUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class GetJobRoleController implements Controller {
  constructor(private getJobRoleUseCase: GetJobRoleUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const jobRole = await this.getJobRoleUseCase.execute(httpRequest);

      return {
        statusCode: 200,
        message: "Rol de Trabajo obtenida exitosamente",
        body: jobRole,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
