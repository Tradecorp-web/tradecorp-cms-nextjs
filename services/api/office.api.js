import { requestApi } from "./main.api";

export const getListMasterOffice = async (param) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/office?`
    url += `search=${param?.search ?? ""}&`
    url += `page=${param?.page ?? 1}&`
    url += `limit=${param?.limit ?? 20}&`
    url += `orderBy=${param?.orderBy ?? ""}&`
    url += `order=${param?.order ?? ""}&`
    url += `company=${param?.company ?? ""}&`
    try {
        const response = await requestApi({
            url: url,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const getListMasterPermissionTemp = async (search = "", page = 0, limit = 0, orderBy = "", order = "") => {
    let param = "?search="+search
    if (page > 0 || limit > 0) {
        page++
        param += "&page="+page+"&limit="+limit
    }
    if (orderBy != "" || order != "") {
        param += "&orderBy="+orderBy+"&order="+order
    }
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/master/permission-temp${param}`
    try {
        const response = await requestApi({
            url: url,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const getDetailPermissionTemplateApi = async (id) => {
    try {
      const response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/permission-temp/${id}`,
        method: "GET",
        isAuth: true,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  
  export const deletePermissionTemplateApi = async (id) => {
    try {
      const response = await requestApi({
        url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/permission-temp/${id}`,
        method: "DELETE",
        isAuth: true,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  
  export const savePermissionTemplateApi = async (data) => {
    try {
      var response = null;
      if (data.id == null || data.id == "") {
        response = await requestApi({
          url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/permission-temp`,
          method: "POST",
          body: data,
          isAuth: true,
        });
      } else {
        var id = data.id;
        response = await requestApi({
          url: `${process.env.NEXT_PUBLIC_REST_API_URL}/master/permission-temp/${id}`,
          method: "PUT",
          body: data,
          isAuth: true,
        });
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  export const getListPermission = async () => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/master/permission`
    try {
        const response = await requestApi({
            url: url,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};
