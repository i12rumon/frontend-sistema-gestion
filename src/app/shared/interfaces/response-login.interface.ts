export interface LoginResponse {
  Message: string;
  role: number;
  access_token: string;
  refresh_token: string;
  user_id : number
}
