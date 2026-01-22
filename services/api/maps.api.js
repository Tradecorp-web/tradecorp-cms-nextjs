import { googleMapApiKey } from "../../helpers/api_key";
import { requestApi } from "./main.api";

export const loadPlaceDetailByLatLng = async (lat, lng) => {
    try {
        const response = await fetch(`/api/place-by-latlng?latlng=${lat},${lng}`)
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
};

export const loadPlaceDetailByPlaceId = async (placeId) => {
    try {
        const response = await fetch(`/api/place-by-place-id?placeId=${placeId}`)
        const data = await response.json()
        return data
    } catch (err) {
        throw err
    }
};

export const searchAddresAutocomplete = async (keyword) => {
    try {
        const response = await fetch(`/api/search-address?input=${keyword}`)
        const data = await response.json()
        console.log(data)
        return data
    } catch (err) {
        throw err
    }
};