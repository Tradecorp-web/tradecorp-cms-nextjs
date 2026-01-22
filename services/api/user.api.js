import {requestApi} from "./main.api";

export const getListUserApi = async (search = "", page = 0, limit = 0, orderBy = "", order = "") => {
    try {
        let param = "?search="+search
        if (page > 0 || limit > 0) {
            page++
            param += "&page="+page+"&limit="+limit
        }
        if (orderBy != "" || order != "") {
            param += "&orderBy="+orderBy+"&order="+order
        }
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/user${param}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const getListUserApi2 = async (param) => {
    try {
        var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/user?`
        url += `search=${param?.search ?? ""}&`
        url += `page=${param?.page ?? 1}&`
        url += `limit=${param?.limit ?? 20}&`
        url += `orderBy=${param?.orderBy ?? ""}&`
        url += `order=${param?.order ?? ""}&`
        url += `companyId=${param?.companyId ?? ""}&`
        url += `officeId=${param?.officeId ?? ""}&`
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

export const getDetailUserApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/user/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const deleteUserApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/user/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const saveUserApi = async (data) => {
    try {
        var response = null
        if (data.id == null || data.id == "") {
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/user`,
                method: 'POST',
                body: data,
                isAuth: true
            })
        } else {
            var id = data.id
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/user/${id}`,
                method: 'PUT',
                body: data,
                isAuth: true
            })
        }
        return response
    } catch (err) {
        throw err
    }
}

export const getDetailSalesTeamApi = async (teamid) => {
    try {
        let teamid = 8003
        return await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/userteam/${teamid}`,
            method: "GET",
            isAuth: true
        });
    } catch (err) {
        throw err;
    }
};