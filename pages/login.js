import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import Loading from '../components/helper/loading'
import { isLoggedIn } from "../helpers/general";
import getRoute from "../helpers/router";

const PageLayout = dynamic(() => import('../components/page/auth/login-page'), {
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
            router.push('/')
        } else {
            router.push(getRoute("auth.login"))
        }
    }, []);

    return (
        <PageLayout />
    )
}