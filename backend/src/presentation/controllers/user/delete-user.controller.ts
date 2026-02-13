import { DeleteUserUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class DeleteUserController implements Controller {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.deleteUserUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Usuario eliminado exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
