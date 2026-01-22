import { requestApi } from "./main.api";

export const getBrowseFolderApi = async (search = "", page = 0, limit = 0, parent="") => {
    try {
        let param = "?parent="+parent+"&search="+search
        if (page > 0 || limit > 0) {
            page++
            param += "&page="+page+"&limit="+limit
        }
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder/browse${param}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const getListFolderApi = async (search = "", page = 0, limit = 0, parent="") => {
    try {
        let param = "?parent="+parent+"&search="+search
        if (page > 0 || limit > 0) {
            page++
            param += "&page="+page+"&limit="+limit
        }
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder${param}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const getDetailFolderApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const deleteFolderApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const purgeFolderApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder2/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const saveFolderApi = async (data) => {
    try {
        var response = null
        if (data.id == null || data.id == "") {
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder`,
                method: 'POST',
                body: data,
                isAuth: true
            })
        } else {
            var id = data.id
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder/${id}`,
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

export const saveMultiFolderApi = async (data) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder2`,
            method: 'POST',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}
