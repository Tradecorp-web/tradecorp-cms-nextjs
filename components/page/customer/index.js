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
import { getListCustomerApi } from "../../../services/api/customer.api";

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
    router.push(route).then(r => {return r});
  }
  const [countTime, setCountTime] = useState(0);

  // useEffect(async () => {
  //   try {
  //     const dataTrx = await getListCustomerApi();
  //     setCountSo(dataTrx.count);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  return (
    <BaseLayout title="Customer">
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Customer</Typography>
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
                        openPage(e, getRoute("customer.customer-company-search-form"))
                      }
                      className={classes.image}
                    >
                      <Icon style={{ fontSize: 50, color: "#666" }}>
                        <span className="material-symbols-rounded">
                          open_in_new
                        </span>
                      </Icon>
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          New Customer
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Create new customer data
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
                            openPage(e, getRoute("customer.customer-page"))
                        }
                      className={classes.image}
                    >
                      <Icon
                        className="me-2"
                        style={{ fontSize: 50, color: "#666" }}
                      >
                        <span className="material-symbols-rounded">
                          pending_actions
                        </span>
                      </Icon>
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          Customer List
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          List of customer data
                        </Typography>
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
