import { UpdateActivitieNoteUseCase } from "../../../application";
import { Controller, HttpNext, HttpRequest, HttpResponse } from "../../../shared";

export class UpdateActivitieNoteController implements Controller {
  constructor(private updateActivitieNoteUseCase: UpdateActivitieNoteUseCase) {}

  async handle(httpRequest: HttpRequest, httpNext: HttpNext["next"]): Promise<HttpResponse | void> {
    try {
      const activitie = await this.updateActivitieNoteUseCase.execute(httpRequest);

      return {
        statusCode: 201,
        message: "Calificación actualizada exitosamente",
        body: activitie,
      };
    } catch (error) {
      httpNext(error);
    }
  }
}
