import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { MessageType } from "../enum/messageType.enum";

@modelOptions({
  options: { customName: "messages" },
  schemaOptions: { versionKey: false },
})
export class MessageModel {

  @prop({ required: true, enum : MessageType})
  type!: string;

  @prop({ required: true , unique: true})
  message!: string;

}

export const Message = getModelForClass(MessageModel);
