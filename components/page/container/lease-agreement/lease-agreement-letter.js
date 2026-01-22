import {
  Button,
  Card,
  makeStyles,
  Grid,
  Typography,
  Box,
  Modal,
  Backdrop,
  CircularProgress,
  TextField,
  IconButton,
  InputLabel,
  InputBase,
} from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";
import ReactHtmlParser from "react-html-parser";

const [depoOptions, setDepoOptions] = useState([]);
const [customerOptions, setCustomerOptions] = useState([]);

useEffect(() => {
  getListDepoApi({
    page: 1,
    limit: 200,
    orderBy: "name",
    order: "asc",
  }).then((res) => {
    setDepoOptions(res?.result ?? []);
  });
  getListCustomerApi({
    page: 1,
    limit: 200,
    orderBy: "name",
    order: "asc",
  }).then((res) => {
    setCustomerOptions(res?.result ?? []);
  });
}, []);

// import logoImg from "../../../../public/images/Logo-Tradecorp.webp";

import {
  Delete,
  Add,
  AlternateEmailTwoTone,
  AddAlertRounded,
} from "@material-ui/icons";

import Moment from "moment";
import {
  dateExpired,
  dateFormatInput,
  rupiah,
} from "../../../../helpers/general";
import CardContent from "@material-ui/core/CardContent";

import { v4 as uuid } from "uuid";

import { getListContainerForSaleSwr } from "../../../../services/swr/container-stock.swr";
import { getDetailLeaseAgreementHeaderSwr } from "../../../../services/swr/lease-agreement-report.swr";
import { getDetailLeaseAgreementByAppendixAApi } from "../../../../services/api/lease-agreement-report.api";

import ReactToPrint from "react-to-print";

// import {Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
} from "@material-ui/core";

// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   PDFViewer,
//   Image,
// } from "@react-pdf/renderer";

