import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import Loading from '../../../../components/helper/loading'
import { LOCAL_STORAGE_MESSAGE_TYPE, LOCAL_STORAGE_MESSAGE } from "../../../../helpers/consts";
import { isLoggedIn, isPermit } from "../../../../helpers/general"
import getRoute from "../../../../helpers/router"

const PageLayout = dynamic(() => import('../../../../components/page/depo/do-release/do-release-detail'), {
    loading: () => (
      <Loading />
    ),
    ssr: false,
});

const Index = ({releaseNumber}) => {

    const router = useRouter()

    useEffect(() => {
        const res = isLoggedIn()
        if(res) {
            if (!isPermit("menu","depo")) {
                localStorage.setItem(LOCAL_STORAGE_MESSAGE_TYPE, "error")
                localStorage.setItem(LOCAL_STORAGE_MESSAGE, "You don't have permission on DEPO")
                router.push('/')
            }
        } else {
            router.push(getRoute("auth.login"))
        }
    }, []);

    return (
        <PageLayout releaseNumber={releaseNumber} />
    )
}

Index.getInitialProps = async ({ query }) => {
    const { releaseNumber } = query;
    return { releaseNumber };
};

export default Index