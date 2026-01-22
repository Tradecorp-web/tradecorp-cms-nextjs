import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import Loading from "../../components/helper/loading";
import { LOCAL_STORAGE_MESSAGE_TYPE, LOCAL_STORAGE_MESSAGE } from "../../helpers/consts";
import { isLoggedIn, isPermit } from "../../helpers/general";
import getRoute from "../../helpers/router";

const PageLayout = dynamic(() => import('../../components/page/customer'), {
    loading: () => (
      <Loading />
    ),
    ssr: false,
});

export default function Index() {

    const router = useRouter()

    useEffect(async () => {
        const res = isLoggedIn();
        if(res) {
            if (!isPermit("menu","customer")) {
                localStorage.setItem(LOCAL_STORAGE_MESSAGE_TYPE, "error")
                localStorage.setItem(LOCAL_STORAGE_MESSAGE, "You don't have permission on CONTAINER")
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