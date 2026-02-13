import { CreateUserUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class CreateUserController implements Controller {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const user = await this.createUserUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Usuario creado exitasamente",
        body: user,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
