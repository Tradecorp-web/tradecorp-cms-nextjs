import { requestApi } from "./main.api";

// export const getListInvoiceApi = async (search = "", page = 0, limit = 0) => {
export const getListInvoiceApi = async (param) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;
  url += `status_invoice=${param?.status_invoice ?? ""}&`;
  url += `sales_id=${param?.sales_id ?? ""}&`;
  url += `customer_id=${param?.customer_id ?? ""}&`;
  try {
    return await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }

  // try {
  //   let param = "?search=" + search;
  //   if (page > 0 || limit > 0) {
  //     page++;
  //     param += "&page=" + page + "&limit=" + limit;
  //   }
  //   param += "&orderBy=invoice_date&order=desc";
  //   return await requestApi({
  //     url: `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice${param}`,
  //     method: "GET",
  //     isAuth: true,
  //   });
  // } catch (err) {
  //   throw err;
  // }
};

export const getListInvoiceByInvNumberApi = async (
  search = "INV",
  page = 0,
  limit = 0
) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=invoice_date&order=desc";
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice${param}`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const getListInvoiceByCustomerApi = async (customer_id) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-by-customer/${customer_id}`;
  try {
    return await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const getListInvoiceBySalesApi = async (customer_id) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-by-sales`;
  try {
    return await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};
export const getListInvoiceByProjectApi = async (project_id) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-by-project/${project_id}?orderBy=payment_term`;
  try {
    return await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const getDetailInvoiceApi = async (id) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice/${id}`,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const generateInvoiceNumberApi = async (id, project_code) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice/${id}/${project_code}`,
      method: "PUT",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const deleteInvoiceApi = async (id) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-delete/${id}`,
      method: "DELETE",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const saveInvoiceApi = async (data) => {
  try {
    let response;
    if (data.id == null || data.id === "") {
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-insert`,
        method: "POST",
        body: data,
        isAuth: true,
      });
    } else {
      let id = data.id;
      response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-update/${id}`,
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

export const getListInvoiceByInvoiceNumberApi = async (invoice_number) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-by-invoice-number/${invoice_number}`;
  try {
    return await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const getListInvoiceBySalesOrderNumberApi = async (sales_order_id) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-by-sales-order-number/${sales_order_id}`;
  try {
    return await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};
export const getInvPaymentDataApi = async (field, criteria) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-payment/${field}/${criteria}`;

  try {
    return await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};
export const getInvComparePaymentDataApi = async (date1, date2, statusInv) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-compare-payment/${date1}/${date2}/${statusInv}`;
  try {
    return await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};
export const getInvComparePaymentPeriodApi = async (
  date1,
  date2,
  statusInv
) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-compare-payment-period/${date1}/${date2}/${statusInv}`;
  try {
    return await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const updateInvoicePayDetailApi = async (id, data) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-update-pay-detail/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};
export const invoiceFlowNext = async (id) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/invoice-flow-next/${id}`,
      method: "PUT",

      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const insertFlowInvoiceStatusAppNext = async (invid, data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-status-app-insert/invoice/${invid}`,
      body: data,
      method: "POST",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
