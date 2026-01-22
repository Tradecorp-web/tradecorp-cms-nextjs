import { requestApi, requestRawApi } from "./main.api";

export const getListMasterSerialApi2 = async (
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
    // alert(`${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial${param}`);
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const getListMasterSerialFilterApi = async (
  field,
  value,
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
    // alert(
    //   `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-filter/${field}/${value}${param}`
    // );
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-filter/${field}/${value}${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getListMasterSerialApi = async (
  unit_code = "",
  ral_color = "*",
  prefix = "*",
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
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-unitcode/${unit_code}/${ral_color}/${prefix}${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListContainerFilterApi = async (field, value, param) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-filter/${field}/${value}?`;
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

export const getListMasterContainerSerialApi = async (
  unit_code = "",
  segment = "*",
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
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-unitcolor/${unit_code}/${segment}${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailMasterSerialApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getDetailFilterApi = async (field, value) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-filter/${field}/${value}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
