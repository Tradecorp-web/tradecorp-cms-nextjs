import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "../../../components/helper/loading";
import { isLoggedIn, isPermit } from "../../../helpers/general";
import getRoute from "../../../helpers/router";

const PageLayout = dynamic(() => import('../../../components/page/container/lease-agreement/lease-agreement-detail'), {
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
            if (!isPermit("menu","container")) {
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