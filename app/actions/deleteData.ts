import dbConnect from "@/lib/db/dbConnect";
import IsletmeModel from "@/lib/models/IsletmeModel";
import { revalidatePath } from "next/cache";

export const deleteIsletme = async (_id: string) => {
  try {
    try {
      await dbConnect();
    } catch (error) {
      console.error(error);
      return [];
    }
    await IsletmeModel.findByIdAndDelete(_id);
    revalidatePath(`/`);
    return { msg: "İşletme Silindi" };
  } catch (error) {
    return { msg: `İşletme Silinemedi: ${error}` };
  }
};
