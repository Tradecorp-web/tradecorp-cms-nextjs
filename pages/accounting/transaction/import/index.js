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
  () => import("../../../../components/page/accounting/transaction/import"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const res = isLoggedIn();
    if (res) {
      if (isPermit("menu", "accounting")) {
        router.push(getRoute("accounting.transaction.import"));
      } else {
        localStorage.setItem(LOCAL_STORAGE_MESSAGE_TYPE, "error");
        localStorage.setItem(
          LOCAL_STORAGE_MESSAGE,
          "You don't have permission on Import  Menu"
        );
        router.push("/");
      }
    } else {
      router.push(getRoute("auth.login"));
    }
  }, []);

  return <PageLayout />;
}
