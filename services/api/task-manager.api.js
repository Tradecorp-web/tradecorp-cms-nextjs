import { requestApi, requestRawApi } from "./main.api";

export const getListTaskManagerApi = async (search = "", page = 0, limit = 0) => {
    try {
        let param = "?search="+search
        if (page > 0 || limit > 0) {
            page++
            param += "&page="+page+"&limit="+limit
        }
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/task${param}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const getDetailTaskManagerApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/task/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const deleteTaskManagerApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/task/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const saveTaskManagerApi = async (data) => {
    try {
        var response = null
        if (data.id == null || data.id == "") {
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/task`,
                method: 'POST',
                body: data,
                isAuth: true
            })
        } else {
            var id = data.id
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/task/${id}`,
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

export const getListTaskMessageApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/task/message/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const downloadTaskMessageFileApi = async (id,msgid) => {
    try {
        const response = await requestRawApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/task/message/${id}/dl/${msgid}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const deleteTaskMessageApi = async (id,msgid) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/task/message/${id}/${msgid}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const saveTaskMessageApi = async (id,data) => {
    try {
        var response = null
        if (data.id == null || data.id == "") {
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/task/message/${id}`,
                method: 'POST',
                body: data,
                isAuth: true
            })
        } else {
            var idmsg = data.id
            response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/task/message/${id}/${idmsg}`,
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
