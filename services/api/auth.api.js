import { LOCAL_STORAGE_API_TOKEN,LOCAL_STORAGE_EXP_TOKEN,LOCAL_STORAGE_USER_ID,LOCAL_STORAGE_API_REFRESH_TOKEN,LOCAL_STORAGE_DEVICE,LOCAL_STORAGE_PREFIX,LOCAL_STORAGE_SUFFIX,LOCAL_STORAGE_THOUSAND,LOCAL_STORAGE_DECIMAL,LOCAL_STORAGE_SCALE,LOCAL_STORAGE_TIMEOUT,LOCAL_STORAGE_DEV_ID,LOCAL_STORAGE_STOP_TIMEOUT,LOCAL_STORAGE_TAX } from "../../helpers/consts";
import { requestApi, requestRawApi } from "./main.api";

const loginApi = async (username, password, device, devid) => {
    try {
        const response = await requestRawApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/login`,
            method: 'POST',
            body: {
                username: username,
                password: password,
                device: device,
                device_id: devid
            }
        })

        const data = await response.json()
        // if (response.status == 200) {
        //     localStorage.setItem(LOCAL_STORAGE_API_TOKEN, data.data.token)
        //     localStorage.setItem(LOCAL_STORAGE_EXP_TOKEN, data.data.expires)
        //     localStorage.setItem(LOCAL_STORAGE_USER_ID, data.data.id)
        //     localStorage.setItem(LOCAL_STORAGE_API_REFRESH_TOKEN, data.data.refresh_token)
        //     localStorage.setItem(LOCAL_STORAGE_PREFIX, data.data.company.prefix_currency)
        //     localStorage.setItem(LOCAL_STORAGE_SUFFIX, data.data.company.suffix_currency)
        //     localStorage.setItem(LOCAL_STORAGE_THOUSAND, data.data.company.thousand_separator)
        //     localStorage.setItem(LOCAL_STORAGE_DECIMAL, data.data.company.decimal_separator)
        //     localStorage.setItem(LOCAL_STORAGE_SCALE, data.data.company.decimal_scale)
        //     localStorage.setItem(LOCAL_STORAGE_TIMEOUT, data.data.config.login_timeout)
        //     localStorage.setItem(LOCAL_STORAGE_TAX, data.data.company.tax)
        //     return data.data
        // } else if (response.status == 201) {
        //     const message = data.message.split("|")
        //     localStorage.setItem(LOCAL_STORAGE_DEV_ID, message[1])
        //     throw message[0]
        // } else {
        //     throw data.message
        // }
        if (response.status == 200) {
            if (data.code == 200) {
                localStorage.setItem(LOCAL_STORAGE_API_TOKEN, data.data.token)
                localStorage.setItem(LOCAL_STORAGE_EXP_TOKEN, data.data.expires)
                localStorage.setItem(LOCAL_STORAGE_USER_ID, data.data.id)
                localStorage.setItem(LOCAL_STORAGE_API_REFRESH_TOKEN, data.data.refresh_token)
                localStorage.setItem(LOCAL_STORAGE_PREFIX, data.data.company.prefix_currency)
                localStorage.setItem(LOCAL_STORAGE_SUFFIX, data.data.company.suffix_currency)
                localStorage.setItem(LOCAL_STORAGE_THOUSAND, data.data.company.thousand_separator)
                localStorage.setItem(LOCAL_STORAGE_DECIMAL, data.data.company.decimal_separator)
                localStorage.setItem(LOCAL_STORAGE_SCALE, data.data.company.decimal_scale)
                localStorage.setItem(LOCAL_STORAGE_TIMEOUT, data.data.config.login_timeout)
                localStorage.setItem(LOCAL_STORAGE_TAX, data.data.company.tax)
                return data.data
            } else if (data.code == 201) {
                const message = data.message.split("|")
                localStorage.setItem(LOCAL_STORAGE_DEV_ID, message[1])
                throw message[0]
            } else {
                throw data.message
            }
        } else {
            throw "Failed"
        }
    } catch (err) {
        throw err
    }
};

const tokenApi = (userid, token, device) => {
    var body = {
        user_id: userid,
        token: token,
        device: device
    }
    var xhr = new XMLHttpRequest()
    var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/get-token`
    xhr.open("POST", url, false)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(body))
    // if (xhr.status === 200) {
    //     var response = JSON.parse(xhr.responseText)
    //     localStorage.setItem(LOCAL_STORAGE_API_TOKEN, response.data.token)
    //     localStorage.setItem(LOCAL_STORAGE_EXP_TOKEN, response.data.expires)
    //     localStorage.setItem(LOCAL_STORAGE_USER_ID, response.data.id)
    //     localStorage.setItem(LOCAL_STORAGE_API_REFRESH_TOKEN, response.data.refresh_token)
    //     localStorage.setItem(LOCAL_STORAGE_PREFIX, response.data.company.prefix_currency)
    //     localStorage.setItem(LOCAL_STORAGE_SUFFIX, response.data.company.suffix_currency)
    //     localStorage.setItem(LOCAL_STORAGE_THOUSAND, response.data.company.thousand_separator)
    //     localStorage.setItem(LOCAL_STORAGE_DECIMAL, response.data.company.decimal_separator)
    //     localStorage.setItem(LOCAL_STORAGE_SCALE, response.data.company.decimal_scale)
    //     localStorage.setItem(LOCAL_STORAGE_TIMEOUT, response.data.config.login_timeout)
    //     localStorage.setItem(LOCAL_STORAGE_TAX, response.data.company.tax)
    //     localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT)
    //     return response.data
    // } else if (xhr.status === 206) {
    //     var response = JSON.parse(xhr.responseText)
    //     let data = {expires:parseInt(response.message)}
    //     // console.log(data)
    //     return data
    // } else if (xhr.status === 400) {
    //     var response = JSON.parse(xhr.responseText)
    //     throw response.message
    // } else if (xhr.status === 404) {
    //     var response = JSON.parse(xhr.responseText)
    //     throw response.message
    // } else {
    //     throw "Failed"
    // }
    if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText)
        if (response.code == 200) {
            localStorage.setItem(LOCAL_STORAGE_API_TOKEN, response.data.token)
            localStorage.setItem(LOCAL_STORAGE_EXP_TOKEN, response.data.expires)
            localStorage.setItem(LOCAL_STORAGE_USER_ID, response.data.id)
            localStorage.setItem(LOCAL_STORAGE_API_REFRESH_TOKEN, response.data.refresh_token)
            localStorage.setItem(LOCAL_STORAGE_PREFIX, response.data.company.prefix_currency)
            localStorage.setItem(LOCAL_STORAGE_SUFFIX, response.data.company.suffix_currency)
            localStorage.setItem(LOCAL_STORAGE_THOUSAND, response.data.company.thousand_separator)
            localStorage.setItem(LOCAL_STORAGE_DECIMAL, response.data.company.decimal_separator)
            localStorage.setItem(LOCAL_STORAGE_SCALE, response.data.company.decimal_scale)
            localStorage.setItem(LOCAL_STORAGE_TIMEOUT, response.data.config.login_timeout)
            localStorage.setItem(LOCAL_STORAGE_TAX, response.data.company.tax)
            localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT)
            return response.data
        } else if (response.code == 206) {
            let data = {expires:parseInt(response.message)}
            // console.log(data)
            return data
        } else if (response.code == 400) {
            throw response.message
        } else if (response.code == 404) {
            throw response.message
        } else {
            throw "Failed"
        }
    } else {
        throw "Failed"
    }
    // try {
    //     var headers = {
    //         'Content-Type': 'application/json',
    //         'Authorization': '',
    //     }
    //     var body = {
    //         user_id: userid,
    //         token: token,
    //         device: device
    //     }
    //     fetch(
    //         `${process.env.NEXT_PUBLIC_REST_API_URL}/get-token`,
    //         {
    //             method: 'POST',
    //             headers: headers,
    //             body: JSON.stringify(body),
    //         },
    //     ).then((response) => {
    //         console.log(response)
    //         if(response.status == 200) {
    //             localStorage.setItem(LOCAL_STORAGE_API_TOKEN, response.token)
    //             localStorage.setItem(LOCAL_STORAGE_EXP_TOKEN, response.expires)
    //             localStorage.setItem(LOCAL_STORAGE_USER_ID, response.id)
    //             localStorage.setItem(LOCAL_STORAGE_API_REFRESH_TOKEN, response.refresh_token)
    //             localStorage.setItem(LOCAL_STORAGE_PREFIX, response.company.prefix_currency)
    //             localStorage.setItem(LOCAL_STORAGE_SUFFIX, response.company.suffix_currency)
    //             localStorage.setItem(LOCAL_STORAGE_THOUSAND, response.company.thousand_separator)
    //             localStorage.setItem(LOCAL_STORAGE_DECIMAL, response.company.decimal_separator)
    //             localStorage.setItem(LOCAL_STORAGE_SCALE, response.company.decimal_scale)
    //             return response.data
    //         } else if (response.status == 206) {
    //             let data = {expires:response.message}
    //             console.log(data)
    //             return data
    //         } else if (response.status == 400) {
    //             throw response.message
    //         } else if (response.status == 404) {
    //             throw "Source Not Found"
    //         } else {
    //             throw "Failed"
    //         }
    //     }).catch((err) => {
    //         throw err
    //     })
        
    // } catch (err) {
    //     throw err
    // }
}

