import { requestApi } from "./main.api";

export const getListImportHistoryApi = async (type = "", page = 0, limit = 0) => {
    try {
        let param = "?type="+type
        if (page > 0 || limit > 0) {
            page++
            param += "&page="+page+"&limit="+limit
        }
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/import-list${param}`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
}
