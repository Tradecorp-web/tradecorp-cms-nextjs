import { requestApi } from "./main.api";

export const getListRefFlowApi = async (param, modul) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-flow-status-data/${modul}?`;
  // var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/postatus?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
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
