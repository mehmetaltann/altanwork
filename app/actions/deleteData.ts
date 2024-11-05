"use server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db/dbConnect";
import IsletmeModel from "@/lib/models/IsletmeModel";
import { DestekModel, ProgramModel } from "@/lib/models/ParametersModel";
import { revalidatePath } from "next/cache";

interface DeleteResponse {
  msg: string;
  status: boolean;
}

// Delete Isletme function
export const deleteIsletme = async (_id: string): Promise<DeleteResponse> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return { msg: "Geçersiz ID formatı", status: false };
    }
    await dbConnect();
    const isletme = await IsletmeModel.findById(_id);
    if (!isletme) {
      return { msg: "İşletme bulunamadı", status: false };
    }
    if (isletme.projeler && isletme.projeler.length > 0) {
      return { msg: "Bu İşletme Silinemez, Projeleri Var", status: false };
    }
    await IsletmeModel.findByIdAndDelete(_id);
    revalidatePath(`/`);
    revalidatePath(`/isletmeler`);
    return { msg: "İşletme başarıyla silindi", status: true };
  } catch (error) {
    console.error(`Silme hatası: ${error}`);
    return {
      msg: `İşletme silinemedi: ${
        error instanceof Error ? error.message : error
      }`,
      status: false,
    };
  }
};

// Delete Odeme function
export const deleteOdeme = async (
  isletmeId: string,
  projeId: string,
  odemeId: string
): Promise<DeleteResponse> => {
  if (!isletmeId || !projeId || !odemeId) {
    return { msg: "Geçersiz parametreler", status: false };
  }
  try {
    await dbConnect();
    const result = await IsletmeModel.updateOne(
      { _id: isletmeId, "projeler._id": projeId },
      { $pull: { "projeler.$.odemeler": { _id: odemeId } } }
    );
    if (result.modifiedCount === 0) {
      return { msg: "Ödeme bulunamadı", status: false };
    }
    revalidatePath(`/`);
    revalidatePath(`/odemeler`);
    return { msg: "Ödeme başarıyla silindi", status: true };
  } catch (error) {
    console.error(`Silme hatası: ${error}`);
    return {
      msg: `Ödeme silinemedi: ${
        error instanceof Error ? error.message : error
      }`,
      status: false,
    };
  }
};

// Delete Proje function
export const deleteProje = async (
  isletmeId: string,
  projeId: string
): Promise<DeleteResponse> => {
  if (!isletmeId || !projeId) {
    return { msg: "Geçersiz parametreler", status: false };
  }
  try {
    await dbConnect();
    const result = await IsletmeModel.updateOne(
      { _id: isletmeId },
      { $pull: { projeler: { _id: projeId } } }
    );
    if (result.modifiedCount === 0) {
      return { msg: "Proje bulunamadı", status: false };
    }
    revalidatePath(`/`);
    revalidatePath(`/projeler`);
    return { msg: "Proje başarıyla silindi", status: true };
  } catch (error) {
    console.error(`Silme hatası: ${error}`);
    return {
      msg: `Proje silinemedi: ${
        error instanceof Error ? error.message : error
      }`,
      status: false,
    };
  }
};

const deleteItem = async (
  model: any,
  _id: string,
  itemName: string
): Promise<DeleteResponse> => {
  try {
    await dbConnect();
    const result = await model.findByIdAndDelete(_id);
    if (!result) {
      return { msg: `${itemName} bulunamadı`, status: false };
    }
    revalidatePath(`/parametreler`);
    return { msg: `${itemName} başarıyla silindi`, status: true };
  } catch (error) {
    console.error(`Silme hatası: ${error}`);
    return {
      msg: `${itemName} silinemedi: ${
        error instanceof Error ? error.message : error
      }`,
      status: false,
    };
  }
};

// Specific delete functions for Program and Destek
export const deleteProgram = async (_id: string): Promise<DeleteResponse> => {
  return await deleteItem(ProgramModel, _id, "Program");
};

export const deleteDestek = async (_id: string): Promise<DeleteResponse> => {
  return await deleteItem(DestekModel, _id, "Destek");
};
