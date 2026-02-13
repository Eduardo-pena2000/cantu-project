import { ShiftDatasourceImpl, ShiftRepositoryImpl } from "../../../infraestructure";
import { GetShiftController } from "../../../presentation";

import { GetShiftUseCase } from "../../use-cases";

export const makeGetShiftController = (): GetShiftController => {
  const shiftDatasource = new ShiftDatasourceImpl();
  const shiftRepository = new ShiftRepositoryImpl(shiftDatasource);

  const createShiftUseCase = new GetShiftUseCase(shiftRepository);

  return new GetShiftController(createShiftUseCase);
};
