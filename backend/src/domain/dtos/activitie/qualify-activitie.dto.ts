export interface QualifyActivitieDto {
  assignment_activitie_id?: number;
  manager_note?: number;
  shift_manager_note?: number;
  shift_manager_comments?: string;
  manager_comments?: string;
  date_completed?: string;
  is_late?: boolean;
  activitie_image_name?: string | null;
  activitie_image_url?: string | null;
}

export interface IQualifyActivitieRequest {
  body: QualifyActivitieDto;
  file?: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
  };
  user?: any;
}

export interface IUpdateActivitieNoteRequest {
  params: { id: number };
  body: QualifyActivitieDto;
}
