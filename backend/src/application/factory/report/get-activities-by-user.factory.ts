import { ReportDatasourceImpl, ReportRepositoryImpl } from "../../../infraestructure";
import { GetActivitiesByUserReportController } from "../../../presentation";

import { GetActivitiesByUserReportUseCase } from "../../use-cases";

export const makeGetActivitiesByUserReportController = (): GetActivitiesByUserReportController => {
  const reportDatasource = new ReportDatasourceImpl();
  const reportRepository = new ReportRepositoryImpl(reportDatasource);

  const useCase = new GetActivitiesByUserReportUseCase(reportRepository);

  return new GetActivitiesByUserReportController(useCase);
};
