import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Grid,
  Icon,
  Box,
  Button,
  ButtonGroup,
  Link,
  Paper,
  Typography,
  makeStyles,
  InputBase,
  TextField,
} from "@material-ui/core";

import AccountingBaseLayout from "../../../../base_layout/base-layout-trx-accounting";
import { getMonth } from "../../helper/acc-helper";
const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    width: 250,
    height: 300,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
export default function Page(props) {
  const classes = useStyles();
  var period =
    getMonth(localStorage.getItem("lsMonth")) +
    "  " +
    localStorage.getItem("lsYear");
  let period_acc = "List Assets  : " + period;
  return (
    <AccountingBaseLayout title="Accounting">
      <div className="p-5 content-wrapper">
        <Grid
          container
          className="page-container"
          alignItems="center"
          justify="center"
        >
          <Grid item lg={12}>
            <Card className="{classes.root}">
              <CardHeader
                title="Depreciation Account"
                subheader={period_acc}
              ></CardHeader>
              <CardContent>
                <TableContainer component={Card}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>No</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>Assets</div>
                        </TableCell>

                        <TableCell>
                          <div style={{ textAlign: "center" }}>Description</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>
                            Date of Acquisition
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>Useful Life</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>Rate (%)</div>
                        </TableCell>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>
                            Beginning book value
                          </div>
                        </TableCell>

                        <TableCell>
                          <div style={{ textAlign: "center" }}>
                            Periodic Depreciation Expense
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ textAlign: "center" }}>
                            {" "}
                            Total Depreciation Expense
                          </div>
                        </TableCell>

                        <TableCell>
                          <ButtonGroup variant="outlined" color="default">
                            <Button onClick={() => setOpenForm(true)}>
                              <Icon>add</Icon> Add
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableCell>
                        <div style={{ textAlign: "center" }}>1</div>
                      </TableCell>

                      <TableCell>
                        <div style={{ textAlign: "left" }}>Land</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "left" }}>Land Cakung</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "center" }}>2015-01-01</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "center" }}>0</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "center" }}>0</div>
                      </TableCell>

                      <TableCell>
                        <div style={{ textAlign: "right" }}>20.000.000.000</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "right" }}>0</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "right" }}>0</div>
                      </TableCell>
                      <TableCell>
                        <ButtonGroup variant="outlined" color="default">
                          <Button onClick={() => addJournal()}>
                            <Icon>edit</Icon>
                          </Button>{" "}
                          <Button onClick={() => addJournal()}>
                            <Icon>delete</Icon>
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableBody>
                    <TableBody>
                      <TableCell>
                        <div style={{ textAlign: "center" }}>2</div>
                      </TableCell>

                      <TableCell>
                        <div style={{ textAlign: "left" }}>Building</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "left" }}>Building Cakung</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "center" }}>2015-01-01</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "center" }}>20</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "center" }}>5</div>
                      </TableCell>

                      <TableCell>
                        <div style={{ textAlign: "right" }}>9.000.000.000</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "right" }}>37.500.000</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ textAlign: "right" }}>450.000.000</div>
                      </TableCell>
                      <TableCell>
                        <ButtonGroup variant="outlined" color="default">
                          <Button onClick={() => addJournal()}>
                            <Icon>edit</Icon>
                          </Button>{" "}
                          <Button onClick={() => addJournal()}>
                            <Icon>delete</Icon>
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* <AccJournalForm open={openForm} closeModal={refreshListCoa} /> */}
      </div>
    </AccountingBaseLayout>
  );
}
