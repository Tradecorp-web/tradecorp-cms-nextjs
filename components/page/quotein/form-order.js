import {
  Button,
  makeStyles,
  Modal,
  Box,
  Card,
  TextField,
  Grid,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Collapse,
  TableContainer,
  TableRow,
  TableCell,
  Table,
  TableHead,
  Chip,
  InputAdornment,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { Alert, AlertTitle, Autocomplete } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { Delete, Add, CallToAction, Edit } from "@material-ui/icons";

import {
  FileUploadSecureComponent,
  DropZoneComponent,
  FileUploadImageComponent,
} from "../../base_component/file-upload";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import {
  getListMasterSerialApi,
  getDetailFilterApi,
} from "../../../services/api/master-serial.api";

import { masterDataSwr } from "../../../services/swr/master-data.swr";
import { getDetailCustomerSwr } from "../../../services/swr/customer.swr";
import {
  generateSerial,
  genSerialFrCustom,
} from "../../../helpers/build-quote/generate";
import { downloadFileProcess } from "../../../helpers/build-quote/file";
import {
  getListCustomerApi,
  insertCustomerApi,
  insertFileCustomerLogoApi,
} from "../../../services/api/customer.api";
import { getSpecificationSwr } from "../../../services/swr/ref-specification.swr";
import {
  insertOrderQuoteApi,
  updateOrderQuoteApi,
} from "../../../services/api/order-quote.api";

import AlertDialog from "../../base_component/dialog";
import { getColorListApi } from "../../../services/api/color-codes.api";

import { v4 as uuid } from "uuid";
import { currency } from "../../../helpers/general";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  itemContainer: {
    textAlign: "center",
    position: "relative",
  },
}));

