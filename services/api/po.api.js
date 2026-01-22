import { requestApi } from "./main.api";

export const getListAllPOApi = async (param) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/po?`;
  // var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/postatus?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  // url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `orderBy=po_date&`;
  url += `order=desc&`;
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
export const getListPurchaseOrderApi = async (param) => {
  // var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/po?`;
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/postatus?`;
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
export const getListPOGtZeroApi = async (param) => {
  // var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/po?`;
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/pogtzero?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=po_date&`;
  url += `order=desc&`;
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

export const getDetailPOPosApi = async (modul_id, position_id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-flow-status/${modul_id}/${position_id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getDetailPurchaseOrderApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/po/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertPurchaseOrderApi = async (data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/po`,
      method: "POST",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updatePurchaseOrderApi = async (data, id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/po/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deletePurchaseOrderApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/po/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const flowNextPOApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-flow-status-next/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const updatePOFlowNext = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/poflownext/${id}`,
      method: "PUT",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const insertFlowStatusAppNext = async (po, data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-status-app-insert/purchase_order/${po}`,
      body: data,
      method: "POST",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

//history
export const getListPOHistoryApi = async (po) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-status-app-module/purchase_order/${po}?`;
  url += `search=&`;
  url += `page=&`;
  url += `limit=&`;
  url += `orderBy=date_process&`;
  url += `order=desc`;

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

export const getListDetailPOHistoryApi = async (po, flowid) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/get-status-app-module/purchase_order/${po}/${flowid}?`;
  url += `search=&`;
  url += `page=&`;
  url += `limit=&`;
  url += `orderBy=date_process&`;
  url += `order=desc`;

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
//==history

export const getPoUserPosApi = async () => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/get-po-userstatus`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getPoNumberApi = async () => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/get-po-number`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getCheckedPoApi = async (id, statusAcc) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/get-po-ready-send/${id}/${statusAcc}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
