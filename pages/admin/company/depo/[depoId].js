import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import Loading from '../../../../components/helper/loading'
import { LOCAL_STORAGE_MESSAGE, LOCAL_STORAGE_MESSAGE_TYPE } from "../../../../helpers/consts";
import { isLoggedIn, isPermit } from "../../../../helpers/general";

const PageLayout = dynamic(() => import('../../../../admin-components/pages/company/depo/depo-detail-page'), {
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