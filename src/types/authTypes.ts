export interface IUser {
  id?: string;
  username: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber?: string;
  region?: string;
  city?: string;
  avatar?: {
    name: string;
    data: { data: any };
    contentType: string;
  };
  meetList?: [];
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface ISuccessLogInResponse {
  data: {
    id: string;
    username: string;
    accessToken: string;
  };
}

export interface IErrorResponse {
  error: {
    data: {
      message: string;
    };
    status: string;
  };
}

export interface ITokenResponse {
  UserInfo: {
    id: string;
    username: string;
  };
}

export interface IMeetInfo {
  id: string;
  adminID: string;
  meetName: string;
  description: string;
  time: string;
  date: string;
  img?: string;
  userList?: [];
}

export interface IMyInfo extends IUser {
  userList: IMeetInfo[];
}

export interface IUseGetMyInfoQuery {
  data: IMyInfo;
  isSuccess: any;
}
