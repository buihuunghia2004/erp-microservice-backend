export interface IEmailJob {
  email: string;
}

export interface IVerifyEmailJob extends IEmailJob {
  token: string;
}
export interface IResetPasswordEmailJob extends IEmailJob {
  token: string;
}
