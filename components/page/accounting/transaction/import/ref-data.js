import {
  Card,
  CardHeader,
  Grid,
  Icon,
  Button,
  ButtonGroup,
  IconButton,
  Link,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import AccountingBaseLayout from "../../../../base_layout/base-layout-trx-accounting";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { getMonth, modulDesc } from "../../helper/acc-helper";
// import { doImport } from "../../helper/acc-trx-helper";
import getRoute from "../../../../../helpers/router";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { red, green } from "@material-ui/core/colors";

import Avatar from "@material-ui/core/Avatar";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { accPoDataSwr } from "../../../../../services/swr/acc-po-data.swr";
import AccMapForm from "./form";
import { ShadowMapType } from "three";

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

    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    avatar: {
      backgroundColor: green[500],
    },
  })
);

export default function Page(props) {
  const [openForm, setOpenForm] = useState(false);
  const [open, setOpen] = useState(false);
  // useEffect(() => {}, []);
  //useEffect(()=>{},[])
  const router = useRouter();
  const routeId = router.query.srcId;

  // const dataPo = doImport();
  // alert(JSON.stringify(data));
  const modulName = modulDesc(routeId);

  function openPage(e, route) {
    e.preventDefault();
    router.push(route);
  }

  const onProcess = () => {
    alert("process");
  };
  var period =
    "Accounting Period : " +
    getMonth(localStorage.getItem("lsMonth")) +
    "  " +
    localStorage.getItem("lsYear");

  const classes = useStyles();

  const NamesList = () => (
    <div>
      {AccPoData.map((id) => (
        <TableCell> {id} </TableCell>
      ))}
    </div>
  );
  const [AccPoData, setAccPoData] = useState([]);
  var accPoSwr = accPoDataSwr("", "");
  //   var accPoSwr = accPoDaataSwr("01-09-2021", "25-09-2021");
  useEffect(() => {
    if (accPoSwr?.data) {
      setAccPoData(accPoSwr?.data.result ?? []);
    }
  }, []);
  // alert(JSON.stringify(AccPoData));
  const showAccMapForm = async (id) => {
    setOpen(false);
    setOpenForm(true);
  };
  const refreshListAccMap = async () => {
    setOpenForm(false);
    try {
      setOpen(true);
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };
  var acc = [];
  var accName = [];
  var accDesc = [];
  var accValue = [];
  if (routeId == "po") {
    acc = ["169", "201"];
    accName = ["Machinery", "Account Payable"];
    accDesc = ["Pembelian Part PO nomor 123", "Pembelian Part PO nomor 123"];
    accValue = ["120000", "120000"];
  } else {
    acc = ["", "106"];
    accName = ["", "Account Receivable"];
    accDesc = ["Pendapatan Lain", "Pendapatan Lain"];
    accValue = ["20000", "20000"];
  }
  return (
    <AccountingBaseLayout title="Accounting">
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Link
              onClick={(e) =>
                openPage(e, getRoute("accounting.transaction.import"))
              }
            >
              Back
            </Link>
          </Grid>
          <Grid item xs={6}>
            <h1 class="mb-3">Import Data Transaction</h1>
          </Grid>
          <Grid
            item
            xs={6}
            container
            direction="row"
            alignItems="flex-end"
            justify="flex-end"
          >
            <ButtonGroup variant="outlined" color="default">
              <Button onClick={() => showAccMapForm()}>
                <Icon>account_tree</Icon> COA Map
              </Button>
              <Button onClick={() => onProcess()}>
                <Icon>add</Icon> Import Proccess
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <Card className="{classes.root}">
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe" className={classes.avatar}>
                    {routeId}
                  </Avatar>
                }
                title={modulName}
                subheader={period}
              ></CardHeader>
              <CardContent>
                <Typography paragraph>detail:</Typography>
                <TableContainer component={Card}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Acc Code</TableCell>
                        <TableCell>Acc Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Debet</TableCell>
                        <TableCell>Credit</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableCell>1</TableCell>
                      <TableCell>{acc[0]}</TableCell>
                      <TableCell>{accName[0]}</TableCell>
                      <TableCell>{accDesc[0]} </TableCell>
                      <TableCell>{accValue[0]}</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableBody>
                    <TableBody>
                      <TableCell>2</TableCell>
                      <TableCell>{acc[1]}</TableCell>
                      <TableCell>{accName[1]}</TableCell>
                      <TableCell>{accDesc[1]} </TableCell>
                      <TableCell></TableCell>
                      <TableCell>{accValue[1]}</TableCell>
                      <TableCell></TableCell>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <AccMapForm open={openForm} closeModal={refreshListAccMap} />
        </Grid>
      </div>
    </AccountingBaseLayout>
  );
}
