export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
