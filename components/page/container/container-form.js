import {
  Button,
  Card,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  FormControl,
  makeStyles,
  LinearProgress,
  IconButton,
  Icon,
  Link,
  Tooltip,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState, createRef } from "react";
import {
  dateFormatInput,
  isPermit,
  checkNull,
  checkDigitGenerator,
} from "../../../helpers/general";
import {
  insertContainerApi,
  updateContainerApi,
  saveContainerApi,
} from "../../../services/api/container-stocks.api";
import { getColorListApi } from "../../../services/api/color-codes.api";
import { getListDepoApi } from "../../../services/api/depo.api";
import { masterDataSwr } from "../../../services/swr/master-data.swr";
import {
  getCountryListSwr,
  getCityListSwr,
  getCurrencyListSwr,
} from "../../../services/swr/countries-cities.swr";
import { getCurrencyListApi } from "../../../services/api/countries-cities.api";
import { CircularProgressCustom } from "../../base_component/spinner";
import {
  FileUploadSecureComponent,
  DropZoneComponent,
} from "../../base_component/file-upload";
import { DropzoneArea } from "material-ui-dropzone";
import {
  uploadFileSecListenerApi,
  deleteFileApi,
  downloadFileSecApi,
} from "../../../services/api/file.api";

const useStyles = makeStyles((theme) => ({
  progress: {
    marginTop: theme.spacing(2),
  },
  pbar: {
    display: "flex",
  },
}));

