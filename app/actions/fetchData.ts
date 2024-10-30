"use server";
import dbConnect from "@/lib/db/dbConnect";
import IsletmeModel from "@/lib/models/IsletmeModel";
import { Parameter } from "@/lib/types/types";
import {
  DestekModel,
  ProgramModel,
  SectorModel,
} from "@/lib/models/ParametersModel";

export const fetchIsletme = async (queryType: string, queryText: string) => {
  try {
    await dbConnect();
    let isletme;
    if (queryType === "unvan") {
      const pattern = new RegExp(`^${queryText}`, "i");
      const isletmeler = await IsletmeModel.find(
        { unvan: pattern },
        { _id: 0 }
      );
      if (isletmeler.length === 0) {
        return { msg: "Böyle bir işletme bulunmuyor", status: false };
      }
      isletme = isletmeler[0];
    } else if (queryType === "vergino") {
      isletme = await IsletmeModel.findOne({ vergiNo: queryText }, { _id: 0 });
      if (!isletme) {
        return { msg: "Böyle bir işletme bulunmuyor", status: false };
      }
    } else if (queryType === "id") {
      isletme = await IsletmeModel.findOne({ id: queryText }, { _id: 0 });
      if (!isletme) {
        return { msg: "Böyle bir işletme bulunmuyor", status: false };
      }
    } else {
      return { msg: "Geçersiz sorgu türü.", status: false };
    }
    if (isletme && isletme.projeler) {
      for (const proje of isletme.projeler) {
        if (proje._id) {
          proje._id = proje._id.toString();
        }
        if (proje.odemeler) {
          for (const odeme of proje.odemeler) {
            if (odeme._id) {
              odeme._id = odeme._id.toString();
            }
          }
        }
      }
    }
    return { msg: "İşletme bulundu.", status: true, data: isletme };
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    return { msg: "Bir hata oluştu.", status: false };
  }
};

export const fetchProjeler = async (durum: string): Promise<any[]> => {
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
          isletmeId: "$id",
          vergiNo: "$vergiNo",
          program: "$projeler.program",
          id: "$projeler.id",
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

    return projeler;
  } catch (error) {
    console.error("Proje alırken hata oluştu: ", error);
    throw new Error("Proje alırken hata oluştu");
  }
};

export const fetchOdemeler = async (durum: string): Promise<any[]> => {
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
      {
        $unwind: {
          path: "$odeme",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          unvan: "$unvan",
          vergiNo: "$vergiNo",
          projeId: "$projeler.id",
          isletmeId: "$id",
          id: "$odeme.id",
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
      { $sort: { gecenGunsayisi: -1 } },
    ]);

    return allOdemes;
  } catch (error) {
    console.error("Ödeme alma hatası:", error);
    throw new Error("Ödemeleri alırken hata oluştu. Lütfen tekrar deneyin.");
  }
};

export const fetchIsletmeler = async (): Promise<any[]> => {
  try {
    await dbConnect();

    const allIsletmes = await IsletmeModel.aggregate([
      {
        $project: {
          _id: 0,
          id: "$id",
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
    return allIsletmes;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw new Error("İşletmeler alınırken hata oluştu. Lütfen tekrar deneyin.");
  }
};

const fetchFromModel = async (model: any): Promise<Parameter[]> => {
  try {
    await dbConnect();
    const allItems = await model.find({}, { _id: 0 }).lean();
    return allItems as Parameter[];
  } catch (error) {
    console.error(`Error fetching from model ${model.modelName}:`, error);
    return [];
  }
};

export const fetchPrograms = async (): Promise<Parameter[]> => {
  return fetchFromModel(ProgramModel);
};

export const fetchDesteks = async (): Promise<Parameter[]> => {
  return fetchFromModel(DestekModel);
};

export const fetchSectors = async (): Promise<Parameter[]> => {
  return fetchFromModel(SectorModel);
};
