import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "../../components/helper/loading";
import { redirectIfUnAuth } from "../../helpers/general";

const PageLayout = dynamic(() => import('../../components/page/profile/edit-password'), {
    loading: () => (
      <Loading />
    ),
    ssr: false,
});

export default function Index() {

    const router = useRouter()

    useEffect(async () => {
        redirectIfUnAuth(router)
    }, []);
    
    return (
        <PageLayout />
    )
}