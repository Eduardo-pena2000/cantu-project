import { ReportDatasourceImpl, ReportRepositoryImpl } from "../../../infraestructure";
import { GetTeamsReportController } from "../../../presentation";

import { GetTeamsReportUseCase } from "../../use-cases";

export const makeGetTeamsReportController = (): GetTeamsReportController => {
  const reportDatasource = new ReportDatasourceImpl();
  const reportRepository = new ReportRepositoryImpl(reportDatasource);

  const useCase = new GetTeamsReportUseCase(reportRepository);

  return new GetTeamsReportController(useCase);
};
