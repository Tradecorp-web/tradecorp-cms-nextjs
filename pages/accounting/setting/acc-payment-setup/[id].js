import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "../../../../components/helper/loading";
import {
  LOCAL_STORAGE_MESSAGE,
  LOCAL_STORAGE_MESSAGE_TYPE,
} from "../../../../helpers/consts";
import { isLoggedIn, isPermit } from "../../../../helpers/general";
import getRoute from "../../../../helpers/router";

const PageLayout = dynamic(
  () =>
    import(
      "../../../../components/page/accounting/setting/acc-payment-setup/edit"
    ),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

export default function Index() {
  const router = useRouter();

  useEffect(async () => {
    var res = await isLoggedIn();
    if (res) {
      if (!isPermit("menu", "accounting")) {
        localStorage.setItem(LOCAL_STORAGE_MESSAGE_TYPE, "error");
        localStorage.setItem(
          LOCAL_STORAGE_MESSAGE,
          "You don't have permission on Product & Material"
        );
        router.push("/");
      }
    } else {
      router.push(getRoute("auth.login"));
    }
  }, []);

  // useEffect(() => {
  //   const res = isLoggedIn();
  //   if (res) {
  //     if (isPermit("menu", "accounting")) {
  //       router.push(getRoute("accounting.transaction.import.ref-data"));
  //     } else {
  //       localStorage.setItem(LOCAL_STORAGE_MESSAGE_TYPE, "error");
  //       localStorage.setItem(
  //         LOCAL_STORAGE_MESSAGE,
  //         "You don't have permission on Import  Menu"
  //       );
  //       router.push("/");
  //     }
  //   } else {
  //     router.push(getRoute("auth.login"));
  //   }
  // }, []);

  return <PageLayout />;
}