// import Pdf from "react-to-pdf";
// import { RawShaderMaterial } from "three";
// const ref = React.createRef();
// const optionToPDF = {
//   orientation: "portrait",
//   unit: "in",
// };

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
  table: {
    minWidth: 650,
  },
  textFontCenter: {
    fontSize: 10,
    textAlign: "center",
  },

  textFont: {
    fontSize: 5,
  },

  tableCustom: {
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "none",
    fontFamily: "Times New Roman",
  },

  customField: {
    marginLeft: "2px",
  },

  customHeader: {
    position: "fixed",
    width: "100%",
  },

  customContent: {
    marginTop: 50,
    marginLeft: 10,
  },

  customPageStart: {
    marginTop: 50,
  },
  customFooter: {
    position: "fixed",
    width: "100%",
    bottom: 0,
    left: 0,
    right: 0,
  },
}));
//https://codesandbox.io/s/print-pdf-with-header-footer-on-every-page-forked-jnpomv?file=/src/App.js
export default function LeaseAgreementLetter(props) {
  var ladetail = getDetailLeaseAgreementHeaderSwr(props?.idLeaseAggrement);

  /**{"isLoading":false,"data":{"id":"75211112-882e-4eb1-9515-0e56ae5fa3d9","logo":"/images/logo.png","company_name":"PT TRADECORP INDONESIA","company_id":"bbaecc1f-6151-44b8-9be5-debe77d40676","company":null,"title_en":"Appendix A, Appendix B & Master Agreement for Lease of Containers/ ","title_idn":"Lampiran A, Lampiran B & Perjanjian Induk Sewa Kontainer","lease_number":"LSN-12.01.23.0001","created_by":"7b515555-4990-46ab-9269-c7b9485cfe56"}} */
  const classes = useStyles();

  const nbsp = "\u00A0";
  const breakline = "\u000A";

  const [open, setOpen] = useState(false);

  const closeForm = () => {
    props?.closeModal();
  };
  var listContainer = getListContainerForSaleSwr();
  var containerData = [];

  listContainer?.data?.result.map((rows, key) => {
    containerData.push({
      container_id: rows.id,
      container_type: rows.type.name,
      container_size: rows.size.name,
      container_serial_number: rows.serial_number,
      container_data:
        rows.id +
        "||" +
        rows.type.name +
        "||" +
        rows.size.name +
        "||" +
        rows.serial_number,
    });
  });

  const [containerDetail, setContainerDetail] = useState([
    {
      agreement_container_list_id: null,
      agreement_container_list_order: null,
      agreement_container_id: null,
      agreement_container_number: null,
      agreement_container_type: null,
      agreement_container_description: null,
    },
  ]);

  const [appendixA, setAppendixA] = useState([
    {
      id: null,
      lease_agreement_header_id: null,
      title_appendix_a_idn: null,
      title_appendix_a_en: null,
      appendix_a_header_idn: null,
      appendix_a_header_en: null,
      appendix_a_details: null,
    },
  ]);

  const [agreementClauseDetail, setAgreementClauseDetail] = useState([
    {
      agreement_clause_id: null,
      agreement_clause_order: null,
      agreement_clause_title_ind: null,
      agreement_clause_title_en: null,
      agreement_clause_description_ind: null,
      agreement_clause_description_en: null,
    },
  ]);
  const [agreementArticle, setAgreementArticle] = useState([
    {
      agreement_article_id: null,
      agreement_article_order: null,
      agreement_article_title_ind: null,
      agreement_article_title_en: null,
      agreement_article_ind: null,
      agreement_article_en: null,
      agreement_article_detail: null,
    },
  ]);

  const [agreementArticleDetail, setAgreementArticleDetail] = useState([
    {
      agreement_article_id: null,
      agreement_article_detail_id: null,
      agreement_article_detail_number: null,
      agreement_article_detail_ind: null,
      agreement_article_detail_en: null,
    },
  ]);

  const [data, setData] = useState({
    id: null,
    lease_agreement_number: null,
    effective_date: null,
    termination_date: null,
    company_id: null,
    agreement_master_title_ind: null,
    agreement_master_title_en: null,
    lessor_id: null,
    lessor_person_name: null,
    lessor_person_position: null,
    leassee_id: null,
    leassee_person_name: null,
    leassee_person_position: null,
    leassee_company: null,
    agreement_clause: null,
    agreement_container_list: null,
    agreement_article: null,
  });
  const onChangeAgreement = (res) => {
    setData({ ...data, [res.target.name]: res.target.value });
  };
  const onChangeContainerDetail = (res, i) => {
    var list = [...containerDetail];
    var value = res.target.value;

    if (res != null) {
      if (res.target.name == "container_detail") {
        var cDetail = value.split("-");
        list[i]["agreement_container_list_id"] = uuid();
        list[i]["agreement_container_list_order"] = i;
        list[i]["agreement_container_id"] = cDetail[0];
        list[i]["agreement_container_type"] = cDetail[1];
        list[i]["agreement_container_number"] = cDetail[3];
      } else {
        list[i][res.target.name] = value;
      }
    }
    setContainerDetail(list);
    setData({ ...data, agreement_container_list: list });
  };
  const onChangeAgreementClauseDetail = (res, i) => {
    var list = [...agreementClauseDetail];

    if (res != null) {
      list[i]["agreement_clause_id"] = uuid();
      list[i]["agreement_clause_order"] = i;
      list[i][res.target.name] = res.target.value;
    }
    setAgreementClauseDetail(list);
    setData({ ...data, agreement_clause: list });
  };
  const onChangeAgreementArticle = (res, i) => {
    var list = [...agreementArticle];

    if (res != null) {
      list[i]["agreement_article_id"] = uuid();
      list[i][res.target.name] = res.target.value;
    }
    setAgreementArticle(list);
    setData({ ...data, agreement_article: list });
  };
  const onChangeAgreementArticleDetail = (res, i, articleDetailId) => {
    var list = [...agreementArticleDetail];

    if (res != null) {
      list[i]["agreement_article_id"] = articleDetailId;
      list[i]["agreement_article_detail_id"] = uuid();
      list[i][res.target.name] = res.target.value;
    }
    setAgreementArticleDetail(list);
  };

  const clickAddRowContainer = () => {
    setContainerDetail([
      ...containerDetail,
      {
        agreement_container_list_id: null,
        agreement_container_list_order: null,
        agreement_container_id: null,
        agreement_container_number: null,
        agreement_container_type: null,
        agreement_container_description: null,
      },
    ]);
  };
  const clickAddRowAgreementClause = (i) => {
    setAgreementClauseDetail([
      ...agreementClauseDetail,
      {
        agreement_clause_id: null,
        agreement_clause_order: i,
        agreement_clause_title_ind: null,
        agreement_clause_title_en: null,
        agreement_clause_description_ind: null,
        agreement_clause_description_en: null,
      },
    ]);
  };

  const clickAddRowAgreementArticle = (i) => {
    setAgreementArticle([
      ...agreementArticle,
      {
        agreement_article_id: null,
        agreement_article_order: null,
        agreement_article_title_ind: null,
        agreement_article_title_en: null,
        agreement_article_ind: null,
        agreement_article_en: null,
        agreement_article_detail: null,
      },
    ]);
  };

  const clickRemoveRowContainer = (i) => {
    setOpen(true);
    var list = [...containerDetail];
    list.splice(i, 1);
    setContainerDetail(list);
    setData({ ...data, container_details: list });
    setOpen(false);
  };
  const clickRemoveRowAgreementClause = (i) => {
    setOpen(true);
    var list = [...agreementClauseDetail];
    list.splice(i, 1);
    setAgreementClauseDetail(list);
    setData({ ...data, agreement_clause: list });
    setOpen(false);
  };
  const clickRemoveRowAgreementArticle = (i) => {
    setOpen(true);
    var list = [...agreementArticle];
    list.splice(i, 1);
    setAgreementArticle(list);
    setData({ ...data, agreement_article: list });
    setOpen(false);
  };

  useEffect(() => {
    getDetailLeaseAgreementByAppendixAApi(ladetail?.data?.id).then((res) => {
      setAppendixA(res ?? []);
    });
  }, [ladetail?.data?.id]);
  function saveData() {
    alert(JSON.stringify(appendixA?.appendix_a_details));
  }
  const ref = useRef(null);
  // const getPageMargins = () => {
  //   //return `@page { margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft} !important; }`;
  //   return `@page { margin: ${50} ${10} ${10} ${10} !important; }`;
  // };

  // function escapeHtml(text) {
  //   var map = {
  //     "&": "&amp;",
  //     "<": "&lt;",
  //     ">": "&gt;",
  //     '"': "&quot;",
  //     "'": "&#039;",
  //   };

  //   return text.replace(/[&<>"']/g, function (m) {
  //     return map[m];
  //   });
  // }

  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "1550px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <ReactToPrint
              trigger={() => {
                return (
                  <Button variant="contained" color="primary">
                    Print
                  </Button>
                );
              }}
              content={() => ref.current}
              documentTitle="Lease Agreement"
              pagestyle="print"
            />
          </Box>
          <Box
            className="modal-content"
            mb={2}
            display="flex"
            flexDirection="column"
            // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
            height="700px" // fixed the height
            style={{
              display: "none",
              border: "0px solid black",
              overflow: "hidden",
              overflowY: "scroll", // added scroll
            }}
          ></Box>
          <div className="mb-3 text-left">
            <div className="display-space-between mb-2">
              <InputLabel className="pb-1">
                <Typography variant="caption">Customer</Typography>
              </InputLabel>
              <Link href={getRoute("customer")} target="_blank">
                <div className="flex-center">
                  <Icon className="me-2" fontSize="small">
                    person_add
                  </Icon>{" "}
                  <small>Add Customer</small>
                </div>
              </Link>
            </div>
            <Select
              labelId="demo-customized-select-label"
              className="input"
              placeholder="Select Customer"
              fullWidth
              name="customer"
              value={formState?.customer ?? "none"}
              onChange={onChangeInput}
              input={<InputBase />}
            >
              <MenuItem value="none">
                <em className="text-muted">Select Customer</em>
              </MenuItem>
              {customerOptions?.map((val, i) => {
                return (
                  <MenuItem key={val?.id} value={val}>
                    {val?.company}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          {/* Print layout */}
          <Box
            className="modal-content"
            mb={2}
            display="flex"
            flexDirection="column"
            // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
            height="700px" // fixed the height
            style={{
              display: "none",
              border: "0px solid black",
              overflow: "hidden",
              overflowY: "scroll", // added scroll
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <h3>Lease Agreement</h3>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <div className="mb-3 text-left">
                  <InputLabel className="pb-1">
                    <Typography variant="caption">effective_date</Typography>
                  </InputLabel>
                  <InputBase
                    name="title"
                    color="secondary"
                    className="input"
                    // value={formState?.title}
                    placeholder="Title"
                    // onChange={onChangeInput}
                    fullWidth
                  ></InputBase>
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <div
                  ref={ref}
                  style={{ margin: 10, backgroundColor: "#FFFFFF" }}
                >
                  <div style={{ backgroundColor: "#FFFFFF" }}>
                    <div style={{ textAlign: "left", marginLeft: 10 }}>
                      {" "}
                      <img style={{ height: 60 }} src="/images/logo.png" />
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "1.2em",
                        width: "100%",
                        backgroundColor: "#FFFFFF",
                        marginTop: 100,
                      }}
                    >
                      <b> {ladetail?.data?.company_name}</b>
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: 300,
                        width: "100%",

                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <b>
                        <i> {ladetail?.data?.title_en}</i>
                        <br />
                        {ladetail?.data?.title_idn}
                      </b>
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        marginTop: 300,
                        width: "100%",

                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <b>Lease No. {ladetail?.data?.lease_number}</b>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                        marginLeft: 10,
                        pageBreakBefore: "always",
                      }}
                    >
                      <img style={{ height: 60 }} src="/images/logo.png" />
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <b>
                        LAMPIRAN A/<i>APPENDIX A</i>
                      </b>
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <b>
                        <u>{appendixA?.title_appendix_a_idn}</u>/<br />
                        <i>{appendixA?.title_appendix_a_en}</i>
                      </b>
                    </div>
                    <div style={{ content: "" }}>
                      <div
                        style={{
                          float: "left",
                          textAlign: "justify",
                          width: "47%",
                        }}
                      >
                        {ReactHtmlParser(appendixA?.appendix_a_header_idn)}
                        <br />
                      </div>

                      <div
                        style={{
                          float: "right",
                          textAlign: "justify",
                          width: "47%",
                        }}
                      >
                        <i>
                          {ReactHtmlParser(appendixA?.appendix_a_header_en)}
                        </i>
                      </div>
                    </div>

                    <div style={{ content: "" }}>
                      <TableContainer>
                        <Table>
                          <TableBody>
                            {appendixA?.appendix_a_details?.map((res) => (
                              <TableRow>
                                <TableCell
                                  style={{
                                    borderTop: 1,
                                    borderLeft: 1,
                                    borderRight: 1,
                                    verticalAlign: "top",
                                  }}
                                >
                                  {res?.appendix_a_details_number}
                                </TableCell>
                                <TableCell style={{ verticalAlign: "top" }}>
                                  {ReactHtmlParser(res?.title_idn)}
                                  {"/"}
                                  <i>{ReactHtmlParser(res?.title_en)}</i>
                                </TableCell>
                                <TableCell style={{ verticalAlign: "top" }}>
                                  :
                                </TableCell>
                                <TableCell style={{ textAlign: "justify" }}>
                                  {ReactHtmlParser(res?.description_idn)}
                                  <br /> <br />
                                  <i>{ReactHtmlParser(res?.description_en)}</i>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
}
