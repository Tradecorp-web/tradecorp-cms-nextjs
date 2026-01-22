import {
  Card,
  Grid,
  Icon,
  Link,
  CardContent,
  Typography,
  Box,
  Paper,
  makeStyles,
} from "@material-ui/core";
import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";

import HomeIcon from "@material-ui/icons/Home";
import WhatshotIcon from "@material-ui/icons/Whatshot";
import AdminBaseLayout from "../../base_layout/admin_base_layout";

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

export default function Page(props) {
  const classes = useStyles();
  const router = useRouter();

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
  return (
    <AdminBaseLayout title="Flow Master">
      {/* <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          button
          onClick={(e) => openPage(e, getRoute("accounting"))}
          className={classes.menuItem}
        >
          <HomeIcon className={classes.icon} />
          Dashboard
        </Link>
        <Typography color="textPrimary" className={classes.link}>
          <WhatshotIcon className={classes.icon} />
          Report
        </Typography>
      </Breadcrumbs> */}

      <div className="p-6 content-wrapper">
        <Grid container spacing={6}>
          <Grid item lg={3}>
            <Link
              color="inherit"
              button
              onClick={(e) => openPage(e, getRoute("admin.fmpo"))}
              className={classes.menuItem}
            >
              <div className="card card-hover mb-12">
                <h4 className="mb-3">Purchase Order </h4>
                <div className="flex-center">
                  <Icon className="me-2" style={{ color: "#666" }}>
                    articlerounded
                  </Icon>
                  <small className="text-muted"> Master Flow</small>
                </div>
                <CardContent>
                  <Typography
                    className="mb-12"
                    color="textSecondary"
                    gutterBottom
                  ></Typography>
                </CardContent>
              </div>
            </Link>
          </Grid>
          <Grid item lg={3}>
            <Link
              color="inherit"
              button
              onClick={(e) => openPage(e, getRoute("admin.fmwo"))}
              className={classes.menuItem}
            >
              <div className="card card-hover mb-12">
                <h4 className="mb-3">Work Order</h4>
                <div className="flex-center">
                  <Icon className="me-2" style={{ color: "#666" }}>
                    articlerounded
                  </Icon>
                  <small className="text-muted">Master Flow </small>
                </div>
                <CardContent>
                  <Typography
                    className="mb-12"
                    color="textSecondary"
                    gutterBottom
                  ></Typography>
                </CardContent>
              </div>
            </Link>
          </Grid>
          <Grid item lg={3}>
            <Link
              color="inherit"
              button
              onClick={(e) => openPage(e, getRoute("admin.fminvoice"))}
              className={classes.menuItem}
            >
              <div className="card card-hover mb-12">
                <h4 className="mb-3">Invoice</h4>
                <div className="flex-center">
                  <Icon className="me-2" style={{ color: "#666" }}>
                    articlerounded
                  </Icon>
                  <small className="text-muted">Master Flow </small>
                </div>
                <CardContent>
                  <Typography
                    className="mb-12"
                    color="textSecondary"
                    gutterBottom
                  ></Typography>
                </CardContent>
              </div>
            </Link>
          </Grid>
        </Grid>
      </div>
    </AdminBaseLayout>
  );
}
