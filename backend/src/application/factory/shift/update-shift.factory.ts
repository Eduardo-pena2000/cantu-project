import { ShiftDatasourceImpl, ShiftRepositoryImpl, ShiftService } from "../../../infraestructure";
import { UpdateShiftController } from "../../../presentation";
import { UpdateShiftUseCase } from "../../use-cases";

export const makeUpdateShiftController = (): UpdateShiftController => {
  const shiftDatasource = new ShiftDatasourceImpl();
  const shiftRepository = new ShiftRepositoryImpl(shiftDatasource);

  const shiftService = new ShiftService();

  const updateShiftUseCase = new UpdateShiftUseCase(shiftRepository, shiftService);

  return new UpdateShiftController(updateShiftUseCase);
};
