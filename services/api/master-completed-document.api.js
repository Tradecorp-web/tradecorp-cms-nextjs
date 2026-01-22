import { requestApi } from "./main.api";

export const getListMasterCompletedDocApi = async (
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
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-complete-document${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const getListMasterCompletedDocNoLimitApi = async (
  // search = "",
  // page = 0,
  // limit = 0,
  param
) => {
  try {
    // let param2 = "?search=" + param?.search;
    // if (param?.page > 0 || param?.limit > 0) {
    //   page++;
    //   param2 +=
    //     "&page=" +
    //     param?.page +
    //     "&limit=" +
    //     param?.limit +
    //     "&orderBy=" +
    //     param?.orderBy +
    //     "&order=" +
    //     param?.order;
    // }

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-complete-document-nolimit?orderBy=${param?.orderBy}&order=${param?.order}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailMasterCompletedDocumentApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-complete-document/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getDetailMasterCompletedDocumentNameApi = async (name) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-complete-document-name/${name}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const saveMasterComponentDocumentApi = async (data) => {
  var tes = Object.values(data);
  try {
    var response = null;
    if (data.id == null || data.id == "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-complete-document`,
        method: "POST",
        body: data,
        isAuth: true,
      });
    } else {
      var id = data.id;
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-complete-document/${id}`,
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

export const deleteMasterCompletedDocumentApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-complete-document/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
