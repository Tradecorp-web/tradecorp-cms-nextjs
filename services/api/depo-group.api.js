import { requestApi } from "./main.api"

export const getListDepoGroupApi = async (search = "", page = 0, limit = 0) => {
    try {
        let param = "?search="+search
        if (page > 0 || limit > 0) {
            page++
            param += "&page="+page+"&limit="+limit
        }

        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/depo-group${param}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const getDetailDepoGroupApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/depo-group/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const deleteDepoGroupApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/depo-group/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const saveDepoGroupApi = async (data, id) => {
    try {
        var response = null
        if (id == null || id == "") {
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/depo-group`,
                method: 'POST',
                body: data,
                isAuth: true
            })
        } else {
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/depo-group/${id}`,
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
