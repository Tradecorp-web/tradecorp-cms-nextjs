import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import Loading from "../../../components/helper/loading";
import { LOCAL_STORAGE_MESSAGE_TYPE, LOCAL_STORAGE_MESSAGE } from "../../../helpers/consts";
import { isLoggedIn, isPermit } from "../../../helpers/general";
import getRoute from "../../../helpers/router";

const PageLayout = dynamic(() => import('../../../components/page/company-directory/users-page'), {
    loading: () => (
      <Loading />
    ),
    ssr: false,
});

export default function Index() {

    const router = useRouter()

    useEffect(async () => {
        var res = await isLoggedIn()
        if(!res) {
            router.push(getRoute("auth.login"))
        }
    }, []);

    return (
        <PageLayout />
    )
}