import { CreateDeviceUseCase, CreateUserUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class CreateDeviceController implements Controller {
  constructor(private createDeviceUseCase: CreateDeviceUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const { id } = httpRequest.user!;

      const { token } = httpRequest.body;

      const user = await this.createDeviceUseCase.execute(id, token);

      return {
        statusCode: 201,
        message: "Dispositivo creado exitasamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
