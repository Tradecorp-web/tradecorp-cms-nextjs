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
import AccountingBaseLayout from "../../../base_layout/base-layout-accounting";
import { showYear, showMonth } from "../helper/acc-helper";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useRouter } from "next/router";
import getRoute from "../../../../helpers/router";

export default function Page(props) {
  const [optionPeriod, setOptionPeriod] = useState([]);
  const router = useRouter();
  const [optionPeriodMonth, setOptionPeriodMonth] = useState([]);
  const [optionPeriodYear, setOptionPeriodYear] = useState([]);
  const [errorText, setErrorText] = useState({
    acc_period_month: null,
    acc_period_year: null,
  });

  const [data, setData] = useState({
    acc_period_month: null,
    acc_period_year: null,
  });

  const onMonthChange = (event, value, extra) => {
    if (value != null) {
      var objekval = Object.values(value);
      data.acc_period_month = objekval[0];
    } else {
      data.acc_period_month = "";
    }
  };
  const onYearChange = (event, value, extra) => {
    if (value != null) {
      var objekval = Object.values(value);
      data.acc_period_year = objekval[0];
    } else {
      data.acc_period_year = "";
    }
  };

  function openPage(e, route) {
    if (checkValidation()) {
      localStorage.setItem("lsMonth", data.acc_period_month);
      localStorage.setItem("lsYear", data.acc_period_year);

      e.preventDefault();
      if (
        localStorage.getItem("lsMonth") != "" &&
        localStorage.getItem("lsYear") != ""
      ) {
        router.push(route);
      }
    }
  }

  function checkValidation() {
    var isValid = true;
    var ePeriodMonth = "",
      ePeriodYear = "";
    if (data.acc_period_month == "" || data.acc_period_month == null) {
      isValid = false;
      ePeriodMonth = "Month can not be empty";
    }
    if (data.acc_period_year == "" || data.acc_period_year == null) {
      isValid = false;
      ePeriodYear = "Year can not be empty";
    }

    setErrorText({
      ...errorText,
      acc_period_month: ePeriodMonth,
      acc_period_year: ePeriodYear,
    });
    return isValid;
  }
  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    var data = showMonth();
    data.map((item, i) => {
      list.push({ id: i + 1, label: item });
    });
    setOptionPeriodMonth(list);
  }, [data]);

  useEffect(() => {
    var list = [];
    list.push({ id: "", label: "" });
    var data = showYear();
    data.map((item, i) => {
      list.push({ id: item, label: item });
    });
    setOptionPeriodYear(list);
  }, [data]);
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
                  <small className="text-muted">Accounting Period</small>
                </div>
                <CardContent>
                  <Typography
                    className="mb-12"
                    color="textSecondary"
                    gutterBottom
                  >
                    <Box className="mb-3">
                      <Autocomplete
                        options={optionPeriodMonth}
                        autoHighlight
                        // value={selectedCoaType}
                        onChange={(e, v) => onMonthChange(e, v, true)}
                        getOptionLabel={(option) => option?.label}
                        // renderOption={(option) => (
                        //   <React.Fragment>{option?.label}</React.Fragment>
                        // )}

                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="acc_period_month"
                            label="Month"
                            variant="outlined"
                            error={errorText.acc_period_month}
                            helperText={errorText.acc_period_month}
                            fullWidth
                          />
                        )}
                      />
                    </Box>
                    <Box className="mb-3">
                      <Autocomplete
                        options={optionPeriodYear}
                        autoHighlight
                        // value={selectedCoaType}
                        onChange={(e, v) => onYearChange(e, v, true)}
                        getOptionLabel={(option) => option?.label}
                        // renderOption={(option) => (
                        //   <React.Fragment>{option?.label}</React.Fragment>
                        // )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="acc_period_year"
                            label="Year"
                            variant="outlined"
                            error={errorText.acc_period_year}
                            helperText={errorText.acc_period_year}
                            fullWidth
                          />
                        )}
                      />
                    </Box>
                    <Box className="modal-footer">
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disableElevation
                        onClick={(e) =>
                          openPage(
                            e,
                            getRoute("accounting.transaction-landing")
                          )
                        }
                      >
                        Process
                      </Button>
                    </Box>
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
