import {
  Box,
  Modal,
  Card,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TextField,
  Button,
  Tooltip,
  Typography,
  Chip,
  AppBar,
  Tabs,
  Tab,
  Checkbox,
  Grid,
  Divider,
} from "@material-ui/core";
// import Autocomplete from "@material-ui/lab/Autocomplete";
import ViewQuiltIcon from "@material-ui/icons/ViewQuilt";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import { useEffect, useState, Fragment } from "react";

import { getListOrderIdQuoteSwr } from "../../../services/swr/order-quote.swr";
import { getDetailQuoteInSwr } from "../../../services/swr/quote-in.swr";

import {
  getListContainerNumberApi,
  getDetailContainerNumberApi,
  getDetailContainerSerialUnitcodeApi,
  updateNewContainerNumberApi,
} from "../../../services/api/container-number.api";

import {
  updateOrderQuoteRalCodeApi,
  updateStatusOrderQuoteApi,
} from "../../../services/api/order-quote.api";
import {
  getRefCsnApi,
  updateLastNumberApi,
  insertRefNumberApi,
} from "../../../services/api/ref-number.api";
import { getColorListApi } from "../../../services/api/color-codes.api";

import AlertDialog from "../../base_component/dialog";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import {
  insertOrderQuoteApi,
  deleteManyOrderQuoteApi,
} from "../../../services/api/order-quote.api";
import { checkDigitGenerator } from "../../../helpers/general";
import { Alert } from "@material-ui/lab";
import {
  GridDataContainer,
  GRID_COLUMN_HEADER_DRAG_OVER,
} from "@material-ui/data-grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ContainerOrdersForm(props) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const [disableGenerate, setDisableGenerate] = useState(true);
  const [orderFinal, setOrderFinal] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [confCountData, setConfCountData] = useState("");
  const [confGenerateData, setConfGenerateData] = useState("");
  const [prefix, setPrefix] = useState("");
  const [prefixId, setPrefixId] = useState("");
  const [prefixSn, setPrefixSn] = useState("");
  const [containerSize, setContainerSize] = useState(0);
  const [containerSizeOrder, setContainerSizeOrder] = useState("*");
  const [unitCode, setUnitCode] = useState("-");
  const [quantity, setQuantity] = useState(0);
  const [dataUnitCode, setDataUnitCode] = useState([
    {
      id: null,
      unit_code: null,
      quantity: null,
      last_number: null,
      serial_number: null,
      series: null,
      prefix: null,
      series: null,
    },
  ]);

  const [checkStatus, setCheckStatus] = useState([
    {
      id: null,
      status: null,
    },
  ]);

  const [colorList, setColorList] = useState(null);

  const [cDataUpdate, setCDataUpdate] = useState(null);
  const [containerNumberSerial, setContainerNumberSerial] = useState(null);

  const [orderData, setOrderData] = useState([
    {
      quote_in_id: null,
      container_id: null,
      container_factory: null,
      container_factory_country_id: null,
      container_factory_city_id: null,
      container_size: null,
      container_size_data: null,
      container_type: null,
      container_type_data: null,
      container_number: null,
      unit_code_data: null,
    },
  ]);

  var containerList = [];
  var countAll = 0;
  var orderIdTmp = "0";
  var sizeType = "-";
  if (typeof props?.id != "undefined") {
    orderIdTmp = props?.id;
  }

  var dataOrderQuote = getListOrderIdQuoteSwr(orderIdTmp, props?.containerSize);
  var dataOrderQuote2 = getListOrderIdQuoteSwr(orderIdTmp, "*");

  if (props) {
    countAll = 0;
    if (typeof props?.orderData?.id != "undefined") {
      props?.orderData?.container_details?.map((res) => {
        for (let i = 0; i < res?.quantity; i++) {
          containerList.push({
            quote_in_id: props?.orderData?.id,
            container_id: res.container_id,
            container_factory: props?.orderData?.factory,
            container_factory_country_id: props?.orderData?.country_id,
            container_factory_city_id: props?.orderData?.city_id,
            container_type: res.container_type,
            container_type_data: res.container_type_data.name,
            container_size: res.container_size,
            container_size_data: res.container_size_data.name,
          });
          countAll++;
        }
      });
    }
  }

  useEffect(() => {
    dataOrderQuote.mutate();
  }, [props?.containerSize]);
  useEffect(async () => {
    try {
      var res = await getColorListApi();
      setColorList(res);
    } catch (err) {
      console.log(err);
    }
  }, []);
  //20HCRF
  //   useEffect(() => {
  //     var res = getDetailContainerSerialUnitcodeApi(
  //       props?.orderData?.container_size_data?.name +
  //         props?.orderData?.container_type_data?.alias
  //     );
  //     setContainerNumberSerial(res.result);
  //   }, []);
  //   useEffect(async () => {
  //     try {
  //       var res = await getDetailContainerSerialUnitcodeApi(unitCode);
  //       setContainerNumberSerial(res.result);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }, []);

  var dataQI = getDetailQuoteInSwr(props?.id);

  const closeForm = () => {
    props?.closeModal();
  };
  const confirmGenerate = () => {
    setConfGenerateData(
      `You will automatically generate ` +
        countAll +
        ` container number, Continue generate ?`
    );
    setOpenGenerateDialog(true);
  };
  const generateNumber = () => {
    storeToOrder();

    setOpenGenerateDialog(false);
  };
  const cancel = () => {
    setConfCountData(
      `You will cancel ` +
        countAll +
        ` container numbering. Will you continue to cancel?`
    );
    setOpenCancelDialog(true);
  };
  const deleteMany = () => {
    var delMany = deleteManyOrderQuoteApi(props?.orderData?.id).then((res) => {
      dataOrderQuote.mutate();
    });
    setOpenCancelDialog(false);
  };
  const onChangeInput = (e) => {
    setDataUnitCode({ ...dataUnitCode, [e.target.name]: e.target.value });
  };
  const exportX = async () => {
    var today = new Date(),
      dateNow =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate() +
        " " +
        today.getHours() +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds();
    //https://dev.to/ridhopamungkas/export-data-ke-excel-menggunakan-exceljs-dari-sisi-front-end-reactjs-5743

    // Create WorkBook
    const wb = new ExcelJS.Workbook();

    var column = 5;

    //properties excel
    wb.creator = "Tradecorp";
    wb.lastModifiedBy = "Tradecorp";
    wb.created = new Date(2022, 1, 5);
    wb.modified = new Date();
    wb.lastPrinted = new Date(2022, 1, 5);

    // Create Sheet
    //summary sheet
    const ws = wb.addWorksheet("Summary");

    ws.columns = [
      { key: "A", width: 10 },
      { key: "B", width: 40 },
      { key: "C", width: 40 },
      { key: "D", width: 20 },
      { key: "E", width: 20 },
    ];
    // Set value cell untuk title
    var factory = dataOrderQuote2?.data?.result[0]?.container_factory;
    ws.getRow(1).getCell("A").value =
      "A List of Container Number (" +
      dataOrderQuote2?.data?.result[0]?.container_factory +
      ")";
    ws.getRow(2).getCell("A").value = "Print date :" + dateNow;

    // Set font Style
    ws.getRow(1).getCell("A").font = {
      bold: true,
      size: 16,
    };

    // merge cell dari A1 sampai C1
    ws.mergeCells("A1", "D1");
    ws.mergeCells("A2", "D2");

    // inisiasi pada baris ke 3 jadi Header table
    const rowHeader = ws.getRow(3);

    // Buat styling cell header menggunakan perulangan agar tidak per cell kita bikinnya

    for (let i = 1; i <= column; i++) {
      // Untuk border table
      rowHeader.getCell(i).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      // Untuk fill color cell
      rowHeader.getCell(i).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "191970" },
      };
      // Untuk alignment text dalam cell
      rowHeader.getCell(i).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // Untuk set font
      rowHeader.getCell(i).font = {
        bold: true,
        size: 11,
        color: { argb: "FFFFFF" },
      };
    }

    // Isi data Header
    rowHeader.getCell(1).value = "No";
    rowHeader.getCell(2).value = "Container Type";
    rowHeader.getCell(3).value = "Container Size";
    rowHeader.getCell(4).value = "Container Number";
    rowHeader.getCell(5).value = "Container Color";

    // Buat datanya menggunakan perulangan
    var start = 4;
    var containerNumber = "";
    dataOrderQuote2?.data?.result?.map((res, keys) => {
      if (keys === 0) {
        containerNumber = res?.container_number;
      }
      const row = ws.getRow(start + keys);
      for (let index = 1; index <= column; index++) {
        row.getCell(index).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
      row.getCell(1).value = keys + 1;
      row.getCell(2).value = res?.container_type_data;
      row.getCell(3).value = res?.container_size_data;
      row.getCell(4).value = res?.container_number;
      row.getCell(5).value =
        res?.container_color.ral_code +
        " - " +
        res?.container_color.name_english;
    });

    //==summary sheet
    //create header for detail

    var size = "";

    dataOrderQuote2?.data?.result?.map((res, keys) => {
      if (size != res?.container_size_data + "' " + res?.container_type_data) {
        const ws = wb.addWorksheet(
          res?.container_size_data + "' " + res?.container_type_data
        );
        ws.columns = [
          { key: "A", width: 10 },
          { key: "B", width: 40 },
          { key: "C", width: 40 },
          { key: "D", width: 20 },
          { key: "E", width: 20 },
        ];
        // Set value cell untuk title

        ws.getRow(1).getCell("A").value =
          "A List of Container Number (" +
          dataOrderQuote2?.data?.result[0]?.container_factory +
          ")";
        ws.getRow(2).getCell("A").value =
          "Container size :" +
          res?.container_size_data +
          "' " +
          res?.container_type_data +
          " , Print date :" +
          dateNow;

        // Set font Style
        ws.getRow(1).getCell("A").font = {
          bold: true,
          size: 16,
        };

        // merge cell dari A1 sampai C1
        ws.mergeCells("A1", "D1");
        ws.mergeCells("A2", "D2");

        // inisiasi pada baris ke 3 jadi Header table
        const rowHeader = ws.getRow(3);

        // Buat styling cell header menggunakan perulangan agar tidak per cell kita bikinnya

        for (let i = 1; i <= column; i++) {
          // Untuk border table
          rowHeader.getCell(i).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          // Untuk fill color cell
          rowHeader.getCell(i).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "191970" },
          };
          // Untuk alignment text dalam cell
          rowHeader.getCell(i).alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          // Untuk set font
          rowHeader.getCell(i).font = {
            bold: true,
            size: 11,
            color: { argb: "FFFFFF" },
          };
        }

        // Isi data Header
        rowHeader.getCell(1).value = "No";
        rowHeader.getCell(2).value = "Container Type";
        rowHeader.getCell(3).value = "Container Size";
        rowHeader.getCell(4).value = "Container Number";
        rowHeader.getCell(5).value = "Container Color";
        var start = 3;
        var number = 1;
        dataOrderQuote2?.data?.result?.map((resDetail, keysDetail) => {
          if (
            res?.container_size_data + res?.container_type_data ==
            resDetail?.container_size_data + resDetail?.container_type_data
          ) {
            const row = ws.getRow(start + number);
            for (let index = 1; index <= column; index++) {
              row.getCell(index).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            }
            row.getCell(1).value = number;
            row.getCell(2).value = resDetail?.container_type_data;
            row.getCell(3).value = resDetail?.container_size_data;
            row.getCell(4).value = resDetail?.container_number;
            row.getCell(5).value =
              resDetail?.container_color.ral_code +
              " - " +
              resDetail?.container_color.name_english;
            number++;
          }
        });
        size = res?.container_size_data + "' " + res?.container_type_data;
      }
    });

    //membuat buffer file
    const buf = await wb.xlsx.writeBuffer();

    //download file dari browser dan menamai filenya
    saveAs(new Blob([buf]), "container_number_generate-" + factory + ".xlsx");
  };

  const export2Excel = (id) => {
    exportX();
  };

  const onColorChange = (res, value, id) => {
    var data = { ral_code: value };
    updateOrderQuoteRalCodeApi(id, data);
    dataOrderQuote.mutate();
  };
  const onContainerSerialChange = (res, value) => {
    /**{"id":"2aaed258-95b9-143f-faea-d4bf1983afb5","unit_code":"20DC","unit_type":"20' General Purpose","prefix":"TIHU","series":"24","colour_name":"Miscellaneous","ral_colour":"Miscellaneous","comments":"Lease Stock","last_number":189,"serial_number":"TIHU240189","container_color":{"ral_code":"","name_english":"","html_code":"","name_german":"","name_french":"","name_spanish":"","name_italian":"","name_nederlands":""},"company_id":"bbaecc1f-6151-44b8-9be5-debe77d40676","created_at":null,"updated_at":null} */
    setUnitCode(value);
    setDataUnitCode({
      ...dataUnitCode,
      id: value.id,
      unit_code: value.unit_code,
      last_number: value.last_number,
      serial_number: value.serial_number,
      series: value.series,
      prefix: value.prefix,
      series: value.series,
    });
    //prefix - Unit Code - Color - last number
  };
  const onStatusChange = (e) => {
    updateStatusOrderQuoteApi(orderIdTmp, "production");
    dataOrderQuote.mutate();
  };
  function storeToOrder() {
    var dataTmp = props?.orderData?.rowData?.row;
    var qty = parseInt(dataUnitCode.quantity);
    var lastNumber = parseInt(dataUnitCode.last_number);
    var numChar = "";
    var numberChar = "";
    var serialNumber = "";
    var dataUpdate = [];
    for (var i = 1; i <= qty; i++) {
      lastNumber = lastNumber + 1;
      numChar = lastNumber.toString();
      if (numChar.length == 4) {
        numberChar = numChar;
      }
      if (numChar.length == 3) {
        numberChar = "0" + numChar;
      }
      if (numChar.length == 2) {
        numberChar = "00" + numChar;
      }
      if (numChar.length == 1) {
        numberChar = "000" + numChar;
      }
      // alert(JSON.stringify(unitCode));
      serialNumber = dataUnitCode.prefix + dataUnitCode.series + numberChar;
      // alert(JSON.stringify(props?.orderData));
      dataUpdate.push({
        container_factory_country_id: props?.orderData.rowData.row.country_id,
        container_type: props?.orderData.container_type,
        ral_code: unitCode.ral_colour,
        container_id: props?.orderData.container_id,
        container_factory: props?.orderData.rowData.row.factory,
        container_factory_city_id: props?.orderData.rowData.row.city_id,
        quote_in_id: props?.orderData.rowData.row.id,
        container_size: props?.orderData.container_size,
        container_size_data: props?.orderData.container_size_data.name,
        container_type_data: props?.orderData.container_type_data.name,
        container_number: serialNumber,
      });
    }
    var endNumber = lastNumber;
    var insert = insertOrderQuoteApi(
      dataUpdate,
      dataUnitCode.id,
      lastNumber,
      serialNumber
    ).then(() => {
      dataOrderQuote.mutate();
    });
  }
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) => option.prefix + option.unit_code,
    limit: 100,
  });
  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "1400px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <h3>Generate Container Number</h3>
          </Box>

          <Box className="modal-content">
            <Box className="mb-3 text-left">
              Manufacture List :{" "}
              <span style={{ fontWeight: "bold" }}>
                {props?.orderData?.rowData?.row?.factory}
              </span>
            </Box>
            <Box className="mb-3 text-left">
              Size and Type :{" "}
              <span style={{ fontWeight: "bold" }}>
                {props?.containerSize} {props?.containerType}
              </span>
            </Box>

            <Box className="mb-3 text-left">
              <Grid container>
                <Grid item xs={5}>
                  <Tooltip
                    title="Prefix/ Unit code/ Color/ Last serial number"
                    aria-label="add"
                  >
                    <Autocomplete
                      options={props?.orderData?.unit_code_data}
                      filterOptions={filterOptions}
                      getOptionLabel={(option) => option.serial_number}
                      renderOption={(option) => (
                        <Fragment>
                          <table>
                            {/* {option.prefix === "title" ? (
                        <thead>
                          <tr>
                            <th style={{ width: 400 }}>prefix</th>
                            <th style={{ width: 100 }}>unitcode</th>
                          </tr>
                        </thead>
                      ) : ( */}
                            <tbody>
                              <tr>
                                <td style={{ width: 50 }}>{option.prefix}</td>
                                <td style={{ width: 50 }}>
                                  {option.unit_code}
                                </td>
                                <td style={{ width: 150 }}>
                                  {option.colour_name}
                                </td>
                                <td style={{ width: 150 }}>
                                  {option.serial_number}
                                </td>
                              </tr>
                            </tbody>
                            {/* )} */}
                          </table>
                        </Fragment>
                      )}
                      autoHighlight
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Code"
                          name="unit_code"
                          id="unit_code"
                          value={params.id}
                          variant="outlined"
                          size="small"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                        />
                      )}
                      onChange={(e, v) => onContainerSerialChange(e, v)}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    style={{ marginLeft: 3, marginRight: 3 }}
                    variant="outlined"
                    size="small"
                    label="Quantity"
                    name="quantity"
                    id="quantity"
                    color="primary"
                    fullWidth
                    onChange={(e) => onChangeInput(e)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  ></TextField>
                </Grid>
                <Grid item xs={2}>
                  {" "}
                  {/* <Button
                    style={{ marginLeft: 3 }}
                    variant="contained"
                    color="primary"
                    onClick={() => confirmGenerate()}
                  >
                    Container Type
                  </Button> */}
                </Grid>
                <Grid item xs={2} alignContent="right">
                  <Button
                    style={{ marginLeft: 3 }}
                    variant="contained"
                    color="primary"
                    onClick={() => confirmGenerate()}
                  >
                    Generate serial number
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-center">
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <span style={{ fontWeight: "bold" }}>Color</span>
                </Grid>
                <Grid item xs={3}>
                  <span style={{ fontWeight: "bold" }}> Serial Number</span>
                </Grid>
              </Grid>
              <Divider></Divider>
              {dataOrderQuote?.data?.result?.map((res, key) => (
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    {/* <span
                      style={{
                        fontWeight: "bold",
                        backgroundColor: res?.container_color?.html_code,
                      }}
                    > */}
                    <ViewQuiltIcon
                      fontSize="small"
                      style={{ color: res?.container_color?.html_code }}
                    />
                    {res?.ral_code} {res?.container_color?.name_english}
                    {/* </span> */}
                  </Grid>
                  <Grid item xs={3}>
                    {res?.container_number}
                  </Grid>
                </Grid>
              ))}
            </Box>
            <Box className="mb-3 text-left">
              <TableContainer>
                <Table aria-label="simple table">
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Tooltip
                        title="Export the data to an excel file"
                        placement="bottom"
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => export2Excel(props?.orderData?.id)}
                          style={{ marginLeft: 5, width: "30%" }}
                        >
                          Export to excel
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e, v) => onStatusChange(e)}
                        style={{ marginLeft: 2 }}
                      >
                        To Production
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography
                        style={{
                          fontSize: "0.9em",
                          color: "#999999",
                          fontStyle: "italic",
                        }}
                      >
                        Note :
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <Typography
                        style={{
                          fontSize: "0.9em",
                          color: "#999999",
                          fontStyle: "italic",
                        }}
                      >
                        Container numbering is the process for automatically
                        generating container number in order. Click the generate
                        number button to start the process for generating
                        container number.
                      </Typography>
                    </TableCell>
                  </TableRow>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Card>
        <AlertDialog
          open={openCancelDialog}
          cancelAction={() => setOpenCancelDialog(false)}
          okAction={() => deleteMany()}
          title="Delete confirmation"
          body={confCountData}
        />
        <AlertDialog
          open={openGenerateDialog}
          cancelAction={() => setOpenGenerateDialog(false)}
          okAction={() => generateNumber()}
          title="Generate confirmation"
          body={confGenerateData}
        />
        {/* <ExcelFile
          fileName="Export from db"
          element={
            <button type="button" className="btn btn-success float-right m-3">
              Export data
            </button>
          }
        >
          <ExcelSheet dataset={DataSet} name="Report continer" />
        </ExcelFile> */}
      </Box>
    </Modal>
  );
}
