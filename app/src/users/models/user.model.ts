import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  options: { customName: "users" },
  schemaOptions: { versionKey: false },
})
export class UserModel {
  @prop({ required: true ,unique : true})
  email!: string;
  @prop({ required: true })
  name!: string;
  @prop({ required: true })
  password!: string;
}

export const User = getModelForClass(UserModel);
