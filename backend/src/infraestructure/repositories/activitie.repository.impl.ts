import {
  ActivitieAssignmentEntity,
  ActivitieDatasource,
  ActivitieEntity,
  ActivitieRepository,
  AssigmentActivitieDto,
  BulkAssignmentActivitieDto,
  CreateActivitieDto,
  IGetActivitiesParams,
  QualifyActivitieDto,
} from "../../domain";
import { PaginatedResponse } from "../../shared";

export class ActivitieRepositoryImpl implements ActivitieRepository {
  constructor(private datasource: ActivitieDatasource) {}

  async assignment(data: AssigmentActivitieDto): Promise<ActivitieAssignmentEntity> {
    return await this.datasource.assignment(data);
  }

  async bulkAssignment(data: BulkAssignmentActivitieDto): Promise<ActivitieAssignmentEntity[]> {
    return await this.datasource.bulkAssignment(data);
  }

  async create(data: CreateActivitieDto): Promise<ActivitieEntity> {
    return await this.datasource.create(data);
  }

  async delete(id: number): Promise<void> {
    return await this.datasource.delete(id);
  }

  async deleteAssignedActivity(id: number): Promise<void> {
    return await this.datasource.deleteAssignedActivity(id);
  }

  async findAll(params: IGetActivitiesParams): Promise<PaginatedResponse<ActivitieEntity>> {
    return await this.datasource.findAll(params);
  }

  async findAllByArea(params: IGetActivitiesParams): Promise<PaginatedResponse<ActivitieEntity>> {
    return await this.datasource.findAllByArea(params);
  }

  async findById(id: number): Promise<ActivitieEntity | null> {
    return await this.datasource.findById(id);
  }

  async findAssignedActivitieById(id: number): Promise<ActivitieAssignmentEntity | null> {
    return await this.datasource.findAssignedActivitieById(id);
  }

  async qualify(data: QualifyActivitieDto): Promise<void> {
    return await this.datasource.qualify(data);
  }

  async update(id: number, data: Partial<CreateActivitieDto>): Promise<void> {
    return await this.datasource.update(id, data);
  }

  async updateAssignedActivitie(
    id: number,
    data: Partial<AssigmentActivitieDto>
  ): Promise<ActivitieAssignmentEntity> {
    return await this.datasource.updateAssignedActivitie(id, data);
  }
}