const logoutAccount = async () => {
    const stop = localStorage.getItem(LOCAL_STORAGE_STOP_TIMEOUT)
    console.log(stop)
    if (stop != "1") {
        const userid = localStorage.getItem(LOCAL_STORAGE_USER_ID)
        const refresh = localStorage.getItem(LOCAL_STORAGE_API_REFRESH_TOKEN)
        const device = localStorage.getItem(LOCAL_STORAGE_DEVICE)
        try {
            const response = await requestApi({
                url: `${process.env.NEXT_PUBLIC_REST_API_URL}/logout`,
                method: 'POST',
                body: {
                    user_id: userid,
                    token: refresh,
                    device: device
                }
            })
            localStorage.removeItem(LOCAL_STORAGE_API_TOKEN)
            localStorage.removeItem(LOCAL_STORAGE_EXP_TOKEN)
            localStorage.removeItem(LOCAL_STORAGE_USER_ID)
            localStorage.removeItem(LOCAL_STORAGE_API_REFRESH_TOKEN)
            localStorage.removeItem(LOCAL_STORAGE_PREFIX)
            localStorage.removeItem(LOCAL_STORAGE_SUFFIX)
            localStorage.removeItem(LOCAL_STORAGE_THOUSAND)
            localStorage.removeItem(LOCAL_STORAGE_DECIMAL)
            localStorage.removeItem(LOCAL_STORAGE_SCALE)
            localStorage.removeItem(LOCAL_STORAGE_TIMEOUT)
            localStorage.removeItem(LOCAL_STORAGE_TAX)
        } catch (err) {
            console.log("LOGOUT ERROR")
            throw err
        }
        window.location.assign("/");
    }
};

export {loginApi, tokenApi, logoutAccount}