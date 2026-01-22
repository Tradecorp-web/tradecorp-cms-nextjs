import { Button, Divider, Grid, InputBase, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { Check } from "@material-ui/icons"
import BaseLayoutStockContainer from '../../base_layout/base-layout-stock-container';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getListContainerStockApi, updateContainerApi, updateManyContainerStockPriceApi } from '../../../services/api/container-stocks.api';
import { masterDataSwr } from '../../../services/swr/master-data.swr';
import { getListDepoApi } from '../../../services/api/depo.api';
import { CircularProgressCustom } from '../../base_component/spinner';
import { rupiah } from '../../../helpers/general';
import Loading from '../../helper/loading';

export default function StockContainerPriceGeneratorPage() {

  const router = useRouter()

  const [formState, setFormState] = useState(null)
  function onChangeInput(e) {
    setFormState({...formState, [e.target.name]: e.target.value})
  }

  // ==========================================
  // [START] GET DATA & PAGINATION
  // ------------------------------------------
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  
  const [search, setSearch] = useState("")
  
  const [isLoading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [updateList, setUpdateList] = useState([])

  const loadData = async () => {
    setLoading(true)
    var depoIds = ""
    var tempDepo = formState?.depo?.map((item) => item?.id)
    console.log(formState?.depo)
    console.log(tempDepo)
    tempDepo?.forEach((item) => {
      if (depoIds == "") {
        depoIds = item
      } else {
        depoIds += `,${item}`
      }
    })
    var res = await getListContainerStockApi({
      search: search, 
      page: page+1, 
      limit: 10000,
      orderBy: "serial_number",
      order: "asc",
      depoId: depoIds,
      size: formState?.size?.id,
      type: formState?.type?.id,
      status: formState?.status?.id,
      condition: formState?.condition?.id,
      repairStatus: formState?.repairStatus?.id,
      percentageFrom: formState?.percentageFrom,
      percentageTo: formState?.percentageTo,
    })
    if(res?.result) {
      setTotal(res?.total)
      var update = []
      res?.result?.map((item,i) => {
        update.push({id:item.id, selling_price:item.selling_price})
      })
      setDataList(res?.result)
      setUpdateList(update)
      setIsFinished(false)
    }
    setLoading(false)
  }

  const [depoOptions, setDepoOptions] = useState([])
  const [containerTypeOptions, setContainerTypeOptions] = useState([])
  const [conditionOptions, setConditionOptions] = useState([])
  const [repairStatusOptions, setRepairStatusOptions] = useState([])
  const [sizeOptions, setSizeOptions] = useState([])
  var masterSwr = masterDataSwr("")
  useEffect(() => {
      if(masterSwr?.data) {
      setContainerTypeOptions(masterSwr?.data?.filter(val => val?.category == "container_type") ?? [])
      setConditionOptions(masterSwr?.data?.filter(val => val?.category == "condition") ?? [])
      setRepairStatusOptions(masterSwr?.data?.filter(val => val?.category == "status_repair") ?? [])
      setSizeOptions(masterSwr?.data?.filter(val => val?.category == "container_size") ?? [])
      }
  }, [masterSwr?.data])

  useEffect(() => {
    getListDepoApi({
      page: 1, 
      limit: 200,
      orderBy: "name",
      order: "asc",
    }).then(res => {
        setDepoOptions(res?.result ?? [])
    })
  }, [])

  function changeFilter() {
    setPage(0)
    setSearch(formState?.serialNumber)
    setSize(formState?.size?.id)
    setYom(formState?.yom)
    setStatus(formState?.status?.id)
    setCondition(formState?.condition?.id)
  }
  // ------------------------------------------
  // [END] GET DATA & PAGINATION
  // ==========================================
  
  // ==========================================
  // [START] UPDATE SCRIPT
  // ------------------------------------------
  const [isLoadingGenerate, setLoadingGenerate] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [updateIndex, setUpdateIndex] = useState(-1)
  const updateData = async (index) => {
    setLoadingGenerate(true)
    // setUpdateIndex(index)
    // console.log(dataList.length)
    // console.log(index+1)
    // if(dataList.length > index+1) {
    //   console.log("Updating")
    //   var res = await updateContainerApi(dataList[index], dataList[index].id)
    //   if(res?.result) {
    //     setTotal(res?.total)
    //     setDataList(res?.result)
    //   }
    //   updateData(index+1)
    // } else {
    //   console.log("Updated Done")
    //   setLoadingGenerate(false)
    //   setUpdateIndex(-1)
    // }
    // console.log(updateList)
    updateManyContainerStockPriceApi(updateList)
    .then((res) => {

      setLoadingGenerate(false)
      setIsFinished(true)
    })
    .catch((err) => {
      console.log(err)
      setLoadingGenerate(false)
    })
  }
  // ------------------------------------------
  // [END] UPDATE SCRIPT
  // ==========================================

  return (
    <BaseLayoutStockContainer title="Stock Price Generator">
      <div className="p-5 content-wrapper">
        <Grid container className="page-container">
          <Grid item xs={12} lg={12} xl={12}>
            <h1 className="mb-3">Stock Price Generator</h1>
            <Grid container className="page-container"spacing={3}>
              <Grid item xs={4} lg={4} xl={4}>
                <div className="card">
                  <div className="mb-3 text-left">
                    <InputLabel className="pb-1">
                        <Typography variant="caption">Depo</Typography>
                    </InputLabel>
                    <Select
                        labelId="demo-customized-select-label"
                        className="input"
                        placeholder="Select Depo"
                        fullWidth
                        name="depo"
                        multiple
                        value={formState?.depo ?? []}
                        onChange={onChangeInput}
                        input={<InputBase />}
                        >
                        <MenuItem value="none"><em className="text-muted">Select Depo</em></MenuItem>
                        {depoOptions?.map((val, i) => {
                            return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                        })}
                    </Select>
                  </div>
                  <div className="mb-3 text-left">
                    <Grid container spacing={3}>
                      <Grid item md={6}>
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Size</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-customized-select-label"
                            className="input"
                            placeholder="Select Size"
                            fullWidth
                            name="size"
                            value={formState?.size ?? "none"}
                            onChange={onChangeInput}
                            input={<InputBase />}
                            >
                            <MenuItem value="none"><em className="text-muted">Select Size</em></MenuItem>
                            {sizeOptions?.map((val, i) => {
                                return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                            })}
                        </Select>
                      </Grid>
                      <Grid item md={6}>
                          <InputLabel className="pb-1">
                              <Typography variant="caption">Type</Typography>
                          </InputLabel>
                          <Select
                              labelId="demo-customized-select-label"
                              className="input"
                              placeholder="Select Type"
                              fullWidth
                              name="type"
                              value={formState?.type ?? "none"}
                              onChange={onChangeInput}
                              input={<InputBase />}
                              >
                              <MenuItem value="none"><em className="text-muted">Select Type</em></MenuItem>
                              {containerTypeOptions?.map((val, i) => {
                                  return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                              })}
                          </Select>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="mb-3 text-left">
                    <Grid container className="mt-3" spacing={3}>
                      <Grid item md={6}>
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Condition</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-customized-select-label"
                            className="input"
                            placeholder="Select Condition"
                            fullWidth
                            name="condition"
                            value={formState?.condition ?? "none"}
                            onChange={onChangeInput}
                            input={<InputBase />}
                            >
                            <MenuItem value="none"><em className="text-muted">Select Condition</em></MenuItem>
                            {conditionOptions?.map((val, i) => {
                                return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                            })}
                        </Select>
                      </Grid>
                      <Grid item md={6}>
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Repair Status</Typography>
                        </InputLabel>
                        <Select
                            labelId="demo-customized-select-label"
                            className="input"
                            placeholder="Select Repair Status"
                            fullWidth
                            name="repairStatus"
                            value={formState?.repairStatus ?? "none"}
                            onChange={onChangeInput}
                            input={<InputBase />}
                            >
                            <MenuItem value="none"><em className="text-muted">Select Repair Status</em></MenuItem>
                            {repairStatusOptions?.map((val, i) => {
                                return <MenuItem key={val?.id} value={val}>{val?.name}</MenuItem>
                            })}
                        </Select>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="mb-3 text-left">
                    <Grid container className="mt-3" spacing={3}>
                      <Grid item md={6}>
                        <InputLabel className="pb-1">
                            <Typography variant="caption">Percentage from (%)</Typography>
                        </InputLabel>
                        <InputBase
                          name="percentageFrom"
                          color="secondary"
                          className="input uppercase"
                          value={formState?.percentageFrom}
                          type="number"
                          placeholder="0"
                          onChange={onChangeInput}
                          fullWidth>
                        </InputBase>
                      </Grid>
                      <Grid item md={6}>
                        <InputLabel className="pb-1">
                            <Typography variant="caption">To (%)</Typography>
                        </InputLabel>
                        <InputBase
                          name="percentageTo"
                          color="secondary"
                          className="input uppercase"
                          value={formState?.percentageTo}
                          type="number"
                          placeholder="100"
                          onChange={onChangeInput}
                          fullWidth>
                        </InputBase>
                      </Grid>
                    </Grid>
                  </div>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => loadData()}
                    disableElevation>
                    {isLoading ? <CircularProgressCustom size={26} /> : "Search Container Stock"}
                  </Button>
                </div>
              </Grid>
              <Grid item xs={8} lg={8} xl={8}>
                {(dataList?.length > 0) && <div className="card no-padding">
                  <div className="p-3">
                    <div>{total} stocks found based on the above criteria. Enter the value below to change the price of existing stocks</div>
                    <div className="mb-3 mt-3 text-left">
                      <InputLabel className="pb-1">
                          <Typography variant="caption">Price</Typography>
                      </InputLabel>
                      <InputBase
                        name="price"
                        color="secondary"
                        className="input"
                        value={formState?.price}
                        type="number"
                        placeholder="0"
                        onChange={(e) => {
                          onChangeInput(e)
                          var tempData = updateList?.map((item) => {
                            item.selling_price = parseInt(e.target.value)
                            return item
                          })
                          setUpdateList([...tempData])
                        }}
                        fullWidth>
                      </InputBase>
                    </div>
                  </div>
                  <Divider />
                  <TableContainer>
                      <Table aria-label="simple table">
                          <TableHead>
                              <TableRow>
                                  <TableCell width={12}>No</TableCell>
                                  <TableCell>Serial Number</TableCell>
                                  <TableCell>Size/Type</TableCell>
                                  <TableCell>Repair</TableCell>
                                  <TableCell>Condition</TableCell>
                                  <TableCell>Price</TableCell>
                                  <TableCell></TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                          {!isLoading && dataList.map((data, index) => (
                              <TableRow key={index}>
                                  <TableCell>{index + 1 + (page*limit)}</TableCell>
                                  <TableCell>{data?.serial_number}</TableCell>
                                  <TableCell>{data?.size?.name}/{data?.type?.name}</TableCell>
                                  <TableCell>{data?.repair_status?.name}</TableCell>
                                  <TableCell>{data?.condition?.name}</TableCell>
                                  <TableCell>
                                      <InputBase
                                        name={`sellingPrice#${index}`}
                                        color="secondary"
                                        className="input uppercase"
                                        value={updateList[index].selling_price}
                                        type="number"
                                        placeholder="100"
                                        onChange={(e) => {
                                          updateList[index].selling_price = parseInt(e.target.value)
                                          setUpdateList([...updateList])
                                        }}
                                        fullWidth>
                                      </InputBase>
                                  </TableCell>
                                  <TableCell>
                                    {isLoadingGenerate && <Loading/>}
                                    {isFinished && <Check style={{color:"green"}} />}
                                  </TableCell>
                              </TableRow>
                          ))}
                          {(isLoading) && <TableRow>
                              <TableCell colSpan={4} className="text-center text-muted" align="center">
                                  Loading...
                              </TableCell>
                          </TableRow>}
                          {(!isLoading && dataList?.length <= 0) && <TableRow>
                              <TableCell colSpan={4} className="text-center text-muted" align="center">
                                  No Data
                              </TableCell>
                          </TableRow>}
                          </TableBody>
                      </Table>
                    </TableContainer>
                    <div className="p-3">
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => updateData(0)}
                        disableElevation>
                        {isLoadingGenerate ? <CircularProgressCustom size={26} /> : "Generate Price"}
                      </Button>
                    </div>
                </div>}

                {!(dataList?.length > 0) && <div className="card">
                  No stocks found.
                </div>}
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </div>
    </BaseLayoutStockContainer>
  )
}