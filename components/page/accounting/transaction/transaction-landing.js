import {
  Butt,
  Grid,
  Icon,
  Link,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import AccountingBaseLayout from "../../../base_layout/base-layout-trx-accounting";
import { getMonth } from "../helper/acc-helper";
// import Autocomplete from "@material-ui/lab/Autocomplete";

export default function Page(props) {
  const [optionPeriod, setOptionPeriod] = useState([]);
  // const [perMonth, setPerMonth] = useState([]);
  // const [perYear, setPerYear] = useState([]);
  var perMonth = localStorage.getItem("lsMonth");
  var perYear = localStorage.getItem("lsYear");
  return (
    <AccountingBaseLayout title="Accounting">
      <div className="p-5 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item lg={3}>
            <Link>
              <div className="card card-hover mb-12">
                <h4 className="mb-3" alignItems="center" justify="center">
                  Accounting
                </h4>
                <div className="flex-center">
                  {/* <Icon className="me-2" style={{ color: "#666" }}>
                      articlerounded
                    </Icon> */}
                  <small className="text-muted">
                    Accounting Period {getMonth(perMonth)} - {perYear}
                  </small>
                </div>
                <CardContent>
                  <Typography
                    className="mb-12"
                    color="textSecondary"
                    gutterBottom
                  >
                    <Box className="mb-3">
                      this is the page of accounting transactions in the period
                    </Box>

                    {/* <Box className="modal-footer">
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        // onClick={sendData}
                        disableElevation
                      ></Button>
                    </Box> */}
                  </Typography>
                </CardContent>
              </div>
            </Link>
          </Grid>
        </Grid>
      </div>
    </AccountingBaseLayout>
  );
}
