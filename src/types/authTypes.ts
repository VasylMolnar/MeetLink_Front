export interface IUser {
  _id?: string;
  id?: string;
  userId?: string;
  username: string;
  surname: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  region?: string;
  city?: string;
  avatar?: {
    name: string;
    data: { data: any };
    contentType: string;
  };
  meetList?: [];
  friendsList?: [];
  // individualMessages?: [{ userList: []; chatRoomId: ""; messages: [] }];
  individualMessages?: {
    userList: any[];
    chatRoomId: string;
    messages: any[];
  }[];
  individualCall?: any;
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
  _id?: string;
  id?: string;
  adminID?: string;
  meetName: string;
  description: string;
  time?: string;
  date?: string;
  img?: {
    name: string;
    data: { data: any };
    contentType: string;
  };
  userList?: IUser[];
  roomId?: string;
  conferenceId?: string;
  messages?:
    | {
        senderId: string;
        username: string;
        surname: string;
        message: string;
        createdAt: any;
        avatar?: string;
      }
    | [];

  attendees: any;
}

export interface IMyInfo extends IUser {
  messages: (
    | {
        _id: string;
        userId: string;
        meetId: string;
        username: string;
        surname: string;
        email: string;
        password?: string;
      }
    | []
  )[];
}

export interface IUseGetMyInfoQuery {
  data: IMyInfo;
  isSuccess: any;
}

export interface IMessage {
  senderId: string;
  username: string;
  surname: string;
  message: string;
  createdAt: any;
  avatar?: string;
}
