import dbConnect from "@/lib/db/dbConnect";
import IsletmeModel from "@/lib/models/IsletmeModel";
import { revalidatePath } from "next/cache";

export const addIsletme = async (formData: any) => {
  try {
    try {
      await dbConnect();
    } catch (error) {
      console.error(error);
      return [];
    }
    await IsletmeModel.create(formData);
    revalidatePath("/");
    return { msg: "İşletme Eklendi", isSuccess: true };
  } catch (error) {
    return { msg: `İşletme Eklenemedi: ${error}`, isSuccess: false };
  }
};
