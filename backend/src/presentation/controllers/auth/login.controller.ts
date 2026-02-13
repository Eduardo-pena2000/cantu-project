import { LoginUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class LoginController implements Controller {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const { email, password } = httpRequest.body;

      const data = await this.loginUseCase.execute(email, password);

      return {
        statusCode: 201,
        message: "Login exitoso",
        body: data,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
