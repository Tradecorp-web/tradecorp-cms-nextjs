import BaseLayout from "../../base_layout/base-layout";

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
    maxWidth: "60%",

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
            <Typography variant="subtitle1">Sales Order</Typography>
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
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item>
                    <ButtonBase
                      onClick={(e) =>
                        openPage(e, getRoute("sales.sales-order-input"))
                      }
                      className={classes.image}
                    >
                      <Icon style={{ fontSize: 50, color: "#666" }}>
                        <span class="material-symbols-rounded">
                          open_in_new
                        </span>
                      </Icon>
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          New Sales Order
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Create new sales order transaction
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

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item>
                    <ButtonBase
                      onClick={(e) =>
                        openPage(e, getRoute("sales.sales-order-ongoing"))
                      }
                      className={classes.image}
                    >
                      <Icon
                        className="me-2"
                        style={{ fontSize: 50, color: "#666" }}
                      >
                        <span class="material-symbols-rounded">
                          pending_actions
                        </span>
                      </Icon>
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          Sales Order List
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          List on going sales order transaction
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Transaction: {countSo} Sales Order on Project Status
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* <Grid item xs={4}>
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item>
                    <ButtonBase
                      onClick={(e) =>
                        openPage(e, getRoute("sales.sales-order-history"))
                      }
                      className={classes.image}
                    >
                      <Icon
                        style={{ fontSize: 50, color: "#666" }}
                        className="me-2"
                      >
                        <span class="material-symbols-rounded">
                          work_history
                        </span>
                      </Icon>
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          Sales Order History
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          List off all sales order transaction
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Transaction: 108 Sales Order Ended
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid> */}
          </Grid>
        </Paper>
      </div>
    </BaseLayout>
  );
}
