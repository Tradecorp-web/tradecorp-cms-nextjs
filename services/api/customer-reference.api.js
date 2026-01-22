import {requestApi} from "./main.api";

export const getListCustomerReferenceApi = async (param) => {
  let url = `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-reference?`;
  // url += `search=${param?.search ?? ""}&`;
  // url += `page=${param?.page ?? 1}&`;
  // url += `limit=${param?.limit ?? 20}&`;
  // url += `orderBy=${param?.orderBy ?? ""}&`;
  // url += `order=${param?.order ?? ""}&`;
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

export const getDetailCustomerReferenceApi = async (id) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-reference/${id}`,
      method: "GET",
      isAuth: true,
    });
  }catch (err) {
    throw err;
  }
};

export const insertCustomerReferenceApi = async (data) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-reference`,
      method: "POST",
      body: data,
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const saveCustomerReferenceApi = async (data) => {
  try {
    let response = null;
    if (data.id == null || data.id === "") {
      await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-reference`,
        method: "POST",
        body: data,
        isAuth: true,
      });
    } else {
        const id = data.id;
        await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-reference-update/${id}`,
            method: "PUT",
            body: data,
            isAuth: true,
        });
    }
  } catch (err) {
    throw err;
  }
}

export const updateCustomerReferenceApi = async (data, id) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-reference-update/${id}`,
      method: "PUT",
      body: data,
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};

export const deleteCustomerReferenceApi = async (id) => {
  try {
    return await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/customer-reference/${id}`,
      method: "DELETE",
      isAuth: true,
    });
  } catch (err) {
    throw err;
  }
};