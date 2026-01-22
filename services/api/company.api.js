import { requestApi } from "./main.api";

export const getListCompanyApi = async (param) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/company?`
    url += `search=${param?.search ?? ""}&`
    url += `page=${param?.page ?? 1}&`
    url += `limit=${param?.limit ?? 20}&`
    url += `orderBy=${param?.orderBy ?? ""}&`
    url += `order=${param?.order ?? ""}&`
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

export const getDetailCompanyApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/company/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const updateCompanyApi = async (data) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/company`,
            method: 'PUT',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const getListCompanyOfficeApi = async (param) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/office?`
    url += `search=${param?.search ?? ""}&`
    url += `page=${param?.page ?? 1}&`
    url += `limit=${param?.limit ?? 20}&`
    url += `orderBy=${param?.orderBy ?? ""}&`
    url += `order=${param?.order ?? ""}&`
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

export const getDetailCompanyOfficeApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/office/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const insertCompanyOfficeApi = async (data) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/office`,
            method: 'POST',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const updateCompanyOfficeApi = async (data, id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/office/${id}`,
            method: 'PUT',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const deleteCompanyOfficeApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/office/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};