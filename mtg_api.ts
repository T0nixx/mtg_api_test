import Axios, { AxiosPromise, AxiosResponse } from "axios";
import {
  MTG_API_Cards_Parameters,
  MTG_API_Method,
  MTG_API_Parameters,
  MTG_API_Cards_Response,
  MTG_API_Card,
  MTG_API_Sets_Parameters,
  MTG_API_Sets_Response,
  MTG_API_Response,
} from "./mtg_api_interfaces";

const call_mtg_api = <T>({
  method,
  params,
}: {
  method: MTG_API_Method;
  params: MTG_API_Parameters;
}): Promise<AxiosResponse<T>> => {
  Axios.defaults.baseURL = "https://api.magicthegathering.io/v1/";
  // Axios.defaults.paramsSerializer = params => {
  //   return Qs.stringify(params, { arrayFormat: "brackets" });
  // };

  const call_cards = (params: MTG_API_Cards_Parameters) => {
    const url: string = "cards";
    return Axios.get<T>(url, {
      params,
    });
  };

  const call_sets = (params: MTG_API_Sets_Parameters) => {
    const url: string = "sets";
    return Axios.get<T>(url, {
      params,
    });
  };

  return {
    cards: call_cards,
    sets: call_sets,
  }[method](params);
};

(async () => {
  // const arr = Array.from({ length: 15 }, (_, i) => i);
  // console.log(arr);
  const arr = [10, 3, 5];
  return arr.map(i =>
    call_mtg_api<MTG_API_Cards_Response>({
      method: "cards",
      params: { set: "ELD", page: i },
    })
      .then(res => {
        // console.log(res.request);
        const results = res.data.cards.reduce<
          { name: string; ko_name: string }[]
        >((cards_with_korean, card) => {
          const ko_name = card.foreignNames.reduce<string>(
            (str, foreign_name) => {
              return foreign_name.language === "Korean"
                ? str + foreign_name.name
                : str;
            },
            "",
          );
          const result = { name: card.name, ko_name };
          //console.log(result);
          return ko_name !== ""
            ? [...cards_with_korean, result]
            : cards_with_korean;
        }, []);
        results.forEach(r => console.log(r));
        return results;
      })
      .catch(e => e),
  );
})();

// (() => {
//   call_mtg_api<MTG_API_Sets_Response>({
//     method: "sets",
//     params: { name: "eldraine|ixal" },
//   })
//     .then(res => {
//       console.log(res.request);
//       return res.data.sets.map(set => console.log(set));
//     })
//     .catch(e => console.error(e));
// })();
