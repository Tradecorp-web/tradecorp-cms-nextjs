import { requestApi } from "./main.api";

export const flowNextApi = async (id) => {
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

export const insertFlowStatusNext = async (modul, po) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-status-app-insert/${modul}/${po}`,
      method: "POST",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

//history
export const getListHistoryApi = async (modul, po) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-status-app-module/${modul}/${po}?`;
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
