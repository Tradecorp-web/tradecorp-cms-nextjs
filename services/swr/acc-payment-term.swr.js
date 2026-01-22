import useSWR from "swr";
import { swrOptions } from "./config.swr";
import { getListAccPaymentTermApi, getDetailAccPaymentTermApi } from "../api/acc-payment-term.api";

export function getListAccPaymentTermSwr(param) {
    let search = param?.search ?? "";
    let page = param?.page ?? 1;
    let limit = param?.limit ?? 20;
    const { data, mutate, error } = useSWR(
        `/acc-payment-term?search=${search}&page=${page}&limit=${limit}&`,
        async () => getListAccPaymentTermApi(param),
        swrOptions
    );
    const isLoading = !data && !error;

    return {
        isLoading,
        data,
        error,
        mutate,
    };
}

export function getDetailAccPaymentTermSwr(id) {
    const fetcher = async () => getDetailAccPaymentTermApi(id);
    const { data, mutate, error } = useSWR(
        `/acc-payment-term/${id}`,
        fetcher,
        swrOptions
    );
    const isLoading = !data && !error;

    return {
        isLoading,
        data,
        error,
        mutate,
    };
}