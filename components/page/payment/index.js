// import BaseLayout from "../../base_layout/base-layout";

import BaseLayout from "../../base_layout/base-layout-sidemenu-accounting";
import React from "react";
import {
  Icon,
  Divider,
  makeStyles,
  Grid,
  Paper,
  Typography,
  ButtonBase,
} from "@material-ui/core";

import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import { useEffect, useState } from "react";
import { getListSalesOrderApi } from "../../../services/api/sales-order.api";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import Compare from "@material-ui/icons/Compare";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 10,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    marginTop: 20,
    maxWidth: 500,
  },

  paper2: {
    padding: theme.spacing(2),
    margin: "auto",
    marginTop: 20,
    maxWidth: "95%",

    border: 0,
    borderTop: 0,
    borderRadius: 0,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

export default function Page() {
  const classes = useStyles();

  const router = useRouter();

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }
  const [countSo, setCountSo] = useState(0);
  const [countTime, setCountTime] = useState(0);

  useEffect(async () => {
    try {
      var dataTrx = await getListSalesOrderApi();
      setCountSo(dataTrx.count);
    } catch (err) {
      console.log(err);
    }
  }, []);

  // useEffect(() => {
  //   var count = 0;
  //   const interval = setInterval(() => {
  //     count++;
  //     setCountTime(count);
  //     console.log(countTime);
  //   }, 100);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <BaseLayout title="Sales Order">
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Payment</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
        <Paper
          sx={{
            border: 0,
            borderTop: 0,
            borderRadius: 0,
          }}
          className={classes.paper2}
        >
          <Grid container spacing={2} style={{ align: "center" }}>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item>
                    <ButtonBase
                      onClick={(e) => openPage(e, getRoute("payment-input"))}
                      className={classes.image}
                    >
                      <Icon style={{ fontSize: 50, color: "#666" }}>
                        <span class="material-symbols-rounded">peoplealt</span>
                      </Icon>
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          Manual Input Payment
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Payment transaction Input
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        ></Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item>
                    <ButtonBase
                      onClick={(e) => openPage(e, getRoute("payment-control"))}
                      className={classes.image}
                    >
                      <Icon style={{ fontSize: 50, color: "#666" }}>
                        <span class="material-symbols-rounded">build</span>
                      </Icon>
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          Payment Control
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Payment control
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        ></Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item>
                    <ButtonBase
                      onClick={(e) =>
                        openPage(e, getRoute("payment-transaction"))
                      }
                      className={classes.image}
                    >
                      {/* <Icon
                        className="me-2"
                        style={{ fontSize: 250, color: "#666" }}
                      > */}
                      {/* <span class="material-symbols-rounded">
                          
                        </span> */}
                      <CompareArrowsIcon style={{ fontSize: 40 }} />
                      {/* </Icon> */}
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          Payment List
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          List payment
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        ></Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item>
                    <ButtonBase
                      onClick={(e) => openPage(e, getRoute("payment-compare"))}
                      className={classes.image}
                    >
                      {/* <Icon
                        className="me-2"
                        style={{ fontSize: 250, color: "#666" }}
                      > */}
                      {/* <span class="material-symbols-rounded">
                          
                        </span> */}
                      <Compare style={{ fontSize: 40 }} />
                      {/* </Icon> */}
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          Payment Compare
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Compare Payment with Invoice
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        ></Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </BaseLayout>
  );
}
