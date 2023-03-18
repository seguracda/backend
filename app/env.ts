export class EnvDataBase {
  static readonly URL_MONGO = process.env.URL_MONGO as string;
}

export const EnvSms = {
  URL : process.env.URL_SMS,
  USER : process.env.USER_SMS,
  PASSWORD: process.env.PASSWOR_SMS
}

export const EnvSecret = {
  SECRET_TOKEN : process.env.SECRET_TOKEN
}