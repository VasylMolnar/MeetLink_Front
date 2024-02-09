export interface IUser {
  id?: string;
  username: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber?: string;
  location?: string;
  avatar?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}
