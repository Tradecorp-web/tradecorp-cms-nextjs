import { requestApi } from "./main.api";

export const getListMaterialCategoryApi = async (param) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/material-category?`
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

export const getDetailMaterialCategoryApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material-category/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const insertMaterialCategoryApi = async (data) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material-category`,
            method: 'POST',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const updateMaterialCategoryApi = async (data, id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material-category/${id}`,
            method: 'PUT',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const deleteMaterialCategoryApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/material-category/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};