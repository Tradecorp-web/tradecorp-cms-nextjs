import { requestApi, requestRawApi } from "./main.api";
import { LOCAL_STORAGE_API_TOKEN } from "../../helpers/consts"

export const uploadFileApi = async (path, file) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/upload/file`
    const formData = new FormData()
    formData.append('path', path)
    formData.append('file', file)
    try {
        const response = await requestApi({
            url: url,
            method: 'POST',
            isFormData: true,
            body: formData
        })
        return response
    } catch (err) {
        throw err
    }
};

export const deleteFileApi = async (link) => {
    try {
        const formData = new FormData()
        formData.append('url', link)
        var response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/delete/file`,
            method: 'POST',
            isFormData: true,
            body: formData,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const uploadFileDocApi = async (path, file, progress, complete, error) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/upload-doc/file`
    const token = localStorage.getItem(LOCAL_STORAGE_API_TOKEN)
    const formData = new FormData()
    formData.append('path', path)
    formData.append('file', file)
    // try {
    //     const response = await requestApi({
    //         url: url,
    //         method: 'POST',
    //         isFormData: true,
    //         body: formData,
    //         isAuth: true
    //     })
    //     return response
    // } catch (err) {
    //     throw err
    // }
    var xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Authorization","Bearer "+token)
    xhr.upload.addEventListener("progress", progress, false)
    xhr.addEventListener("load", complete, false)
    xhr.addEventListener("error", error, false)
    xhr.send(formData)
};

export const uploadFileMyApi = async (path, file, progress, complete, error) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/upload-my/file`
    const token = localStorage.getItem(LOCAL_STORAGE_API_TOKEN)
    const formData = new FormData()
    formData.append('path', path)
    formData.append('file', file)
    // try {
    //     const response = await requestApi({
    //         url: url,
    //         method: 'POST',
    //         isFormData: true,
    //         body: formData,
    //         isAuth: true
    //     })
    //     return response
    // } catch (err) {
    //     throw err
    // }
    var xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Authorization","Bearer "+token)
    xhr.upload.addEventListener("progress", progress, false)
    xhr.addEventListener("load", complete, false)
    xhr.addEventListener("error", error, false)
    xhr.send(formData)
};

export const uploadFileSecApi = async (path, file) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/upload-sec/file`
    const formData = new FormData()
    formData.append('path', path)
    formData.append('file', file)
    try {
        const response = await requestApi({
            url: url,
            method: 'POST',
            isFormData: true,
            body: formData,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const uploadFileImageApi = async (path, file) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/upload-image/file`
    const formData = new FormData()
    formData.append('path', path)
    formData.append('file', file)
    try {
        const response = await requestApi({
            url: url,
            method: 'POST',
            isFormData: true,
            body: formData,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const downloadFileSecApi = async (link) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/download-sec/file`
    const formData = new FormData()
    formData.append('url', link)
    try {
        const response = await requestRawApi({
            url: url,
            method: 'POST',
            isFormData: true,
            body: formData,
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const uploadFileSecListenerApi = async (path, file, progress, complete, error) => {
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/upload-sec/file`
    const token = localStorage.getItem(LOCAL_STORAGE_API_TOKEN)
    const formData = new FormData()
    formData.append('path', path)
    formData.append('file', file)
    var xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Authorization","Bearer "+token)
    xhr.upload.addEventListener("progress", progress, false)
    xhr.addEventListener("load", complete, false)
    xhr.addEventListener("error", error, false)
    xhr.send(formData)
};
