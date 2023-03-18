import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";


@modelOptions({
  options: { customName: "statistics" },
  schemaOptions: { versionKey: false },
})
export class StatisticsModel {

  @prop({ required: true})
  phone!: string;

  @prop({ required: true})
  message!: string;

  @prop()
  send!: boolean;

  @prop()
  error!: string;
}

export const Statistics = getModelForClass(StatisticsModel);
