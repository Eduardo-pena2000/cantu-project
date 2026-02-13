import { ShiftDatasourceImpl, ShiftRepositoryImpl, ShiftService } from "../../../infraestructure";
import { CreateShiftController } from "../../../presentation";

import { CreateShiftUseCase } from "../../use-cases";

export const makeCreateShiftController = (): CreateShiftController => {
  const shiftDatasource = new ShiftDatasourceImpl();
  const shiftRepository = new ShiftRepositoryImpl(shiftDatasource);

  const shiftService = new ShiftService();

  const createShiftUseCase = new CreateShiftUseCase(shiftRepository, shiftService);

  return new CreateShiftController(createShiftUseCase);
};
