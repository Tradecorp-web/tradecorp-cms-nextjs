import { requestApi, requestRawApi } from "./main.api";

export const getListSalesOrderApi = async (
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
    param += "&orderBy=project_code&order=desc";
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getListSalesOrderGroupApi = async (
  search = "",
  field = "*",
  criteria = "*",
  page = 0,
  limit = 0
) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=project_code&order=desc";
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-group/${field}/${criteria}${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailSalesOrderApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getSalesOrderProject = async (projectcode, incometype) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-project/${projectcode}/${incometype}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteSalesOrderApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-delete/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertSOApi = async (data, statusAcc) => {
  try {
    var state = 0;
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-insert`,
      method: "POST",
      body: data,
      isAuth: true,
    }).then((a) => {
      if (a.id != null) {
        state = a.id;
        //   updateQuoteApi(data.quote_id, statusAcc);
      } else {
        state = 0;
      }
    });

    return state;
  } catch (err) {
    throw err;
  }
};
export const insertFileSOApi = async (id, data) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-file-insert/${id}`,
      method: "POST",
      body: data,
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const updateQuoteApi = async (id, statusAcc) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/update-quote-status/${id}/${statusAcc}`,
      method: "PUT",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
export const saveSalesOrderApi = async (data) => {
  try {
    var response = null;
    if (data.id == null || data.id == "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-insert`,
        method: "POST",
        body: data,
        isAuth: true,
      }).then((data) => {
        data?.containers?.map(async (row, index) => {
          response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/update-container-status/${row.container_id}/1001`,
            method: "PUT",
            body: data,
            isAuth: true,
          });
        });
      });
    } else {
      var id = data.id;
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-update/${id}`,
        method: "PUT",
        body: data,
        isAuth: true,
      }).then(
        data?.containers?.map(async (row, index) => {
          response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/update-container-status/${row.container_id}/1001`,
            method: "PUT",
            body: data,
            isAuth: true,
          });
        })
      );
    }
    return response;
  } catch (err) {
    throw err;
  }
};
export const saveSOTerm = async (data, soid) => {
  try {
    var response = null;
    if (soid != null && soid != "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-update-term/${soid}`,
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

export const saveSOTermDetail = async (data, soid) => {
  try {
    var response = null;
    if (soid != null && soid != "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-update-term-detail/${soid}`,
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
export const saveSOComment = async (data, soid) => {
  try {
    var response = null;

    if (soid != null && soid != "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-update-comment/${soid}`,
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

export const deleteFileSO = async (data, soid, fileid) => {
  try {
    var response = null;
    if (soid != null && soid != "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-delete-file/${soid}/${fileid}`,
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

export const getSOStatusAccApi = async (
  statusAcc,
  search = "",
  page = 0,
  limit = 0
) => {
  let param = "?search=" + search;
  if (page > 0 || limit > 0) {
    page++;
    param += "&page=" + page + "&limit=" + limit;
  }
  param += "&orderBy=order_date&order=desc";

  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-status/${statusAcc}${param}`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};
export const getSOGroupApi = async (
  field = "*",
  criteria = "*",
  search = "",
  page = 0,
  limit = 0,
  orderBy = "project_code",
  order = "asc"
) => {
  let param = "?search=" + search;
  if (page > 0 || limit > 0) {
    page++;
    param += "&page=" + page + "&limit=" + limit;
  }
  param += "&orderBy=" + orderBy + "&order=" + order;

  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-group/${field}/${criteria}${param}`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const getSOProjectIncomeApi = async (
  projectCode,
  incomeType,
  statusAcc,
  search = "",
  page = 0,
  limit = 0
) => {
  let param = "?search=" + search;
  if (page > 0 || limit > 0) {
    page++;
    param += "&page=" + page + "&limit=" + limit;
  }
  param += "&orderBy=order_date&order=desc";

  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-project/${projectCode}/${incomeType}${param}`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};
export const getAccMapSO = async () => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-mapping?application_code=SO`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

// export const getFileSOApi = async (id, file_id) => {
//   try {
//     return await requestApi({
//       url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-file/${id}/dl/${file_id}`,
//       method: "GET",
//       isAuth: true,
//     });
//   } catch (err) {
//     throw err;
//   }
// };

export const getFileSOApi = async (id, file_id) => {
  try {
    const response = await requestRawApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-file/${id}/dl/${file_id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getSoNumber = async () => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/get-new-number/SO`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const updateRefLastNumberSo = async (lastNumber, id) => {
  try {
    var response = null;
    if (id != null && id != "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/update-last-number/${id}/${lastNumber}`,
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

export const getSoPaymentTermApi = async (method) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-payment-term-method/${method}`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};
export const getSOProjectListApi = async (projectCode, incomeType) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/sales-order-project/${projectCode}/${incomeType}`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};
