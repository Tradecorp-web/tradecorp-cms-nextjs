import { requestApi } from "./main.api";

export const getListAccTrxJournalApi = async (
  search = "",
  page = 0,
  limit = 0
) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/trx-journal${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const getListAccTrxJournalOrderApi = async (
  search = "",
  page = 0,
  limit = 0,
  orderBy = ""
) => {
  try {
    let param = "?search=" + search + "&orderBy=" + orderBy;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/trx-journal${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailAccTrxJournalApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/trx-journal/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailCoaApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/trx-journal/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
// export const getCoaParentDetailApi = async (id) => {
//   try {
//     const response = await requestApi({
//       url: `${process.env.NEXT_PUBLIC_REST_API_URL}/coa-parent/${id}`,
//       method: "GET",
//       isAuth: true,
//     });
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };

export const saveTrxJournal = async (data) => {
  var tes = Object.values(data);
  try {
    var response = null;
    if (data.id == null || data.id == "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/trx-journal-insert`,
        method: "POST",
        body: data,
        isAuth: true,
      });
    } else {
      var id = data.id;
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/trx-journal-update/${id}`,
        method: "PUT",
        body: data,
        isAuth: true,
      });
    }
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteCoaApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/trx-journaldelete/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
