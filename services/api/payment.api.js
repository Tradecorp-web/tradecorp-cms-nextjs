import { requestApi, requestRawApi } from "./main.api";

export const getListPaymentApi = async (search = "", page = 0, limit = 0) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=payment_date&order=desc";
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getListPaymentCriteriaApi = async (
  method,
  type,
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
    if (orderBy != "" || order != "") {
      param += "&orderBy=" + orderBy + "&order=" + order;
    }

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-criteria/${method}/${type}${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailPaymentApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deletePaymentApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-delete/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertPaymentApi = async (data, statusAcc) => {
  try {
    var state = 0;
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-insert`,
      method: "POST",
      body: data,
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const updatePaymentCodeApi = async (id) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-code/${id}`,
      method: "PUT",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const getPaymentNumber = async () => {
  try {
    var state = 0;
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-code`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const updatePaymentApi = async (id, data) => {
  try {
    var state = 0;
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-update/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const insertFilePaymentApi = async (id, data) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-file-insert/${id}`,
      method: "POST",
      body: data,
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const savePaymentApi = async (data) => {
  try {
    var response = null;
    if (data.id == null || data.id == "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-insert`,
        method: "POST",
        body: data,
        isAuth: true,
      });
    } else {
      var id = data.id;
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-update/${id}`,
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

export const updateStatusInvoice = async (id, data) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-update-status/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getFilePaymentApi = async (id, file_id) => {
  try {
    const response = await requestRawApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-file/${id}/dl/${file_id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getPaymentInInvApi = async (data) => {
  try {
    const response = await requestRawApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-in-invoice`,
      method: "GET",
      body: data,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const GetPayNum = async () => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-num`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListByBankName = async (
  banksubacc = "",
  statusacc = "",
  search = "",
  page = 0,
  limit = 0
) => {
  try {
    let param = "?search=" + search;

    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + 0;
    }
    param += "&orderBy=payment_date&order=desc";

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-bybank/${banksubacc}/${statusacc}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const getListByBankPeriod = async (
  banksubacc = "",
  date1 = "*",
  date2 = "*",
  search = "",
  page = 0,
  limit = 0
) => {
  try {
    let param = "?search=" + search;

    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + 0;
    }
    param += "&orderBy=payment_date&order=desc";

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-bybankperiod/${banksubacc}/${date1}/${date2}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const getListSearchInv = async (
  statusinvoice = "outstanding",
  value = "0",
  accurate = "100",
  field = "*",
  criteria = "*",
  search = "",
  page = 0,
  limit = 0
) => {
  ///invoice-compare-payment/:statusinvoice/:value/:accurate/:field/:criteria

  try {
    let param = "?search=" + search;

    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + 0;
    }
    param += "&orderBy=payment_date&order=desc";

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-compare-payment/${statusinvoice}/${value}/${accurate}/${field}/${criteria}${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getListByField = async (
  banksubacc = "",
  field = "",
  operator = "",
  criteria = "",
  search = "",
  page = 0,
  limit = 0
) => {
  try {
    let param = "?search=" + search;

    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + 0;
    }
    param += "&orderBy=payment_date&order=desc";
    //payment-byfield/*/status_match/1
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-byfield/${banksubacc}/${field}/${operator}/${criteria}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

//payment aggregate invoice

export const getListPaymentByIdApi = async (
  payinv,
  payment_id,
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
    if (orderBy != "" || order != "") {
      param += "&orderBy=" + orderBy + "&order=" + order;
    }

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-agg-src-id/${payinv}/${payment_id}${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertPaymentInvoiceApi = async (data) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/payment-agg-insert`,
      method: "POST",
      body: data,
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
