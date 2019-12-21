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
  Name_Pair,
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

const get_name_pair = (cards_with_korean: Name_Pair[], card: MTG_API_Card) => {
  const ko_name = card.foreignNames.reduce<string>((str, foreign_name) => {
    return foreign_name.language === "Korean" ? str + foreign_name.name : str;
  }, "");
  const result = { en_name: card.name, ko_name };

  return ko_name !== "" ? [...cards_with_korean, result] : cards_with_korean;
};

(async () => {
  const first_repsonse = await call_mtg_api<MTG_API_Cards_Response>({
    method: "cards",
    params: { set: "ELD", page: 1 },
  });

  const total_count_for_this_set = first_repsonse.headers["total-count"];
  console.log(total_count_for_this_set);
  const pages_except_first = Array.from(
    { length: total_count_for_this_set / 100 - 1 },
    (_, i) => i + 2,
  );

  const name_pair_matrix = await Promise.all(
    pages_except_first.map(async i => {
      // for throttling
      await new Promise(resolve => setTimeout(resolve, 100));
      const response = await call_mtg_api<MTG_API_Cards_Response>({
        method: "cards",
        params: { set: "ELD", page: i },
      });

      const en_ko_pairs = response.data.cards.reduce(get_name_pair, []);

      return en_ko_pairs;
    }),
  );

  const first_name_pairs = first_repsonse.data.cards.reduce(get_name_pair, []);
  return Array.from(
    new Set([
      ...first_name_pairs,
      ...name_pair_matrix.reduce(
        (arr, name_pairs) => [...arr, ...name_pairs],
        [],
      ),
    ]),
  );
})().then(r => console.log(r.length));

// (async () => {
//   const arr = Array.from({ length: 15 }, (_, i) => i);
//   Promise.all(
//     arr.map(i => {
//       const timer = setTimeout(() => {}, i * 100);

//       call_mtg_api<MTG_API_Cards_Response>({
//         method: "cards",
//         params: { set: "ELD", page: i },
//       })
//         .then(res => {
//           const results = res.data.cards.reduce<
//             { name: string; ko_name: string }[]
//           >((cards_with_korean, card) => {
//             const ko_name = card.foreignNames.reduce<string>(
//               (str, foreign_name) => {
//                 return foreign_name.language === "Korean"
//                   ? str + foreign_name.name
//                   : str;
//               },
//               "",
//             );
//             const result = { name: card.name, ko_name };

//             return ko_name !== ""
//               ? [...cards_with_korean, result]
//               : cards_with_korean;
//           }, []);
//           console.log(i + " " + results);
//           return results;
//         })
//         .catch(e => e.message);
//     }),
//   );
// })();

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
