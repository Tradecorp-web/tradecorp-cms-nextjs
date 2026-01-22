import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import Loading from '../../../../components/helper/loading'
import { isLoggedIn, isPermit } from "../../../../helpers/general"
import getRoute from "../../../../helpers/router"

const PageLayout = dynamic(() => import('../../../../admin-components/pages/master/color/list'), {
    loading: () => (
      <Loading />
    ),
    ssr: false,
});

export default function Page() {

    const router = useRouter()

    useEffect(() => {
        const res = isLoggedIn()
        if(res) {
            if (!isPermit("menu","admin")) {
                localStorage.setItem(LOCAL_STORAGE_MESSAGE_TYPE, "error")
                localStorage.setItem(LOCAL_STORAGE_MESSAGE, "You don't have permission on Admin Menu")
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