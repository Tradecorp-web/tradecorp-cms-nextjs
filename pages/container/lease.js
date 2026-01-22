import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import Loading from "../../components/helper/loading";
import { LOCAL_STORAGE_MESSAGE_TYPE, LOCAL_STORAGE_MESSAGE } from "../../helpers/consts";
import { isLoggedIn, isPermit } from "../../helpers/general";
import getRoute from "../../helpers/router";

const PageLayout = dynamic(() => import('../../components/page/container/lease-list'), {
    loading: () => (
      <Loading />
    ),
    ssr: false,
});

export default function Index() {

    const router = useRouter()

    useEffect(async () => {
        var res = await isLoggedIn()
        if(res) {
            if (!isPermit("menu","lease_container")) {
                localStorage.setItem(LOCAL_STORAGE_MESSAGE_TYPE, "error")
                localStorage.setItem(LOCAL_STORAGE_MESSAGE, "You don't have permission on CONTAINER")
                router.push('/')
            }
        } else {
            router.push(getRoute("auth.login"))
        }
    }, []);

    return (
        <PageLayout />
    )
}