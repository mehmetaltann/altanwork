"use server";
import dbConnect from "@/lib/db/dbConnect";
import bcrypt from "bcryptjs";
import IsletmeModel from "@/lib/models/IsletmeModel";
import UserModel from "@/lib/models/UserModel";
import { revalidatePath } from "next/cache";
import { DestekModel, ProgramModel } from "@/lib/models/ParametersModel";
import { ProjeWithoutId } from "@/lib/types/types";

interface InsertResponse {
  msg: string;
  status: boolean;
}

export const addIsletme = async (formData: any): Promise<InsertResponse> => {
  const { unvan, vergiNo, sistemId } = formData;
  try {
    await dbConnect();
    const isletme = await IsletmeModel.findOne(
      {
        $or: [{ unvan: unvan }, { vergiNo: vergiNo }, { sistemId: sistemId }],
      },
      { _id: 0 }
    );
    if (isletme) {
      return { msg: "Bu İşletme Zaten Kayıtlıdır", status: false };
    } else {
      await IsletmeModel.create(formData);
    }
    revalidatePath("/");
    revalidatePath("/isletmeler");
    return { msg: "İşletme Eklendi", status: true };
  } catch (error) {
    return {
      msg: `İşletme Eklenemedi: ${
        error instanceof Error ? error.message : error
      }`,
      status: false,
    };
  }
};

export const addProje = async (
  isletmeId: string,
  formData: ProjeWithoutId
): Promise<InsertResponse> => {
  try {
    await dbConnect();
    const result = await IsletmeModel.updateOne(
      { _id: isletmeId },
      { $push: { projeler: formData } }
    );
    if (result.modifiedCount === 0) {
      return { msg: "Proje eklenemedi", status: false };
    }
    revalidatePath("/");
    revalidatePath("/projeler");
    return { msg: "Proje Eklendi", status: true };
  } catch (error) {
    console.error(`Proje Ekleme Hatası: ${error}`);
    return {
      msg: `Proje Eklenemedi: ${
        error instanceof Error ? error.message : error
      }`,
      status: false,
    };
  }
};

export const addOdeme = async (
  isletmeId: string,
  projeId: string,
  formData: any
): Promise<InsertResponse> => {
  try {
    await dbConnect();
    const result = await IsletmeModel.updateOne(
      { _id: isletmeId, "projeler._id": projeId },
      {
        $push: { "projeler.$.odemeler": formData },
      }
    );
    if (result.modifiedCount === 0) {
      return { msg: "Ödeme eklenemedi", status: false };
    }
    revalidatePath("/");
    revalidatePath("/odemeler");
    return { msg: "Ödeme Eklendi", status: true };
  } catch (error) {
    console.error(`Ödeme Ekleme Hatası: ${error}`);
    return {
      msg: `Ödeme Eklenemedi: ${
        error instanceof Error ? error.message : error
      }`,
      status: false,
    };
  }
};

export const addUser = async (
  prevState: any,
  formData: any
): Promise<InsertResponse> => {
  try {
    const isim = formData.get("isim")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    if (!isim || !email || !password) {
      return { msg: "Tüm alanları doldurun", status: false };
    }
    await dbConnect();
    const existingUser = await UserModel.findOne({ email }).select("_id");
    if (existingUser) {
      return { msg: "Bu kullanıcı zaten kayıtlıdır", status: false };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { isim, email, password: hashedPassword };
    await UserModel.create(userData);
    return { msg: "Kullanıcı başarıyla kaydedildi", status: true };
  } catch (error) {
    console.error(`Kullanıcı eklenemedi: ${error}`);
    return {
      msg: `Kullanıcı eklenemedi: ${
        error instanceof Error ? error.message : "Bilinmeyen hata"
      }`,
      status: false,
    };
  }
};

export const addProgram = async (isim: string): Promise<InsertResponse> => {
  try {
    await dbConnect();
    await ProgramModel.create({ isim });
    revalidatePath("/parametreler");
    return { msg: "Program Başarıyla Eklendi", status: true };
  } catch (error) {
    return {
      msg: `Program eklenemedi: ${
        error instanceof Error ? error.message : "Bilinmeyen hata"
      }`,
      status: false,
    };
  }
};

export const addDestek = async (isim: string): Promise<InsertResponse> => {
  try {
    await dbConnect();
    await DestekModel.create({ isim });
    revalidatePath("/parametreler");
    return { msg: "Destek Başarıyla Eklendi", status: true };
  } catch (error) {
    return {
      msg: `Destek eklenemedi: ${
        error instanceof Error ? error.message : "Bilinmeyen hata"
      }`,
      status: false,
    };
  }
};
