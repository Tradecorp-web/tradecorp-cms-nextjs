import {
  Button,
  makeStyles,
  Modal,
  Box,
  Card,
  TextField,
  Grid,
  Typography,
  Divider,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { Alert, AlertTitle, Autocomplete } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { CallToAction, Edit } from "@material-ui/icons";

import { getListMasterSerialApi } from "../../../services/api/master-serial.api";
import { generateSerial } from "../../../helpers/build-quote/generate";
import {
  getDetailCustomerApi,
  insertFileCustomerLogoApi,
} from "../../../services/api/customer.api";

import { getSpecificationSwr } from "../../../services/swr/ref-specification.swr";
import {
  insertOrderQuoteApi,
  updateOrderQuoteApi,
} from "../../../services/api/order-quote.api";

import { getColorListApi } from "../../../services/api/color-codes.api";

import { v4 as uuid } from "uuid";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
}));

export default function FormOrderProduction(props) {
  const classes = useStyles();
  const [data, setData] = useState(false);
  const [color, setColor] = useState("");
  const [series, setSeries] = useState(-1);
  const [qty, setQty] = useState(0);
  // const [refreshOrder, setRefreshOrder] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openFailAlert, setOpenFailAlert] = useState(false);
  const [cscDescOpen, setCscDescOpen] = useState(false);
  const [inputList, setInputList] = useState([
    {
      id: null,
      unit_code: null,
      series: null,
      color: null,
      price: null,
      quantity: null,
      container_number_from: null,
      container_number_to: null,
      pre_sale: null,
      order_quote_files: [],
      csc_plate_description: null,
      specification: [],
    },
  ]);
  // const [openDetailPreSold, setOpenDetailPreSold] = useState(false);
  const [refCust, setRefCust] = useState([{ company: null }]);
  const [saveDialog, setSaveDialog] = useState(false);
  const [dataInput, setDataInput] = useState([
    {
      pre_sale: null,
    },
  ]);
  const [newCustData, setNewCustData] = useState([]);
  const [customerDetail, setCustomerDetail] = useState({
    name: null,
    address: null,
    company: null,
    phone: null,
    email: null,
    logoThumbnail: null,
    logoAttachment: null,
    logoLink: null,
  });
  const [sendDialog, setSendDialog] = useState(false);
  const [quoteData, setQuoteData] = useState(false);
  const [unitCode, setUnitCode] = useState("");
  const [listFile, setListFile] = useState([]);
  const [fileUpOther, setFileUpOther] = useState({
    label: null,
    content_type: null,
    link: null,
    thumbnail: null,
  });
  const [fileUpload, setFileUpload] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
  });
  const [cscPlateDescription, setCscPlateDescription] = useState("");
  const [fileUpCompLogo, setFileUpCompLogo] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
  });
  const [fileUpCsc, setFileUpCsc] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
  });

  const [colorList, setColorList] = useState([
    {
      ral_code: null,
      rgb: null,
      html_code: null,
      name_german: null,
      name_english: null,
      name_french: null,
      name_spanish: null,
      name_italian: null,
      name_nederlands: null,
      unit_link: null,
      series: null,
    },
  ]);

  //spec
  const [otherSpec, setOtherSpec] = useState(false);
  const [specList, setSpecList] = useState([
    {
      specification_id: null,
      specification: null,
    },
  ]);

  var reference = [];

  var specSwr = getSpecificationSwr();

  getSpec();
  useEffect(() => {
    getSpec();
  }, [specSwr]);

  useEffect(() => {
    setOpenAlert(false);
    setOpenFailAlert(false);
    if (props?.specListData?.container_specifications != null) {
      setSpecList(props?.specListData?.container_specifications);
    }

    setInputList(props?.orderDataList);
    props?.orderDataList?.map(async (res) => {
      setCscPlateDescription(res?.csc_plate_description);
      res?.order_quote_files?.map((res2) => {
        if (res2?.file_description == "company_logo") {
          setFileUpCompLogo({
            file_description: res2?.file_description,
            link: res2?.link,
            attachment: res2?.attachment,
            content_type: res2?.content_type,
            thumbnail: res2?.thumbnail,
            deleted_at: null,
          });
        } else {
          setFileUpCsc({
            file_description: res2?.file_description,
            link: res2?.link,
            attachment: res2?.attachment,
            content_type: res2?.content_type,
            thumbnail: res2?.thumbnail,
            deleted_at: null,
          });
        }
      });
      var data = await getDetailCustomerApi(res?.pre_sale);
      if (data != null) {
        setRefCust(data);
      }
    });

    setOtherSpec(props?.specListData?.other_specification);
  }, [props?.open]);

  function getSpec() {
    reference = [];
    specSwr?.data?.result?.map((res) => {
      reference.push({
        title: res.ref_specification,
      });
    });
  }

  //spec

  const inputChange = (e, key) => {
    var list = [...inputList];
    list[key][e.target.name] = e.target.value;
    setInputList(list);
  };

  async function setColorEnable(unitCode) {
    var dataColorOrigin = [];
    dataColorOrigin.push({
      ral_code: "Miscellaneous",
      rgb: null,
      html_code: null,
      name_german: null,
      name_english: "Miscellaneous",
      name_french: null,
      name_spanish: null,
      name_italian: null,
      name_nederlands: null,
      unit_link: null,
      series: -1,
    });
    dataColorOrigin.push({
      ral_code: "All Colours",
      rgb: null,
      html_code: null,
      name_german: null,
      name_english: "All Colours",
      name_french: null,
      name_spanish: null,
      name_italian: null,
      name_nederlands: null,
      unit_link: null,
      series: -1,
    });
    var res = await getColorListApi("", "name_english");
    res?.map((res) => {
      dataColorOrigin.push({
        ral_code: res?.ral_code,
        rgb: null,
        html_code: res?.html_code,
        name_german: null,
        name_english: res?.name_english,
        name_french: null,
        name_spanish: null,
        name_italian: null,
        name_nederlands: null,
        unit_link: null,
        series: -1,
      });
    });

    var colorData = await getListMasterSerialApi(unitCode, "*");
    var colorDataMisc = await getListMasterSerialApi("*", "Miscellaneous");
    var colorDataAllC = await getListMasterSerialApi("*", "Allcolours");

    var colorTmp = [];

    dataColorOrigin?.map((res) => {
      var series = -1;

      if (res?.ral_code == "All Colours") {
        var x = colorDataAllC?.result?.filter(
          ({ ral_colour }) => ral_colour === res?.ral_code
        );
        if (x.length > 0) {
          x?.map((res2) => {
            if (res2.unit_code == unitCode) {
              series = res2.series;
            } else {
              series = -1;
            }
            colorTmp.push({
              ral_code: res2?.ral_colour,
              html_code: null,
              name_english: res2?.ral_colour,
              series: series,
            });
          });
        }
      } else if (res?.ral_code == "Miscellaneous") {
        var x = colorDataMisc?.result?.filter(
          ({ ral_colour }) => ral_colour === res?.ral_code
        );
        if (x.length > 0) {
          x?.map((res2) => {
            if (res2.unit_code == unitCode) {
              series = res2.series;
            } else {
              series = -1;
            }
            colorTmp.push({
              ral_code: res2?.ral_colour,
              html_code: null,
              name_english: res2?.ral_colour,
              series: series,
            });
          });
        }
      } else {
        var x = colorData?.result?.find(
          ({ ral_colour }) => ral_colour === res?.ral_code
        );

        if (typeof x != "undefined") {
          series = x?.series;
        } else {
          series = -1;
        }
        colorTmp.push({
          ral_code: res?.ral_code,
          html_code: res?.html_code,
          name_english: res?.name_english,
          series: series,
        });
      }
    });
    setColorList(colorTmp);
  }

  const colorChange = (e, key) => {
    var val = e.target.value.split("|");
    setColor(val[0]);

    var list = [...inputList];
    list[key]["color"] = val[0];
    list[key]["series"] = val[1];
    setSeries(val[1]);
    setInputList(list);
    getSerial(unitCode, e.target.value, qty, key, val[1]);
  };
  const qtyChange = (e, key) => {
    setQty(e.target.value);
    var list = [...inputList];
    list[key][e.target.name] = e.target.value;
    setInputList(list);
    getSerial(unitCode, color, e.target.value, key, series);
  };
  const getSerial = async (u, c, q, key, serial) => {
    var list = [...inputList];
    var x = await generateSerial(u, c, q, serial);
    if (x != false) {
      list[key]["container_number_from"] = x[0].serial_start;
      list[key]["container_number_to"] = x[0].serial_end;
      list[key]["master_id"] = x[0].id;
      setInputList(list);
    }
  };

  const refSpecChange = (value, key) => {
    if (value != null) {
      var list = [...specList];
      list[key]["specification_id"] = uuid();
      list[key]["specification"] = value.toUpperCase();
      setSpecList(list);
    }
  };
  const otherSpecChange = (e) => {
    setOtherSpec(e.target.value);
  };
  const closeForm = () => {
    props?.closeModal();
  };

  return (
    <Modal open={props?.open} onClose={closeForm}>
      <Box className="modal-wrapper" style={{ width: "1000px" }}>
        <Card className="modal">
          <Collapse in={openAlert}>
            <Alert severity="success">
              <AlertTitle>Success</AlertTitle>
              Data container order saved!
            </Alert>
          </Collapse>
          <Collapse in={openFailAlert}>
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Data container order not saved!
            </Alert>
          </Collapse>
          <Box className="modal-header">
            <h3>{" Order Detail"}</h3>
          </Box>
          <Box className="modal-content">
            {inputList?.map((row, key) => (
              <Grid container>
                <Grid item xs={12}>
                  <div className="mb-3 text-left">
                    {props?.actForm === "Update" && (
                      <TextField
                        disabled
                        labelId="demo-controlled-open-select-label"
                        id="unit_code"
                        name="unit_code"
                        variant="outlined"
                        fullWidth
                        value={row?.unit_code}
                        label="Unit Code"
                        InputLabelProps={{ shrink: true }}
                      ></TextField>
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} mt={10}>
                  <div className="mb-3 text-left">
                    {props?.actForm === "Update" && (
                      <Grid container>
                        <Grid item xs={6}>
                          <TextField
                            disabled
                            labelId="demo-controlled-open-select-label"
                            id="color"
                            name="color"
                            value={row?.color + " [ " + row?.series + " ]"}
                            variant="outlined"
                            label="Ral Color [series]"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={3} style={{ textAlign: "center" }}>
                          {row?.container_color?.name_english != "" && (
                            <TextField
                              disabled
                              labelId="demo-controlled-open-select-label"
                              id="color"
                              name="color"
                              value={row?.container_color?.name_english}
                              variant="outlined"
                              label="Color Name"
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                            />
                          )}
                        </Grid>
                        <Grid item xs={3} style={{ textAlign: "left" }}>
                          {row?.container_color?.html_code != "" && (
                            <CallToAction
                              style={{
                                width: 100,
                                color: row?.container_color?.html_code,
                              }}
                            />
                          )}
                        </Grid>
                      </Grid>
                    )}
                  </div>
                </Grid>

                <Grid item xs={12} mt={10}>
                  <div className="mb-3 text-left">
                    {props?.actForm === "Update" && (
                      <TextField
                        disabled
                        name="quantity"
                        id="quantity"
                        value={row?.quantity}
                        variant="outlined"
                        label="Quantity"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    )}
                  </div>
                </Grid>
                <Grid container>
                  <Grid item xs={6} mt={10}>
                    <div className="mb-3 text-left">
                      <TextField
                        name="container_number_start"
                        id="container_number_start"
                        value={row?.container_number_from}
                        onChange={(e) => inputChange(e, key)}
                        disabled
                        variant="outlined"
                        label="Container Number Start"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </div>
                  </Grid>

                  <Grid item xs={6} mt={10}>
                    <div className="mb-3 text-right">
                      <TextField
                        name="container_number_end"
                        id="container_number_end"
                        value={row?.container_number_to}
                        onChange={(e) => inputChange(e, key)}
                        disabled
                        variant="outlined"
                        label="Container Number TO"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </div>
                  </Grid>
                </Grid>

                <Grid item xs={12} mt={10}>
                  <div className="mb-3 text-left">
                    <TextField
                      disabled
                      name="price"
                      id="price"
                      variant="outlined"
                      type="number"
                      value={row?.price}
                      onChange={(e) => inputChange(e, key)}
                      label="Price"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </div>
                </Grid>
                {/* <Grid item xs={12} mt={10}>
                  <div className="mb-3 text-left">
                    <TextField
                      id="pre_sale"
                      name="pre_sale"
                      value={row?.customer?.company}
                      variant="outlined"
                      fullWidth
                      disabled
                    />
                  </div>
                </Grid> */}
              </Grid>
            ))}
            <Box
              style={{ margin: 10 }}
              class={classes.itemContainer}
              justifyContent="center"
              alignItems="center"
            >
              <Grid container style={{ marginBottom: 10 }}>
                <Grid item xs={12}>
                  <h4>Pre sale</h4> <Divider></Divider>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <h5>Company</h5>
                </Grid>
                <Grid item xs={9}>
                  <h4>
                    : {refCust?.company} {", "}
                    {refCust?.company_type}
                  </h4>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <h5>Customer Code</h5>
                </Grid>
                <Grid item xs={9}>
                  <h4>: {refCust?.customer_code}</h4>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <h5>Contact Person</h5>
                </Grid>
                <Grid item xs={9}>
                  <h4>: {refCust?.name}</h4>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={3}>
                  <h5>Company Address</h5>
                </Grid>
                <Grid item xs={9}>
                  <h4>: {refCust?.address}</h4>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <h5>Phone</h5>
                </Grid>
                <Grid item xs={9}>
                  <h4>: {refCust?.phone_number}</h4>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <h5>Email</h5>
                </Grid>
                <Grid item xs={9}>
                  <h4>: {refCust?.email}</h4>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <h5>Tax Number</h5>
                </Grid>
                <Grid item xs={9}>
                  <h4>: {refCust?.npwp_number}</h4>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <h5>Contact Person</h5>
                </Grid>
                <Grid item xs={9}>
                  <h4>: {refCust?.name}</h4>
                </Grid>
              </Grid>
            </Box>
            <div className="mt-3 mb-3 text-left">
              <Divider></Divider>
            </div>
            <Box
              style={{ marginLeft: 10 }}
              class={classes.itemContainer}
              justifyContent="center"
              alignItems="center"
            >
              <Grid container>
                <Grid item xs={6}>
                  {" "}
                  <Typography
                    variant="h4"
                    component="h4"
                    style={{
                      wordWrap: "anywhere",
                      marginLeft: "0px",
                    }}
                  >
                    Company Logo
                  </Typography>
                  {fileUpCompLogo?.thumbnail == null && (
                    <img
                      width="100px"
                      src={
                        "data:image/webp;base64,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"
                      }
                    />
                  )}
                  {fileUpCompLogo?.thumbnail != null && (
                    <img
                      onClick={() => downloadFile(fileUpCompLogo?.link)}
                      width="100px"
                      src={`data:image/jpeg;base64,${fileUpCompLogo?.thumbnail}`}
                    />
                  )}
                </Grid>
                <Grid item xs={6}>
                  {" "}
                  <Typography
                    variant="h4"
                    component="h4"
                    style={{
                      wordWrap: "anywhere",
                      marginLeft: "0px",
                    }}
                  >
                    CSC
                  </Typography>
                  {fileUpCsc?.thumbnail == null && (
                    <img
                      width="100px"
                      src={
                        "data:image/webp;base64,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"
                      }
                    />
                  )}
                  {fileUpCsc?.thumbnail != null && (
                    <img
                      onClick={() => downloadFile(fileUpCsc?.link)}
                      width="100px"
                      src={`data:image/jpeg;base64,${fileUpCsc?.thumbnail}`}
                    />
                  )}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <h4>{inputList?.csc_plate_description}</h4>
                </Grid>
              </Grid>
            </Box>

            <div className="mt-3 mb-3 text-left">
              <Grid container>
                <Grid item xs={3}>
                  <h5>CSC Plate Description</h5>
                </Grid>
                <Grid item xs={9}>
                  <h4>{cscPlateDescription}</h4>
                </Grid>
              </Grid>
            </div>
            <div className="mt-3 mb-3 text-left">
              <Divider></Divider>
            </div>

            {specList?.map((res, key) => (
              <Grid container spacing={0} justify="center" alignItems="center">
                <React.Fragment>
                  <Grid item xs={12}>
                    <Autocomplete
                      disabled
                      onChange={(event, newValue) => {
                        refSpecChange(newValue, key);
                      }}
                      value={specList[key].specification}
                      freeSolo
                      options={reference?.map((option) => option.title)}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={"Specification " + (key + 1)}
                          margin="normal"
                          variant="outlined"
                          id="specification"
                          name="specification"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    ></Autocomplete>
                  </Grid>
                </React.Fragment>
              </Grid>
            ))}
            <Grid container spacing={0} justify="center" alignItems="center">
              <Grid item xs={12} sm={12}>
                {/* <Button variant="outlined" color="secondary">
                  <Add onClick={() => clickAddRow()} />
                </Button> */}
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: 20 }}>
              <Grid item xs={12}>
                <TextField
                  disabled
                  label="Other Specification"
                  name="other_specification"
                  value={otherSpec}
                  id="other_specification"
                  variant="outlined"
                  onChange={(e) => otherSpecChange(e)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  multiline
                  rows={4}
                  fullWidth
                  inputProps={{ style: { textTransform: "uppercase" } }}
                />
              </Grid>
            </Grid>
          </Box>
          <Box className="modal-footer">
            <Grid container>
              <Grid item xs={6}>
                {/* {" "}
                <Button
                  variant="outlined"
                  onClick={saveOrderQuote}
                  color="primary"
                  autoFocus
                >
                  Update
                </Button> */}
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                {" "}
                <Button
                  variant="outlined"
                  onClick={() => {
                    closeForm();
                  }}
                  color="secondary"
                  autoFocus
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Dialog
          fullWidth
          maxWidth="md"
          open={cscDescOpen}
          onClose={() => {
            setCscDescOpen(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            CSC Plate Description
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <TextField
                fullWidth
                multiline
                variant="outlined"
                defaultValue={props?.orderDataList[0]?.csc_plate_description}
                rows={4}
                id="csc_plate_description"
                name="csc_plate_description"
                onChange={(e) => inputChange(e, 0)}
              />
            </DialogContentText>
            <Button
              className="mb-3"
              variant="outlined"
              onClick={() => {
                setCscDescOpen(false);
              }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </Modal>
  );
}
