import { LOCAL_STORAGE_API_TOKEN } from "../../helpers/consts"
import { isLoggedIn } from "../../helpers/general"

const hostApi = "http://127.0.0.1:1323"

// param = {
//     isRequestToken: Boolean,
//     isAuth: Boolean,
//     isFormData: Boolean,
//     url: String,
//     method: String,
//     body: Object,
// }

const requestApi = async (param) => {
    try {
        if(!param.isRequestToken && param.isAuth) {
            if(!isLoggedIn()) {
                throw "Unauthenticated"
            }
        }
        const token = param?.serverSide ? "" : localStorage.getItem(LOCAL_STORAGE_API_TOKEN)
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': param.isAuth ? `Bearer ${token}` : '',
        }
        if(param.isFormData) headers = {
            'Authorization': param.isAuth ? `Bearer ${token}` : '',
        }
        const response = await fetch(
            param.url,
            {
                method: param.method,
                headers: headers,
                body: param.body ? (param.isFormData ? param.body : JSON.stringify(param.body)) : null,
            },
        )
            
        const data = await response.json()
        // if(response.status == 200) {
        //     return data.data
        // } else if (response.status == 401) {
        //     throw data.message
        // } else if (response.status == 400) {
        //     throw data.message
        // } else if (response.status == 404) {
        //     throw "Source Not Found"
        // } else {
        //     throw "Failed"
        // }
        if (response.status == 200) {
            if (data.code == 200) {
                return data.data
            } else {
                throw data.message
            }
        } else if (response.status == 404) {
            throw "Source Not Found"
        } else {
            throw "Failed"
        }
    } catch (err) {
        throw `${err}`
    }
}

const requestRawApi = async (param) => {
    try {
        if(!param.isRequestToken && param.isAuth) {
            if(!(await isLoggedIn())) {
                throw "Unauthenticated"
            }
        }
        const token = param?.serverSide ? "" : localStorage.getItem(LOCAL_STORAGE_API_TOKEN)
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': param.isAuth ? `Bearer ${token}` : '',
        }
        if(param.isFormData) headers = {
            'Authorization': param.isAuth ? `Bearer ${token}` : '',
        }
        if (param.contentType?.length > 0) {
            headers = {
                'Content-Type': param.contentType,
                'Authorization': param.isAuth ? `Bearer ${token}` : '',
            }
        }
        const response = await fetch(
            param.url,
            {
                method: param.method,
                headers: headers,
                body: param.body ? (param.isFormData ? param.body : JSON.stringify(param.body)) : null,
            },
        )
        
        return response
    } catch (err) {
        throw `${err}`
    }
}

export {hostApi, requestApi, requestRawApi}