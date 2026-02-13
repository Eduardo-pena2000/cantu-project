import { UpdateJobRoleUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class UpdateJobRoleController implements Controller {
  constructor(private updateJobRoleUseCase: UpdateJobRoleUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.updateJobRoleUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Rol de Trabajo actualizada exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
