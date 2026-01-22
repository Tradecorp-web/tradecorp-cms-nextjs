import { requestApi } from "./main.api";

export const getListProductCategoryApi = async (param) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/product-category?`
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

export const getDetailProductCategoryApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/product-category/${id}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const insertProductCategoryApi = async (data) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/product-category`,
            method: 'POST',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const updateProductCategoryApi = async (data, id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/product-category/${id}`,
            method: 'PUT',
            body: data,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const deleteProductCategoryApi = async (id) => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/product-category/${id}`,
            method: 'DELETE',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};