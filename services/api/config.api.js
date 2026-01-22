import { requestApi } from "./main.api";

export const getDetailConfigApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/config`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}

export const saveConfigApi = async (data) => {
    try {
        var response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/config`,
            method: 'PUT',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}
