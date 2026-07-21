import { AssistanceDatasourceImpl, AssistanceRepositoryImpl } from "../../../infraestructure";
import { GetAssistanceHistoryUseCase } from "../../use-cases";
import { GetAssistanceHistoryController } from "../../../presentation/controllers";

export const makeGetAssistanceHistoryController = (): GetAssistanceHistoryController => {
  const datasource = new AssistanceDatasourceImpl();
  const repository = new AssistanceRepositoryImpl(datasource);
  const useCase = new GetAssistanceHistoryUseCase(repository);

  return new GetAssistanceHistoryController(useCase);
};
