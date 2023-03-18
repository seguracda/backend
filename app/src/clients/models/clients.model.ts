import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  options: { customName: "clients" },
  schemaOptions: { versionKey: false },
})
export class ClientModel {
  @prop({ required: true})
  name!: string;

  @prop({ required: true , unique: true})
  identification_vehicle!: string;

  @prop({ required: true })
  type_vehicle!: string;

  @prop({ required: true })
  identification_number!: string;

  @prop({ required: true })
  phone_one!: string;

  @prop({ required: true })
  phone_two!: string;

  @prop({ default: false })
  sendWhatsappPhone_one!: boolean;

  @prop({ default: false })
  sendWhatsappPhone_two!: boolean;
  
  @prop({ required: true })
  date_expiration!: Date;

  @prop()
  date_birthday!: Date;
}

export const Client = getModelForClass(ClientModel);
