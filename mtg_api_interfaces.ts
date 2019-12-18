export interface MTG_API_Cards_Response {
  cards: MTG_API_Card[];
}

export interface MTG_API_Card {
  foreignNames: { name: string; language: string }[];
  name: string;
}

export interface MTG_API_Cards_Parameters {
  setName?: string;
  set?: string;
  page?: number;
}

export interface MTG_API_Sets_Parameters {
  name?: string;
  block?: string;
}

export interface MTG_API_Sets_Response {
  sets: { code: string; name: string }[];
}

export type MTG_API_Method = "cards" | "sets";
export type MTG_API_Parameters =
  | MTG_API_Cards_Parameters
  | MTG_API_Sets_Parameters;
export type MTG_API_Response = MTG_API_Cards_Response | MTG_API_Sets_Response;
