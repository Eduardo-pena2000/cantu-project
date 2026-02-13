import { AssignAreaToUsersUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class AssignAreaToUsersController implements Controller {
  constructor(private assignAreaToUsersUserUseCase: AssignAreaToUsersUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      await this.assignAreaToUsersUserUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Area asignada exitasamente",
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
