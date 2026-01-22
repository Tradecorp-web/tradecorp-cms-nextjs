import { requestApi } from "./main.api";

export const insertFlowAppNext = async (modul, invid, data) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/ref-status-app-insert/${modul}/${invid}`,
      body: data,
      method: "POST",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
