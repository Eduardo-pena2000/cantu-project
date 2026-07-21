import { Controller, HttpRequest, HttpResponse, AppError } from "../../../shared";
import { GetAssistanceHistoryDto } from "../../../domain";
import { GetAssistanceHistoryUseCase } from "../../../application";
export class GetAssistanceHistoryController implements Controller {
  constructor(private readonly getAssistanceHistoryUseCase: GetAssistanceHistoryUseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const [error, getAssistanceHistoryDto] = GetAssistanceHistoryDto.create({ ...req.query });

    if (error) {
      throw AppError.badRequest(error);
    }

    const history = await this.getAssistanceHistoryUseCase.execute(getAssistanceHistoryDto!);

    return {
      statusCode: 200,
      message: "History retrieved successfully",
      body: history,
    };
  }
}
