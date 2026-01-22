import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDetailPurchaseOrderSwr } from "../../../../../services/swr/po.swr";
// import BaseLayoutPo from "../../../../base_layout/base-layout-po";
import AccountingBaseLayout from "../../../../base_layout/base-layout-sidemenu-accounting";

import PODetailComponent from "./po-detail-component";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";

import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import GrainIcon from "@material-ui/icons/Grain";

import { Link, Typography, makeStyles } from "@material-ui/core";
import getRoute from "../../../../../helpers/router";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  backdrop: { zIndex: theme.zIndex.drawer + 1, color: "#fff" },
  link: { display: "flex" },
  icon: { marginRight: theme.spacing(0.5), width: 20, height: 20 },
}));

export default function PODetail() {
  const classes = useStyles();
  const router = useRouter();
  const poId = router.query.id;

  const [po, setPo] = useState(null);
  const poSwr = getDetailPurchaseOrderSwr(poId);
  useEffect(() => {
    setPo(poSwr.data);
    console.log(poSwr.data);
  }, [poSwr]);

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  return (
    <AccountingBaseLayout title={po?.po_number}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          button
          onClick={(e) => openPage(e, getRoute("accounting"))}
          className={classes.menuItem}
        >
          <HomeIcon className={classes.icon} />
          Dashboard
        </Link>
        <Link
          color="inherit"
          button
          onClick={(e) =>
            openPage(e, getRoute("accounting.transaction.purchase.po"))
          }
          className={classes.menuItem}
        >
          <GrainIcon className={classes.icon} />
          Purchase List
        </Link>
        <Typography color="textPrimary" className={classes.link}>
          <WhatshotIcon className={classes.icon} />
          PO Detail
        </Typography>
      </Breadcrumbs>

      <PODetailComponent role="accounting" />
    </AccountingBaseLayout>
  );
}