export default function StockContainerForm(props) {
  const classes = useStyles();

  const [data, setData] = useState({
    id: null,
    serial_number: null,
    size_id: null,
    teu: null,
    type_id: null,
    stock_depo_id: null,
    depo_id: null,
    color_name: null,
    color_code: null,
    stock_status_id: null,
    available_status: [],
    repair_status_id: null,
    condition_id: null,
    percentage: null,
    yom_month: null,
    yom_year: null,
    date_in_stock: null,
    date_out_stock: null,
    gate_in_date: null,
    gate_out_date: null,
    delivery_status_id: null,
    country_id: null,
    selected_country: null,
    city_id: null,
    selected_city: null,
    cost_currency: null,
    cost_price: null,
    depo_fee_currency: null,
    depo_fee_cost: null,
    survey_currency: null,
    survey_cost: null,
    trucking_currency: null,
    trucking_cost: null,
    shipping_currency: null,
    shipping_cost: null,
    custom_clearance_currency: null,
    custom_clearance_cost: null,
    selling_currency: null,
    selling_price: null,
    carrier: null,
    one_way_ref: null,
    supplier_invoice: null,
    supplier_release: null,
    depo_release: null,
    csc_certificates: [],
    owner: null,
    images: [],
    redelivery_ref: null,
    destination_depo_id: null,
    stock_reconcile: null,
    specifications: [],
    contracts: [],
    invoices: [],
    drawings: [],
    surveys: [],
    relative_documents: [],
    original_photos: [],
    remarks: null,
  });
  const [newData, setNewData] = useState(false);
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState({ formTitle: "", buttonTitle: "" });
  const [genButton, setGenButton] = useState(false);
  const [serialLock, setSerialLock] = useState(false);

  const router = useRouter();
  const depoId = props?.depoId;

  const [depoOptions, setDepoOptions] = useState([]);
  const [containerTypeOptions, setContainerTypeOptions] = useState([]);
  const [conditionOptions, setConditionOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [repairOptions, setRepairOptions] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);

  const [cityParam, setCityParam] = useState(102);
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const [colorList, setColorList] = useState(null);

  const [listFile, setListFile] = useState({
    images: [],
    csc_certificates: [],
    specifications: [],
    contracts: [],
    invoices: [],
    drawings: [],
    surveys: [],
    relative_documents: [],
    original_photos: [],
  });

  const sellingPrice = isPermit("component", "selling_price_container");
  const costPrice = isPermit("component", "cost_price_container");

  const isAdmin = isPermit("menu", "admin");

  var masterSwr = masterDataSwr("");
  useEffect(() => {
    if (masterSwr?.data) {
      setContainerTypeOptions(
        masterSwr?.data?.filter((val) => val?.category == "container_type") ??
          []
      );
      setConditionOptions(
        masterSwr?.data?.filter((val) => val?.category == "condition") ?? []
      );
      setStatusOptions(
        masterSwr?.data?.filter((val) => val?.category == "stock_status") ?? []
      );
      setSizeOptions(
        masterSwr?.data?.filter((val) => val?.category == "container_size") ??
          []
      );
      setRepairOptions(
        masterSwr?.data?.filter((val) => val?.category == "status_repair") ?? []
      );
      setDeliveryOptions(
        masterSwr?.data?.filter((val) => val?.category == "delivery") ?? []
      );
    }
  }, [masterSwr?.data]);

  useEffect(() => {
    getListDepoApi({
      page: 1,
      limit: 200,
      orderBy: "name",
      order: "asc",
      // depoPartnerId: depoId
    }).then((res) => {
      setDepoOptions(res?.result ?? []);
    });
  }, []);

  useEffect(async () => {
    try {
      var res = await getColorListApi();
      setColorList(res);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(async () => {
    try {
      var res = await getCurrencyListApi();
      setCurrencyOptions(res);
    } catch (err) {
      console.log(err);
    }
  }, []);

  var countrySwr = getCountryListSwr("");
  useEffect(() => {
    if (countrySwr?.data) {
      var list = [];
      list.push({ id: "", label: "" });
      countrySwr.data.map((item, i) => {
        list.push({ id: item.id, label: item.name });
      });
      setCountryList(countrySwr.data);
      setCountryOptions(list);
    }
  }, [countrySwr?.data]);

  var citySwr = getCityListSwr(cityParam);
  useEffect(() => {
    if (citySwr?.data) {
      var city = [...cityOptions];
      var list = [];
      citySwr.data.cities.map((item, i) => {
        list.push({ id: item.id, label: item.name });
      });
      city[cityParam] = { id: cityParam, cities: list };
      setCityOptions(city);
      if (cityParam == 102) {
        // Australia
        setCityParam(14);
      } else if (cityParam == 14) {
        // Hong Kong
        setCityParam(98);
      } else if (cityParam == 98) {
        // US
        setCityParam(233);
      }
    }
  }, [citySwr?.data]);

  // var currencySwr = getCurrencyListSwr()
  // useEffect(() => {
  //     if (currencySwr?.data) {
  //         var curr = []
  //         curr.push({ id: "", label: "" })
  //         currencySwr.data.map((item, i) => {
  //           curr.push({ id: item.currency, label: item.currency })
  //         })
  //         setCurrencyOptions(curr)
  //     }
  // }, [currencySwr?.data])

  useEffect(() => {
    if (!active) {
      if (props?.open) {
        setActive(true);
      }
      if (props?.data != null) {
        var selectCountry = null;
        var selectCity = null;
        // var selectCostCurr = null
        // var selectSellCurr = null
        if (
          props.data.country_id != null &&
          props.data.country_id != undefined &&
          props.data.country_id > 0
        ) {
          countryOptions.map((item, i) => {
            if (item.id == props.data.country_id) {
              selectCountry = item;
            }
          });
          if (props.data.city_id != null && props.data.city_id > 0) {
            var city = [...cityOptions];
            if (city[props.data.country_id] == undefined) {
              setCityParam(props.data.country_id);
            }
            city[props.data.country_id]?.cities.map((item, i) => {
              if (item.id == props.data.city_id) {
                selectCity = item;
              }
            });
          }
        }
        // if (props.data.cost_currency != null && props.data.cost_currency != undefined) {
        //     currencyOptions.map((item,i) => {
        //         if (item.id == props.data.cost_currency) {
        //             selectCostCurr = item
        //         }
        //     })
        //     if (selectCostCurr == null) {
        //         selectCostCurr = { id: "USD", label: "USD" }
        //     }
        // } else {
        //     if (selectCostCurr == null) {
        //         selectCostCurr = { id: "USD", label: "USD" }
        //     }
        // }
        // if (props.data.selling_currency != null && props.data.selling_currency != undefined) {
        //     currencyOptions.map((item,i) => {
        //         if (item.id == props.data.selling_currency) {
        //             selectSellCurr = item
        //         }
        //     })
        //     if (selectSellCurr == null) {
        //         selectSellCurr = { id: "USD", label: "USD" }
        //     }
        // } else {
        //     if (selectSellCurr == null) {
        //         selectSellCurr = { id: "USD", label: "USD" }
        //     }
        // }
        if (Array.isArray(props.data.available_status)) {
          var temp = { sale_stock: false, lease_stock: false };
          if (props.data.available_status.includes("Sale Stock")) {
            temp.sale_stock = true;
          }
          if (props.data.available_status.includes("Lease Stock")) {
            temp.lease_stock = true;
          }
          setState(temp);
        }
        var images = [];
        var csc_certificates = [];
        var specifications = [];
        var contracts = [];
        var invoices = [];
        var drawings = [];
        var surveys = [];
        var relative_documents = [];
        var original_photos = [];
        if (Array.isArray(props.data.images)) {
          props.data.images.map((item, i) => {
            images.push({
              name: item.label,
              progress: 100,
              link: item.link,
              content_type: item.content_type,
              loading: -1,
            });
          });
        }
        if (Array.isArray(props.data.csc_certificates)) {
          props.data.csc_certificates.map((item, i) => {
            csc_certificates.push({
              name: item.label,
              progress: 100,
              link: item.link,
              content_type: item.content_type,
              loading: -1,
            });
          });
        }
        if (Array.isArray(props.data.specifications)) {
          props.data.specifications.map((item, i) => {
            specifications.push({
              name: item.label,
              progress: 100,
              link: item.link,
              content_type: item.content_type,
              loading: -1,
            });
          });
        }
        if (Array.isArray(props.data.contracts)) {
          props.data.contracts.map((item, i) => {
            contracts.push({
              name: item.label,
              progress: 100,
              link: item.link,
              content_type: item.content_type,
              loading: -1,
            });
          });
        }
        if (Array.isArray(props.data.invoices)) {
          props.data.invoices.map((item, i) => {
            invoices.push({
              name: item.label,
              progress: 100,
              link: item.link,
              content_type: item.content_type,
              loading: -1,
            });
          });
        }
        if (Array.isArray(props.data.drawings)) {
          props.data.drawings.map((item, i) => {
            drawings.push({
              name: item.label,
              progress: 100,
              link: item.link,
              content_type: item.content_type,
              loading: -1,
            });
          });
        }
        if (Array.isArray(props.data.surveys)) {
          props.data.surveys.map((item, i) => {
            surveys.push({
              name: item.label,
              progress: 100,
              link: item.link,
              content_type: item.content_type,
              loading: -1,
            });
          });
        }
        if (Array.isArray(props.data.relative_documents)) {
          props.data.relative_documents.map((item, i) => {
            relative_documents.push({
              name: item.label,
              progress: 100,
              link: item.link,
              content_type: item.content_type,
              loading: -1,
            });
          });
        }
        if (Array.isArray(props.data.original_photos)) {
          props.data.original_photos.map((item, i) => {
            original_photos.push({
              name: item.label,
              progress: 100,
              link: item.link,
              content_type: item.content_type,
              loading: -1,
            });
          });
        }
        setListFile({
          images: images,
          csc_certificates: csc_certificates,
          specifications: specifications,
          contracts: contracts,
          invoices: invoices,
          drawings: drawings,
          surveys: surveys,
          relative_documents: relative_documents,
          original_photos: original_photos,
        });
        setData({
          id: props.data.id,
          serial_number: props.data.serial_number,
          size_id: props.data.size_id,
          teu: props.data.teu,
          type_id: props.data.type_id,
          stock_depo_id: props.data.stock_depo_id,
          depo_id: props.data.depo_id,
          color_name: props.data.color_name,
          color_code: props.data.color_code,
          stock_status_id: props.data.stock_status_id,
          available_status: props.data.available_status,
          repair_status_id: props.data.repair_status_id,
          condition_id: props.data.condition_id,
          percentage: props.data.percentage,
          yom_month: props.data.yom_month,
          yom_year: props.data.yom_year,
          date_in_stock: props.data.date_in_stock,
          date_out_stock: props.data.date_out_stock,
          gate_in_date: props.data.gate_in_date,
          gate_out_date: props.data.gate_out_date,
          delivery_status_id: props.data.delivery_status_id,
          country_id: props.data.country_id,
          selected_country: selectCountry,
          city_id: props.data.city_id,
          selected_city: selectCity,
          cost_currency: props.data.cost_currency,
          cost_price: props.data.cost_price,
          depo_fee_currency: props.data.depo_fee_currency,
          depo_fee_cost: props.data.depo_fee_cost,
          survey_currency: props.data.survey_currency,
          survey_cost: props.data.survey_cost,
          trucking_currency: props.data.trucking_currency,
          trucking_cost: props.data.trucking_cost,
          shipping_currency: props.data.shipping_currency,
          shipping_cost: props.data.shipping_cost,
          custom_clearance_currency: props.data.custom_clearance_currency,
          custom_clearance_cost: props.data.custom_clearance_cost,
          selling_currency: props.data.selling_currency,
          selling_price: props.data.selling_price,
          carrier: props.data.carrier,
          one_way_ref: props.data.one_way_ref,
          supplier_invoice: props.data.supplier_invoice,
          supplier_release: props.data.supplier_release,
          depo_release: props.data.depo_release,
          csc_certificates: props.data.csc_certificates,
          owner: props.data.owner,
          images: props.data.images,
          redelivery_ref: props.data.redelivery_ref,
          destination_depo_id: props.data.destination_depo_id,
          stock_reconcile: props.data.stock_reconcile,
          specifications: props.data.specifications,
          contracts: props.data.contracts,
          invoices: props.data.invoices,
          drawings: props.data.drawings,
          surveys: props.data.surveys,
          relative_documents: props.data.relative_documents,
          original_photos: props.data.original_photos,
          remarks: props.data.remarks,
        });
        setNewData(false);
        setSerialLock(true);
        setTitle({
          formTitle: "Edit Container",
          buttonTitle: "Save Container",
        });
      } else {
        setData({
          id: null,
          serial_number: null,
          size_id: null,
          teu: null,
          type_id: null,
          stock_depo_id: props?.depoId,
          depo_id: props?.depoId,
          color_name: null,
          color_code: null,
          stock_status_id: null,
          available_status: [],
          repair_status_id: null,
          condition_id: null,
          percentage: null,
          yom_month: null,
          yom_year: null,
          date_in_stock: null,
          date_out_stock: null,
          gate_in_date: null,
          gate_out_date: null,
          delivery_status_id: null,
          country_id: null,
          selected_country: null,
          city_id: null,
          selected_city: null,
          cost_currency: null,
          cost_price: null,
          depo_fee_currency: null,
          depo_fee_cost: null,
          survey_currency: null,
          survey_cost: null,
          trucking_currency: null,
          trucking_cost: null,
          shipping_currency: null,
          shipping_cost: null,
          custom_clearance_currency: null,
          custom_clearance_cost: null,
          selling_currency: null,
          selling_price: null,
          carrier: null,
          one_way_ref: null,
          supplier_invoice: null,
          supplier_release: null,
          depo_release: null,
          csc_certificates: [],
          owner: null,
          images: [],
          redelivery_ref: null,
          destination_depo_id: null,
          stock_reconcile: null,
          specifications: [],
          contracts: [],
          invoices: [],
          drawings: [],
          surveys: [],
          relative_documents: [],
          original_photos: [],
          remarks: null,
        });
        setListFile({
          images: [],
          csc_certificates: [],
          specifications: [],
          contracts: [],
          invoices: [],
          drawings: [],
          surveys: [],
          relative_documents: [],
          original_photos: [],
        });
        setNewData(true);
        setSerialLock(false);
        setTitle({ formTitle: "Add Container", buttonTitle: "Add Container" });
      }
    }
  }, [props?.open]);

  const [errorText, setErrorText] = useState({
    serial_number: null,
    size_id: null,
    teu: null,
    type_id: null,
    stock_depo_id: null,
    depo_id: null,
    color_name: null,
    color_code: null,
    stock_status_id: null,
    available_status: [],
    repair_status_id: null,
    condition_id: null,
    percentage: null,
    yom_month: null,
    yom_year: null,
    date_in_stock: null,
    date_out_stock: null,
    gate_in_date: null,
    gate_out_date: null,
    delivery_status_id: null,
    country_id: null,
    city_id: null,
    cost_currency: null,
    cost_price: null,
    depo_fee_currency: null,
    depo_fee_cost: null,
    survey_currency: null,
    survey_cost: null,
    trucking_currency: null,
    trucking_cost: null,
    shipping_currency: null,
    shipping_cost: null,
    custom_clearance_currency: null,
    custom_clearance_cost: null,
    selling_currency: null,
    selling_price: null,
    carrier: null,
    one_way_ref: null,
    supplier_invoice: null,
    supplier_release: null,
    depo_release: null,
    csc_certificates: [],
    owner: null,
    images: [],
    redelivery_ref: null,
    destination_depo_id: null,
    stock_reconcile: null,
    specifications: [],
    contracts: [],
    invoices: [],
    drawings: [],
    surveys: [],
    relative_documents: [],
    original_photos: [],
    remarks: null,
  });

  const [isLoading, setLoading] = useState(false);
  const [pendingSelect, setPendingSelect] = useState(null);

  useEffect(() => {
    if (pendingSelect != null) {
      masterSwr.mutate();
      setData({ ...data, [pendingSelect]: props?.newOption?.id });
      setPendingSelect(null);
    }
  }, [props?.newOption]);

  const onChangeInput = (e) => {
    if (e.target.value == "create-new") {
      if (e.target.name == "size_id") {
        openAddMaster("container_size");
      } else if (e.target.name == "type_id") {
        openAddMaster("container_type");
      } else if (e.target.name == "stock_status_id") {
        openAddMaster("stock_status");
      } else if (e.target.name == "repair_status_id") {
        openAddMaster("status_repair");
      } else if (e.target.name == "condition_id") {
        openAddMaster("condition");
      } else if (e.target.name == "delivery_status_id") {
        openAddMaster("delivery");
      }
      setPendingSelect(e.target.name);
    } else {
      if (
        typeof e.target.value === "string" ||
        e.target.value instanceof String
      ) {
        e.target.value = e.target.value.toUpperCase();
      }
      if (e.target.name == "size_id") {
        var size = sizeOptions.filter((val) => val.id == e.target.value);
        var teu = parseFloat(size[0].name) / 20;
        // if (e.target.value == 4001) {
        //     // 20
        //     teu = 1
        // } else if (e.target.value == 4002) {
        //     // 40
        //     teu = 2
        // } else if (e.target.value == 4003) {
        //     // 10
        //     teu = 0.5
        // } else if (e.target.value == 4004) {
        //     // 8
        //     teu = 0.4
        // } else if (e.target.value == 4005) {
        //     // 6
        //     teu = 0.3
        // } else if (e.target.value == 4006) {
        //     // 45
        //     teu = 2.25
        // }
        setData({ ...data, size_id: e.target.value, teu: teu });
      } else if (e.target.name == "yom_month" || e.target.name == "yom_year") {
        setData({ ...data, [e.target.name]: parseInt(e.target.value) });
      } else if (e.target.name == "percentage") {
        setData({ ...data, [e.target.name]: parseFloat(e.target.value) });
      } else if (
        e.target.name == "date_in_stock" ||
        e.target.name == "date_out_stock" ||
        e.target.name == "gate_in_date" ||
        e.target.name == "gate_out_date"
      ) {
        setData({ ...data, [e.target.name]: Moment(e.target.value).toDate() });
      } else if (e.target.name == "serial_number") {
        if (e.target.value.length == 11) {
          var digit = e.target.value.substr(10);
          var gen = checkDigitGenerator(e.target.value.substr(0, 10));
          if (digit != gen) {
            setErrorText({
              ...errorText,
              serial_number: "Invalid check digit",
            });
          } else {
            setErrorText({ ...errorText, serial_number: "" });
          }
          setGenButton(false);
        } else if (e.target.value.length == 10) {
          setGenButton(true);
          setErrorText({ ...errorText, serial_number: "" });
        } else {
          setGenButton(false);
          setErrorText({ ...errorText, serial_number: "" });
        }
        setData({ ...data, [e.target.name]: e.target.value });
      } else if (e.target.name == "selling_price") {
        if (data.selling_currency == "" || data.selling_currency == null) {
          setData({
            ...data,
            [e.target.name]: parseFloat(e.target.value),
            selling_currency: "USD",
          });
        } else {
          setData({ ...data, [e.target.name]: parseFloat(e.target.value) });
        }
      } else if (e.target.name == "cost_price") {
        if (data.cost_currency == "" || data.cost_currency == null) {
          setData({
            ...data,
            [e.target.name]: parseFloat(e.target.value),
            cost_currency: "USD",
          });
        } else {
          setData({ ...data, [e.target.name]: parseFloat(e.target.value) });
        }
      } else if (e.target.name == "depo_fee_cost") {
        if (data.depo_fee_currency == "" || data.depo_fee_currency == null) {
          setData({
            ...data,
            [e.target.name]: parseFloat(e.target.value),
            depo_fee_currency: "USD",
          });
        } else {
          setData({ ...data, [e.target.name]: parseFloat(e.target.value) });
        }
      } else if (e.target.name == "survey_cost") {
        if (data.survey_currency == "" || data.survey_currency == null) {
          setData({
            ...data,
            [e.target.name]: parseFloat(e.target.value),
            survey_currency: "USD",
          });
        } else {
          setData({ ...data, [e.target.name]: parseFloat(e.target.value) });
        }
      } else if (e.target.name == "trucking_cost") {
        if (data.trucking_currency == "" || data.trucking_currency == null) {
          setData({
            ...data,
            [e.target.name]: parseFloat(e.target.value),
            trucking_currency: "USD",
          });
        } else {
          setData({ ...data, [e.target.name]: parseFloat(e.target.value) });
        }
      } else if (e.target.name == "shipping_cost") {
        if (data.shipping_currency == "" || data.shipping_currency == null) {
          setData({
            ...data,
            [e.target.name]: parseFloat(e.target.value),
            shipping_currency: "USD",
          });
        } else {
          setData({ ...data, [e.target.name]: parseFloat(e.target.value) });
        }
      } else if (e.target.name == "custom_clearance_cost") {
        if (data.custom_clearance_currency == "" || data.custom_clearance_currency == null) {
          setData({
            ...data,
            [e.target.name]: parseFloat(e.target.value),
            custom_clearance_currency: "USD",
          });
        } else {
          setData({ ...data, [e.target.name]: parseFloat(e.target.value) });
        }
      } else {
        setData({ ...data, [e.target.name]: e.target.value });
      }
    }
  };

  const openAddMaster = (tipe) => {
    props?.addMaster(tipe);
  };

  const onCountryCityChange = async (event, value, tipe) => {
    if (tipe == "country") {
      setData({
        ...data,
        country_id: value?.id ?? null,
        selected_country: value ?? null,
      });
      if (value != null) {
        var city = [...cityOptions];
        if (city[value.id] == undefined) {
          setCityParam(value.id);
        }
      }
    } else if (tipe == "city") {
      setData({
        ...data,
        city_id: value?.id ?? null,
        selected_city: value ?? null,
      });
    }
  };

  // const onCurrencyChange = async (event, value, tipe) => {
  //     if (tipe == "selling_currency") {
  //         setData({...data, selling_currency: value?.id ?? null, selected_selling: value ?? null})
  //     } else if (tipe == "cost_currency") {
  //         setData({...data, cost_currency: value?.id ?? null, selected_cost: value ?? null})
  //     }
  // }

  const onColorChange = (event, value, tipe) => {
    if (tipe == "name") {
      if (value != null) {
        // if (data.color_code == null || data.color_code == "") {
        var color = colorList.filter((val) => val.name_english == value);
        if (color.length > 0) {
          setData({
            ...data,
            color_name: value,
            color_code: color[0].ral_code,
          });
        } else {
          setData({ ...data, color_name: value });
        }
        // } else {
        //     setData({...data, color_name: value})
        // }
      } else {
        setData({ ...data, color_name: null });
      }
    } else if (tipe == "code") {
      if (value != null) {
        // if (data.color_name == null || data.color_name == "") {
        var color = colorList.filter((val) => val.ral_code == value);
        if (color.length > 0) {
          setData({
            ...data,
            color_code: value,
            color_name: color[0].name_english,
          });
        } else {
          setData({ ...data, color_code: value });
        }
        // } else {
        //     setData({...data, color_code: value})
        // }
      } else {
        setData({ ...data, color_code: null });
      }
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
    setData({ ...data, [name]: result });
  };

  const [state, setState] = useState({ sale_stock: false, lease_stock: false });

  const onCheck = (e) => {
    if (e.target.name == "sale_stock" || e.target.name == "lease_stock") {
      var temp = { ...state, [e.target.name]: e.target.checked };
      var available = [];
      if (temp.sale_stock) {
        available.push("Sale Stock");
      }
      if (temp.lease_stock) {
        available.push("Lease Stock");
      }
      setState(temp);
      setData({ ...data, available_status: available });
    } else {
      setData({ ...data, [e.target.name]: e.target.checked });
    }
  };

  const generateCheckDigit = () => {
    var serial = data.serial_number;
    var gen = checkDigitGenerator(serial);
    setData({ ...data, serial_number: serial + gen });
    setGenButton(false);
  };

  const unlock = () => {
    var digit = data.serial_number.substr(10);
    var gen = checkDigitGenerator(data.serial_number.substr(0, 10));
    if (digit != gen) {
      setErrorText({ ...errorText, serial_number: "Invalid check digit" });
    } else {
      setErrorText({ ...errorText, serial_number: "" });
    }
    setSerialLock(false);
  };

  function checkValidation() {
    var isValid = true;
    var eSerial = "",
      eType = "",
      eSize = "",
      eStatus = "",
      eCostCur = "",
      eSellCur = "";
    if (data.serial_number == "" || data.serial_number == null) {
      isValid = false;
      eSerial = "Serial Number can not be empty";
    }
    if (data.type_id == null) {
      isValid = false;
      eType = "Please choose Container Type";
    }
    if (data.size_id == null) {
      isValid = false;
      eSize = "Please choose Container Size";
    }
    if (data.stock_status_id == null) {
      isValid = false;
      eStatus = "Please choose Container Status";
    }
    if (data.cost_price > 0) {
      if (data.cost_currency == "" || data.cost_currency == null) {
        isValid = false;
        eCostCur = "Please choose Cost Currency";
      }
    }
    if (data.selling_price > 0) {
      if (data.selling_currency == "" || data.selling_currency == null) {
        isValid = false;
        eSellCur = "Please choose Selling Currency";
      }
    }
    setErrorText({
      ...errorText,
      serial_number: eSerial,
      type_id: eType,
      size_id: eSize,
      stock_status_id: eStatus,
      cost_currency: eCostCur,
      selling_currency: eSellCur,
    });
    return isValid;
  }

  const sendData = () => {
    if (!isLoading)  {
      if (checkValidation()) {
        setLoading(true);
        saveContainerApi(data)
          .then((res) => {
            setData({
              id: null,
              serial_number: null,
              size_id: null,
              teu: null,
              type_id: null,
              stock_depo_id: null,
              depo_id: null,
              color_name: null,
              color_code: null,
              stock_status_id: null,
              available_status: [],
              repair_status_id: null,
              condition_id: null,
              percentage: null,
              yom_month: null,
              yom_year: null,
              date_in_stock: null,
              date_out_stock: null,
              gate_in_date: null,
              gate_out_date: null,
              delivery_status_id: null,
              country_id: null,
              selected_country: null,
              city_id: null,
              selected_city: null,
              cost_currency: null,
              cost_price: null,
              depo_fee_currency: null,
              depo_fee_cost: null,
              survey_currency: null,
              survey_cost: null,
              trucking_currency: null,
              trucking_cost: null,
              shipping_currency: null,
              shipping_cost: null,
              custom_clearance_currency: null,
              custom_clearance_cost: null,
              selling_currency: null,
              selling_price: null,
              carrier: null,
              one_way_ref: null,
              supplier_invoice: null,
              supplier_release: null,
              depo_release: null,
              csc_certificates: [],
              owner: null,
              images: [],
              redelivery_ref: null,
              destination_depo_id: null,
              stock_reconcile: null,
              specifications: [],
              contracts: [],
              invoices: [],
              drawings: [],
              surveys: [],
              relative_documents: [],
              original_photos: [],
              remarks: null,
            });
            setLoading(false);
            setActive(false);
            props?.dataRefresh();
            props?.closeModal();
          })
          .catch((err) => {
            console.log(err);
            props?.alert(err);
            setLoading(false);
          });
      }
    }
  };

  const closeForm = async () => {
    setData({
      id: null,
      serial_number: null,
      size_id: null,
      teu: null,
      type_id: null,
      stock_depo_id: null,
      depo_id: null,
      color_name: null,
      color_code: null,
      stock_status_id: null,
      available_status: [],
      repair_status_id: null,
      condition_id: null,
      percentage: null,
      yom_month: null,
      yom_year: null,
      date_in_stock: null,
      date_out_stock: null,
      gate_in_date: null,
      gate_out_date: null,
      delivery_status_id: null,
      country_id: null,
      selected_country: null,
      city_id: null,
      selected_city: null,
      cost_currency: null,
      cost_price: null,
      depo_fee_currency: null,
      depo_fee_cost: null,
      survey_currency: null,
      survey_cost: null,
      trucking_currency: null,
      trucking_cost: null,
      shipping_currency: null,
      shipping_cost: null,
      custom_clearance_currency: null,
      custom_clearance_cost: null,
      selling_currency: null,
      selling_price: null,
      carrier: null,
      one_way_ref: null,
      supplier_invoice: null,
      supplier_release: null,
      depo_release: null,
      csc_certificates: [],
      owner: null,
      images: [],
      redelivery_ref: null,
      destination_depo_id: null,
      stock_reconcile: null,
      specifications: [],
      contracts: [],
      invoices: [],
      drawings: [],
      surveys: [],
      relative_documents: [],
      original_photos: [],
      remarks: null,
    });
    setActive(false);
    props?.closeModal();
  };

  return (
    <Modal
      open={props?.open}
      onClose={closeForm}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "700px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <h3>{title.formTitle}</h3>
          </Box>

          <Box className="modal-content">
            <Box className="mb-3 text-left">
              <TextField
                label="Serial Number"
                name="serial_number"
                variant="outlined"
                size="small"
                required
                disabled={serialLock}
                value={checkNull(data.serial_number)}
                placeholder="TIHU1234567"
                error={errorText.serial_number ? true : false}
                helperText={errorText.serial_number}
                onChange={onChangeInput}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  "aria-label": "lock-generate",
                  endAdornment: (
                    <React.Fragment>
                      {genButton && (
                        <Tooltip title="Generate Check Digit" placement="top">
                          <IconButton onClick={generateCheckDigit} size="small">
                            <Icon>looks_one</Icon>
                          </IconButton>
                        </Tooltip>
                      )}
                      {!genButton && serialLock && (
                        <Tooltip title="Unlock Serial Number" placement="top">
                          <IconButton onClick={unlock} size="small">
                            <Icon>lock</Icon>
                          </IconButton>
                        </Tooltip>
                      )}
                    </React.Fragment>
                  ),
                }}
                fullWidth
              />
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    select
                    label="Type"
                    name="type_id"
                    variant="outlined"
                    size="small"
                    required
                    value={data.type_id}
                    placeholder="Select Type"
                    error={errorText.type_id ? true : false}
                    helperText={errorText.type_id}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  >
                    <MenuItem value={null}>
                      <em className="text-muted">None</em>
                    </MenuItem>
                    {containerTypeOptions?.map((val, i) => {
                      return (
                        <MenuItem key={val.id} value={val.id}>
                          {val.name}
                        </MenuItem>
                      );
                    })}
                    {isAdmin && (
                      <MenuItem value="create-new">
                        <em>Add (+)</em>
                      </MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    select
                    label="Size"
                    name="size_id"
                    variant="outlined"
                    size="small"
                    required
                    value={data.size_id}
                    placeholder="Select Size"
                    error={errorText.size_id ? true : false}
                    helperText={errorText.size_id}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  >
                    <MenuItem value={null}>
                      <em className="text-muted">None</em>
                    </MenuItem>
                    {sizeOptions?.map((val, i) => {
                      return (
                        <MenuItem key={val.id} value={val.id}>
                          {val.name}
                        </MenuItem>
                      );
                    })}
                    {isAdmin && (
                      <MenuItem value="create-new">
                        <em>Add (+)</em>
                      </MenuItem>
                    )}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <Autocomplete
                    options={colorList?.map((option) => option.name_english)}
                    autoHighlight
                    value={data.color_name}
                    renderOption={(option) => (
                      <Chip
                        size="small"
                        label={option}
                        style={{
                          backgroundColor: colorList.filter(
                            (val) => val.name_english == option
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
                        size="small"
                        error={errorText.color_name ? true : false}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => onColorChange(e, v, "name")}
                  />
                </Grid>
                <Grid item md={6}>
                  <Autocomplete
                    options={colorList?.map((option) => option.ral_code)}
                    autoHighlight
                    value={data.color_code}
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
                        label="Color Code"
                        name="color_code"
                        variant="outlined"
                        size="small"
                        error={errorText.color_code ? true : false}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => onColorChange(e, v, "code")}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    label="YOM (Month)"
                    name="yom_month"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={data.yom_month}
                    placeholder="Input: 1-12"
                    error={errorText.yom_month ? true : false}
                    helperText={errorText.yom_month}
                    onChange={onChangeInput}
                    InputProps={{
                      inputProps: { min: 1, max: 12 },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    label="YOM (Year)"
                    name="yom_year"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={data.yom_year}
                    placeholder="1900"
                    error={errorText.yom_year ? true : false}
                    helperText={errorText.yom_year}
                    onChange={onChangeInput}
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            {/*<Box className="mb-3 text-left">
                        <Grid container className="mt-3" spacing={3}>
                            <Grid item md={6}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">CSC Plate (Month)</Typography>
                                </InputLabel>
                                <InputBase
                                    name="cscMonth"
                                    color="secondary"
                                    className="input"
                                    value={formState?.cscMonth}
                                    type="number"
                                    placeholder="Input: 1-12"
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                            <Grid item md={6}>
                                <InputLabel className="pb-1">
                                    <Typography variant="caption">(Year)</Typography>
                                </InputLabel>
                                <InputBase
                                    name="cscYear"
                                    color="secondary"
                                    className="input"
                                    value={formState?.cscYear}
                                    type="number"
                                    placeholder="2021"
                                    onChange={onChangeInput}
                                    fullWidth>
                                </InputBase>
                            </Grid>
                        </Grid>
                    </Box>*/}
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    select
                    label="Status"
                    name="stock_status_id"
                    variant="outlined"
                    size="small"
                    required
                    value={data.stock_status_id}
                    placeholder="Select Status"
                    error={errorText.stock_status_id ? true : false}
                    helperText={errorText.stock_status_id}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  >
                    <MenuItem value={null}>
                      <em className="text-muted">None</em>
                    </MenuItem>
                    {statusOptions?.map((val, i) => {
                      return (
                        <MenuItem key={val.id} value={val.id}>
                          {val.name}
                        </MenuItem>
                      );
                    })}
                    {isAdmin && (
                      <MenuItem value="create-new">
                        <em>Add (+)</em>
                      </MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid item md={6}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.sale_stock}
                          onChange={onCheck}
                          name="sale_stock"
                        />
                      }
                      label="Sale Stock"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.lease_stock}
                          onChange={onCheck}
                          name="lease_stock"
                        />
                      }
                      label="Lease Stock"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    label="In Stock"
                    name="date_in_stock"
                    variant="outlined"
                    size="small"
                    type="date"
                    value={Moment(data.date_in_stock).format("YYYY-MM-DD")}
                    error={errorText.date_in_stock ? true : false}
                    helperText={errorText.date_in_stock}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    label="Out of Stock"
                    name="date_out_stock"
                    variant="outlined"
                    size="small"
                    type="date"
                    value={Moment(data.date_out_stock).format("YYYY-MM-DD")}
                    error={errorText.date_out_stock ? true : false}
                    helperText={errorText.date_out_stock}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            {(newData || isAdmin) && (
              <Box className="mb-3 text-left">
                <Grid container className="mt-3" spacing={3}>
                  <Grid item md={6}>
                    <TextField
                      label="Gate In"
                      name="gate_in_date"
                      variant="outlined"
                      size="small"
                      type="date"
                      value={Moment(data.gate_in_date).format("YYYY-MM-DD")}
                      error={errorText.gate_in_date ? true : false}
                      helperText={errorText.gate_in_date}
                      onChange={onChangeInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      label="Gate Out"
                      name="gate_out_date"
                      variant="outlined"
                      size="small"
                      type="date"
                      value={Moment(data.gate_out_date).format("YYYY-MM-DD")}
                      error={errorText.gate_out_date ? true : false}
                      helperText={errorText.gate_out_date}
                      onChange={onChangeInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    select
                    label="Condition"
                    name="condition_id"
                    variant="outlined"
                    size="small"
                    value={data.condition_id}
                    placeholder="Select Condition"
                    error={errorText.condition_id ? true : false}
                    helperText={errorText.condition_id}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  >
                    <MenuItem value={null}>
                      <em className="text-muted">None</em>
                    </MenuItem>
                    {conditionOptions?.map((val, i) => {
                      return (
                        <MenuItem key={val.id} value={val.id}>
                          {val.name}
                        </MenuItem>
                      );
                    })}
                    {isAdmin && (
                      <MenuItem value="create-new">
                        <em>Add (+)</em>
                      </MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    label="(%)"
                    name="percentage"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={data.percentage}
                    placeholder="Input: 0-100"
                    error={errorText.percentage ? true : false}
                    helperText={errorText.percentage}
                    onChange={onChangeInput}
                    InputProps={{
                      inputProps: { min: 0, max: 100 },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    select
                    label="Delivery Status"
                    name="delivery_status_id"
                    variant="outlined"
                    size="small"
                    value={data.delivery_status_id}
                    placeholder="Select Delivery"
                    error={errorText.delivery_status_id ? true : false}
                    helperText={errorText.delivery_status_id}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  >
                    <MenuItem value={null}>
                      <em className="text-muted">None</em>
                    </MenuItem>
                    {deliveryOptions?.map((val, i) => {
                      return (
                        <MenuItem key={val.id} value={val.id}>
                          {val.name}
                        </MenuItem>
                      );
                    })}
                    {isAdmin && (
                      <MenuItem value="create-new">
                        <em>Add (+)</em>
                      </MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    label="Carrier"
                    name="carrier"
                    variant="outlined"
                    size="small"
                    value={checkNull(data.carrier)}
                    error={errorText.carrier ? true : false}
                    helperText={errorText.carrier}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    label="Depot Release"
                    name="depo_release"
                    variant="outlined"
                    size="small"
                    value={checkNull(data.depo_release)}
                    error={errorText.depo_release ? true : false}
                    helperText={errorText.depo_release}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    label="One Way Ref"
                    name="one_way_ref"
                    variant="outlined"
                    size="small"
                    value={checkNull(data.one_way_ref)}
                    error={errorText.one_way_ref ? true : false}
                    helperText={errorText.one_way_ref}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <Autocomplete
                    options={countryOptions}
                    autoHighlight
                    value={data.selected_country}
                    getOptionLabel={(option) => option?.label}
                    renderOption={(option) => (
                      <React.Fragment>{option?.label}</React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Location (Country)"
                        name="country_id"
                        variant="outlined"
                        size="small"
                        error={errorText.country_id ? true : false}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => onCountryCityChange(e, v, "country")}
                  />
                </Grid>
                <Grid item md={6}>
                  <Autocomplete
                    options={
                      cityOptions[data.country_id]?.cities ?? [
                        { id: "", label: "" },
                      ]
                    }
                    autoHighlight
                    value={data.selected_city}
                    getOptionLabel={(option) => option?.label}
                    renderOption={(option) => (
                      <React.Fragment>{option?.label}</React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="(City)"
                        name="city_id"
                        variant="outlined"
                        size="small"
                        error={errorText.city_id ? true : false}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    )}
                    onChange={(e, v) => onCountryCityChange(e, v, "city")}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    label="Supplier Invoice"
                    name="supplier_invoice"
                    variant="outlined"
                    size="small"
                    value={checkNull(data.supplier_invoice)}
                    error={errorText.supplier_invoice ? true : false}
                    helperText={errorText.supplier_invoice}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    label="Supplier Release"
                    name="supplier_release"
                    variant="outlined"
                    size="small"
                    value={checkNull(data.supplier_release)}
                    error={errorText.supplier_release ? true : false}
                    helperText={errorText.supplier_release}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                {sellingPrice && (
                  <React.Fragment>
                    <Grid item md={2}>
                      <TextField
                        select
                        label=""
                        name="selling_currency"
                        variant="outlined"
                        size="small"
                        value={data.selling_currency}
                        placeholder=""
                        error={errorText.selling_currency ? true : false}
                        helperText={errorText.selling_currency}
                        onChange={onChangeInput}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      >
                        <MenuItem value={null}>
                          <em className="text-muted">None</em>
                        </MenuItem>
                        {currencyOptions?.map((val, i) => {
                          return (
                            <MenuItem key={val.currency} value={val.currency}>
                              {val.currency}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                    <Grid item md={4}>
                      <TextField
                        label="Selling Price"
                        name="selling_price"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={data.selling_price}
                        placeholder=""
                        error={errorText.selling_price ? true : false}
                        helperText={errorText.selling_price}
                        onChange={onChangeInput}
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </Grid>
                  </React.Fragment>
                )}
                {costPrice && (
                  <React.Fragment>
                    <Grid item md={2}>
                      <TextField
                        select
                        label=""
                        name="cost_currency"
                        variant="outlined"
                        size="small"
                        value={data.cost_currency}
                        placeholder=""
                        error={errorText.cost_currency ? true : false}
                        helperText={errorText.cost_currency}
                        onChange={onChangeInput}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      >
                        <MenuItem value={null}>
                          <em className="text-muted">None</em>
                        </MenuItem>
                        {currencyOptions?.map((val, i) => {
                          return (
                            <MenuItem key={val.currency} value={val.currency}>
                              {val.currency}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </Grid>
                    <Grid item md={4}>
                      <TextField
                        label="Cost Price"
                        name="cost_price"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={data.cost_price}
                        placeholder=""
                        error={errorText.cost_price ? true : false}
                        helperText={errorText.cost_price}
                        onChange={onChangeInput}
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
            </Box>
            {costPrice && (
            <React.Fragment>
              <Box className="mb-3 text-left">
                <Grid container className="mt-3" spacing={3}>
                  <Grid item md={2}>
                    <TextField
                      select
                      label=""
                      name="depo_fee_currency"
                      variant="outlined"
                      size="small"
                      value={data.depo_fee_currency}
                      placeholder=""
                      error={errorText.depo_fee_currency ? true : false}
                      helperText={errorText.depo_fee_currency}
                      onChange={onChangeInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    >
                      <MenuItem value={null}>
                        <em className="text-muted">None</em>
                      </MenuItem>
                      {currencyOptions?.map((val, i) => {
                        return (
                          <MenuItem key={val.currency} value={val.currency}>
                            {val.currency}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      label="Depot Fee"
                      name="depo_fee_cost"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={data.depo_fee_cost}
                      placeholder=""
                      error={errorText.depo_fee_cost ? true : false}
                      helperText={errorText.depo_fee_cost}
                      onChange={onChangeInput}
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={2}>
                    <TextField
                      select
                      label=""
                      name="survey_currency"
                      variant="outlined"
                      size="small"
                      value={data.survey_currency}
                      placeholder=""
                      error={errorText.survey_currency ? true : false}
                      helperText={errorText.survey_currency}
                      onChange={onChangeInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    >
                      <MenuItem value={null}>
                        <em className="text-muted">None</em>
                      </MenuItem>
                      {currencyOptions?.map((val, i) => {
                        return (
                          <MenuItem key={val.currency} value={val.currency}>
                            {val.currency}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      label="Survey Cost"
                      name="survey_cost"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={data.survey_cost}
                      placeholder=""
                      error={errorText.survey_cost ? true : false}
                      helperText={errorText.survey_cost}
                      onChange={onChangeInput}
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className="mb-3 text-left">
                <Grid container className="mt-3" spacing={3}>
                  <Grid item md={2}>
                    <TextField
                      select
                      label=""
                      name="trucking_currency"
                      variant="outlined"
                      size="small"
                      value={data.trucking_currency}
                      placeholder=""
                      error={errorText.trucking_currency ? true : false}
                      helperText={errorText.trucking_currency}
                      onChange={onChangeInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    >
                      <MenuItem value={null}>
                        <em className="text-muted">None</em>
                      </MenuItem>
                      {currencyOptions?.map((val, i) => {
                        return (
                          <MenuItem key={val.currency} value={val.currency}>
                            {val.currency}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      label="Trucking Cost"
                      name="trucking_cost"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={data.trucking_cost}
                      placeholder=""
                      error={errorText.trucking_cost ? true : false}
                      helperText={errorText.trucking_cost}
                      onChange={onChangeInput}
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={2}>
                    <TextField
                      select
                      label=""
                      name="shipping_currency"
                      variant="outlined"
                      size="small"
                      value={data.shipping_currency}
                      placeholder=""
                      error={errorText.shipping_currency ? true : false}
                      helperText={errorText.shipping_currency}
                      onChange={onChangeInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    >
                      <MenuItem value={null}>
                        <em className="text-muted">None</em>
                      </MenuItem>
                      {currencyOptions?.map((val, i) => {
                        return (
                          <MenuItem key={val.currency} value={val.currency}>
                            {val.currency}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      label="Shipping Cost"
                      name="shipping_cost"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={data.shipping_cost}
                      placeholder=""
                      error={errorText.shipping_cost ? true : false}
                      helperText={errorText.shipping_cost}
                      onChange={onChangeInput}
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className="mb-3 text-left">
                <Grid container className="mt-3" spacing={3}>
                  <Grid item md={2}>
                    <TextField
                      select
                      label=""
                      name="custom_clearance_currency"
                      variant="outlined"
                      size="small"
                      value={data.custom_clearance_currency}
                      placeholder=""
                      error={errorText.custom_clearance_currency ? true : false}
                      helperText={errorText.custom_clearance_currency}
                      onChange={onChangeInput}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    >
                      <MenuItem value={null}>
                        <em className="text-muted">None</em>
                      </MenuItem>
                      {currencyOptions?.map((val, i) => {
                        return (
                          <MenuItem key={val.currency} value={val.currency}>
                            {val.currency}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      label="Custom Clearance"
                      name="custom_clearance_cost"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={data.custom_clearance_cost}
                      placeholder=""
                      error={errorText.custom_clearance_cost ? true : false}
                      helperText={errorText.custom_clearance_cost}
                      onChange={onChangeInput}
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={2}>
                    
                  </Grid>
                  <Grid item md={4}>
                    
                  </Grid>
                </Grid>
              </Box>
            </React.Fragment>
            )}
            {/* <Box className="mb-3 text-left">
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Depo</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-customized-select-label"
                            className="input"
                            placeholder="Select Depo"
                            fullWidth
                            name="depo"
                            value={formState?.depo ?? "none"}
                            onChange={onChangeInput}
                            input={<InputBase />}>
                            <MenuItem value="none"><em className="text-muted">Select Depo</em></MenuItem>
                            {depoOptions?.map((val, i) => {
                                return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                            })}
                        </Select>
                    </Box> */}
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    label="Owner"
                    name="owner"
                    variant="outlined"
                    size="small"
                    value={checkNull(data.owner)}
                    error={errorText.owner ? true : false}
                    helperText={errorText.owner}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    select
                    label="Status Repair"
                    name="repair_status_id"
                    variant="outlined"
                    size="small"
                    value={data.repair_status_id}
                    placeholder="Select Repair Status"
                    error={errorText.repair_status_id ? true : false}
                    helperText={errorText.repair_status_id}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  >
                    <MenuItem value={null}>
                      <em className="text-muted">None</em>
                    </MenuItem>
                    {repairOptions?.map((val, i) => {
                      return (
                        <MenuItem key={val.id} value={val.id}>
                          {val.name}
                        </MenuItem>
                      );
                    })}
                    {isAdmin && (
                      <MenuItem value="create-new">
                        <em>Add (+)</em>
                      </MenuItem>
                    )}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={6}>
                  <TextField
                    label="Redelivery Ref"
                    name="redelivery_ref"
                    variant="outlined"
                    size="small"
                    value={checkNull(data.redelivery_ref)}
                    error={errorText.redelivery_ref ? true : false}
                    helperText={errorText.redelivery_ref}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item md={6}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={data.stock_reconcile}
                          onChange={onCheck}
                          name="stock_reconcile"
                        />
                      }
                      label="Stock Reconcile"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={12}>
                  <TextField
                    label="Remarks"
                    name="remarks"
                    variant="outlined"
                    size="small"
                    multiline
                    rows={4}
                    value={checkNull(data.remarks)}
                    error={errorText.remarks ? true : false}
                    helperText={errorText.remarks}
                    onChange={onChangeInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={12}>
                  <InputLabel shrink={true}>Images</InputLabel>
                  <DropZoneComponent
                    id="images"
                    exportList={(res) => onChangeUpload(res, "images")}
                    data={listFile.images}
                    path="container"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={12}>
                  <InputLabel shrink={true}>CSC Certificate</InputLabel>
                  <DropZoneComponent
                    id="csc_certificates"
                    exportList={(res) =>
                      onChangeUpload(res, "csc_certificates")
                    }
                    data={listFile.csc_certificates}
                    path="csc"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={12}>
                  <InputLabel shrink={true}>Specification</InputLabel>
                  <DropZoneComponent
                    id="specifications"
                    exportList={(res) => onChangeUpload(res, "specifications")}
                    data={listFile.specifications}
                    path="container_spec"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={12}>
                  <InputLabel shrink={true}>Contract</InputLabel>
                  <DropZoneComponent
                    id="contracts"
                    exportList={(res) => onChangeUpload(res, "contracts")}
                    data={listFile.contracts}
                    path="container_contract"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={12}>
                  <InputLabel shrink={true}>Invoice</InputLabel>
                  <DropZoneComponent
                    id="invoices"
                    exportList={(res) => onChangeUpload(res, "invoices")}
                    data={listFile.invoices}
                    path="container_invoice"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={12}>
                  <InputLabel shrink={true}>Drawings</InputLabel>
                  <DropZoneComponent
                    id="drawings"
                    exportList={(res) => onChangeUpload(res, "drawings")}
                    data={listFile.drawings}
                    path="container_drawings"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={12}>
                  <InputLabel shrink={true}>Surveys</InputLabel>
                  <DropZoneComponent
                    id="surveys"
                    exportList={(res) => onChangeUpload(res, "surveys")}
                    data={listFile.surveys}
                    path="container_surveys"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={12}>
                  <InputLabel shrink={true}>Relative Documents</InputLabel>
                  <DropZoneComponent
                    id="relative_documents"
                    exportList={(res) =>
                      onChangeUpload(res, "relative_documents")
                    }
                    data={listFile.relative_documents}
                    path="container_others"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box className="mb-3 text-left">
              <Grid container className="mt-3" spacing={3}>
                <Grid item md={12}>
                  <InputLabel shrink={true}>Original Photos</InputLabel>
                  <DropZoneComponent
                    id="original_photos"
                    exportList={(res) =>
                      onChangeUpload(res, "original_photos")
                    }
                    data={listFile.original_photos}
                    path="container_original_photos"
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box className="modal-footer">
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => sendData()}
              disableElevation
            >
              {isLoading ? (
                <CircularProgressCustom size={26} />
              ) : (
                title.buttonTitle
              )}
            </Button>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
}
