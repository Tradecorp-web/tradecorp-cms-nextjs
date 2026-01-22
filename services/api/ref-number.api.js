import { requestApi, requestRawApi } from "./main.api";

export const getRefCsnApi = async (prefix) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/get-last-number-csn/${prefix}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getLastNumberApi = async (aplcode) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/get-last-number/${aplcode}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateLastNumberApi = async (id, number) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/update-last-number/${id}/${number}`,
      method: "PUT",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const insertRefNumberApi = async (number) => {
  try {
    var state = 0;
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/insert-last-number/${number}`,
      method: "POST",
      isAuth: true,
    }).then((a) => {
      if (a.id != null) {
        state = a.id;
      } else {
        state = 0;
      }
    });
    return state;
  } catch (err) {
    throw err;
  }
};
