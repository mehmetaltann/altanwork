"use server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db/dbConnect";
import IsletmeModel from "@/lib/models/IsletmeModel";
import { revalidatePath } from "next/cache";

interface UpdateResponse {
  msg: string;
  status: boolean;
}

export const updateIsletme = async (
  _id: string,
  formData: any
): Promise<UpdateResponse> => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { msg: "Geçersiz ID formatı", status: false };
  }
  try {
    await dbConnect();
    const updatedIsletme = await IsletmeModel.updateOne(
      { _id },
      {
        $set: formData,
      }
    );
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

export const updateProje = async (
  isletmeId: string,
  projeId: string,
  formData: any
): Promise<UpdateResponse> => {
  const newData = Object.fromEntries(
    Object.entries(formData).map(([k, v]) => [`projeler.$.${k}`, v])
  );
  try {
    await dbConnect();
    const updatedIsletme = await IsletmeModel.updateOne(
      { _id: isletmeId, "projeler._id": projeId },
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

export const updateOdeme = async (
  isletmeId: string,
  formData: any
): Promise<UpdateResponse> => {
  if (!formData) {
    return {
      msg: "Güncellenmiş Ödeme Dosyası Server'a Gelmedi",
      status: false,
    };
  }
  const newData = Object.fromEntries(
    Object.entries(formData).map(([k, v]) => [
      `projeler.$[].odemeler.$[p].${k}`,
      v,
    ])
  );
  try {
    await dbConnect();
    const updatedIsletme = await IsletmeModel.updateOne(
      {
        _id: isletmeId,
        "projeler.odemeler._id": formData._id,
      },
      {
        $set: newData,
      },
      {
        arrayFilters: [{ "p._id": formData._id }],
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
