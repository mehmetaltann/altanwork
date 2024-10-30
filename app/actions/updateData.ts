"use server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db/dbConnect";
import IsletmeModel from "@/lib/models/IsletmeModel";
import { Isletme } from "@/lib/types/types";
import { revalidatePath } from "next/cache";

interface UpdateResponse {
  msg: string;
  status: boolean;
}

export const updateIsletme = async (
  formData: Isletme
): Promise<UpdateResponse> => {
  const { _id } = formData;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { msg: "Geçersiz ID formatı", status: false };
  }
  try {
    await dbConnect();
    const updatedIsletme = await IsletmeModel.findByIdAndUpdate(_id, formData, {
      new: true,
    });
    if (!updatedIsletme) {
      return { msg: "İşletme bulunamadı", status: false };
    }
    revalidatePath(`/`);
    revalidatePath(`/isletmeler`);
    return { msg: "İşletme başarıyla güncellendi", status: true };
  } catch (error) {
    console.error(`Güncelleme hatası (ID: ${_id}): ${error}`);
    return {
      msg: `İşletme güncellenemedi: ${
        error instanceof Error ? error.message : error
      }`,
      status: false,
    };
  }
};

export const updateProje = async (formData: any): Promise<UpdateResponse> => {
  const { projeId, isletmeId } = formData;
  const newData = Object.fromEntries(
    Object.entries(formData.data).map(([k, v]) => [`projeler.$.${k}`, v])
  );
  try {
    await dbConnect();
    const updatedIsletme = await IsletmeModel.updateOne(
      { id: isletmeId, "projeler.id": projeId },
      { $set: newData }
    );
    if (!updatedIsletme) {
      return { msg: "İşletme bulunamadı", status: false };
    }
    revalidatePath(`/`);
    revalidatePath(`/projeler`);
    return { msg: "Proje başarıyla güncellendi", status: true };
  } catch (error) {
    return {
      msg: `Proje güncellenemedi: ${
        error instanceof Error ? error.message : error
      }`,
      status: false,
    };
  }
};

export const updateOdeme = async (formData: any): Promise<UpdateResponse> => {
  const { odemeId, projeId, isletmeId } = formData;
  const newData = Object.fromEntries(
    Object.entries(formData.data).map(([k, v]) => [
      `projeler.$[].odemeler.$[p].${k}`,
      v,
    ])
  );
  try {
    await dbConnect();
    const updatedIsletme = await IsletmeModel.updateOne(
      {
        id: isletmeId,
        "projeler.odemeler.id": odemeId,
      },
      {
        $set: newData,
      },
      {
        arrayFilters: [{ "p.id": odemeId }],
        upsert: true,
      }
    );

    if (!updatedIsletme.matchedCount) {
      return { msg: "Ödeme bulunamadı", status: false };
    }

    revalidatePath(`/`);
    revalidatePath(`/odemeler`);
    return { msg: "Ödeme başarıyla güncellendi", status: true };
  } catch (error) {
    return {
      msg: `Ödeme güncellenemedi: ${
        error instanceof Error ? error.message : error
      }`,
      status: false,
    };
  }
};