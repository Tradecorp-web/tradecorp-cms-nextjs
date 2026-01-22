import { requestApi } from "./main.api";

export const getListAccPoData = async (date1, date2) => {
  //acc-po-date/08-09-2021/25-09-2021?search=&page=1&limit=20&orderBy=&order=
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-po-date/${date1}/${date2}`;
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

export const getListAccPoDataApi = async (param) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-po?`;
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
