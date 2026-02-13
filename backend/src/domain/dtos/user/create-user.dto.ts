export interface CreateUserDto {
  names: string;
  last_names: string;
  phone: string;
  email: string;
  username: string;
  is_active: boolean;
  address?: string;
  avatar_url?: string | null;
  avatar_name?: string | null;
  store_id?: number;
  area_id?: number | null;
  password?: string;
}

export interface ICreateUserRequest {
  body: CreateUserDto & { roles: number[] };
  file?: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
  };
}