export default function UploadForm(props) {
  const quoteinId = props.quoteinId;
  var containerPrefixSwr = masterDataSwr("container_prefix", "alias");

  const classes = useStyles();
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
  const [openDetailPreSold, setOpenDetailPreSold] = useState(false);
  const [data, setData] = useState(false);
  const [dataInput, setDataInput] = useState([
    {
      pre_sale: null,
    },
  ]);

  const [color, setColor] = useState("");
  const [cscDescOpen, setCscDescOpen] = useState(false);
  const [custSaveDialog, setCustSaveDialog] = useState(false);
  const [newCustData, setNewCustData] = useState([]);
  const [newCust, setNewCust] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [series, setSeries] = useState(-1);
  const [prefix, setPrefix] = useState(true);
  const [seriesList, setSeriesList] = useState([]);
  const [seriesName, setSeriesName] = useState("");
  const [prefCustom, setPrefCustom] = useState(false);
  const [serialStart, setSerialStart] = useState("");
  const [serialEnd, setSerialEnd] = useState("");
  const [customer, setCustomer] = useState("");
  const [refCust, setRefCust] = useState([{ company: null }]);
  const [qty, setQty] = useState(0);
  const [refreshOrder, setRefreshOrder] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openFailAlert, setOpenFailAlert] = useState(false);
  const [inputList, setInputList] = useState([
    {
      id: null,
      unit_code: null,
      series: null,
      color: null,
      price: null,
      currency: null,
      quantity: null,
      container_number_from: null,
      container_number_to: null,
      pre_sale: null,
      order_quote_files: [],
      specification: [],
    },
  ]);

  const [sendDialog, setSendDialog] = useState(false);
  const [unitCode, setUnitCode] = useState("");
  const [listFile, setListFile] = useState(false);
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
  const [fileUpCompLogo, setFileUpCompLogo] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
    thumbnail: null,
  });
  const [fileUpCsc, setFileUpCsc] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
    thumbnail: null,
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
  const clickAddRow = () => {
    if (typeof specList === "undefined") {
      setSpecList([
        {
          specification_id: null,
          specification: null,
        },
      ]);
    } else {
      setSpecList([
        ...specList,
        {
          specification_id: null,
          specification: null,
        },
      ]);
    }
  };
  const clickRemoveRow = (i) => {
    var list = [...specList];
    list.splice(i, 1);
    setSpecList(list);
  };

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
    if (props?.actForm === "Update") {
      colorFill(props?.orderDataList[0]?.series);
      var currency = "";

      setOpenDetailPreSold(true);
      getPreSold("id", props?.orderDataList[0]?.pre_sale);
      props?.orderDataList[0]?.order_quote_files?.map((res) => {
        if (res.file_description == "company_logo") {
        } else {
          setFileUpCsc({
            file_id: res?.file_id,
            file_description: res?.file_description,
            link: res?.link,
            attachment: res?.attachment,
            content_type: res?.content_type,
            thumbnail: res?.thumbnail,
          });
        }
      });

      props?.quoteData?.container_details?.map((quote1) => {
        var unitCode =
          quote1.container_size_data?.name + quote1.container_type_data?.alias;

        if (unitCode == props?.orderDataList[0]?.unit_code) {
          currency = quote1.currency;
        }
      });

      props?.orderDataList?.push({
        currency: currency,
      });

      setInputList(props?.orderDataList);

      setDataInput({
        ...dataInput,
        label: props?.orderDataList[0]?.customer?.company,
        id: props?.orderDataList[0]?.pre_sale,
      });
      var colorTmp =
        props?.orderDataList[0]?.container_color?.name_english +
        "  " +
        props?.orderDataList[0]?.container_color?.ral_code;

      setColor(colorTmp);
      setSerialStart(props?.orderDataList[0]?.container_number_from);
      setSerialEnd(props?.orderDataList[0]?.container_number_to);

      // getSeries(props?.orderDataList[0]?.unit_code);
    } else {
      // alert(JSON.stringify(containerPrefixSwr));
      setSerialEnd("");
      setSerialStart("");

      setColor("");
      setInputList([
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
          specification: [],
        },
      ]);
      setDataInput({
        ...dataInput,
        label: null,
        id: null,
      });
      setSpecList([
        {
          specification_id: null,
          specification: null,
        },
      ]);
      setFileUpCompLogo({
        file_id: null,
        file_description: null,
        link: null,
        attachment: null,
        content_type: null,
      });
      setFileUpCsc({
        file_id: null,
        file_description: null,
        link: null,
        attachment: null,
        content_type: null,
      });
    }
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

  useEffect(async () => {
    var images = [];

    if (Array.isArray(props?.uploadListData?.fileData)) {
      props?.uploadListData?.fileData?.map((item, i) => {
        images.push({
          name: item.attachment,
          progress: 100,
          link: item.link,
          content_type: item.content_type,
          loading: -1,
        });
      });
    }
    if (Array.isArray(props?.uploadOtherListData?.otherFileData)) {
      props?.uploadOtherListData?.otherFileData?.map((item, i) => {
        images.push({
          name: item.label,
          progress: 100,
          link: item.link,
          content_type: item.content_type,
          loading: -1,
        });
      });
    }
    setListFile(images);

    var data = await getListCustomerApi();
    if (data.count > 0) {
      setRefCust(data.result);
    }
  }, [props?.open]);

  const reg = () => {
    props.uploadData(data);
  };
  const getData = (e) => {
    setData(e.target.value);
  };
  useEffect(async () => {
    var data = await getListCustomerApi();
    if (data.count > 0) {
      setRefCust(data.result);
    }
  }, [newCust]);
  const onUploaded = (res, fileInfo) => {
    if (res != null) {
      if (fileInfo == "company_logo") {
        setFileUpCompLogo({
          ...fileUpCompLogo,
          file_description: fileInfo,
          link: res.link,
          attachment: fileInfo + "_" + res.file_name,
          content_type: res.content_type,
          deleted_at: null,
          thumbnail: res.thumbnail,
        });
        setData({
          ...data,
          file_description: fileInfo,
          link: res.link,
          attachment: fileInfo + "_" + res.file_name,
          content_type: res.content_type,
          deleted_at: null,
          thumbnail: res.thumbnail,
        });
      } else {
        setFileUpCsc({
          ...fileUpCsc,
          file_description: fileInfo,
          link: res.link,
          attachment: fileInfo + "_" + res.file_name,
          content_type: res.content_type,
          deleted_at: null,
          thumbnail: res.thumbnail,
        });
        setData({
          ...data,
          file_description: fileInfo,
          link: res.link,
          attachment: fileInfo + "_" + res.file_name,
          content_type: res.content_type,
          deleted_at: null,
          thumbnail: res.thumbnail,
        });
      }
    } else {
      if (fileInfo == "company_logo") {
        setFileUpCompLogo({
          ...fileUpCompLogo,
          file_description: null,
          link: null,
          attachment: null,
          content_type: null,
          deleted_at: null,
          thumbnail: null,
        });
      } else {
        setFileUpCsc({
          ...fileUpCsc,
          file_description: null,
          link: null,
          attachment: null,
          content_type: null,
          deleted_at: null,
          thumbnail: null,
        });
      }
    }
  };

  const inputChange = (e, key) => {
    var list = [...inputList];
    list[key][e.target.name] = e.target.value;
    setInputList(list);
  };
  const inputSerialChange = (e, key) => {
    if (e.target.value.length == 10) {
      getSerialCustom(e.target.value.toUpperCase(), qty);
    } else {
      setSerialEnd("");
    }
    setSerialStart(e.target.value);
    var list = [...inputList];
    list[0]["container_number_start"] = e.target.value;
    setInputList(list);
  };

  const containerNumberChange = (e) => {
    if (e.target.value.length == 10) {
      getSerialCustom(e.target.value.toUpperCase(), qty);
    } else {
      setSerialEnd("");
    }
  };
  const onChangeUpload = (res, name) => {
    var result = [];
    res?.map((row, i) => {
      result.push({
        label: row.name,
        content_type: row.content_type,
        link: row.link,
        thumbnail: null,
      });
    });
    setFileUpOther({ ...fileUpOther, other_order_quote_files: result });
  };

  const saveOrderQuote = () => {
    setSaveDialog(true);
  };

  const saveOrder = async () => {
    setSaveDialog(false);
    var colorSet = color.split("  ");
    var ralColor = "";
    if (typeof colorSet[1] != "undefined") {
      ralColor = colorSet[1];
    }
    var order_quote_files = [];
    if (fileUpCompLogo.link != null) {
      order_quote_files.push(fileUpCompLogo);
    }
    if (fileUpCsc.link != null) {
      order_quote_files.push(fileUpCsc);
    }
    var listData = [];
    var id = "";
    var resSeries = -1;
    inputList?.map((res) => {
      if (prefCustom) {
        resSeries = 999;
      } else {
        resSeries = series;
      }
      id = res?.id;
      listData.push({
        master_id: res?.master_id,
        quote_in_id: quoteinId,
        container_id: res?.container_id,
        id: res?.id,
        unit_code: res?.unit_code,
        series: parseInt(resSeries),
        color: res?.color,
        price: parseFloat(res?.price),
        currency: props?.quoteData?.container_details?.currency,
        quantity: parseInt(res?.quantity),
        container_number_from: serialStart,
        container_number_to: serialEnd,
        pre_sale: res?.pre_sale,
        container_factory: props?.quoteData?.factory,
        container_factory_country_id: parseInt(props?.quoteData?.country_id),
        container_size: parseInt(res?.container_size),
        container_type: parseInt(res?.container_type),
        container_type_data: res?.container_type_data,
        quote_status: res?.quote_status,
        container_factory_city_id: parseInt(props?.quoteData?.city_id),
        container_size_data: res?.container_size_data,
        contract: res?.contract,
        order_quote_files: order_quote_files,
        other_order_quote_files: fileUpOther?.other_order_quote_files,
        other_specification: otherSpec,
        container_specifications: specList,
        csc_plate_description: res?.csc_plate_description,
        prefix: prefix,
      });
    });
    if (props?.actForm == "Add") {
      var saveData = await insertOrderQuoteApi(listData[0]).then(() => {
        setOpenAlert(true);
        setOpenFailAlert(false);
      });
    } else {
      var saveData = await updateOrderQuoteApi(id, listData[0]).then(() => {
        setOpenAlert(true);
        setOpenFailAlert(false);
      });
    }

    if (customerDetail.id != null && fileUpCompLogo.thumbnail != null) {
      insertFileCustomerLogoApi(customerDetail.id, fileUpCompLogo);
    }
  };

  const sendUpload = () => {
    props.uploadData(data, props?.keyRow);
    props.uploadOtherData(fileUpOther, props?.keyRow);
    setSendDialog(false);
  };
  const prefixChange = (e) => {
    setPrefix(e.target.value);
    if (unitCode != "") {
      getSeries(unitCode, e.target.value);
    }
    if (e.target.value == "Custom") {
      setPrefCustom(true);
    } else {
      setPrefCustom(false);
    }
  };
  const unitCodeChange = (e) => {
    var containers = e.target.value;
    var container = containers.split("|");
    var uContainerId = container[0];
    var uContainerSize = container[1];
    var uContainerSizeName = container[2];
    var uContainerType = container[3];
    var uContainerTypeAlias = container[4];
    var uContainerTypeName = container[5];
    var uCodeUnitCode = uContainerSizeName + uContainerTypeAlias;

    var data = [props?.quoteData];
    var i = 0;
    var price = 0;
    var currency = "";
    data.map((res, key) => {
      for (i = 0; i <= res.container_details.length - 1; i++) {
        if (
          res.container_details[i].container_type == uContainerType &&
          res.container_details[i].container_size == uContainerSize
        ) {
          price = res.container_details[i].price;
          currency = res.container_details[i].currency;
        }
      }
    });

    var list = [...inputList];
    list[0]["container_id"] = uContainerId;
    list[0]["container_type"] = uContainerType;
    list[0]["container_type_data"] = uContainerTypeName;
    list[0]["container_size_data"] = uContainerSizeName;
    list[0]["container_size"] = uContainerSize;
    list[0]["unit_code"] = uCodeUnitCode;
    list[0]["price"] = price;
    list[0]["currency"] = currency;

    setUnitCode(uCodeUnitCode);
    getSeries(uCodeUnitCode, prefix);
    setColorEnable(uCodeUnitCode);
    setInputList(list);
  };

  const getSeries = async (uCodeUnitCode, uPrefix) => {
    var seriesList = await getListMasterSerialApi(uCodeUnitCode, "*", uPrefix);
    var vSeries = [];
    var def = "";
    seriesList?.result?.map((res) => {
      if (def != res?.series) {
        vSeries.push({
          series: res?.series,
        });
        def = res?.series;
      }
    });

    setSeriesList(vSeries);
  };
  useEffect(async () => {
    try {
      var dataColor = [];
      var res = await getColorListApi("", "name_english");
      res?.map((res) => {
        dataColor.push({
          ral_code: res?.ral_code,
          html_code: res?.html_code,
          name_english: res?.name_english,
          series: -1,
        });
      });
      setColorList(dataColor);
    } catch (err) {
      console.log(err);
    }
  }, [refreshOrder]);

  async function setColorEnable(unitCode) {
    var dataColorOrigin = [];

    var res = await getColorListApi("", "name_english");
    res?.map((res) => {
      dataColorOrigin.push({
        ral_code: res?.ral_code,
        html_code: res?.html_code,
        name_english: res?.name_english,
        series: -1,
      });
    });

    var colorData = await getListMasterSerialApi(unitCode, "*");
    var colorDataMisc = await getListMasterSerialApi("*", "Miscellaneous");
    var colorDataAllC = await getListMasterSerialApi("*", "Allcolours");

    var colorTmp = [];

    dataColorOrigin?.map((res) => {
      var vSeries = -1;

      if (res?.ral_code == "All Colours") {
        var x = colorDataAllC?.result?.filter(
          ({ ral_colour }) => ral_colour === res?.ral_code
        );
        if (x.length > 0) {
          x?.map((res2) => {
            if (res2.unit_code == unitCode) {
              vSeries = res2.series;
            } else {
              vSeries = -1;
            }
            colorTmp.push({
              ral_code: res2?.ral_colour,
              html_code: null,
              name_english: res2?.ral_colour,
              series: vSeries,
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
              vSeries = res2.series;
            } else {
              vSeries = -1;
            }
            colorTmp.push({
              ral_code: res2?.ral_colour,
              html_code: null,
              name_english: res2?.ral_colour,
              series: vSeries,
            });
          });
        }
      } else {
        var x = colorData?.result?.find(
          ({ ral_colour }) => ral_colour === res?.ral_code
        );

        if (typeof x != "undefined") {
          vSeries = x?.series;
        } else {
          vSeries = -1;
        }
        colorTmp.push({
          ral_code: res?.ral_code,
          html_code: res?.html_code,
          name_english: res?.name_english,
          series: vSeries,
        });
      }
    });
    setColorList(colorTmp);
  }

  const colorChange = (e, v) => {
    if (v != null) {
      var val = v.split("  ");
      var list = [...inputList];
      list[0]["color"] = val[1];

      var colorTmp = val[0] + "  " + val[1];
      setColor(colorTmp);
      setInputList(list);
    }
  };

  const preSold = (e, val) => {
    var list = [...inputList];
    if (val != null) {
      list[0]["pre_sale"] = val.id;
      setDataInput({
        label: val.label,
        id: val.id,
      });
    }

    setInputList(list);
  };

  const saveCustomer = () => {
    insertCustomerApi(newCustData).then((res) => {
      var list = [...inputList];
      list[0]["pre_sale"] = res.id;
      setInputList(list);
      setNewCust(true);
    });
    setNewCust(false);
    setCustSaveDialog(false);
  };
  const preSoldCheck = (value) => {
    var flag = false;
    flag = getPreSold("company", value);

    if (!flag) {
      setDataInput({
        label: value,
        id: null,
      });
      var dataCust = {
        company: value,
      };
      setCustomerDetail({
        name: "-",
        address: "-",
        company: value,
        phone: "",
        email: "",
      });
      setNewCustData(dataCust);
      setCustSaveDialog(true);
    }
  };
  const qtyChange = (e, key) => {
    setQty(e.target.value);
    setSerialNumber(e.target.value, series);
    // getSerial(unitCode, color, e.target.value, key, series);
  };
  const setSerialNumber = (vQty, vSeries) => {
    setQty(vQty);
    var list = [...inputList];
    list[0]["quantity"] = vQty;
    setInputList(list);

    if (prefCustom) {
      if (vQty == 1) {
        setSerialEnd(list[0].container_number_start);
      } else {
        if (list[0].container_number_start != null) {
          getSerialCustom(list[0].container_number_start.toUpperCase(), vQty);
        }
      }
    } else {
      getSerial(unitCode, color, vQty, 0, vSeries);
    }
  };

  const getSerial = async (u, c, q, key, serial) => {
    var list = [...inputList];
    var x = await generateSerial(u, c, q, serial, prefix);

    if (x != false) {
      list[key]["container_number_from"] = x[0].serial_start;
      list[key]["container_number_to"] = x[0].serial_end;
      list[key]["master_id"] = x[0].id;
      setSerialStart(x[0].serial_start);
      setSerialEnd(x[0].serial_end);
      setInputList(list);
    }
  };
  const getSerialCustom = (serial, quantity) => {
    var x = genSerialFrCustom(serial.toUpperCase(), quantity);
    if (x != false) {
      setSerialStart(serial);
      setSerialEnd(x[0].serial_end);
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
  const onChangeSeries = async (vSeries) => {
    var list = [...inputList];

    if (prefCustom) {
      list[0]["container_number_from"] = "";
      list[0]["container_number_to"] = "";
      list[0]["master_id"] = null;
      setSerialStart("");
      setSerialEnd("");
      setInputList(list);
    }

    setSeries(vSeries);
    setSerialNumber(qty, vSeries);
    colorFill(vSeries);
  };
  const downloadFile = (link) => {
    downloadFileProcess(link);
  };
  const closeForm = () => {
    props?.closeModal();
  };

  async function colorFill(vSeries) {
    setSeries(vSeries);
    var dataColor = await getDetailFilterApi("series", vSeries);
    setSeriesName("");
    var dataColorArr = [];
    var flag = false;
    dataColor?.result[0]?.container_ral_color?.map((res) => {
      var colorTmp = res?.name_english + "  " + res?.ral_code;
      setColor(colorTmp);
      if (res?.name_english != "All Colours") {
        dataColorArr.push({
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
          series: res?.series,
        });
        setSeriesName(res?.name_english);
      } else {
        setSeriesName(res?.ral_code);
        flag = true;
      }
    });

    if (flag || prefCustom) {
      var res = await getColorListApi("", "name_english");
      res?.map((res) => {
        dataColorArr.push({
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
          series: vSeries,
        });
      });
    }
    setColorList(dataColorArr);
  }
  function getPreSold(id, value) {
    var flag = false;
    var found = [];
    if (id == "id") {
      found = refCust.find((element) => element.id == value);
    } else {
      found = refCust.find((element) => element.company == value);
    }

    if (found) {
      flag = true;
      setCustomerDetail({
        id: found.id,
        name: found.name,
        address: found.address,
        company: found.company,
        phone: found.phone_number,
        email: found.email,
        logoThumbnail: null,
        logoAttachment: "",
        logoLink: "",
      });
      if (found.customer_logo_file != null) {
        if (
          typeof found.customer_logo_file[0] == "undefined" ||
          found.customer_logo_file == null
        ) {
          setFileUpCompLogo({
            file_id: null,
            file_description: null,
            link: null,
            attachment: null,
            content_type: null,
            deleted_at: null,
            thumbnail: null,
          });
        } else {
          setFileUpCompLogo({
            file_id: found.customer_logo_file[0].file_id,
            file_description: found.customer_logo_file[0].file_description,
            link: found.customer_logo_file[0].link,
            attachment: found.customer_logo_file[0].attachment,
            content_type: found.customer_logo_file[0].content_type,
            deleted_at: found.customer_logo_file[0].deleted_at,
            thumbnail: found.customer_logo_file[0].thumbnail,
          });
        }
      }

      setOpenDetailPreSold(true);
    } else {
      setCustomerDetail({
        id: null,
        name: null,
        address: null,
        company: null,
        phone: null,
        email: null,
        logoThumbnail: null,
        logoAttachment: "",
        logoLink: "",
      });
      setFileUpCompLogo({
        file_id: null,
        file_description: null,
        link: null,
        attachment: null,
        content_type: null,
        deleted_at: null,
        thumbnail: null,
      });
    }
    return flag;
  }
  return (
    <Modal open={props?.open} onClose={closeForm}>
      <Box className="modal-wrapper" style={{ width: "90%" }}>
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
            <Grid container>
              <Grid item xs={6}>
                <h3>
                  {props.actForm}
                  {" Order Quote"}
                </h3>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <h3>
                  Quote Number {" : "}
                  {props.quoteData?.quote_in_number}
                </h3>
              </Grid>
            </Grid>

            {/* <TextField onClick={(e) => getData(e)}></TextField>
            <Button onClick={reg}>Register</Button> */}
          </Box>
          <Box className="modal-content">
            <Grid container>
              <Grid item xs={4}>
                <Card style={{ marginRight: 10 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ textAlign: "center" }}>
                            Type
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            Size
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            Qty
                          </TableCell>
                          <TableCell style={{ textAlign: "right" }}>
                            Price
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      {props?.quoteData?.container_details?.map((res) => (
                        <TableRow>
                          <TableCell
                            style={{
                              borderBottom: "none",
                              textAlign: "center",
                            }}
                          >
                            {res?.container_type_data?.name}
                          </TableCell>
                          <TableCell
                            style={{
                              borderBottom: "none",
                              textAlign: "center",
                            }}
                          >
                            {res?.container_size_data?.name}
                            {res?.container_type_data?.alias}
                          </TableCell>
                          <TableCell
                            style={{ borderBottom: "none", textAlign: "right" }}
                          >
                            {res?.quantity}
                          </TableCell>
                          <TableCell
                            style={{ borderBottom: "none", textAlign: "right" }}
                          >
                            {res?.price} {res?.currency}
                          </TableCell>
                        </TableRow>
                      ))}
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>
              <Grid item xs={8}>
                <Grid container>
                  <Grid item xs={6}>
                    <div className="mb-3 text-left">
                      {props?.actForm === "Update" && (
                        <TextField
                          labelId="demo-controlled-open-select-label"
                          id="prefix"
                          name="prefix"
                          variant="outlined"
                          fullWidth
                          value={inputList[0]?.prefix}
                          label="Prefix"
                          InputLabelProps={{ shrink: true }}
                        ></TextField>
                      )}
                      {props?.actForm === "Add" && (
                        <TextField
                          select
                          labelId="demo-controlled-open-select-label"
                          id="prefix"
                          name="prefix"
                          variant="outlined"
                          fullWidth
                          label="Prefix"
                          InputLabelProps={{ shrink: true }}
                          onChange={(e) => prefixChange(e)}
                        >
                          {containerPrefixSwr?.data?.map((res) => (
                            <MenuItem key={res?.alias} value={res?.alias}>
                              {res?.alias}
                            </MenuItem>
                          ))}
                          <MenuItem key="custom" value="Custom">
                            Custom
                          </MenuItem>
                        </TextField>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="mb-3 text-left">
                      {props?.actForm === "Update" && (
                        <TextField
                          labelId="demo-controlled-open-select-label"
                          id="unit_code"
                          name="unit_code"
                          variant="outlined"
                          fullWidth
                          value={inputList[0]?.unit_code}
                          label="Unit Code"
                          InputLabelProps={{ shrink: true }}
                        ></TextField>
                      )}
                      {props?.actForm === "Add" && (
                        <TextField
                          select
                          labelId="demo-controlled-open-select-label"
                          id="unit_code"
                          name="unit_code"
                          variant="outlined"
                          fullWidth
                          label="Unit Code"
                          InputLabelProps={{ shrink: true }}
                          onChange={(e) => unitCodeChange(e)}
                        >
                          {props?.quoteData?.container_details?.map((res) => (
                            <MenuItem
                              key={
                                res?.container_size_data?.name +
                                res?.container_type_data?.alias
                              }
                              value={
                                res?.container_id +
                                "|" +
                                res?.container_size_data?.id +
                                "|" +
                                res?.container_size_data?.name +
                                "|" +
                                res?.container_type_data?.id +
                                "|" +
                                res?.container_type_data?.alias +
                                "|" +
                                res?.container_type_data?.name
                              }
                            >
                              {res?.container_size_data?.name +
                                res?.container_type_data?.alias}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    </div>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12} mt={10}>
                    <FormControl
                      component="fieldset"
                      style={{ marginBottom: 10 }}
                    >
                      <FormLabel
                        component="legend"
                        style={{ display: prefCustom ? "none" : "" }}
                      >
                        Series{" "}
                        {props?.actForm === "Update"
                          ? "[ " + inputList[0]?.series + " ]"
                          : ""}
                      </FormLabel>
                      {props?.actForm === "Add" && (
                        <RadioGroup
                          row
                          aria-label="series"
                          name="series"
                          defaultValue={inputList[0]?.series}
                        >
                          {seriesList?.map((res) => (
                            <FormControlLabel
                              value={res?.series}
                              control={<Radio color="primary" />}
                              label={res?.series}
                              labelPlacement="top"
                              onChange={() => onChangeSeries(res?.series)}
                            />
                          ))}
                          {/* <FormControlLabel
                            value="999"
                            control={<Radio color="primary" />}
                            label="Custom"
                            labelPlacement="top"
                            onChange={() => onChangeSeries("999")}
                          /> */}
                        </RadioGroup>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} mt={10}>
                    <div className="mb-3 text-left">
                      <Autocomplete
                        options={colorList?.map(
                          (option) =>
                            option.name_english + "  " + option.ral_code
                        )}
                        autoHighlight
                        defaultValue={color}
                        onChange={(e, v) => colorChange(e, v)}
                        renderOption={(option) => (
                          <Chip
                            label={option}
                            style={{
                              backgroundColor: colorList.filter(
                                (val) =>
                                  val.name_english + "  " + val.ral_code ==
                                  option
                              )[0].html_code,
                              width: 250,
                            }}
                          />
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Color Name"
                            name="color_name"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                          />
                        )}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} mt={10}>
                    <div className="mb-3 text-left">
                      {props?.actForm === "Update" && (
                        <TextField
                          name="quantity"
                          id="quantity"
                          value={inputList[0]?.quantity}
                          variant="outlined"
                          label="Quantity"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                        />
                      )}
                      {props?.actForm === "Add" && (
                        <TextField
                          name="quantity"
                          id="quantity"
                          value={inputList[0]?.quantity}
                          onChange={(e) => qtyChange(e, 0)}
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
                          value={
                            props?.actForm == "Update"
                              ? inputList[0]?.container_number_from
                              : serialStart
                          }
                          // value={serialStart}
                          // value={row?.container_number_from}
                          onChange={(e) => inputSerialChange(e, 0)}
                          onBlur={(e) => containerNumberChange(e)}
                          disabled={prefCustom ? false : true}
                          variant="outlined"
                          label="Container Number Start"
                          inputProps={{
                            style: {
                              textTransform: "uppercase",
                            },
                            maxLength: 10,
                          }}
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
                          value={
                            props?.actForm == "Update"
                              ? inputList[0]?.container_number_to
                              : serialEnd
                          }
                          // value={serialEnd}
                          onChange={(e) => inputSerialChange(e, 0)}
                          disabled={prefCustom ? false : true}
                          variant="outlined"
                          label="Container Number TO"
                          inputProps={{
                            style: { textTransform: "uppercase" },
                          }}
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
                        name="price"
                        id="price"
                        variant="outlined"
                        type="number"
                        value={inputList[0].price}
                        onChange={(e) => inputChange(e, 0)}
                        label="Price"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {props?.actForm == "Add"
                                ? inputList[0]?.currency
                                : props?.orderDataList[1]?.currency}
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} mt={10}>
                    <div className="mb-3 text-left">
                      <Autocomplete
                        id="combo-box-demo"
                        options={refCust?.map((option) => ({
                          label: option.company,
                          id: option.id,
                        }))}
                        value={dataInput}
                        getOptionLabel={(option) => option.label}
                        onChange={(v, val) => preSold(v, val)}
                        onBlur={(v) => {
                          preSoldCheck(v.target.value);
                        }}
                        //    defaultValue={row?.pre_sale}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            label="Pre Sold"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                    </div>
                  </Grid>
                  <Collapse in={openDetailPreSold} timeout="auto" unmountOnExit>
                    <Box className="mb-3 mt-3">
                      <Grid
                        container
                        spacing={4}
                        justify="center"
                        alignItems="center"
                        className={classes.company}
                      >
                        <Grid item xs={2} sm={2}>
                          <Typography variant="h5">Company Name</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                          {customerDetail.company}
                        </Grid>
                        <Grid item xs={2} sm={2}>
                          <Typography variant="h5">Contact Person</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                          {customerDetail.name}
                        </Grid>
                        <Grid item xs={2} sm={2}>
                          <Typography variant="h5">Phone</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                          {customerDetail.phone}
                        </Grid>
                        <Grid item xs={2} sm={2}>
                          <Typography variant="h5">Email</Typography>
                        </Grid>
                        <Grid item xs={4} sm={4}>
                          {customerDetail.email}
                        </Grid>
                        <Grid item xs={2} sm={2}>
                          <Typography variant="h5">Address</Typography>
                        </Grid>
                        <Grid item xs={10} sm={10}>
                          {customerDetail.address}
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                  <Box>
                    <Box
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
                            Logo
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
                          <Typography
                            variant="h4"
                            component="h4"
                            style={{
                              wordWrap: "anywhere",
                              marginLeft: "0px",
                            }}
                          >
                            {fileUpCompLogo?.attachment}
                          </Typography>
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
                          <Typography
                            variant="h4"
                            component="h4"
                            style={{
                              wordWrap: "anywhere",
                              marginLeft: "0px",
                            }}
                          >
                            {fileUpCsc?.attachment}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Grid>

                <Divider></Divider>
                <Grid container style={{ marginTop: 20 }}>
                  <Grid item xs={4}>
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "bold", fontSize: ".8em" }}
                      color="textSecondary"
                      component="p"
                    >
                      Upload Company Logo
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <FileUploadImageComponent
                      label="Company Logo"
                      id="company_logo"
                      path="customer/logo"
                      fileUploaded={(res) => onUploaded(res, "company_logo")}
                      url={fileUpCompLogo.link}
                      deleteFile={() => onUploaded(null, "company_logo")}
                      thumbnail={fileUpCompLogo.thumbnail}
                    />
                  </Grid>
                </Grid>
                <Grid container style={{ marginTop: 10 }}>
                  <Grid item xs={2}>
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "bold", fontSize: ".8em" }}
                      color="textSecondary"
                      component="p"
                    >
                      Upload CSC
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setCscDescOpen(true)}
                    >
                      CSC Description
                    </Button>
                  </Grid>
                  <Grid item xs={8}>
                    <FileUploadImageComponent
                      label="CSC Certified"
                      id="csc_certified"
                      path="order_quote/csc_certified"
                      fileUploaded={(res) => onUploaded(res, "csc_certified")}
                      url={fileUpCsc.link}
                      deleteFile={() => onUploaded(null, "csc_certified")}
                      thumbnail={fileUpCsc.thumbnail}
                    />
                  </Grid>
                </Grid>
                <Grid container style={{ marginTop: 10 }}>
                  <Grid item xs={12}>
                    <InputLabel shrink={true}>Images / Files</InputLabel>
                    <DropZoneComponent
                      id="images"
                      exportList={(res) =>
                        onChangeUpload(res, "other_order_quote_files")
                      }
                      data={listFile}
                      path="order_quote"
                    />
                  </Grid>
                </Grid>
                <div className="mt-3 mb-3 text-left">
                  <Divider></Divider>
                </div>
                {specList?.map((res, key) => (
                  <Grid
                    container
                    spacing={0}
                    justify="center"
                    alignItems="center"
                  >
                    <React.Fragment>
                      <Grid item xs={11}>
                        <Autocomplete
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
                      <Grid item xs={1} sm={1}>
                        {key != 0 && (
                          <IconButton>
                            <Delete onClick={() => clickRemoveRow(key)} />
                          </IconButton>
                        )}
                      </Grid>
                    </React.Fragment>
                  </Grid>
                ))}
                <Grid
                  container
                  spacing={0}
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={12} sm={12}>
                    <Button variant="outlined" color="secondary">
                      <Add onClick={() => clickAddRow()} />
                    </Button>
                  </Grid>
                </Grid>
                <Grid container style={{ marginTop: 20 }}>
                  <Grid item xs={12}>
                    <TextField
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
              </Grid>
            </Grid>
          </Box>
          <Box className="modal-footer">
            <Grid container>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  onClick={saveOrderQuote}
                  color="primary"
                  autoFocus
                >
                  {props?.actForm}
                </Button>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
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
        <AlertDialog
          open={saveDialog}
          cancelAction={() => setSaveDialog(false)}
          okAction={() => saveOrder()}
          title="Save confirmation"
          body="Save data order ?"
        />
        <AlertDialog
          open={sendDialog}
          cancelAction={() => setSendDialog(false)}
          okAction={() => sendUpload()}
          title="Close confirmation"
          body="Close upload form ?"
        />
        <AlertDialog
          open={custSaveDialog}
          cancelAction={() => setCustSaveDialog(false)}
          okAction={() => saveCustomer()}
          title="Save customer confirmation"
          body="Save new Customer ?"
        />

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
