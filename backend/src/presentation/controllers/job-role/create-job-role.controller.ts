import { CreateJobRoleUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class CreateJobRoleController implements Controller {
  constructor(private createJobRoleUseCase: CreateJobRoleUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const jobRole = await this.createJobRoleUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Rol de Trabajo creado exitosamente",
        body: jobRole,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
