export interface CreateAssistanceDto {
  employee_id: number;
  schedule_id: number;
  status: string;
  taken_by_employee_id: number;
  assistance_image_name?: string | null;
  assistance_image_url?: string | null;
  store_id?: number | null;
  team_id?: number;
}

export interface ICreateAssistanceRequest {
  body: CreateAssistanceDto;
  file?: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
  };
}
