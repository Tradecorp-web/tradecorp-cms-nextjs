import { requestApi } from "./main.api";

export const getListDepoApi = async (param) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/depo?`
    url += `search=${param?.search ?? ""}&`
    url += `page=${param?.page ?? 1}&`
    url += `limit=${param?.limit ?? 20}&`
    url += `orderBy=${param?.orderBy ?? ""}&`
    url += `order=${param?.order ?? ""}&`
    url += `isOwn=${param?.isOwn ?? ""}&`
    url += `depoPartnerId=${param?.depoPartnerId ?? ""}&`
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

export const getListDepoNoLimitApi = async (param) => {
    
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/depo-nolimit/${param?.group}?`
    url += `search=${param?.search ?? ""}&`
    url += `page=${param?.page ?? 1}&`
    url += `limit=${param?.limit ?? 20}&`
    url += `orderBy=${param?.orderBy ?? ""}&`
    url += `order=${param?.order ?? ""}&`
    url += `isOwn=${param?.isOwn ?? ""}&`
    url += `depoPartnerId=${param?.depoPartnerId ?? ""}&`

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

export const getListDepoGCountryApi = async (param) => {
    
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/depo-group/country/${param?.group}?`
    url += `search=${param?.search ?? ""}&`
    url += `page=${param?.page ?? 1}&`
    url += `limit=${param?.limit ?? 20}&`
    url += `orderBy=${param?.orderBy ?? ""}&`
    url += `order=${param?.order ?? ""}&`
    url += `isOwn=${param?.isOwn ?? ""}&`
    url += `depoPartnerId=${param?.depoPartnerId ?? ""}&`

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

export const getListDepoGApi = async (param, group) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/depo/group/${group}?`
    url += `search=${param?.search ?? ""}&`
    url += `page=${param?.page ?? 1}&`
    url += `limit=${param?.limit ?? 20}&`
    url += `orderBy=${param?.orderBy ?? ""}&`
    url += `order=${param?.order ?? ""}&`
    url += `isOwn=${param?.isOwn ?? ""}&`
    url += `depoPartnerId=${param?.depoPartnerId ?? ""}&`
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

export const getListDepo2GApi = async (param, group) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/depo2/group/${group}?`
    url += `search=${param?.search ?? ""}&`
    url += `page=${param?.page ?? 1}&`
    url += `limit=${param?.limit ?? 20}&`
    url += `orderBy=${param?.orderBy ?? ""}&`
    url += `order=${param?.order ?? ""}&`
    url += `isOwn=${param?.isOwn ?? ""}&`
    url += `depoPartnerId=${param?.depoPartnerId ?? ""}&`
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

export const getDetailDepoApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/depo/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const insertDepoApi = async (data) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/depo`,
            method: 'POST',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const updateDepoApi = async (data, id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/depo/${id}`,
            method: 'PUT',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const deleteDepoApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/depo/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const addDepoOfficerApi = async (depoId, userId) => {
    try {
        var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/depo/${depoId}/officer/add/${userId}`
        const response = await requestApi({
            url: url,
            method: 'PUT',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const deleteDepoOfficerApi = async (depoId, userId) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/depo/${depoId}/officer/remove/${userId}`,
            method: 'PUT',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const getDepoNewsApi = async () => {
    try {
        const response = await fetch(
            "https://www.freightwaves.com/wp-json/wp/v2/posts",
            { method: "GET" },
        )
        const data = await response.json()
        console.log("data")
        console.log(data)
        return data
    } catch (err) {
        throw err
    }
};