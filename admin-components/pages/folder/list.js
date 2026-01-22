import { Button, Grid, Icon, IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Backdrop, CircularProgress, TablePagination, TableFooter, Box } from "@material-ui/core"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getListFolderApi,deleteFolderApi,getDetailFolderApi } from "../../../services/api/folder.api"
import AdminBaseLayout from "../../base_layout/admin_base_layout"
import { Delete } from '@material-ui/icons'
import AlertDialog from "../../../components/base_component/dialog"
import FolderForm from "./form"

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
}))

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

    const confirmDelete = (id) => {
        setIdData(id)
        setOpenDialog(true)
    }

    const deleteFolder = async () => {
        setOpenDialog(false)
        try {
            setOpen(true)
            var res = await deleteFolderApi(idData)
            var data = await getListFolderApi()
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
            var data = await getListFolderApi()
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
            var data = await getListFolderApi(search,newPage,rowsPerPage)
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
            var data = await getListFolderApi(search,0,parseInt(event.target.value, 10))
            setRowCount(data.total)
            setListData(data.result)
            setPage(0)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    const refreshListFolder = async () => {
        setOpenForm(false)
        try {
            setOpen(true)
            var data = await getListFolderApi(search,page,rowsPerPage)
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
        var result = await getDetailFolderApi(id)
        setData({id:id,folder_name:result.folder_name,teams:result.teams,users:result.users})
        setOpen(false)
        setOpenForm(true)
    }

    const shareList = (obj) => {
        var list = []
        obj?.map((v,k) => {
            list.push(v.name)
        })
        return list.join(", ")
    }

    return ( <AdminBaseLayout title="Folder List">
        <Grid container spacing={4}>
            <Grid item lg={12}>
                <Button 
                    color="secondary" 
                    variant="contained" 
                    disableElevation 
                    className="mb-4"
                    onClick={() => {
                        setData(null)
                        setOpenForm(true)
                    }}>
                    <Icon>add</Icon> Create Folder
                </Button>
                <Box className="card no-padding">
                    <TableContainer>
                        <Table aria-label="Folder List">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Folder Name</TableCell>
                                    <TableCell>Teams</TableCell>
                                    <TableCell>Users</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {listData?.map((row, key) => (
                                <TableRow key={key} hover>
                                    <TableCell onClick={() => editForm(row.id)}>{key+1+(page*rowsPerPage)}</TableCell>
                                    <TableCell onClick={() => editForm(row.id)}>{row.folder_name}</TableCell>
                                    <TableCell onClick={() => editForm(row.id)}>{shareList(row.team_list)}</TableCell>
                                    <TableCell onClick={() => editForm(row.id)}>{shareList(row.user_list)}</TableCell>
                                    <TableCell>
                                        <IconButton>
                                            <Delete onClick={() => confirmDelete(row.id)} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {listData?.length == 0 && 
                                <TableRow>
                                    <TableCell colspan={5} align="center">No data to show</TableCell>
                                </TableRow>
                            }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination 
                                        rowsPerPageOptions={[20, 50, 100]}
                                        colSpan={5}
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
                <Backdrop className={classes.backdrop} open={open}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <AlertDialog open={openDialog} cancelAction={() => setOpenDialog(false)} okAction={() => deleteFolder()} title="Delete confirmation" body="Are you sure want to delete this folder?" />
                <FolderForm open={openForm} closeModal={refreshListFolder} folder={data} />
            </Grid>
        </Grid>
    </AdminBaseLayout> )
}