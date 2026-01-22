import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import Loading from '../components/helper/loading'
import { isLoggedIn } from "../helpers/general";
import getRoute from "../helpers/router";

const PageLayout = dynamic(() => import('../components/page/home/home-page'), {
    loading: () => (
      <Loading />
    ),
    ssr: false,
});

export default function Login() {
    
    const router = useRouter()

    useEffect(() => {
        const res = isLoggedIn()
        console.log("INDEX")
        if(res) {
            console.log("LOGGED IN")
            router.push('/')
        } else {
            console.log("LOGGED OUT")
            router.push(getRoute("auth.login"))
        }
    }, []);

    return (
        <PageLayout />
    )
}