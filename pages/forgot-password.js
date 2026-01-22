import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { useEffect } from "react";
import Loading from '../components/helper/loading'

const PageLayout = dynamic(() => import('../components/page/auth/forgot-password-page'), {
    loading: () => (
      <Loading />
    ),
    ssr: false,
});

export default function Page() {

    const router = useRouter()

    useEffect(() => {
        router.push('/forgot-password') 
    }, []);

    return (
        <PageLayout />
    )
}