import { Request, Response } from "express";

import { GetAssistanceHistoryDto } from "../../../domain";
import { GetAssistanceHistoryUseCase } from "../../../application";

export class GetAssistanceHistoryController {
  constructor(private readonly getAssistanceHistoryUseCase: GetAssistanceHistoryUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    const [error, getAssistanceHistoryDto] = GetAssistanceHistoryDto.create({ ...req.query });

    if (error) {
      res.status(400).json({ error });
      return;
    }

    const history = await this.getAssistanceHistoryUseCase.execute(getAssistanceHistoryDto!);

    res.json({
      body: history,
    });
  }
}
