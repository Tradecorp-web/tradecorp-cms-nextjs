import { dateFormatInput } from "../../helpers/general";
import { requestApi } from "./main.api";

export const getListDOAcceptanceApi = async (param) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/do-acceptance?`
    url += `search=${param?.search ?? ""}&`
    url += `page=${param?.page ?? 1}&`
    url += `limit=${param?.limit ?? 20}&`
    url += `orderBy=${param?.orderBy ?? ""}&`
    url += `order=${param?.order ?? ""}&`
    url += `depoId=${param?.depoId ?? ""}&`
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

export const getDetailDOAcceptanceApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/do-acceptance/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const insertDOAcceptanceApi = async (data) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/do-acceptance`,
            method: 'POST',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const updateDOAcceptanceApi = async (data, id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/do-acceptance/${id}`,
            method: 'PUT',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const deleteDOAcceptanceApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/do-acceptance/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const getRequestLocDOAcceptanceApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/do-acceptance/push/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const getLocationDOAcceptanceApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/do-acceptance/loc/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};