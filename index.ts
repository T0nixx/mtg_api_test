import Axios, { AxiosRequestConfig } from "axios";
import {
  Get_Cards_Param,
  Scryfall_Method,
  Scryfall_Param,
  Get_Cards,
  Card_Data,
  List_Data,
  Set_Data,
  Magic_Set,
} from "./interfaces";

// Axios.defaults.baseURL = "https://api.scryfall.com";

const get_cards = async (page: number) => {
  const url = "https://api.scryfall.com/cards?page=" + page;

  const params: Get_Cards_Param = {
    page,
    format: "json",
    pretty: true,
  };

  const config: AxiosRequestConfig = {
    url,
    params,
  };
  const response = await Axios.get<List_Data>(url, config);
  // 필요한 것만 추출
  return response.data.data.map(({ name }) => ({
    name,
  }));
};

const get_arenable_sets = async () => {
  const url = "https://api.scryfall.com/sets";
  const response = await Axios.get<{ data: Set_Data[] }>(url, {});
  const expansions = response.data.data.reduce<Magic_Set[]>(
    (expansions, set) => {
      const { name, code, set_type } = set;
      const arena_cores = [
        "Core Set 2020",
        "Core Set 2019",
        "Historic Anthology 1",
      ];
      if (set_type === "expansion" || arena_cores.includes(name))
        return [...expansions, { name, code }];
      return expansions;
    },
    [],
  );
  const splice_index = expansions.findIndex(exp => exp.name === "Ixalan") + 1;

  return expansions.splice(0, splice_index);
};

const get_cards_from_mtg_api = () => {};

(async () => {
  const res = await get_cards(1);
  console.log(res);
  // get_arenable_sets()
  //   .then(res => console.log(res))
  //   .catch(e => console.error(e));
})();
