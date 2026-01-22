import { requestApi, requestRawApi } from "./main.api";

export const getListContainerStockApi = async (param) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/container?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;
  url += `size=${param?.size ?? ""}&`;
  url += `type=${param?.type ?? ""}&`;
  url += `yom=${param?.yom ?? ""}&`;
  url += `status=${param?.status ?? ""}&`;
  url += `condition=${param?.condition ?? ""}&`;
  url += `stockDepoId=${param?.stockDepoId ?? ""}&`;
  url += `depoId=${param?.depoId ?? ""}&`;
  url += `percentageFrom=${param?.percentageFrom ?? ""}&`;
  url += `percentageTo=${param?.percentageTo ?? ""}&`;
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

export const getListContainerStock2Api = async (param) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container/list`,
      method: "POST",
      body: param,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListContainerStock3Api = async (param) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container2/list`,
      method: "POST",
      body: param,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailContainerStockApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailContainerStockBySnApi = async (sn) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container/check-sn/${sn}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertContainerApi = async (data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container`,
      method: "POST",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertBatchContainerApi = async (data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-batch`,
      method: "POST",
      body: data,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateContainerApi = async (data, id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const saveContainerApi = async (data) => {
  try {
    var response = null;
    if (data.id == null || data.id == "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container`,
        method: "POST",
        body: data,
        isAuth: true,
      });
    } else {
      var id = data.id;
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container/${id}`,
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

export const updateContainerAttachmentApi = async (data) => {
  try {
    var id = data.id;
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-attachment/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const replaceContainerImageApi = async (data) => {
  try {
    var id = data.id;
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-image/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteContainerApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateManyContainerStockPriceApi = async (data) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/update-many-container-price`;
  // url += `?size=${param?.size ?? ""}&`;
  // url += `type=${param?.type ?? ""}&`;
  // url += `status=${param?.status ?? ""}&`;
  // url += `condition=${param?.condition ?? ""}&`;
  // url += `stockDepoId=${param?.stockDepoId ?? ""}&`;
  // url += `depoId=${param?.depoId ?? ""}&`;
  // url += `percentageFrom=${param?.percentageFrom ?? ""}&`;
  // url += `percentageTo=${param?.percentageTo ?? ""}&`;
  try {
    const response = await requestApi({
      url: url,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteMultiContainersApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/multi-containers/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getContainerOptionApi = async (depo = "") => {
  try {
    let param = "";
    if (depo != "") {
      param = "?depo=" + depo;
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container/option${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteManyContainersApi = async (data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/many-containers`,
      method: "DELETE",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateContainerDepoApi = async (data) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/container-move`;
  try {
    const response = await requestApi({
      url: url,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getLeasedContainerStockApi = async (param) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container/lease`,
      method: "POST",
      body: param,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getContainerForSaleApi = async (depo = "") => {
  try {
    let param = "";
    if (depo != "") {
      param = "?depo=" + depo;
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-forsale${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const downloadContainerApi = async (param) => {
  try {
    const response = await requestRawApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/download/container`,
        method: 'POST',
        body: param,
        isAuth: true
    })
    return response
  } catch (err) {
      throw err
  }
};

export const getContainerColumnApi = async () => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container/column`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
