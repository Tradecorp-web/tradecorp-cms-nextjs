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
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PropTypes from "prop-types";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import { useEffect, useState } from "react";

import { getListOrderIdQuoteSwr } from "../../../services/swr/order-quote.swr";
import { getDetailQuoteInSwr } from "../../../services/swr/quote-in.swr";

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
import { GRID_COLUMN_HEADER_DRAG_OVER } from "@material-ui/data-grid";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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

  const [checkStatus, setCheckStatus] = useState([
    {
      id: null,
      status: null,
    },
  ]);

  const [colorList, setColorList] = useState(null);

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
    },
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setContainerSizeOrder(newValue);
  };

  const onChangePrefix1 = (e) => {
    setPrefix(e.target.value.toUpperCase());
    if (e.target.value.length >= 4) {
      document.getElementById("prefix2").focus();
    }
  };
  const onChangePrefix2 = async (e, size) => {
    var prefix2 = prefix + e.target.value;
    setContainerSize(size);

    if (prefix2.length >= 6) {
      var data = await getRefCsnApi(prefix2);
      var data2 = data.split("||");
      setPrefixId(data2[0]);
      setPrefixSn(data2[1]);
      document.getElementById("serial_number").value = data2[1];
      setDisableGenerate(false);
    }
  };

  const onChangeSerialNumberInput = (e) => {
    var serial = e.target.value.toUpperCase();
    var serigen = "";
    var serialFinal = [];
    if (serial.length >= 4) {
      var serialAll = serial.substring(0, 10);
      var serialText = serial.substring(0, 4);
      var serialCount = serial.substring(4, 10);

      for (let i = 0; i < containerList.length; i++) {
        serialAll = serialText + serialCount;
        serigen = serialAll + checkDigitGenerator(serialAll);
        serialFinal.push({
          serigen,
        });
        serialCount++;
      }
      setOrderFinal(serialFinal);
      setDisableGenerate(false);
    } else {
      setDisableGenerate(true);
    }
  };
  var containerList = [];
  var countAll = 0;
  var orderIdTmp = "0";
  if (typeof props?.orderData?.id != "undefined") {
    orderIdTmp = props?.orderData?.id;
  }

  // alert(dataQuoteIn.data.container_details.container_size_data.name);

  var dataOrderQuote = getListOrderIdQuoteSwr(orderIdTmp, containerSizeOrder);

  function ShowData(size) {
    {
      dataOrderQuote?.data?.result?.map((res, key) => {
        if (res.container_size_data == size) {
          return (
            <TableRow>
              <TableCell>{res.container_size_data}</TableCell>
            </TableRow>
          );
        }
      });
    }
  }

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

    // alert(containerSizeOrder);
    // alert(JSON.stringify(dataOrderQuote));
  }, [containerSizeOrder]);
  useEffect(async () => {
    try {
      var res = await getColorListApi();
      setColorList(res);
    } catch (err) {
      console.log(err);
    }
  }, []);
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
    storeToOrder(prefixSn);
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
    var factory = dataOrderQuote?.data?.result[0]?.container_factory;
    ws.getRow(1).getCell("A").value =
      "A List of Container Number (" +
      dataOrderQuote?.data?.result[0]?.container_factory +
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
    dataOrderQuote?.data?.result?.map((res, keys) => {
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

    dataOrderQuote?.data?.result?.map((res, keys) => {
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
          dataOrderQuote?.data?.result[0]?.container_factory +
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
        dataOrderQuote?.data?.result?.map((resDetail, keysDetail) => {
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
  const onStatusChange = (e, id) => {
    updateStatusOrderQuoteApi(id, "production");
    dataOrderQuote.mutate();
  };
  function storeToOrder(serial) {
    var prefixIdTmp = prefixId;
    //get container
    var containerList1 = [];
    containerList?.map((res, key) => {
      if (containerSize == res?.container_size_data) {
        containerList1.push({
          quote_in_id: res.quote_in_id,
          container_id: res.container_id,
          container_factory: res.container_factory,
          container_factory_country_id: res.container_factory_country_id,
          container_factory_city_id: res.container_factory_city_id,
          container_type: res.container_type,
          container_type_data: res.container_type_data,
          container_size: res.container_size,
          container_size_data: res.container_size_data,
        });
      }
    });
    serial = prefixSn;
    var serigen = "";
    var serialNum = 0;
    var serialFinal = [];
    var serialText2 = "";
    if (serial.length >= 10) {
      var serialAll = serial.substring(0, 10);
      var serialText = serial.substring(0, 6);
      var serialCount = serial.substring(6, 10);

      for (let i = 0; i < containerList1.length; i++) {
        serialNum = parseInt(serialCount);
        serialText2 = serialNum.toString();
        if (serialText2.length == 1) {
          serialCount = "000" + serialText2;
        } else if (serialText2.length == 2) {
          serialCount = "00" + serialText2;
        } else if (serialText2.length == 3) {
          serialCount = "0" + serialText2;
        } else {
          serialCount = serialText2;
        }
        serialAll = serialText + serialCount;
        serigen = serialAll + checkDigitGenerator(serialAll);
        serialFinal.push({
          serigen,
        });
        serialCount++;
      }

      containerList1?.map((res, key) => {
        if (containerSize == res?.container_size_data) {
          var orderData = {
            quote_in_id: res.quote_in_id,
            container_id: res.container_id,
            container_factory: res.container_factory,
            container_factory_country_id: res.container_factory_country_id,
            container_factory_city_id: res.container_factory_city_id,
            container_type: res.container_type,
            container_type_data: res.container_type_data,
            container_size: res.container_size,
            container_size_data: res.container_size_data,
            container_number: serialFinal[key]?.serigen,
          };
          var insert = insertOrderQuoteApi(orderData).then((res) => {
            if (prefixIdTmp == "-") {
              var insertLastNumber = insertRefNumberApi(serialAll);
              prefixIdTmp = "=";
            } else if (prefixIdTmp == "=") {
            } else {
              var updateLastNumber = updateLastNumberApi(
                prefixIdTmp,
                serialAll
              );
              prefixIdTmp == "=";
            }

            dataOrderQuote.mutate();
          });
        }
      });
      setOrderData(orderData);
    }
  }

  useEffect(async () => {
    try {
      var res = await getColorListApi();
      setColorList(res);
    } catch (err) {
      console.log(err);
    }
  }, []);

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
              Manufacture :{" "}
              <span style={{ fontWeight: "bold" }}>
                {props?.orderData?.factory}
              </span>
            </Box>
            <Box className="mb-3 text-center">
              <div className={classes.root}>
                {/* <AppBar position="static"> */}
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="simple tabs example"
                >
                  {dataQI?.data?.container_details?.map((res, key) => (
                    <Tab
                      label={
                        res?.container_size_data?.name +
                        "' " +
                        res?.container_type_data?.name
                      }
                      {...a11yProps(key)}
                    />
                  ))}
                </Tabs>
                {/* </AppBar> */}
                {dataQI?.data?.container_details?.map((res, key) => (
                  <TabPanel value={value} index={key}>
                    <Box className="mb-3 text-left">
                      <TableContainer>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableCell>Container Type</TableCell>
                            <TableCell colSpan={3}>
                              <TextField
                                label="Prefix"
                                name="prefix"
                                variant="outlined"
                                size="small"
                                style={{ width: "10%" }}
                                placeholder="TIHU"
                                onChange={(e) => onChangePrefix1(e)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                  maxLength: 4,
                                  style: { textTransform: "uppercase" },
                                }}
                              />
                              <TextField
                                label="Code"
                                name="prefix2"
                                id="prefix2"
                                variant="outlined"
                                size="small"
                                style={{ width: "10%" }}
                                placeholder="Code"
                                onChange={(e) =>
                                  onChangePrefix2(
                                    e,
                                    res?.container_size_data?.name
                                  )
                                }
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                  maxLength: 2,
                                  style: { textTransform: "uppercase" },
                                }}
                              />
                              <Tooltip
                                title="Type container number to start the process for generating number"
                                placement="bottom"
                              >
                                <TextField
                                  label="Serial Number"
                                  name="serial_number"
                                  id="serial_number"
                                  variant="outlined"
                                  size="small"
                                  style={{ width: "40%" }}
                                  placeholder="1234"
                                  onChange={(e) => onChangeSerialNumberInput(e)}
                                  InputLabelProps={{ shrink: true }}
                                  inputProps={{
                                    maxLength: 4,
                                    style: { textTransform: "uppercase" },
                                  }}
                                />
                              </Tooltip>
                              <Tooltip
                                title="This process formulates container number in order"
                                placement="bottom"
                              >
                                <Button
                                  disabled={disableGenerate}
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => confirmGenerate()}
                                  style={{ marginLeft: 5, width: "30%" }}
                                >
                                  Generate Number
                                </Button>
                              </Tooltip>
                            </TableCell>
                          </TableHead>
                          {dataOrderQuote?.data?.result?.map((res1, key) => (
                            <TableRow
                              style={
                                res?.container_type_data?.name +
                                  res.container_size_data?.name !=
                                res1?.container_type_data +
                                  res1.container_size_data
                                  ? { display: "none" }
                                  : { display: "show" }
                              }
                            >
                              <TableCell>
                                {res1.container_size_data}
                                {"' "}
                                {res1.container_type_data}
                              </TableCell>
                              <TableCell>{res1.container_number}</TableCell>
                              <TableCell key={key} align="center">
                                <Autocomplete
                                  disabled={
                                    res1.quote_status == "production"
                                      ? true
                                      : false
                                  }
                                  options={colorList?.map(
                                    (option) => option.ral_code
                                  )}
                                  autoHighlight
                                  // value={data.ral_code}
                                  defaultValue={res1?.ral_code}
                                  renderOption={(option) => (
                                    <Chip
                                      size="small"
                                      label={option}
                                      style={{
                                        backgroundColor: colorList.filter(
                                          (val) => val.ral_code == option
                                        )[0].html_code,
                                        width: 250,
                                      }}
                                    />
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Color Name"
                                      name="ral_code"
                                      id="ral_code"
                                      variant="outlined"
                                      size="small"
                                      // error={
                                      //   errorText.color_name ? true : false
                                      // }
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      fullWidth
                                    />
                                  )}
                                  // onChange={(e) =>
                                  //   onChangeContainerDetail(e, keyRow)
                                  // }
                                  onChange={(e, v) =>
                                    onColorChange(e, v, res1.id)
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={(e, v) => onStatusChange(e, res1.id)}
                                  style={{ marginLeft: 2 }}
                                >
                                  To Production
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </Table>
                      </TableContainer>
                    </Box>
                    {/* {dataOrderQuote?.data?.result?.map((res1, key) => {
                      if (res.container_size_data == res1.container_size_data) {
                      
                        <TableContainer>
                          <Table>
                            <TableRow>
                              <TableCell>{res.container_size_data}</TableCell>
                            </TableRow>
                          </Table>
                        </TableContainer>;
                      }
                    })} */}
                  </TabPanel>
                ))}
              </div>
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
