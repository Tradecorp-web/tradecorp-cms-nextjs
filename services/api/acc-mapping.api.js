import { requestApi } from "./main.api";

export const getListAccMappingApi = async (
  search = "",
  page = 0,
  limit = 0
) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-mapping${param}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailAccMappingApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-mapping/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

// export const saveAccMappingApi = async (data) => {
//   var tes = Object.values(data);
//   try {
//     var response = null;
//     if (data.id == null || data.id == "") {
//       response = await requestApi({
//         url: `${process.env.NEXT_PUBLIC_REST_API_URL}/coainsert`,
//         method: "POST",
//         body: data,
//         isAuth: true,
//       });
//     } else {
//       var id = data.id;
//       response = await requestApi({
//         url: `${process.env.NEXT_PUBLIC_REST_API_URL}/coaedit/${id}`,
//         method: "PUT",
//         body: data,
//         isAuth: true,
//       });
//     }
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };

// export const deleteCoaApi = async (id) => {
//   try {
//     const response = await requestApi({
//       url: `${process.env.NEXT_PUBLIC_REST_API_URL}/coadelete/${id}`,
//       method: "DELETE",
//       isAuth: true,
//     });
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };
