import dynamic from "next/dynamic";
import Loading from "../../../components/helper/loading";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isLoggedIn, isPermit } from "../../../helpers/general";
import getRoute from "../../../helpers/router";

const PageLayout = dynamic(() => import('../../../components/page/vendor/vendor-page'), {
    loading: () => (
      <Loading />
    ),
    ssr: false,
});

export default function Index() {

    const router = useRouter()

    useEffect(() => {
        const res = isLoggedIn()
        if(res) {
            if (!isPermit("menu","product")) {
                localStorage.setItem(LOCAL_STORAGE_MESSAGE_TYPE, "error")
                localStorage.setItem(LOCAL_STORAGE_MESSAGE, "You don't have permission on Product & Material")
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