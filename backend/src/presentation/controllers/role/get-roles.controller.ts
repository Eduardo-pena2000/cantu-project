import { GetRolesUseCase } from "../../../application";
import { Controller, HttpNext, HttpResponse } from "../../../shared";

export class GetRolesController implements Controller {
  constructor(private getRolesUseCase: GetRolesUseCase) {}

  async handle(_: unknown, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const roles = await this.getRolesUseCase.execute();

      return {
        statusCode: 200,
        message: "Roles obtenidos exitosamente",
        body: roles,
      } as HttpResponse;
    } catch (error) {
      httpNext(error);
    }
  }
}
