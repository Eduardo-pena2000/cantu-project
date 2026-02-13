import { DeleteJobRoleUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class DeleteJobRoleController implements Controller {
  constructor(private deleteJobRoleUseCase: DeleteJobRoleUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.deleteJobRoleUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Rol de Trabajo eliminada exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
