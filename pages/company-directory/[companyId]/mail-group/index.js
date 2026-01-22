import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import Loading from "../../../../components/helper/loading";

const PageLayout = dynamic(() => import('../../../../components/page/company-directory/mail-group/mail-group-page'), {
    loading: () => (
      <Loading />
    ),
    ssr: false,
});

export default function Index() {

    const router = useRouter()

    useEffect(async () => {
    }, []);

    return (
        <PageLayout />
    )
}