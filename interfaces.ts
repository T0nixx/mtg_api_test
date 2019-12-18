export interface Get_Cards_Param {
  page: number;
  // only json
  format: string;
  // if true, json will be prettified
  pretty: boolean;
}
export type Get_Cards = "Get_Cards";

export type Scryfall_Param = Get_Cards_Param;
export type Scryfall_Method = Get_Cards;

type Language = "en" | "ko";

export interface List_Data {
  data: Card_Data[];
}

export interface Card_Data {
  name: string;
  lang: Language;
  // scryfall uuid 한글을 뽑고싶은데
  id: string;
}
