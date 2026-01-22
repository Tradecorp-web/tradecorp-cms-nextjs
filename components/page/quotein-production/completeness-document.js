import {
  Modal,
  Box,
  Card,
  Grid,
  TextField,
  MenuItem,
  Button,
  IconButton,
  InputLabel,
  Divider,
} from "@material-ui/core";

import { DropZoneComponent } from "../../base_component/file-upload";
import CompDoc from "../master/comp-doc/comp-doc";

import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import { getListMasterCompletedDocNoLimitSwr } from "../../../services/swr/master-completed-document.swr";
import { saveComponentDocumentApi } from "../../../services/api/completed-document.api";
import { Delete, Add, CallToAction, Edit } from "@material-ui/icons";

import React, { useEffect, useState } from "react";
import Moment from "moment";

export default function CompletenessDocument(props) {
  const [openComDoc, setOpenComDoc] = useState(false);
  const [openSave, setOpenSave] = React.useState(false);
  const [masterCompDoc, setMasterCompDoc] = useState([]);
  const [masterCompDocRet, setMasterCompDocRet] = useState([]);
  const [documentDetail, setDocumentDetail] = useState([
    {
      completed_document_id: null,
      completed_document_name: null,
      completed_document_number: null,
      completed_document_date: null,
      completed_document: null,
    },
  ]);

  const [fileUpload, setFileUpload] = useState({
    label: null,
    content_type: null,
    link: null,
    thumbnail: null,
  });
  const [listFile, setListFile] = useState([
    {
      name: null,
      progress: 100,
      link: null,
      content_type: null,
      loading: -1,
    },
  ]);
  const [inputList, setInputList] = useState([
    {
      id: null,
      completed_document_id: null,
      completed_document_name: null,
      completed_document: null,
      completed_document_files: [],
    },
  ]);
  const [data, setData] = useState({
    id: null,
    check_point: "no",
    potensial_survey_cost: "no",
    selling_price: 0,
    description_completed_document: null,
    completed_document_files: [],
    document_details: [],
  });

  const refreshMaster = () => {
    masterCompletedDocNoLimitSwr.mutate();
  };

  var masterCompletedDocNoLimitSwr = getListMasterCompletedDocNoLimitSwr({
    orderBy: "name",
    order: "asc",
  });
  const closeForm = () => {
    setOpenSave(false);
    // refresh();
    // setAcive(false);
    props?.closeModal();
  };

  const dataChange = (e) => {
    setOpenSave(false);
    if (e.target.name == "selling_price") {
      setData({ ...data, [e.target.name]: Number(e.target.value) });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const masterDocChange = (event, value, i, extra) => {
    setOpenSave(false);
    var list = [...documentDetail];
    var val2 = event.target.value;
    if (val2 != null) {
      if (event.target.name == "completed_document_id") {
        var masterDoc = val2.split("||");
        list[i]["completed_document_id"] = masterDoc[0];
        list[i]["completed_document_name"] = masterDoc[1];
      } else if (event.target.name == "completed_document_number") {
        list[i]["completed_document_number"] = val2;
      } else if (event.target.name == "completed_document_date") {
        list[i]["completed_document_date"] = val2;
      } else if (event.target.name == "completed_document") {
        list[i]["completed_document"] = val2;
      }
      setDocumentDetail(list);
      setData({ ...data, document_details: list });
    }
  };

  const onChangeUpload = (res, name) => {
    setOpenSave(false);
    var result = [];
    res?.map((row, i) => {
      result.push({
        label: row.name,
        content_type: row.content_type,
        link: row.link,
        thumbnail: null,
      });
    });
    setFileUpload({ ...fileUpload, result });
    setData({
      ...data,
      completed_document_files: result,
    });
  };

  const clickAddRow = () => {
    var docDet = {
      completed_document_id: null,
      completed_document_name: null,
      completed_document_number: null,
      completed_document_date: null,
      completed_document: null,
    };
    setOpenSave(false);
    setDocumentDetail([
      ...documentDetail,
      {
        completed_document_id: null,
        completed_document_name: null,
        completed_document_number: null,
        completed_document_date: null,
        completed_document: null,
      },
    ]);
  };

  const clickRemoveRow = (i) => {
    setOpenSave(false);
    var list = [...documentDetail];
    list.splice(i, 1);
    setDocumentDetail(list);
    setData({ ...data, document_details: list });
  };

  const save = () => {
    setOpenSave(false);
    var dataSave = [data];
    var dataSaveDocDetail = [];
    var dataSaveFile = [];
    var dataFinal = {};
    dataSave.map((res) => {
      res.document_details.map((docDet) => {
        var docDate =
          docDet.completed_document_date +
          "T" +
          Moment().format("hh:mm:ss") +
          ".000Z";
        dataSaveDocDetail.push({
          completed_document_id: docDet.completed_document_id,
          completed_document_name: docDet.completed_document_name,
          completed_document_number: docDet.completed_document_number,
          completed_document: docDet.completed_document,
          completed_document_date: docDate,
        });
      });

      res.completed_document_files.map((docFile) => {
        if (docFile.label != null) {
          dataSaveFile.push({
            label: docFile.label,
            content_type: docFile.content_type,
            link: docFile.link,
            thumbnail: docFile.thumbnail,
          });
        }
      });

      dataFinal = {
        id: res.id,
        order_id: props.orderId,
        check_point: res.check_point,
        potensial_survey_cost: res.potensial_survey_cost,
        selling_price: res.selling_price,
        description_completed_document: res.description_completed_document,
        document_details: dataSaveDocDetail,
        completed_document_files: dataSaveFile,
      };
    });

    var saveData = saveComponentDocumentApi(dataFinal).then((res) => {
      setData({ ...data, id: res.id });
      setOpenSave(true);
    });
  };

  //useEffect
  useEffect(() => {
    if (props.actForm == "edit") {
      if (props.completedDocData != null) {
        var dataSave = [props.completedDocData];
        var dataSaveDocDetail = [];
        var dataSaveFile = [];
        var dataFinal = {};
        dataSave.map((res) => {
          res.document_details != null &&
            res.document_details.map((docDet) => {
              var docDate = Moment(docDet.completed_document_date).format(
                "YYYY-MM-DD"
              );

              dataSaveDocDetail.push({
                completed_document_id: docDet.completed_document_id,
                completed_document_name: docDet.completed_document_name,
                completed_document_number: docDet.completed_document_number,
                completed_document: docDet.completed_document,
                completed_document_date: docDate,
              });
            });

          res.completed_document_files != null &&
            res.completed_document_files.map((docFile) => {
              dataSaveFile.push({
                progress: 100,
                name: docFile.label,
                label: docFile.label,
                content_type: docFile.content_type,
                link: docFile.link,
                thumbnail: docFile.thumbnail,
                loading: -1,
              });
            });
          dataFinal = {
            id: res.id,
            order_id: props.orderId,
            check_point: res.check_point,
            potensial_survey_cost: res.potensial_survey_cost,
            selling_price: res.selling_price,
            description_completed_document: res.description_completed_document,
            document_details: dataSaveDocDetail,
            completed_document_files: dataSaveFile,
          };

          setListFile(dataSaveFile);
          setDocumentDetail(dataSaveDocDetail);
          setData(dataFinal);
        });
      }
    } else {
      setData({
        id: null,
        check_point: null,
        potensial_survey_cost: null,
        selling_price: 0,
        description_completed_document: null,
        completed_document_files: [],
        document_details: [],
      });
    }
  }, [props.open]);

  //==useEffect
  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "1400px" }}>
        <Card className="modal">
          <Collapse in={openSave}>
            <Alert
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenSave(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              Data saved....
            </Alert>
          </Collapse>
          <Box className="modal-header">
            <h3>Completeness Document</h3>
          </Box>
          <Box className="modal-content">
            {documentDetail?.map((res, key) => (
              <React.Fragment>
                <Grid container className="mb-3">
                  <Grid item xs={4}>
                    <TextField
                      id="completed_document_id"
                      name="completed_document_id"
                      variant="outlined"
                      fullWidth
                      select
                      label={"Document type " + (key + 1)}
                      value={
                        data?.document_details[key]?.completed_document_id +
                        "||" +
                        data?.document_details[key]?.completed_document_name
                      }
                      // onChange={(e) => masterDocChange(e, key)}
                      onChange={(e, v) => masterDocChange(e, v, key, true)}
                      InputLabelProps={{ shrink: true }}
                    >
                      {masterCompletedDocNoLimitSwr != null &&
                        masterCompletedDocNoLimitSwr?.data?.result?.map(
                          (res) => (
                            <MenuItem value={res?.id + "||" + res?.name}>
                              {res?.name}
                            </MenuItem>
                          )
                        )}
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      //  style={{ marginLeft: 10 }}
                      variant="outlined"
                      id="completed_document_number"
                      label={"Document Number " + (key + 1)}
                      name="completed_document_number"
                      value={
                        data?.document_details[key]?.completed_document_number
                      }
                      onChange={(e, v) => masterDocChange(e, v, key, true)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      //    style={{ marginLeft: 10 }}
                      variant="outlined"
                      id="completed_document_date"
                      value={
                        data?.document_details[key]?.completed_document_date
                      }
                      label={"Document Date " + (key + 1)}
                      name="completed_document_date"
                      type="date"
                      onChange={(e, v) => masterDocChange(e, v, key, true)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={1} sm={1}>
                    {key == 0 && (
                      <CompDoc
                        closeModal={() => refreshMaster()}
                        open={openComDoc}
                      />
                    )}
                    {key != 0 && (
                      <IconButton>
                        <Delete onClick={() => clickRemoveRow(key)} />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </React.Fragment>
            ))}

            <Grid container spacing={0} justify="center" alignItems="center">
              <Grid item xs={12} sm={12}>
                <Button variant="outlined" color="secondary">
                  <Add onClick={() => clickAddRow()} />
                </Button>
              </Grid>
            </Grid>

            <Box>
              <Grid container>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    style={{ marginTop: 20 }}
                    id="check_point"
                    name="check_point"
                    variant="outlined"
                    select
                    defaultValue={
                      props?.actForm == "edit" ? data.check_point : "null"
                    }
                    label="Check Point"
                    onChange={(e) => dataChange(e)}
                  >
                    <MenuItem key="null" value="null">
                      Select...
                    </MenuItem>
                    <MenuItem key="yes" value="yes">
                      Yes
                    </MenuItem>
                    <MenuItem key="yes" value="no">
                      No
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    style={{ marginTop: 20, marginLeft: 10 }}
                    id="potensial_survey_cost"
                    name="potensial_survey_cost"
                    variant="outlined"
                    select
                    defaultValue={
                      props?.actForm == "edit"
                        ? data.potensial_survey_cost
                        : "null"
                    }
                    label="Potensial Survey Cost"
                    onChange={(e) => dataChange(e)}
                  >
                    <MenuItem key="null" value="null">
                      Select...
                    </MenuItem>
                    <MenuItem key="yes" value="yes">
                      Yes
                    </MenuItem>
                    <MenuItem key="yes" value="no">
                      No
                    </MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <TextField
                    style={{ marginTop: 20 }}
                    variant="outlined"
                    id="selling_price"
                    label="Selling Price"
                    name="selling_price"
                    defaultValue={
                      props?.actForm == "edit" ? data.selling_price : 0
                    }
                    onChange={(e) => dataChange(e)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>

            <Grid container>
              <Grid item xs={12}>
                <TextField
                  style={{ marginTop: 20 }}
                  variant="outlined"
                  multiline
                  rows={5}
                  defaultValue={
                    props?.actForm == "edit"
                      ? data.description_completed_document
                      : ""
                  }
                  id="description_completed_document"
                  label={"Document Description"}
                  name="description_completed_document"
                  onChange={(e) => dataChange(e)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} style={{ marginTop: 20 }}>
                <InputLabel shrink={true}>Images / Files</InputLabel>
                <DropZoneComponent
                  id="completed_document_files"
                  exportList={(res) =>
                    onChangeUpload(res, "completed_document_files")
                  }
                  data={listFile}
                  path="completed_document_files"
                />
              </Grid>
            </Grid>
          </Box>
          <Box className="modal-footer">
            <Grid container>
              <Grid item xs={6}>
                <Button
                  onClick={closeForm}
                  variant="outlined"
                  color="secondary"
                >
                  Close
                </Button>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  // onMouseMove={() => prepareSave()}
                  onClick={() => save()}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
}
