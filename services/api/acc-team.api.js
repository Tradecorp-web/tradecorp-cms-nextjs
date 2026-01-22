import { requestApi } from "./main.api";

export const getListTeamApi = async (search = "", page = 0, limit = 0) => {
  try {
    let param = "?category=team";
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/categories?category=team`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};
