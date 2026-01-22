import { requestApi, requestRawApi } from "./main.api";

export const getListQuoteInApi = async (
  search = "",
  page = 0,
  limit = 0,
  orderBy = "",
  order = ""
) => {
  try {
    let param = "?search=" + search;

    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=" + orderBy + "&order=" + order;
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/quote-in${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListQuoteInStatusApi = async (
  status = "",
  search = "",
  page = 0,
  limit = 0,
  orderBy = "",
  order = ""
) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=" + orderBy + "&order=" + order;
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/quote-in-status-list/${status}${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getListQuoteInGroupFactoryApi = async (
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
    param += "&orderBy=factory&order=desc";
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/quote-in-group-factory${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailQuoteInApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/quote-in/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteQuoteInApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/quote-in/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertQuoteInApi = async (data) => {
  try {
    var state = 0;
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/quote-in`,
      method: "POST",
      body: data,
      isAuth: true,
    }).then((a) => {
      if (a.id != null) {
        state = a.id;
      } else {
        state = 0;
      }
    });

    return state;
  } catch (err) {
    throw err;
  }
};

export const updateQuoteInApi = async (id, data) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/quote-in/${id}`,
      body: data,
      method: "PUT",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const insertFileQuoteInApi = async (id, data) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/quote-in-file-insert/${id}`,
      method: "POST",
      body: data,
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getFileQuoteInApi = async (id, file_id) => {
  try {
    const response = await requestRawApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/quote-in-file/${id}/dl/${file_id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteFileQuoteIn = async (data, quote_id, fileid) => {
  try {
    var response = null;
    if (soid != null && soid != "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/quote-in-delete-file/${quote_id}/${fileid}`,
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
