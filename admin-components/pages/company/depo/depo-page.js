import { Avatar, Button, ButtonGroup, Divider, Grid, Icon, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { useEffect, useState } from "react";
import getRoute from "../../../../helpers/router";
import AdminBaseLayout from "../../../base_layout/admin_base_layout";
import { getListDepoSwr } from "../../../../services/swr/depo.swr";
import DepoForm from "../../../../components/page/depo/depo-form";
import AlertDialog from "../../../../components/base_component/dialog";
import { deleteDepoApi } from "../../../../services/api/depo.api";

export default function Page() {

    const router = useRouter()

    function openDetail(e, url) {
        e.preventDefault();
        router.push(url)
      }

    const [isFormEdit, setFormEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    
    function openEditData(index) {
        setEditData(dataList[index])
        setFormEdit(true)
        setOpenForm(true)
    }

    const [dataList, setDataList] = useState([])
    const depoSwr = getListDepoSwr({
        page: 1, 
        limit: 200,
        orderBy: "name",
        order: "asc",
        isOwn: true
    })
    useEffect(() => {
        if(depoSwr.data) {
            setDataList(depoSwr.data.result)
        }
    }, depoSwr.data)

    // *----<Delete Items>----*
    const [isOpenConfirmationDialog, setOpenConfirmationDialog] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState(-1)
  
    function confirmDelete(index) {
        setDeleteIndex(index)
        setOpenConfirmationDialog(true)
    }
  
    const deleteData = async () => {
        setOpenConfirmationDialog(false)
        var data = dataList[deleteIndex]
        console.log(data)
        dataList.splice(deleteIndex, 1)
        setDataList(dataList)
        await deleteDepoApi(data?.id)
    }
    // *----<Delete Items>----*

    return <AdminBaseLayout title="Depo">
        <AlertDialog 
            title="Delete Item"
            body={`Are you sure you want to delete ${dataList[deleteIndex]?.name}`}
            open={isOpenConfirmationDialog} 
            cancelAction={() => setOpenConfirmationDialog(false)} okAction={deleteData} />
        <div className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={12} xl={10}>
                    <h1 className="mb-5">Depo</h1>
                    <div className="card no-padding">
                        <div className="p-3 display-space-between">
                            <div className="flex-center me-3" style={{flexGrow: 1}}>
                            </div>
                            <ButtonGroup variant="outlined" color="default" aria-label="split button">
                                <Button
                                    onClick={() => setOpenForm(true)}>
                                    <Icon>add</Icon>Add Depo
                                </Button>
                            </ButtonGroup>
                        </div>
                        <Divider />
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={12}>No</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Address</TableCell>
                                        <TableCell>Contact Person</TableCell>
                                        <TableCell>Officers</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!depoSwr?.isLoading && dataList.map((depo, index) => (
                                        <TableRow hover={true} key={index}>
                                            <TableCell onClick={(e) => openDetail(e, getRoute("admin.company.depo.detail", {depoId: depo?.id}))}>{index + 1}</TableCell>
                                            <TableCell onClick={(e) => openDetail(e, getRoute("admin.company.depo.detail", {depoId: depo?.id}))}>{depo?.name}</TableCell>
                                            <TableCell onClick={(e) => openDetail(e, getRoute("admin.company.depo.detail", {depoId: depo?.id}))}>{depo?.address} <br /> {depo?.city} <br /> {depo?.country}, {depo?.postal_code}</TableCell>
                                            <TableCell onClick={(e) => openDetail(e, getRoute("admin.company.depo.detail", {depoId: depo?.id}))}>
                                                {depo?.cp?.map(cp => (
                                                    <Typography className="mb-3">{cp?.name} / {cp?.telp}</Typography>
                                                ))}
                                            </TableCell>
                                            <TableCell onClick={(e) => openDetail(e, getRoute("admin.company.depo.detail", {depoId: depo?.id}))}>
                                                <AvatarGroup max={4}>
                                                    {depo.officers.map((officer, index) => (
                                                        <Tooltip title={officer?.name} placement="top">
                                                            <Avatar alt="Dika" style={{width: 32, height: 32}} src={officer?.photo} />
                                                        </Tooltip>
                                                    ))}
                                                </AvatarGroup>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Edit" placement="top">
                                                <IconButton size="small" onClick={() => openEditData(index)}><Icon>edit</Icon></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete" placement="top">
                                                <IconButton size="small" onClick={() => confirmDelete(index)}><Icon>delete</Icon></IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(depoSwr.isLoading) && <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted" align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>}
                                    {(!depoSwr.isLoading && dataList?.length <= 0) && <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted" align="center">
                                            No Data
                                        </TableCell>
                                    </TableRow>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Grid>
            </Grid>
        </div>
      <DepoForm 
          open={openForm} 
          isEdit={isFormEdit}
          data={editData}
          closeModal={() => setOpenForm(false)} 
          isOwn={true}
          dataInserted={(data) => depoSwr.mutate()}
          dataUpdated={(data) => depoSwr.mutate()}  />
    </AdminBaseLayout>
}