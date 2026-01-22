import { requestApi } from "./main.api";

export const getListFolderUserApi = async (search = "", page = 0, limit = 0, parent="") => {
    try {
        let param = "?parent="+parent+"&search="+search
        if (page > 0 || limit > 0) {
            page++
            param += "&page="+page+"&limit="+limit
        }
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder-user${param}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const getDetailFolderUserApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder-user/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const deleteFolderUserApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder-user/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const purgeFolderUserApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder-user2/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const saveFolderUserApi = async (data) => {
    try {
        var response = null
        if (data.id == null || data.id == "") {
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder-user`,
                method: 'POST',
                body: data,
                isAuth: true
            })
        } else {
            var id = data.id
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder-user/${id}`,
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

export const saveMultiFolderUserApi = async (data) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/folder-user2`,
            method: 'POST',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}
