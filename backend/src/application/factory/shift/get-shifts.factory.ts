import { ShiftDatasourceImpl, ShiftRepositoryImpl } from "../../../infraestructure";
import { GetShiftsController } from "../../../presentation";

import { GetShiftsUseCase } from "../../use-cases";

export const makeGetShiftsController = (): GetShiftsController => {
  const shiftDatasource = new ShiftDatasourceImpl();
  const shiftRepository = new ShiftRepositoryImpl(shiftDatasource);

  const createShiftUseCase = new GetShiftsUseCase(shiftRepository);

  return new GetShiftsController(createShiftUseCase);
};
