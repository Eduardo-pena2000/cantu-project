import { UpdateUserUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class UpdateUserController implements Controller {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const user = await this.updateUserUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Usuario actualizado exitasamente",
        body: user,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
