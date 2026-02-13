import { RotateTeamsUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class RotateTeamsController implements Controller {
  constructor(private rotateTeamsUseCase: RotateTeamsUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.rotateTeamsUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Equipo rotados exitosamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
