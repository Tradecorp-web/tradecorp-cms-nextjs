import { requestApi } from "./main.api";

export const getListMasterData = async (category = "", order = "") => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/master/list/team?category=${category}&orderBy=${order}`;
  try {
    const response = await requestApi({
      url: url,
      method: "GET",
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getMasteData = async (category = "", order = "") => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/master/categories?category=${category}&orderBy=${order}`;
  try {
    const response = await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getMasterDataApi = async (search = "", page = 0, limit = 0) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=category&order=asc";
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/list${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailMasterDatapi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/list-detail/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListMasterTeamData = async (param) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/master/list/team?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;

  try {
    const response = await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertMasterDataApi = async (data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-insert`,
      method: "POST",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateMasterDataApi = async (data, id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-update/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteMasterDataApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-delete/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const saveMasterDataApi = async (data) => {
  try {
    var response = null;
    if (data.id == null || data.id == "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-insert`,
        method: "POST",
        body: data,
        isAuth: true,
      });
    } else {
      var id = data.id;
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master-update/${id}`,
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
