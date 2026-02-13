import { AssistanceDatasourceImpl, AssistanceRepositoryImpl } from "../../../infraestructure";
import { DeleteAssistanceController } from "../../../presentation";

import { DeleteAssistanceUseCase } from "../../use-cases";

export const makeDeleteAssistanceController = (): DeleteAssistanceController => {
  const assistanceDatasource = new AssistanceDatasourceImpl();
  const assistanceRepository = new AssistanceRepositoryImpl(assistanceDatasource);

  const deleteAssistanceUseCase = new DeleteAssistanceUseCase(assistanceRepository);

  return new DeleteAssistanceController(deleteAssistanceUseCase);
};
