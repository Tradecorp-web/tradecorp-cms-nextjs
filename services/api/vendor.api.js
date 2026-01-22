import { requestApi } from "./main.api";

export const getListVendorApi = async (param) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/vendor?`
    url += `search=${param?.search ?? ""}&`
    url += `page=${param?.page ?? 1}&`
    url += `limit=${param?.limit ?? 20}&`
    url += `orderBy=${param?.orderBy ?? ""}&`
    url += `order=${param?.order ?? ""}&`
    url += `isAccepted=${param?.isAccepted ?? ""}&`
    url += `pendingAcceptance=${param?.pendingAcceptance ?? ""}&`
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

export const getDetailVendorApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/vendor/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const insertVendorApi = async (data) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/vendor`,
            method: 'POST',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const registerVendorApi = async (data) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/vendor/register`,
            method: 'POST',
            body: data
        })
        return response
    } catch (err) {
        throw err
    }
};

export const updateVendorApi = async (data, id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/vendor/${id}`,
            method: 'PUT',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const deleteVendorApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/vendor/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};