import { Isletme } from "@/lib/types/types";
import { fetchIsletmeler } from "../actions/fetchData";
import IslTableContainer from "@/features/Isletmeler/IslTableContainer";

export default async function Isletmeler() {
  const isletmeler = (await fetchIsletmeler()) as Isletme[];
  return <IslTableContainer isletmeler={isletmeler} />;
}
