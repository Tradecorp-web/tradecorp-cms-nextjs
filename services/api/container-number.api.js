import { requestApi, requestRawApi } from "./main.api";

export const getListContainerNumberPagingApi = async (modul, param) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial?`;
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

export const getListContainerNumberApi = async (param) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial?`;
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

export const getListContainerNumberApix = async (
  search = "",
  page = 0,
  limit = 0,
  orderBy = "",
  order = ""
) => {
  try {
    let param = "?search=" + search;
    if (page > 0 || limit > 0) {
      page++;
      param += "&page=" + page + "&limit=" + limit;
    }
    param += "&orderBy=" + orderBy + "&order=" + order;
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial${param}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailContainerNumberApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getDetailContainerSerialUnitcodeApi = async (
  unit_code,
  ral_colour,
  serial
) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-unitcode/${unit_code}/${ral_colour}/${serial}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const getSerialUnitcodeApi = async (unit_code, serial, prefix) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-unit-serial/${unit_code}/${serial}/${prefix}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteContainerNumberApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-delete/${id}`,
      method: "DELETE",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const insertContainerNumberApi = async (data) => {
  try {
    var state = 0;
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-insert`,
      method: "POST",
      body: data,
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

export const updateContainerNumberApi = async (id, data) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-update/${id}`,
      body: data,
      method: "PUT",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const updateNewContainerNumberApi = async (id,data) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-update-number/${id}`,
      body: data,
      method: "PUT",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};


export const  getCntFilterApi= async (prefix,value) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-filter/${prefix}/${value}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const  getCntAvailableApi= async (prefix) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-available/${prefix}`,
      method: "GET",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const  updateCntSerialNumber= async (id,lastNumber) => {
  try {
    var response = null;
    response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-update-cntnumber/${id}/${lastNumber}`,
      method: "PUT",
      isAuth: true,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const cekLastCntNumber=async(prefSeries)=>{
  try{
    var response = null;
    response = await requestApi({
      url:`${process.env.NEXT_PUBLIC_REST_API_URL}/container-prefix/${prefSeries}`,
      method:"GET",
      isAuth:true,
    });
    return response;
  }catch(err){
    throw err;
  }
}

// import { requestApi, requestRawApi } from "./main.api";

// export const getListContainerNumberPagingApi = async (modul, param) => {
//   var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial?`;
//   url += `search=${param?.search ?? ""}&`;
//   url += `page=${param?.page ?? 1}&`;
//   url += `limit=${param?.limit ?? 20}&`;
//   url += `orderBy=${param?.orderBy ?? ""}&`;
//   url += `order=${param?.order ?? ""}&`;
//   try {
//     const response = await requestApi({
//       url: url,
//       method: "GET",
//       isAuth: true,
//     });
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };

// export const getListContainerNumberApi = async (param) => {
//   var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial?`;
//   url += `search=${param?.search ?? ""}&`;
//   url += `page=${param?.page ?? 1}&`;
//   url += `limit=${param?.limit ?? 20}&`;
//   url += `orderBy=${param?.orderBy ?? ""}&`;
//   url += `order=${param?.order ?? ""}&`;

//   try {
//     const response = await requestApi({
//       url: url,
//       method: "GET",
//       isAuth: true,
//     });
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };

// export const getListContainerNumberApix = async (
//   search = "",
//   page = 0,
//   limit = 0,
//   orderBy = "",
//   order = ""
// ) => {
//   try {
//     let param = "?search=" + search;
//     if (page > 0 || limit > 0) {
//       page++;
//       param += "&page=" + page + "&limit=" + limit;
//     }
//     param += "&orderBy=" + orderBy + "&order=" + order;
//     const response = await requestApi({
//       url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial${param}`,
//       method: "GET",
//       isAuth: true,
//     });
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };

// export const getDetailContainerNumberApi = async (id) => {
//   try {
//     const response = await requestApi({
//       url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial/${id}`,
//       method: "GET",
//       isAuth: true,
//     });
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };
// export const getDetailContainerSerialUnitcodeApi = async (
//   unit_code,
//   ral_colour,
//   serial
// ) => {
//   try {
//     const response = await requestApi({
//       url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-unitcode/${unit_code}/${ral_colour}/${serial}`,
//       method: "GET",
//       isAuth: true,
//     });
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };
// export const getSerialUnitcodeApi = async (unit_code, serial, prefix) => {
//   try {
//     const response = await requestApi({
//       url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-unit-serial/${unit_code}/${serial}/${prefix}`,
//       method: "GET",
//       isAuth: true,
//     });
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };

// export const deleteContainerNumberApi = async (id) => {
//   try {
//     const response = await requestApi({
//       url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-delete/${id}`,
//       method: "DELETE",
//       isAuth: true,
//     });
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };

// export const insertContainerNumberApi = async (data) => {
//   try {
//     var state = 0;
//     var response = null;
//     response = await requestApi({
//       url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-insert`,
//       method: "POST",
//       body: data,
//       isAuth: true,
//     }).then((a) => {
//       if (a.id != null) {
//         state = a.id;
//       } else {
//         state = 0;
//       }
//     });

//     return state;
//   } catch (err) {
//     throw err;
//   }
// };

// export const updateContainerNumberApi = async (id, data) => {
//   try {
//     var response = null;
//     response = await requestApi({
//       url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-update/${id}`,
//       body: data,
//       method: "PUT",
//       isAuth: true,
//     });

//     return response;
//   } catch (err) {
//     throw err;
//   }
// };

// export const updateNewContainerNumberApi = async (id) => {
//   try {
//     var response = null;
//     response = await requestApi({
//       url: `${process.env.NEXT_PUBLIC_REST_API_URL}/container-serial-update-number/${id}`,
//       body: data,
//       method: "PUT",
//       isAuth: true,
//     });

//     return response;
//   } catch (err) {
//     throw err;
//   }
// };
