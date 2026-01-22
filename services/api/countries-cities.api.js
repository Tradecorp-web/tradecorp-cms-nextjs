import { requestApi } from "./main.api";

export const getCountryListApi = async (id = "") => {
  try {
    let param = "?id="+id

    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/country${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getCityListApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/city/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getCurrencyListApi = async () => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/currency?orderBy=currency`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
