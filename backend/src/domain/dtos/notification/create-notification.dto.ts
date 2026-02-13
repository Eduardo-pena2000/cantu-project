export interface CreateNotificationDTO {
  title: string;
  description: string;
  type: string;
  user_id: number;
  date: Date;
  metadata?: { [key: string]: any };
  is_read?: boolean;
}
