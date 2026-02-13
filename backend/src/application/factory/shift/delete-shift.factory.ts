import { ShiftDatasourceImpl, ShiftRepositoryImpl } from "../../../infraestructure";
import { DeleteShiftController } from "../../../presentation";

import { DeleteShiftUseCase } from "../../use-cases";

export const makeDeleteShiftController = (): DeleteShiftController => {
  const shiftDatasource = new ShiftDatasourceImpl();
  const shiftRepository = new ShiftRepositoryImpl(shiftDatasource);

  const createShiftUseCase = new DeleteShiftUseCase(shiftRepository);

  return new DeleteShiftController(createShiftUseCase);
};
