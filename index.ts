import Axios, { AxiosRequestConfig } from "axios";
import {
  Get_Cards_Param,
  Scryfall_Method,
  Scryfall_Param,
  Get_Cards,
  Card_Data,
  List_Data,
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

const test = () => {
  const url = "https://api.scryfall.com/cards/arena/67330";
  return [
    //Axios.get(url, {}),
    // Axios.get(url + "/:ko", {}),
  ];
};

const get_cards_from_mtg_api = () => {};

(async () => {
  const res = await get_cards(1);
  console.log(res);
  // const reses = await Promise.all(test())
  //   .catch(e => console.error(e))
  //   .then(response => console.log(response));
})();
