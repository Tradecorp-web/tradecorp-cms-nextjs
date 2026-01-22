import { Button, ButtonGroup, Card, makeStyles, Divider, Grid, Icon, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography, Box, TextField, Backdrop, CircularProgress, Collapse, Tooltip, Link } from "@material-ui/core"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import getRoute from "../../../helpers/router"
import { Edit,Delete,Send,KeyboardArrowUp,KeyboardArrowDown } from '@material-ui/icons'
import { getListQuoteApi,deleteQuoteApi,getDetailQuoteApi } from "../../../services/api/quote.api"
import QuoteForm from "./form"
import BaseLayout from "../../base_layout/base-layout-design"
import AlertDialog from "../../base_component/dialog"
import { currency } from '../../../helpers/general'
import { CircularProgressCustom } from "../../base_component/spinner"
import Moment from 'moment'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
          borderBottom: 'unset',
        },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
}))

function Row(props) {
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    var totalPrice = 0

    props.row.container_stocks?.map((item, key) => {
        totalPrice += item.price
    })

    props.row.containers?.map((item, key) => {
        totalPrice += (item.price*item.qty)
    })

    props.row.products?.map((item, key) => {
        totalPrice += (item.price*item.qty)
    })
    
    return (
      <React.Fragment>
        <TableRow key={props.keys} className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell>{props.keys+1+(props.page*props.rowsPerPage)}</TableCell>
          <TableCell>{props.row.name}</TableCell>
          <TableCell>{Moment(props.row.quote_date).format("LL")}</TableCell>
          <TableCell>{props.row.customer.company_type} {props.row.customer.company}</TableCell>
          <TableCell>{props.row.sales.name}</TableCell>
          <TableCell>{props.row.status_detail.name}</TableCell>
          <TableCell>
            {/*<Tooltip title="Print" placement="top">
                <Link href="sample_quotation.pdf" target="_blank">Print</Link>
            </Tooltip>*/}
            {(props.row.status == 7001) &&
                <React.Fragment>
                    <Tooltip title="Edit" placement="top">
                        <IconButton>
                            <Edit onClick={() => props.clickAction()} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" placement="top">
                        <IconButton>
                            <Delete onClick={() => props.clickDelete()} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Submit for Approval" placement="top">
                        <IconButton>
                            <Send />
                        </IconButton>
                    </Tooltip>
                </React.Fragment>
            }
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h3" gutterBottom component="div">
                  Items
                </Typography>
                <Table size="small" aria-label="materials">
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Remark</TableCell>
                      <TableCell align="center">Unit Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.row.container_stocks?.map((item, key) => (
                        item.stock_id != "" &&
                        <TableRow key={props.keys+key}>
                            <TableCell>{item.serial_number}</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>{item.remark}</TableCell>
                            <TableCell align="right">{currency(item.price)}</TableCell>
                            <TableCell align="center">1</TableCell>
                            <TableCell align="right">{currency(item.price)}</TableCell>
                        </TableRow>
                    ))}
                    {props.row.containers?.map((item, key) => (
                        item.qty > 0 &&
                        <TableRow key={props.keys+key}>
                            <TableCell>-</TableCell>
                            <TableCell>Container {item.size.name}</TableCell>
                            <TableCell>{item.remark}</TableCell>
                            <TableCell align="right">{currency(item.price)}</TableCell>
                            <TableCell align="center">{item.qty}</TableCell>
                            <TableCell align="right">{currency(item.price*item.qty)}</TableCell>
                        </TableRow>
                    ))}
                    {props.row.products?.map((item, key) => (
                        item.product_id?.length > 0 &&
                      <TableRow key={props.keys+key}>
                        <TableCell>{item.detail.code}</TableCell>
                        <TableCell>{item.detail.name}</TableCell>
                        <TableCell>{item.remark}</TableCell>
                        <TableCell align="right">{currency(item.price)}</TableCell>
                        <TableCell align="center">{item.qty} {item.unit}</TableCell>
                        <TableCell align="right">{currency(item.price*item.qty)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell align="right"><Typography variant="h4">Total:</Typography></TableCell>
                      <TableCell align="right"><Typography variant="h4">{currency(totalPrice)}</Typography></TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                      
                  </TableFooter>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }

export default function Page() {
    const router = useRouter()
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [openDialog, setOpenDialog] = useState(false)
    const [idData, setIdData] = useState(null)
    const [data, setData] = useState(null)
    const [listData, setListData] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [rowCount, setRowCount] = useState(0)
    const [openForm, setOpenForm] = useState(false)
    const [exportLoading, setExportLoading] = useState(false)

    const confirmDelete = (id) => {
        setIdData(id)
        setOpenDialog(true)
    }

    const deleteQuote = async () => {
        setOpenDialog(false)
        try {
            setOpen(true)
            var res = await deleteQuoteApi(idData)
            var data = await getListQuoteApi()
            setListData(data.result)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    useEffect(async () => {
        try {
            setOpen(true)
            var data = await getListQuoteApi()
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }, []);

    const handleChangePage = async (event, newPage) => {
        try {
            setOpen(true)
            var data = await getListQuoteApi(search,newPage,rowsPerPage)
            setRowCount(data.total)
            setListData(data.result)
            setPage(newPage)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        try {
            setOpen(true)
            var data = await getListQuoteApi(search,0,parseInt(event.target.value, 10))
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const doSearch = async () => {
        try {
            setOpen(true)
            var data = await getListQuoteApi(search,0,rowsPerPage)
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const refreshListQuote = async () => {
        setOpenForm(false)
        try {
            setOpen(true)
            var data = await getListQuoteApi(search,page,rowsPerPage)
            setRowCount(data.total)
            setListData(data.result)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const editForm = async (id) => {
        setOpen(true)
        var result = await getDetailQuoteApi(id)
        setData({id:id,name:result.name,quote_date:result.quote_date,sales_id:result.sales_id,customer_id:result.customer_id,remark:result.remark,containers:result.containers,container_stocks:result.container_stocks,status:result.status,products:result.products})
        setOpen(false)
        setOpenForm(true)
    }

    return <BaseLayout title="Quotation">
        <Box className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                        <h1 className="mb-3">Quotation</h1>
                        <Box className="card no-padding">
                            <Box className="p-3 display-space-between">
                                <Box className="search-bar me-3" style={{width: "25%"}}>
                                    <TextField
                                        variant="standard"
                                        placeholder="Search Quote Name…"
                                        className="search-input"
                                        readOnly={open}
                                        defaultValue={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        InputProps={{ 
                                            'aria-label': 'search',
                                            'endAdornment': (
                                                <IconButton onClick={doSearch} size="small"><Icon>search</Icon></IconButton>
                                            )
                                        }}/>
                                </Box>
                                <ButtonGroup variant="outlined" color="default" aria-label="split button">
                                    <Button onClick={() => {
                                        setData(null)
                                        setOpenForm(true)
                                        }}>
                                        <Icon>add</Icon>Create Quotation
                                    </Button>
                                </ButtonGroup>
                            </Box>
                            <Divider/>
                            <TableContainer component={Card}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={12} />
                                            <TableCell width={12}>No</TableCell>
                                            <TableCell>Quote Name</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Customer</TableCell>
                                            <TableCell>Sales</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {listData?.map((row, key) => (
                                        <Row keys={key} row={row} clickAction={() => editForm(row.id)} clickDelete={() => confirmDelete(row.id)} page={page} rowsPerPage={rowsPerPage} />
                                    ))}
                                    {listData?.length == 0 && 
                                        <TableRow>
                                            <TableCell colspan={8} className="text-center text-muted" align="center">No data to show</TableCell>
                                        </TableRow>
                                    }
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[20, 50, 100]}
                                                colSpan={8}
                                                count={rowCount}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                SelectProps={{
                                                    inputProps: { 'aria-label': 'rows per page' },
                                                    native: true,
                                                }}
                                                onChangePage={handleChangePage}
                                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </Box>
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteQuote()} title="Delete confirmation" body="Are you sure want to delete this record?" />
            <QuoteForm open={openForm} closeModal={refreshListQuote} quote={data} />
        </Box>
    </BaseLayout>
}