import { requestApi, requestRawApi } from "./main.api";

export const getListOrderQuoteApi = async (
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
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-quote${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListOrderIdQuoteApi = async (
  id = "",
  size = "*",
  search = "",
  page = 0,
  limit = 0,
  orderBy = "container_size_data",
  order = "asc"
) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=" + orderBy + "&order=" + order;

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-idquote/${id}/${size}${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getListOrderIdStatusQuoteApi = async (
  id = "",
  status = "*",
  search = "",
  page = 0,
  limit = 0,
  orderBy = "container_size_data",
  order = "asc"
) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=" + orderBy + "&order=" + order;

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-idquote-idstatus/${id}/${status}${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListOrderIdQuoteStatusApi = async (
  size = "*",
  status,
  search = "",

  page = 0,
  limit = 0,
  orderBy = "container_size_data",
  order = "asc"
) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=" + orderBy + "&order=" + order;

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-idquote-status/${size}/${status}${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListOrderQuoteStatusGroupApi = async (
  size = "*",
  status,
  search = "",

  page = 0,
  limit = 0,
  orderBy = "container_size_data",
  order = "asc"
) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=" + orderBy + "&order=" + order;

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-quote-status-group/${status}${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getDetailOrderQuoteApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-quote/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteManyOrderQuoteApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-quote-many/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertOrderQuoteApi = async (data) => {
  try {
    var state = 0;
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-quote`,
      method: "POST",
      body: data,
      isAuth: true,
    });

    return state;
  } catch (err) {
    throw err;
  }
};

export const updateOrderQuoteApi = async (id, data) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-quote/${id}`,
      body: data,
      method: "PUT",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const updateOrderQuoteRalCodeApi = async (id, data) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-quote-ralcode/${id}`,
      body: data,
      method: "PUT",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const updateStatusOrderQuoteApi = async (id, status) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-quote-status/${id}/${status}`,
      method: "PUT",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const updateStatusOrderQuoteIdApi = async (id, status) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/order-quote-status-id/${id}/${status}`,
      method: "PUT",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
