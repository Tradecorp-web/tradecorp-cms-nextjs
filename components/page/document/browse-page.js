import { Divider, Grid, Icon, Typography, Link, Box, Button, ButtonGroup, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Card, Tooltip, makeStyles } from "@material-ui/core"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import getRoute from "../../../helpers/router"
import { Person, Group } from "@material-ui/icons"
import { getBrowseFolderApi } from "../../../services/api/folder.api"
import BaseLayout from "../../base_layout/base-layout-document"
import { CircularProgressCustom } from "../../base_component/spinner"
import { switchView } from "../../../helpers/general"
import Moment from 'moment'

const useStyles = makeStyles((theme) => ({
    customWidth: {
        minWidth: 150,
        fontSize: 14,
    },
}))

function Tooltiplist(props) {
    var list = []
    props.data.map((row,key) => {
        list.push(row.name)
    })
    var lists = list.join(", ")
    return <React.Fragment>{lists}</React.Fragment>
}

export default function Page() {
    const classes = useStyles()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [view, setView] = useState("")
    const [search, setSearch] = useState("")
    const [idData, setIdData] = useState(null)
    const [listData, setListData] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [rowCount, setRowCount] = useState(0)

    function openPage(e, url) {
        //e.preventDefault()
        router.push(url)
    }

    const changeView = (vw) => {
        switchView(vw)
        setView(vw)
    }

    useEffect(async () => {
        try {
            setOpen(true)
            var vw = switchView()
            setView(vw)
            var data = await getBrowseFolderApi("",0,999,"")
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
            var data = await getBrowseFolderApi(search,newPage,rowsPerPage)
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
            var data = await getBrowseFolderApi(search,0,parseInt(event.target.value, 10))
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
            var data = await getBrowseFolderApi(search,0,rowsPerPage)
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const checkUpdate = (update,create) => {
        if (update == undefined) {
            return Moment(create).format("LLL")
        } else {
            if (update.startsWith("0001")) {
                return Moment(create).format("LLL")
            } else {
                return Moment(update).format("LLL")
            }
        }
    }

    return <BaseLayout title="Authorized Document for Distribution">
        <Box className="p-5">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={8}>
                    <Box className="p-3 display-space-between">
                        <h1 className="mb-5">Browse Folders</h1>
                        <ButtonGroup variant="outlined" color="default" aria-label="split button">
                            <Tooltip title="List View" placement="top">
                                <Button onClick={() => changeView("list") }>
                                    <Icon>view_list</Icon>
                                </Button>
                            </Tooltip>
                            <Tooltip title="Grid View" placement="top">
                                <Button onClick={() => changeView("grid") }>
                                    <Icon>grid_view</Icon>
                                </Button>
                            </Tooltip>
                        </ButtonGroup>
                    </Box>
                    <Divider />
                    {view == "list" &&
                    <TableContainer component={Card}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={12}></TableCell>
                                    <TableCell>File Name</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Modified</TableCell>
                                    <TableCell>Shares</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {listData?.map((row, key) => (
                                <TableRow>
                                    <TableCell>
                                        <Tooltip title={`Go to ${row.folder_name}`} placement="top">
                                            <Link href={"/document/browse/"+row.id}><Icon>folder_open</Icon></Link>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={`Go to ${row.folder_name}`} placement="top">
                                            <Link href={"/document/browse/"+row.id}>{row.folder_name}</Link>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{Moment(row.created_at).format("LLL")}</TableCell>
                                    <TableCell>{checkUpdate(row.updated_at,row.created_at)}</TableCell>
                                    <TableCell>
                                        {row.team_list != null &&
                                        <Tooltip title={
                                            <Tooltiplist data={row.team_list} />
                                        } placement="bottom" classes={{tooltip:classes.customWidth}}>
                                            <Icon>
                                                <Group></Group>
                                            </Icon>
                                        </Tooltip>}
                                        {row.user_list != null &&
                                        <Tooltip title={
                                            <Tooltiplist data={row.user_list} />
                                        } placement="bottom" classes={{tooltip:classes.customWidth}}>
                                            <Icon>
                                                <Person></Person>
                                            </Icon>
                                        </Tooltip>}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {listData?.length == 0 && 
                                <TableRow>
                                    <TableCell colspan={5} className="text-center text-muted" align="center">No folder to show</TableCell>
                                </TableRow>
                            }
                            </TableBody>
                        </Table>
                    </TableContainer>}
                    {view == "grid" &&
                    <Grid container className="page-container mt-5" spacing={5}>
                        {listData?.map((row, key) => (
                            <Grid item xs={12} md={2}>
                                <Box className="card-small">
                                    <Link href={"/document/browse/"+row.id} onClick={(e) => openPage(e, "/document/browse/"+row.id)}>
                                        <Box className="text-center" display="flex" justifyContent="center" alignItems="center">
                                            <Box className="small-icon-wrapper">
                                                <Icon style={{fontSize: 30}}>folder</Icon>
                                            </Box>
                                            <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"10px"}}>{row.folder_name}</Typography>
                                        </Box>
                                    </Link>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>}
                </Grid>
            </Grid>
        </Box>
    </BaseLayout>
}