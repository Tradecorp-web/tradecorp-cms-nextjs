import { requestApi } from "./main.api";

export const getListCompletedDoc = async (search = "", page = 0, limit = 0) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/complete-document${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailCompletedDocumentApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/complete-document/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getDetailCompDocByOrderIdApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/complete-document-by-order/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const saveComponentDocumentApi = async (data) => {
  var tes = Object.values(data);
  try {
    var response = null;
    if (data.id == null || data.id == "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/complete-document`,
        method: "POST",
        body: data,
        isAuth: true,
      });
    } else {
      var id = data.id;
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/complete-document/${id}`,
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

export const deleteCompletedDocumentApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/complete-document/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
