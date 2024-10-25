import dbConnect from "@/lib/db/dbConnect";
import IsletmeModel from "@/lib/models/IsletmeModel";
import { Isletme } from "@/lib/types/types";

export const fetchIsletmeler = async () => {
  try {
    try {
      await dbConnect();
    } catch (error) {
      console.error(error);
      return [];
    }
    const response = await IsletmeModel.find({});
    console.log(response)
    const allIsletmes: Isletme[] = JSON.parse(JSON.stringify(response));
    return allIsletmes;
  } catch (error) {
    console.log(error);
  }
};

export const fetchIsletme = async (queryType: string, queryText: string) => {
  try {
    try {
      await dbConnect();
    } catch (error) {
      console.error(error);
      return [];
    }
    if (queryType === "vergino") {
      const isletme = IsletmeModel.findOne({ vergiNo: queryText }, { _id: 0 });
      if (!isletme) return { msg: "Aradığınız İşletme Bulunamadı" };
      return isletme;
    } else if (queryType === "id") {
      const isletme = IsletmeModel.findOne({ id: queryText }, { _id: 0 });
      if (!isletme) return { msg: "Aradığınız İşletme Bulunamadı" };
      return isletme;
    } else if (queryType === "unvan") {
      const isletme = IsletmeModel.find(
        { unvan: { $regex: queryText, $options: "i" } },
        { _id: 0 }
      ).limit(1);
      if (!isletme) return { msg: "Aradığınız İşletme Bulunamadı" };
      return isletme;
    }
  } catch (error) {
    console.log(error);
  }
};
