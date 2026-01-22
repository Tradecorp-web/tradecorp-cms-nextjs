import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "../../components/helper/loading";
import { isLoggedIn, isPermit } from "../../helpers/general";
import getRoute from "../../helpers/router";
import {
    LOCAL_STORAGE_MESSAGE,
    LOCAL_STORAGE_MESSAGE_TYPE,
} from "../../helpers/consts";

// const PageLayout = dynamic(() => import('../../components/page/customer/customer-detail'), {
const PageLayout = dynamic(() => import('../../components/page/customer/customer-edit'), {

    loading: () => (
      <Loading />
    ),
    ssr: false,
});

export default function Index() {

    const router = useRouter()

    useEffect(async () => {
        const res = isLoggedIn()
        if(res) {
            if (!isPermit("menu","customer")) {
                localStorage.setItem(LOCAL_STORAGE_MESSAGE_TYPE, "error")
                localStorage.setItem(LOCAL_STORAGE_MESSAGE, "You don't have permission on Customer page")
                await router.push('/')
            }
        } else {
            await router.push(getRoute("auth.login"))
        }
    }, []);

    return (
        <PageLayout />
    )
}