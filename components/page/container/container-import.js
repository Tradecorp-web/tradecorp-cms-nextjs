import {
  Button,
  Card,
  Icon,
  Link,
  Modal,
  InputBase,
  Paper,
  MenuItem,
  Typography,
  Select,
  TextField,
  Container,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Chip,
  Box,
  Grid,
  InputLabel,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";
import React, { useEffect, useState } from "react";
import readXlsxFile from "read-excel-file";
import { insertBatchContainerApi, insertContainerApi, deleteMultiContainersApi } from "../../../services/api/container-stocks.api";
import { getColorListApi } from "../../../services/api/color-codes.api";
import { getCountryListSwr, getCityListSwr } from "../../../services/swr/countries-cities.swr";
import { getCityListApi } from "../../../services/api/countries-cities.api";
import { getListDepoApi } from "../../../services/api/depo.api";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import { masterDataSwr } from "../../../services/swr/master-data.swr";
import { checkNull } from "../../../helpers/general";
import { LOCAL_STORAGE_API_TOKEN, LOCAL_STORAGE_USER_ID, LOCAL_STORAGE_STOP_TIMEOUT } from "../../../helpers/consts";
import { DropZoneComponent } from "../../base_component/file-upload";
import { ClosedCaptionDisabledSharp, TryRounded } from "@mui/icons-material";
// import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material";

export default function StockContainerImport(props) {
  var id = props?.id ?? "containerImportId";
  var stockDepoId = props?.stockDepoId;
  var numBatch = 1000;

  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0)
  const [fileName, setFileName] = useState("");
  const [completed, setCompleted] = useState(0);
  const [uncomplete, setUncomplete] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [company, setCompany] = useState("");
  const [userId, setUserId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [attachForm, setAttachForm] = useState(false)
  const [finishAttach, setFinishAttach] = useState(false)
  const [finishImport, setFinishImport] = useState(false);
  const [reviewFail, setReviewFail] = useState(false);
  const [revData, setRevData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [firstRev, setFirstRev] = useState(false);
  const [allCountry, setAllCountry] = useState([]);

  const [masterData, setMasterData] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [repairOptions, setRepairOptions] = useState([]);
  const [conditionOptions, setConditionOptions] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [pendingSelect, setPendingSelect] = useState({ index: null, name: null })

  const [cityParam, setCityParam] = useState(102)
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [cityFind, setCityFind] = useState([]);
  const [countryList, setCountryList] = useState([]);

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
  })

  var masterSwr = masterDataSwr("");
  useEffect(() => {
    if (masterSwr?.data) {
      setMasterData(masterSwr?.data);
      setSizeOptions(masterSwr?.data?.filter((val) => val?.category == "container_size") ?? []);
      setTypeOptions(masterSwr?.data?.filter((val) => val?.category == "container_type") ?? []);
      setStatusOptions(masterSwr?.data?.filter((val) => val?.category == "stock_status") ?? []);
      setRepairOptions(masterSwr?.data?.filter((val) => val?.category == "status_repair") ?? []);
      setConditionOptions(masterSwr?.data?.filter((val) => val?.category == "condition") ?? []);
      setDeliveryOptions(masterSwr?.data?.filter((val) => val?.category == "delivery") ?? [])
    }
  }, [masterSwr?.data]);

  useEffect(async () => {
    try {
      var res = await getColorListApi()
      setColorList(res)
    } catch (err) {
      console.log(err)
    }
  }, []);

  

  // useEffect(async()=>{
  //   var res = await getCityListApi(cityParam).then((res2)=>{
  //     setAllCountry(res2);
  //   });
  //     },[cityParam])
  var countrySwr = getCountryListSwr("")
  useEffect(() => {
    if (countrySwr?.data) {
      var list = []
      list.push({ id: "", label: "" })
      countrySwr.data.map((item, i) => {
        list.push({ id: item.id, label: item.name })
      })
      setCountryList(countrySwr.data)
      setCountryOptions(list)
    }
  }, [countrySwr?.data])

  var citySwr = getCityListSwr(cityParam)
  useEffect(() => {
    if (citySwr?.data) {
      var city = [...cityOptions]
      var list = []
      citySwr.data.cities.map((item, i) => {
        list.push({ id: item.id, label: item.name })
      })
      city[cityParam] = { id: cityParam, cities: list }
      setCityOptions(city)
      if (cityParam == 102) {
        // Australia
        setCityParam(14)
      } else if (cityParam == 14) {
        // Hong Kong
        setCityParam(98)
      } else if (cityParam == 98) {
        // US
        setCityParam(233)
      }
    }
  }, [citySwr?.data])



  const selectFile = async (e) => {
    const token = localStorage.getItem(LOCAL_STORAGE_API_TOKEN);
    if (token != "" && token != "undefined" && token != null) {
      const dt = JSON.parse(atob(token.split(".")[1]));
      setCompany(dt.company_id);
    }
    const uid = localStorage.getItem(LOCAL_STORAGE_USER_ID);
    if (uid != "" && uid != "undefined" && uid != null) {
      setUserId(uid);
    }
    const batch = [...Array(5)].map((value) => (Math.random() * 1000000).toString(36).replace(".", "")).join("");
    setBatchId(batch);
    const file = e.target.files[0];
    var split = e.target.value.split("\\");
    setFileName(split[split.length - 1]);
    try {
      var rows = await readXlsxFile(file);
      var total = 0
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][0] != null) {
          total++
        }
      }
      setData([...rows]);
      data.splice(0, 1);
      setTotalData(total)
      setFinishAttach(false)
      document.getElementById(id).value = null;
    } catch (err) {
      console.log(err);
    }
  };

  // const importData = async (index, success, fail, failData) => {
  //   if (index == 0) {
  //     localStorage.setItem(LOCAL_STORAGE_STOP_TIMEOUT, "1");
  //     failData = [];
  //     setFinishImport(false);
  //     importData(index + 1, 0, 0, failData);
  //   } else {
  //     setUploading(true);
  //     var teu = 0;
  //     var datai1 = data[index][1] != null ? data[index][1].toString() : null;
  //     var datai2 = data[index][2] != null ? data[index][26].toString().toLowerCase() : null;
  //     var datai3 = data[index][3] != null ? data[index][3].toString().toLowerCase() : null;
  //     var datai4 = data[index][4] != null ? data[index][4].toString().toLowerCase() : null;
  //     var datai5 = data[index][5] != null ? data[index][5].toString().toLowerCase() : null;

  //     if (datai1 == "20") {
  //       teu = 1;
  //     } else if (datai1 == "40") {
  //       teu = 2;
  //     } else if (datai1 == "10") {
  //       teu = 0.5;
  //     } else if (datai1 == "8") {
  //       teu = 0.4;
  //     } else if (datai1 == "6") {
  //       teu = 0.3;
  //     }

  //     var param = {
  //       serial_number: data[index][0],
  //       size_id: masterData?.find((val) => val.name == datai1)?.id ?? null,
  //       teu: teu,
  //       type_id: masterData?.find((val) => val.name.toLowerCase() == datai2)?.id ?? null,
  //       stock_depo_id: stockDepoId,
  //       depo_id: stockDepoId,
  //       stock_status_id: masterData?.find((val) => val.name.toLowerCase() == datai3)?.id ?? null,
  //       repair_status_id: masterData?.find((val) => val.name.toLowerCase() == datai4)?.id ?? null,
  //       condition_id: masterData?.find((val) => val.name.toLowerCase() == datai5)?.id ?? null,
  //       percentage: data[index][6],
  //       yom_month: data[index][7],
  //       yom_year: data[index][8],
  //       csc_month: data[index][9],
  //       csc_year: data[index][10],
  //       remarks: data[index][12],
  //       company_id: company,
  //       gate_in_date: data[index][11],
  //       created_by: userId,
  //       batch_id: batchId,
  //       total_data: data.length - 1,
  //     };

  //     insertContainerApi(param)
  //       .then((res) => {
  //         setCompleted(success + 1);
  //         if (index < data.length - 1) {
  //           importData(index + 1, success + 1, fail, failData);
  //         } else {
  //           if (fail > 0) {
  //             retryImport(failData, 0, success + 1, fail);
  //           } else {
  //             setUploading(false);
  //             setFileName("");
  //             setData([]);
  //             setFinishImport(true);
  //             localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT);
  //             props?.dataImported();
  //           }
  //         }
  //       })
  //       .catch((err) => {
  //         failData.push(param);
  //         setUncomplete(fail + 1);
  //         if (index < data.length - 1) {
  //           importData(index + 1, success, fail + 1, failData);
  //         } else {
  //           if (fail > 0) {
  //             retryImport(failData, 0, success + 1, fail + 1);
  //           } else {
  //             setUploading(false);
  //             setFileName("");
  //             setData([]);
  //             setFinishImport(true);
  //             localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT);
  //             props?.dataImported();
  //           }
  //         }
  //       });
  //   }
  // };

  const convertExcelDate = (tanggal) => {
    if (Object.prototype.toString.call(tanggal).slice(8, -1).toLowerCase() == "string") {
      return tanggal
    } else if (Object.prototype.toString.call(tanggal).slice(8, -1).toLowerCase() == "number") {
      // return moment("1900-01-01").add(tanggal-1,"d").format("YYYY-MM-DD")+"T00:00:00.000Z"
      const excelEpoc = new Date(1900, 0, 0).getTime()
      const msDay = 86400000
      var tgl = new Date(excelEpoc + tanggal * msDay)
      return moment(tgl).format("YYYY-MM-DD") + "T00:00:00.000Z"
    } else if (Object.prototype.toString.call(tanggal).slice(8, -1).toLowerCase() == "date") {
      return tanggal
    } else {
      return null
    }
  }

  const importBatchData = async (index, success, fail, failData) => {
    if (index == 0) {
      localStorage.setItem(LOCAL_STORAGE_STOP_TIMEOUT, "1");
      failData = [];
      setFinishImport(false);
      importBatchData(index + 1, 0, 0, failData);
    } else {
      setUploading(true);
      var batch = [];
      var needRev = [];
      var city = [...cityOptions];

      for (var i = 0; i < numBatch; i++) {
        if (data[index][0] != null) {
          var teu = 0;

          var datai1 = data[index][1] != null ? data[index][1].toString() : null;
          var datai2 = data[index][2] != null ? data[index][2].toString().toLowerCase() : null;

          var datai3 = data[index][5] != null ? data[index][5].toString().toLowerCase() : null;
          var datai4 = data[index][7] != null ? data[index][7].toString().toLowerCase() : null;
          var datai5 = data[index][8] != null ? data[index][8].toString().toLowerCase() : null;
          var datai6 = data[index][17] != null ? data[index][17].toString().toLowerCase() : null;
          var datai7 = data[index][18] != null ? data[index][18].toString().toLowerCase() : null;
          var datai8 = data[index][16] != null ? data[index][16].toString().toLowerCase() : null;
          var datai9 = data[index][6] != null ? data[index][6].split(",") : [];


          // if (datai1 == "20") {
          //   teu = 1;
          // } else if (datai1 == "40") {
          //   teu = 2;
          // } else if (datai1 == "10") {
          //   teu = 0.5;
          // } else if (datai1 == "8") {
          //   teu = 0.4;
          // } else if (datai1 == "6") {
          //   teu = 0.3;
          // } else if (datai1 == "45") {
          //   teu = 2.25;
          // }

          teu = parseFloat(datai1) / 20
          var countryId2 = null;
          var coName = "";

          if (datai6 == null || datai6 == "") { coName = ""; } else { coName = datai6.trim(); };
          if (coName == "united states of america") { coName = "united states"; };
          if (coName != "") {
            var countryId = countryList?.find((val) => val.name.toLowerCase() == coName)?.id ?? null;
            countryId2 = countryId;
          } else {
            countryId2 = null;
          }


          var param = {
            serial_number: data[index][0],
            size_id: masterData?.find((val) => val.name == datai1)?.id ?? null,
            teu: teu,
            type_id: masterData?.find((val) => val.name.toLowerCase() == datai2)?.id ?? null,
            stock_depo_id: stockDepoId,
            depo_id: stockDepoId,
            color_name: data[index][3],
            color_code: data[index][4],
            stock_status_id: masterData?.find((val) => val.name.toLowerCase() == datai3)?.id ?? null,
            available_status: datai9,
            repair_status_id: masterData?.find((val) => val.name.toLowerCase() == datai4)?.id ?? null,
            condition_id: masterData?.find((val) => val.name.toLowerCase() == datai5)?.id ?? null,
            percentage: data[index][9],
            yom_month: data[index][10],
            yom_year: data[index][11],
            date_in_stock: convertExcelDate(data[index][12]),
            date_out_stock: convertExcelDate(data[index][13]),
            gate_in_date: convertExcelDate(data[index][14]),
            gate_out_date: convertExcelDate(data[index][15]),
            delivery_status_id: masterData?.find((val) => val.name.toLowerCase() == datai8)?.id ?? null,
            country_id: countryId2,
            cost_price: data[index][19],
            selling_price: data[index][20],
            carrier: data[index][21],
            one_way_ref: data[index][22],
            supplier_invoice: data[index][23],
            supplier_release: data[index][24],
            depo_release: data[index][25],
            owner: data[index][26],
            redelivery_ref: data[index][27],
            remarks: data[index][28],
            images: listFile.images,
            csc_certificates: listFile.csc_certificates,
            specifications: listFile.specifications,
            contracts: listFile.contracts,
            invoices: listFile.invoices,
            drawings: listFile.drawings,
            surveys: listFile.surveys,
            relative_documents: listFile.relative_documents,
            original_photos: listFile.original_photos,
            company_id: company,
            created_by: userId,
            batch_id: batchId,
            total_data: totalData,
            city_id: null,
          };

          // if (param.country_id != null) {

          if (countryId2 != null) {

            countryOptions.map((item, i) => {
              if (countryId2 == item.id) {// if (param.country_id == item.id) {
                param.selected_country = item
              }
            });


            var cityId2 = null;
            var cityName = "";
            if (datai7 == null || datai7 == "") { cityName = ""; } else { cityName = datai7.trim(); };

            if (city[countryId2] == undefined) {
              setCityParam(countryId2);

              var res = await getCityListApi(countryId2);
              if (res.id != null) {
                res?.cities?.map((resCity) => {
                  if (resCity.name.toLowerCase() == cityName) {
                    param.city_id = resCity?.id;
                    var paramCity =
                      { id: resCity?.id, label: resCity?.name }
                      ;
                    param.selected_city = paramCity;
                  } else {
                    // param.selected_city = null;
                  }
                })

              } else {
                // param.selected_city = null;
              }

              // if(cityName!=""){
              //  param.city_id = res.cities?.find((val) => val.name.toLowerCase() == cityName)?.id ?? null;

              //  if (param.city_id > 0 ) {
              //   res.map((item, i) => {
              //     if (param.city_id == item.id) {
              //       param.selected_city = {id:item?.cities?.id,label:item?.cities?.name}
              //     }
              //   });
              // }
              // }else{
              //  param.city_id=null;
              // }
            } else {
              param.city_id = city[countryId2].cities?.find((val) => val.label.toLowerCase() == datai7)?.id ?? null;
              if (param.city_id != null) {
                city[countryId2].cities.map((item, i) => {
                  if (param.city_id == item.id) {
                    param.selected_city = item
                  }
                });
              }

            }



            //  alert(city[countryId2]);
            // if (city[countryId2] == undefined) {//if (city[param.country_id] == undefined) {
            //   setCityParam(countryId2);
            //   //setCityParam(param.country_id)
            //  // var res = getCityListSwr(param.country_id);
            //   var res = getCityListSwr(countryId2);
            //   param.city_id = res.data.cities?.find((val) => val.name.toLowerCase() == datai7)?.id ?? null;
            // } else {
            //   param.city_id = city[countryId2].cities?.find((val) => val.label.toLowerCase() == datai7)?.id ?? null;
            // }
            // if (param.city_id != null) {
            //   city[countryId2].cities.map((item, i) => {
            //     if (param.city_id == item.id) {
            //       param.selected_city = item
            //     }
            //   });
            // }
          }


          if (param.serial_number == null || param.size_id == null || param.type_id == null || param.stock_status_id == null) {
            needRev.push(param);
          } else if (datai6 != null && countryId2 == null) {
            needRev.push(param);
          } else if (datai7 != null && param.city_id == null) {
            needRev.push(param);
          } else {
            batch.push(param);
          }


        }
        index++;
        if (index == data.length) {
          break;
        }
      }
      setRevData([...needRev]);
      setCityOptions(city);

      if (batch.length > 0) {
        insertBatchContainerApi(batch)
          .then((res) => {
            setCompleted(success + batch.length);
            if (index < data.length) {
              importBatchData(index, success + batch.length, fail + needRev.length, failData);
            } else {
              if (fail > 0) {
                retryBatchImport(failData, 0, success + batch.length, fail + needRev.length);
              } else {
                if (needRev.length > 0) {
                  setReviewFail(true);
                } else {
                  setUploading(false);
                  setFileName("");
                  setData([]);
                  setFinishImport(true);
                  localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT);
                  props?.dataImported();
                }
              }
            }
          })
          .catch((err) => {
            failData.push(...batch);
            setUncomplete(fail + batch.length);
            if (index < data.length) {
              importBatchData(index, success, fail + batch.length + needRev.length, failData);
            } else {
              if (fail > 0) {
                retryBatchImport(failData, 0, success, fail + batch.length + needRev.length);
              } else {
                if (needRev.length > 0) {
                  setReviewFail(true);
                } else {
                  setUploading(false);
                  setFileName("");
                  setData([]);
                  setFinishImport(true);
                  localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT);
                  props?.dataImported();
                }
              }
            }
          });
      } else {
        if (needRev.length > 0) {
          setFirstRev(true);
          setReviewFail(true);
        }
      }
    }
  };

  // const retryImport = async (dataTemp, index, success, fail, failData) => {
  //   var param = dataTemp[index];
  //   insertContainerApi(param)
  //     .then((res) => {
  //       setCompleted(success + 1);
  //       setUncomplete(fail - 1);
  //       if (index < dataTemp.length - 1) {
  //         retryImport(dataTemp, index + 1, success + 1, fail - 1, failData);
  //       } else {
  //         setUploading(false);
  //         setFileName("");
  //         setData([]);
  //         setFinishImport(true);
  //         localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT);
  //         props?.dataImported();
  //       }
  //     })
  //     .catch((err) => {
  //       failData.push(param);
  //       setUncomplete(fail + 1);
  //       if (index < dataTemp.length - 1) {
  //         retryImport(dataTemp, index + 1, success, fail + 1, failData);
  //       } else {
  //         setUploading(false);
  //         setFileName("");
  //         setData([]);
  //         setFinishImport(true);
  //         localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT);
  //         props?.dataImported();
  //       }
  //     });
  // };

  const retryBatchImport = async (dataTemp, index, success, fail, failData) => {
    var param = [];
    for (var i = 0; i < numBatch; i++) {
      param.push(dataTemp[index]);
      index++;
      if (index == dataTemp.length) {
        break;
      }
    }
    insertBatchContainerApi(param)
      .then((res) => {
        setCompleted(success + param.length);
        setUncomplete(fail - param.length);
        if (index < dataTemp.length) {
          retryBatchImport(dataTemp, index, success + param.length, fail - param.length, failData);
        } else {
          if (failData.length > 0) {
            setRevData([...revData, ...failData]);
            setReviewFail(true);
          } else {
            setUploading(false);
            setFileName("");
            setData([]);
            setFinishImport(true);
            localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT);
            props?.dataImported();
          }
        }
      })
      .catch((err) => {
        failData.push(...param);
        setUncomplete(fail + param.length);
        if (index < dataTemp.length) {
          retryBatchImport(dataTemp, index, success, fail + param.length, failData);
        } else {
          if (failData.length > 0) {
            setRevData([...revData, ...failData]);
            setReviewFail(true);
          } else {
            setUploading(false);
            setFileName("");
            setData([]);
            setFinishImport(true);
            localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT);
            props?.dataImported();
          }
        }
      });
  };

  const importRevData = async (index, success, fail, failData) => {
    setReviewFail(false);
    var dataTemp = [...revData];
    if (isNaN(success)) {
      success = completed;
    }
    if (isNaN(fail)) {
      fail = uncomplete;
    }
    if (!Array.isArray(failData)) {
      failData = [];
    }
    var param = [];
    for (var i = 0; i < numBatch; i++) {
      param.push(dataTemp[index]);
      index++;
      if (index == dataTemp.length) {
        break;
      }
    }
    insertBatchContainerApi(param)
      .then((res) => {
        setCompleted(success + param.length);
        if (!firstRev) {
          if (uncomplete > 0) {
            setUncomplete(fail - param.length);
          }
        }
        if (index < dataTemp.length) {
          if (firstRev) {
            importRevData(index, success + param.length, fail, failData);
          } else {
            if (uncomplete > 0) {
              importRevData(index, success + param.length, fail - param.length, failData);
            } else {
              importRevData(index, success + param.length, fail, failData);
            }
          }
        } else {
          setFirstRev(false);
          if (failData.length > 0) {
            setRevData([...failData]);
            setReviewFail(true);
          } else {
            setUploading(false);
            setFileName("");
            setData([]);
            setFinishImport(true);
            localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT);
            props?.dataImported();
          }
        }
      })
      .catch((err) => {
        failData.push(...param);
        setUncomplete(fail + param.length);
        if (index < dataTemp.length) {
          importRevData(index, success, fail + param.length, failData);
        } else {
          setFirstRev(false);
          if (failData.length > 0) {
            setRevData([...failData]);
            setReviewFail(true);
          } else {
            setUploading(false);
            setFileName("");
            setData([]);
            setFinishImport(true);
            localStorage.removeItem(LOCAL_STORAGE_STOP_TIMEOUT);
            props?.dataImported();
          }
        }
      });
  };

  const undo = async () => {
    if (batchId != "") {
      var respones = await deleteMultiContainersApi(batchId);
      setBatchId("");
      props?.dataImported(batchId);
    }
  };

  useEffect(() => {
    if (pendingSelect.index != null) {
      var row = [...revData];
      row[pendingSelect.index][pendingSelect.name] = props?.newOption?.id;
      setRevData(row);
      setPendingSelect({ index: null, name: null });
    }
  }, [props?.newOption])

  const onInputChange = (event, index) => {
    var row = [...revData];
    if (event.target.value == "create-new") {
      if (event.target.name == "size_id") {
        openAddMaster("container_size");
      } else if (event.target.name == "type_id") {
        openAddMaster("container_type");
      } else if (event.target.name == "stock_status_id") {
        openAddMaster("stock_status");
      } else if (event.target.name == "repair_status_id") {
        openAddMaster("status_repair");
      } else if (event.target.name == "condition_id") {
        openAddMaster("condition");
      } else if (event.target.name == "delivery_status_id") {
        openAddMaster("delivery");
      }
      setPendingSelect({ index: index, name: event.target.name });
    } else {
      if (event.target.name == "gate_in_date" || event.target.name == "gate_out_date" || event.target.name == "date_in_stock" || event.target.name == "date_out_stock") {
        row[index][event.target.name] = new Date(event.target.value);
      } else if (event.target.name == "available_status") {
        row[index][event.target.name] = event.target.value != null ? event.target.value.split(",") : [];
      } else if (event.target.name == "color_name") {
        if (row[index]["color_code"] == null || row[index]["color_code"] == "") {
          var code = colorList.filter(val => val.name_english == event.target.value);
          if (code.length > 0) {
            row[index]["color_code"] = code[0].ral_code;
          }
        }
        row[index][event.target.name] = event.target.value;
      } else if (event.target.name == "color_code") {
        if (row[index]["color_name"] == null || row[index]["color_name"] == "") {
          var name = colorList.filter(val => val.ral_code == event.target.value);
          if (name.length > 0) {
            row[index]["color_name"] = name[0].name_english;
          }
        }
        row[index][event.target.name] = event.target.value;
      } else {
        row[index][event.target.name] = event.target.value;
      }
    }
    setRevData(row);
  };

  const onCountryCityChange = (event, value, index, tipe) => {
    var row = [...revData];
    if (tipe == "country") {
      row[index]["country_id"] = value?.id ?? null;
      row[index]["selected_country"] = value ?? null;
      if (value != null) {
        var city = [...cityOptions]
        if (city[value.id] == undefined) {
          setCityParam(value.id)
        }
      }
    } else if (tipe == "city") {
      row[index]["city_id"] = value?.id ?? null;
      row[index]["selected_city"] = value ?? null;
    }
    setRevData(row);
  };

  const onColorChange = (event, value, index, tipe) => {
    var row = [...revData];
    if (tipe == "name") {
      if (value != null) {
        if (row[index]["color_code"] == null || row[index]["color_code"] == "") {
          var color = colorList.filter(val => val.name_english == value)
          if (color.length > 0) {
            row[index]["color_code"] = color[0].ral_code;
          }
        }
      }
      row[index]["color_name"] = value;
    } else if (tipe == "code") {
      if (value != null) {
        if (row[index]["color_name"] == null || row[index]["color_name"] == "") {
          var color = colorList.filter(val => val.ral_code == value)
          if (color.length > 0) {
            row[index]["color_name"] = color[0].name_english;
          }
        }
      }
      row[index]["color_code"] = value;
    }
    setRevData(row);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const openAddMaster = (tipe) => {
    props?.addMaster(tipe);
  }

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
    setListFile({ ...listFile, [name]: result });
  };

  const finishAttachment = () => {
    setFinishAttach(true)
    setAttachForm(false)
  }

  return (
    <Modal
      open={props?.open}
      onClose={uploading ? null : () => props?.closeModal()}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box className="modal-wrapper" style={{ width: "80%" }}>
        <Card className="modal">
          <Box className="modal-content text-center">
            <Icon style={{ fontSize: 40 }}>archive</Icon>
            <h3 className="mb-5">Import Container Stock</h3>
            {(!reviewFail && !attachForm) && (
              <Paper elevation={0} className="bg-grey p-5">
                <Typography align="center">
                  You can import Container Stocks Data at once.
                </Typography>
                <Typography align="center">
                  If you need file template, you can{" "}
                  <Link href="/import-file/import-stock-template.xlsx">
                    <strong>Download here</strong>
                  </Link>
                  .
                </Typography>
                {uploading && (
                  <Typography align="center" className="mt-5">
                    Importing... {completed} completed, {uncomplete} failed of{" "}
                    {totalData}
                  </Typography>
                )}
                {!uploading && data.length > 0 && (
                  <Box>
                    {!finishAttach && (
                      <Typography align="center" className="mb-3 mt-5">
                        Step 1. (Optional) Upload photo or other attachment for all data in file.
                      </Typography>)}
                    {finishAttach && (
                      <Typography align="center" className="mb-3 mt-5">
                        Step 1. (Optional) Upload photo or other attachment for all data in file.<br />
                        Images ({listFile.images.length}), CSC Sertificate ({listFile.csc_certificates.length}), Specification ({listFile.specifications.length}), Contract ({listFile.contracts.length}), Invoice ({listFile.invoices.length}), Drawings ({listFile.drawings.length}), Surveys ({listFile.surveys.length}), Relative documents ({listFile.relative_documents.length}), Original photos ({listFile.original_photos.length})
                      </Typography>)}
                    <Typography align="center">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setAttachForm(true)}
                        disableElevation
                      >
                        Add photo and attachment
                      </Button>
                    </Typography>
                    <Typography align="center" className="mb-3 mt-5">
                      Step 2. Import all data in file combine with attachment above (if have any).
                    </Typography>
                    <Typography align="center">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => importBatchData(0)}
                        disableElevation
                      >
                        Import {totalData} rows of data from "{fileName}"
                      </Button>
                    </Typography>
                    <Typography align="center" className="mb-3 mt-5">
                      <Button
                        variant="contained"
                        color="default"
                        onClick={() => document.getElementById(id).click()}
                        disableElevation
                      >
                        Change other files
                      </Button>
                    </Typography>
                  </Box>
                )}
                {finishImport && (
                  <Typography align="center" className="mt-5">
                    {completed} completed, {uncomplete} failed
                  </Typography>
                )}
                {finishImport && batchId != "" && (
                  <Typography align="center" className="mb-3 mt-5">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={undo}
                      disableElevation
                    >
                      Undo last Imported Data
                    </Button>
                  </Typography>
                )}
                {data.length <= 0 && (
                  <Typography align="center" className="mt-5">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => document.getElementById(id).click()}
                      disableElevation
                    >
                      Upload File Import
                    </Button>
                  </Typography>
                )}
                <InputBase
                  onChange={selectFile}
                  style={{ display: "none" }}
                  id={id}
                  type="file"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
              </Paper>
            )}
            {(attachForm && !reviewFail) &&
              (<Paper elevation={0} className="bg-grey p-5">
                <Box className="mb-3 text-left">
                  <Grid container className="mt-3" spacing={3} justify="center" alignItems="center">
                    <Grid item md={6}>
                      <InputLabel shrink={true}>Images</InputLabel>
                      <DropZoneComponent
                        id="images"
                        exportList={(res) => onChangeUpload(res, "images")}
                        path="container"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box className="mb-3 text-left">
                  <Grid container className="mt-3" spacing={3} justify="center" alignItems="center">
                    <Grid item md={6}>
                      <InputLabel shrink={true}>CSC Certificate</InputLabel>
                      <DropZoneComponent
                        id="csc_certificates"
                        exportList={(res) => onChangeUpload(res, "csc_certificates")}
                        path="csc"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box className="mb-3 text-left">
                  <Grid container className="mt-3" spacing={3} justify="center" alignItems="center">
                    <Grid item md={6}>
                      <InputLabel shrink={true}>Specification</InputLabel>
                      <DropZoneComponent
                        id="specifications"
                        exportList={(res) => onChangeUpload(res, "specifications")}
                        path="container_spec"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box className="mb-3 text-left">
                  <Grid container className="mt-3" spacing={3} justify="center" alignItems="center">
                    <Grid item md={6}>
                      <InputLabel shrink={true}>Contract</InputLabel>
                      <DropZoneComponent
                        id="contracts"
                        exportList={(res) => onChangeUpload(res, "contracts")}
                        path="container_contract"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box className="mb-3 text-left">
                  <Grid container className="mt-3" spacing={3} justify="center" alignItems="center">
                    <Grid item md={6}>
                      <InputLabel shrink={true}>Invoice</InputLabel>
                      <DropZoneComponent
                        id="invoices"
                        exportList={(res) => onChangeUpload(res, "invoices")}
                        path="container_invoice"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box className="mb-3 text-left">
                  <Grid container className="mt-3" spacing={3} justify="center" alignItems="center">
                    <Grid item md={6}>
                      <InputLabel shrink={true}>Drawings</InputLabel>
                      <DropZoneComponent
                        id="drawings"
                        exportList={(res) => onChangeUpload(res, "drawings")}
                        path="container_drawings"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box className="mb-3 text-left">
                  <Grid container className="mt-3" spacing={3} justify="center" alignItems="center">
                    <Grid item md={6}>
                      <InputLabel shrink={true}>Surveys</InputLabel>
                      <DropZoneComponent
                        id="surveys"
                        exportList={(res) => onChangeUpload(res, "surveys")}
                        path="container_surveys"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box className="mb-3 text-left">
                  <Grid container className="mt-3" spacing={3} justify="center" alignItems="center">
                    <Grid item md={6}>
                      <InputLabel shrink={true}>Relative Documents</InputLabel>
                      <DropZoneComponent
                        id="relative_documents"
                        exportList={(res) => onChangeUpload(res, "relative_documents")}
                        path="container_others"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box className="mb-3 text-left">
                  <Grid container className="mt-3" spacing={3} justify="center" alignItems="center">
                    <Grid item md={6}>
                      <InputLabel shrink={true}>Original Photos</InputLabel>
                      <DropZoneComponent
                        id="original_photos"
                        exportList={(res) => onChangeUpload(res, "original_photos")}
                        path="container_original_photos"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box className="mb-3">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={finishAttachment}
                    disableElevation
                  >
                    Finished Attach File
                  </Button>
                </Box>
              </Paper>)}
            {(reviewFail && !attachForm) && (
              <Container fixed style={{ width: "5000px", maxWidth: "5000px" }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell width={170}>Serial</TableCell>
                        <TableCell width={90}>Size</TableCell>
                        <TableCell width={280}>Type</TableCell>
                        <TableCell width={150}>Color Name</TableCell>
                        <TableCell width={150}>Color Code</TableCell>
                        <TableCell width={190}>Sale Status</TableCell>
                        <TableCell width={260}>Available Status</TableCell>
                        <TableCell width={90}>Repair Status</TableCell>
                        <TableCell width={170}>Condition</TableCell>
                        <TableCell width={100}>Percentage</TableCell>
                        <TableCell width={110}>YOM Month</TableCell>
                        <TableCell width={130}>YOM Year</TableCell>
                        <TableCell width={180}>Date In Stock</TableCell>
                        <TableCell width={180}>Date Out Stock</TableCell>
                        <TableCell width={180}>Gate In Date</TableCell>
                        <TableCell width={180}>Gate Out Date</TableCell>
                        <TableCell width={140}>Delivery Status</TableCell>
                        <TableCell width={250}>Country Location</TableCell>
                        <TableCell width={250}>City Location</TableCell>
                        <TableCell width={170}>Cost Price</TableCell>
                        <TableCell width={170}>Selling Price</TableCell>
                        <TableCell width={180}>Carrier</TableCell>
                        <TableCell width={140}>One Way Ref</TableCell>
                        <TableCell width={140}>Supplier Invoice</TableCell>
                        <TableCell width={140}>Supplier Release</TableCell>
                        <TableCell width={140}>Depo Release</TableCell>
                        <TableCell width={140}>Owner</TableCell>
                        <TableCell width={140}>Redelivery Ref</TableCell>
                        <TableCell>Remark</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {revData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((rdata, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              name="serial_number"
                              variant="outlined"
                              value={checkNull(rdata.serial_number)}
                              required
                              error={!rdata.serial_number}
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                              margin="dense"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="size_id"
                              select
                              variant="outlined"
                              value={rdata.size_id}
                              required
                              error={!rdata.size_id}
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            >
                              <MenuItem value={null}>
                                <em>None</em>
                              </MenuItem>
                              {sizeOptions?.map((row, key) => {
                                return (
                                  <MenuItem value={row.id}>{row?.name}</MenuItem>
                                );
                              })}
                              <MenuItem value="create-new">
                                <em>Add (+)</em>
                              </MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="type_id"
                              select
                              variant="outlined"
                              value={rdata.type_id}
                              required
                              error={!rdata.type_id}
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            >
                              <MenuItem value={null}>
                                <em>None</em>
                              </MenuItem>
                              {typeOptions?.map((row, key) => {
                                return (
                                  <MenuItem value={row.id}>{row?.name}</MenuItem>
                                );
                              })}
                              <MenuItem value="create-new">
                                <em>Add (+)</em>
                              </MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              options={colorList?.map((option) => option.name_english)}
                              autoHighlight
                              value={rdata.color_name}
                              renderOption={(option) => (<Chip size="small" label={option} style={{ backgroundColor: colorList.filter(val => val.name_english == option)[0].html_code }} />)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name="color_name"
                                  variant="outlined"
                                  size="small"
                                  error=""
                                  fullWidth
                                />
                              )}
                              onChange={(e, v) => onColorChange(e, v, page * rowsPerPage + index, "name")}
                            />
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              options={colorList?.map((option) => option.ral_code)}
                              autoHighlight
                              value={rdata.color_code}
                              renderOption={(option) => (<Chip size="small" label={option} style={{ backgroundColor: colorList.filter(val => val.ral_code == option)[0].html_code }} />)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name="color_code"
                                  variant="outlined"
                                  size="small"
                                  error=""
                                  fullWidth
                                />
                              )}
                              onChange={(e, v) => onColorChange(e, v, page * rowsPerPage + index, "code")}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="stock_status_id"
                              select
                              variant="outlined"
                              value={rdata.stock_status_id}
                              required
                              error={!rdata.stock_status_id}
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            >
                              <MenuItem value={null}>
                                <em>None</em>
                              </MenuItem>
                              {statusOptions?.map((row, key) => {
                                return (
                                  <MenuItem value={row.id}>{row?.name}</MenuItem>
                                );
                              })}
                              <MenuItem value="create-new">
                                <em>Add (+)</em>
                              </MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="available_status"
                              select
                              variant="outlined"
                              value={rdata.available_status.join(",")}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            >
                              <MenuItem value={null}><em>None</em></MenuItem>
                              <MenuItem value="Sale Stock">Sale Stock</MenuItem>
                              <MenuItem value="Lease Stock">Lease Stock</MenuItem>
                              <MenuItem value="Sale Stock,Lease Stock">Sale Stock,Lease Stock</MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="repair_status_id"
                              select
                              variant="outlined"
                              value={rdata.repair_status_id}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            >
                              <MenuItem value={null}>
                                <em>None</em>
                              </MenuItem>
                              {repairOptions?.map((row, key) => {
                                return (
                                  <MenuItem value={row.id}>{row?.name}</MenuItem>
                                );
                              })}
                              <MenuItem value="create-new">
                                <em>Add (+)</em>
                              </MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="condition_id"
                              select
                              variant="outlined"
                              value={rdata.condition_id}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            >
                              <MenuItem value={null}>
                                <em>None</em>
                              </MenuItem>
                              {conditionOptions?.map((row, key) => {
                                return (
                                  <MenuItem value={row.id}>{row?.name}</MenuItem>
                                );
                              })}
                              <MenuItem value="create-new">
                                <em>Add (+)</em>
                              </MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="percentage"
                              variant="outlined"
                              value={checkNull(rdata.percentage)}
                              type="number"
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="yom_month"
                              variant="outlined"
                              value={checkNull(rdata.yom_month)}
                              type="number"
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="yom_year"
                              variant="outlined"
                              value={checkNull(rdata.yom_year)}
                              type="number"
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="date_in_stock"
                              variant="outlined"
                              value={moment(rdata.date_in_stock).format("YYYY-MM-DD")}
                              type="date"
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="date_out_stock"
                              variant="outlined"
                              value={moment(rdata.date_out_stock).format("YYYY-MM-DD")}
                              type="date"
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="gate_in_date"
                              variant="outlined"
                              value={moment(rdata.gate_in_date).format("YYYY-MM-DD")}
                              type="date"
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="gate_out_date"
                              variant="outlined"
                              value={moment(rdata.gate_out_date).format("YYYY-MM-DD")}
                              type="date"
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="delivery_status_id"
                              select
                              variant="outlined"
                              value={rdata.delivery_status_id}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            >
                              <MenuItem value={null}>
                                <em>None</em>
                              </MenuItem>
                              {deliveryOptions?.map((row, key) => {
                                return (
                                  <MenuItem value={row.id}>{row?.name}</MenuItem>
                                );
                              })}
                              <MenuItem value="create-new">
                                <em>Add (+)</em>
                              </MenuItem>
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              options={countryOptions}
                              autoHighlight
                              value={rdata.selected_country}
                              getOptionLabel={(option) => option?.label}
                              renderOption={(option) => (
                                <React.Fragment>{option?.label}</React.Fragment>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name="country_id"
                                  variant="outlined"
                                  error=""
                                  fullWidth
                                />
                              )}
                              onChange={(e, v) => onCountryCityChange(e, v, page * rowsPerPage + index, "country")}
                            />
                          </TableCell>
                          <TableCell>
                            <Autocomplete
                              options={cityOptions[rdata.country_id]?.cities ?? [{ id: "", label: "" }]}
                              autoHighlight
                              value={rdata.selected_city}
                              getOptionLabel={(option) => option?.label}
                              renderOption={(option) => (
                                <React.Fragment>{option?.label}</React.Fragment>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name="city_id"
                                  variant="outlined"
                                  error=""
                                  fullWidth
                                />
                              )}
                              onChange={(e, v) => onCountryCityChange(e, v, page * rowsPerPage + index, "city")}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="cost_price"
                              variant="outlined"
                              value={checkNull(rdata.cost_price)}
                              type="number"
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="selling_price"
                              variant="outlined"
                              value={checkNull(rdata.selling_price)}
                              type="number"
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="carrier"
                              variant="outlined"
                              value={checkNull(rdata.carrier)}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="one_way_ref"
                              variant="outlined"
                              value={checkNull(rdata.one_way_ref)}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="supplier_invoice"
                              variant="outlined"
                              value={checkNull(rdata.supplier_invoice)}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="supplier_release"
                              variant="outlined"
                              value={checkNull(rdata.supplier_release)}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="depo_release"
                              variant="outlined"
                              value={checkNull(rdata.depo_release)}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="owner"
                              variant="outlined"
                              value={checkNull(rdata.owner)}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="redelivery_ref"
                              variant="outlined"
                              value={checkNull(rdata.redelivery_ref)}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="remarks"
                              variant="outlined"
                              value={checkNull(rdata.remarks)}
                              error=""
                              onChange={(e) => onInputChange(e, page * rowsPerPage + index)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>

                        <TablePagination
                          count={revData.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onChangePage={handleChangePage}
                          onChangeRowsPerPage={handleChangeRowsPerPage}

                          // onPageChange={handleChangePage}
                          // onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
                <Typography align="center" className="mb-3 mt-5">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => importRevData(0, completed, uncomplete, null)}
                    disableElevation
                  >
                    Import modified Data
                  </Button>
                </Typography>
              </Container>
            )}
          </Box>
        </Card>
      </Box>
    </Modal>
  );
}
