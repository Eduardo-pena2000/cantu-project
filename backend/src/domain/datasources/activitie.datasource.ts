import { PaginatedResponse } from "../../shared";

import {
  AssigmentActivitieDto,
  CreateActivitieDto,
  IGetActivitiesParams,
  QualifyActivitieDto,
} from "../dtos";
import { ActivitieAssignmentEntity, ActivitieEntity } from "../entities";

export abstract class ActivitieDatasource {
  abstract assignment(data: AssigmentActivitieDto): Promise<ActivitieAssignmentEntity>;
  abstract create(data: CreateActivitieDto): Promise<ActivitieEntity>;
  abstract delete(id: number): Promise<void>;
  abstract deleteAssignedActivity(id: number): Promise<void>;
  abstract findAll(params: IGetActivitiesParams): Promise<PaginatedResponse<ActivitieEntity>>;
  abstract findAllByArea(params: IGetActivitiesParams): Promise<PaginatedResponse<ActivitieEntity>>;
  abstract findById(id: number): Promise<ActivitieEntity | null>;
  abstract findAssignedActivitieById(id: number): Promise<ActivitieAssignmentEntity | null>;
  abstract qualify(data: QualifyActivitieDto): Promise<void>;
  abstract update(id: number, data: Partial<CreateActivitieDto>): Promise<void>;
  abstract updateAssignedActivitie(
    id: number,
    data: Partial<AssigmentActivitieDto>
  ): Promise<ActivitieAssignmentEntity>;
}
