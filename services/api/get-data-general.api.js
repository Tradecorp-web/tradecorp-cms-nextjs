import { requestApi } from "./main.api";
export const getModPosApi = async (modul_id, position_id) => {
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

export const getRefFlowApi = async (modul_id, position_id) => {
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
