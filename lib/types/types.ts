export type Odeme = {
  _id: string;
  destek: string;
  durum: string;
  id: string;
  karekod: string;
  projeId: string;
  tarih: string;
  tutar: number;
};

export type Proje = {
  _id: string;
  baslamaTarihi: string;
  durum: string;
  id: string;
  isletmeId: string;
  izleyici?: string;
  notlar?: string;
  program?: string;
  sure?: string;
  takipTarihi?: string;
  tamamlanmaTarihi?: string;
  odemeler?: Odeme[];
};

export type Isletme = {
  _id: string;
  unvan: string;
  vergiNo: string;
  yetkili?: string;
  adres?: string;
  mail: string;
  id: string;
  sistemId: string;
  naceKodu?: string;
  notlar?: string;
  tel1?: string;
  tel2?: string;
  uets?: string;
  projeler?: Proje[];
};

export type Parameter = {
  id: string;
  isim: string;
};
