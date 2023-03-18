import mongoose from "mongoose";



export class DataBase {

static async initDataBase(url: string){
  try {
    mongoose.set('strictQuery',false)
    const database = await mongoose.connect(url);

  } catch (error) {
    console.error(error); 
  }
}

}