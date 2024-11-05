"use server";
import dbConnect from "@/lib/db/dbConnect";
import IsletmeModel from "@/lib/models/IsletmeModel";
import {
  DisplayIsletmes,
  DisplayOdemes,
  DisplayProjects,
  Parameter,
} from "@/lib/types/types";
import {
  DestekModel,
  ProgramModel,
  SectorModel,
} from "@/lib/models/ParametersModel";

export const fetchIsletme = async (queryText: string, queryType: string) => {
  try {
    await dbConnect();
    let isletme;
    if (queryType === "unvan") {
      const pattern = new RegExp(`^${queryText}`, "i");
      const isletmeler = await IsletmeModel.find({ unvan: pattern });
      if (isletmeler.length === 0) {
        return { msg: "Böyle bir işletme bulunmuyor", status: false };
      }
      const filteredIsletmeler = JSON.parse(JSON.stringify(isletmeler));
      isletme = filteredIsletmeler[0];
    } else if (queryType === "vergiNo") {
      const res = await IsletmeModel.findOne({ vergiNo: queryText });
      if (!res) {
        return { msg: "Böyle bir işletme bulunmuyor", status: false };
      }
      isletme = JSON.parse(JSON.stringify(res));
    } else if (queryType === "id") {
      const res = await IsletmeModel.findOne({ sistemId: queryText });
      if (!res) {
        return { msg: "Böyle bir işletme bulunmuyor", status: false };
      }
      isletme = JSON.parse(JSON.stringify(res));
    } else {
      return { msg: "Geçersiz sorgu türü.", status: false };
    }
    return { msg: "İşletme bulundu.", status: true, data: isletme };
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    return { msg: "Bir hata oluştu.", status: false };
  }
};

export const fetchProjeler = async (
  durum: string
): Promise<DisplayProjects[]> => {
  if (!durum) {
    throw new Error("Durum parametresi gerekli.");
  }
  try {
    await dbConnect();
    const matchStage = durum === "Tümü" ? {} : { "projeler.durum": durum };
    const projeler = await IsletmeModel.aggregate([
      { $unwind: "$projeler" },
      { $match: matchStage },
      {
        $project: {
          _id: 0,
          unvan: "$unvan",
          isletmeId: "$_id",
          vergiNo: "$vergiNo",
          program: "$projeler.program",
          id: "$projeler._id",
          baslamaTarihi: {
            $dateFromString: { dateString: "$projeler.baslamaTarihi" },
          },
          sure: "$projeler.sure",
          tamamlanmaTarihi: {
            $dateFromString: { dateString: "$projeler.tamamlanmaTarihi" },
          },
          takipTarihi: {
            $dateFromString: { dateString: "$projeler.takipTarihi" },
          },
          numberOfOdeme: {
            $cond: {
              if: { $isArray: "$projeler.odemeler" },
              then: { $size: "$projeler.odemeler" },
              else: "NA",
            },
          },
          gecenGunsayisi: {
            $dateDiff: {
              startDate: "$$NOW",
              endDate: {
                $dateFromString: { dateString: "$projeler.takipTarihi" },
              },
              unit: "day",
            },
          },
          durum: "$projeler.durum",
        },
      },
      { $sort: { gecenGunsayisi: 1 } },
    ]);
    const filteredAllItems: DisplayProjects[] = JSON.parse(
      JSON.stringify(projeler)
    );
    return filteredAllItems;
  } catch (error) {
    console.error("Proje alırken hata oluştu: ", error);
    throw new Error("Proje alırken hata oluştu");
  }
};

export const fetchOdemeler = async (
  durum: string
): Promise<DisplayOdemes[]> => {
  if (!durum) {
    throw new Error("Durum parametresi gerekli.");
  }
  try {
    await dbConnect();
    const allOdemes = await IsletmeModel.aggregate([
      {
        $unwind: "$projeler",
      },
      {
        $addFields: {
          odeme: {
            $filter: {
              input: "$projeler.odemeler",
              as: "odemeler",
              cond: { $eq: ["$$odemeler.durum", durum] },
            },
          },
        },
      },
      { $unwind: "$odeme" },
      {
        $match: {
          "odeme.durum": durum,
        },
      },
      {
        $project: {
          _id: 0,
          unvan: "$unvan",
          vergiNo: "$vergiNo",
          projeId: "$projeler._id",
          isletmeId: "$_id",
          id: "$odeme._id",
          program: "$projeler.program",
          baslamaTarihi: {
            $dateFromString: { dateString: "$projeler.baslamaTarihi" },
          },
          karekod: "$odeme.karekod",
          tarih: { $dateFromString: { dateString: "$odeme.tarih" } },
          tutar: "$odeme.tutar",
          durum: "$odeme.durum",
          gecenGunsayisi: {
            $dateDiff: {
              startDate: { $dateFromString: { dateString: "$odeme.tarih" } },
              endDate: "$$NOW",
              unit: "day",
            },
          },
        },
      },
      { $sort: { tarih: -1 } },
    ]);
    const filteredAllItems: DisplayOdemes[] = JSON.parse(
      JSON.stringify(allOdemes)
    );
    return filteredAllItems;
  } catch (error) {
    console.error("Ödeme alma hatası:", error);
    throw new Error("Ödemeleri alırken hata oluştu. Lütfen tekrar deneyin.");
  }
};

export const fetchIsletmeler = async (): Promise<DisplayIsletmes[]> => {
  try {
    await dbConnect();

    const allIsletmes = await IsletmeModel.aggregate([
      {
        $project: {
          _id: 0,
          id: "$_id",
          unvan: "$unvan",
          vergiNo: "$vergiNo",
          naceKodu: "$naceKodu",
          mail: "$mail",
          notlar: "$notlar",
          numberOfProje: {
            $size: { $ifNull: ["$projeler", []] },
          },
        },
      },
    ]);
    const filteredAllItems: DisplayIsletmes[] = JSON.parse(
      JSON.stringify(allIsletmes)
    );
    return filteredAllItems;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw new Error("İşletmeler alınırken hata oluştu. Lütfen tekrar deneyin.");
  }
};

const fetchFromModel = async (model: any): Promise<Parameter[]> => {
  try {
    await dbConnect();
    const allItems = await model.find({}).lean();
    const filteredAllItems: Parameter[] = JSON.parse(JSON.stringify(allItems));
    return filteredAllItems as Parameter[];
  } catch (error) {
    console.error(`Error fetching from model ${model.modelName}:`, error);
    return [];
  }
};

export const fetchPrograms = async (): Promise<Parameter[]> => {
  return fetchFromModel(ProgramModel);
};

export const fetchDesteks = async (): Promise<Parameter[]> => {
  try {
    await dbConnect();
    const allItems = await DestekModel.find({}).lean();
    const filteredAllItems: Parameter[] = JSON.parse(JSON.stringify(allItems));
    return filteredAllItems as Parameter[];
  } catch (error) {
    console.error(`Error fetching from model`, error);
    return [];
  }
};

export const fetchSectors = async (): Promise<Parameter[]> => {
  return fetchFromModel(SectorModel);
};
