import {
  Card,
  Grid,
  Icon,
  IconButton,
  Link,
  CardContent,
  Typography,
  Paper,
} from "@material-ui/core";
import AccountingBaseLayout from "../../../../base_layout/base-layout-sidemenu-accounting";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { getMonth } from "../../helper/acc-helper";
import getRoute from "../../../../../helpers/router";
// import { useRouter } from "next/router";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "left",
      color: theme.palette.text.secondary,
      alignItems: "left",
    },
  })
);

export default function Page(props) {
  const poPage = getRoute("accounting.transaction.import.ref-data", {
    srcId: "po",
  });
  const woPage = getRoute("accounting.transaction.import.ref-data", {
    srcId: "wo",
  });

  var period =
    getMonth(localStorage.getItem("lsMonth")) +
    "  " +
    localStorage.getItem("lsYear");

  const classes = useStyles();
  return (
    <AccountingBaseLayout title="Accounting">
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <h1 class="mb-3">Import Data Transaction</h1>
            <h3 class="mb-3">Accounting Period : {period}</h3>
          </Grid>
          <Grid item xs={3}>
            <Link href={poPage}>
              <div className="card card-hover mb-12">
                <h4 className="mb-3">Purchase Order</h4>
                <div className="flex-center">
                  <Icon className="me-2" style={{ color: "#666" }}>
                    articlerounded
                  </Icon>
                  <small className="text-muted">PO</small>
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
          <Grid item xs={3}>
            <Link href={woPage}>
              <div className="card card-hover mb-12">
                <h4 className="mb-3">Work Order</h4>
                <div className="flex-center">
                  <Icon className="me-2" style={{ color: "#666" }}>
                    articlerounded
                  </Icon>
                  <small className="text-muted">WO</small>
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
    </AccountingBaseLayout>
  );
}
