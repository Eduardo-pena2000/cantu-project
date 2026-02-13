import { ReportDatasourceImpl, ReportRepositoryImpl } from "../../../infraestructure";
import { GetUsersByTeamReportController } from "../../../presentation";

import { GetUsersByTeamReportUseCase } from "../../use-cases";

export const makeGetUserssByTeamReportController = (): GetUsersByTeamReportController => {
  const reportDatasource = new ReportDatasourceImpl();
  const reportRepository = new ReportRepositoryImpl(reportDatasource);

  const useCase = new GetUsersByTeamReportUseCase(reportRepository);

  return new GetUsersByTeamReportController(useCase);
};
