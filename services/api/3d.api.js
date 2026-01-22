import { requestApi } from "./main.api";

export const getListDesignApi = async (page, limit) => {
    try {
        let param = ""
        if (page > 0 || limit > 0) {
            page++
            param = "?page="+page+"&limit="+limit
        }
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/3d${param}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const getDesignApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/3d/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const deleteDesignApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/3d/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const saveDesignApi = async (data) => {
    try {
        var response = null
        if (data.id == null || data.id == "") {
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/3d`,
                method: 'POST',
                body: data,
                isAuth: true
            })
        } else {
            var id = data.id
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/3d/${id}`,
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