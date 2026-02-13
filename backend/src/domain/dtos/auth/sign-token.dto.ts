export interface SignTokenDto {
  id: number;
}

export interface ExpirationTokenOutput {
  renew: boolean;
  timeRemaining: number;
}
