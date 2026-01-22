import { Avatar, Button, Card, Grid, Icon, IconButton, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AlertDialog from "../../../../components/base_component/dialog";
import DepoForm from "../../../../components/page/depo/depo-form";
import { deleteDepoOfficerApi } from "../../../../services/api/depo.api";
import { getDetailDepoSwr } from "../../../../services/swr/depo.swr";
import AdminBaseLayout from "../../../base_layout/admin_base_layout";
import DepoOfficerForm from "./depo-officer-form";

export default function Page() {

    const router = useRouter()
    const depoId = router.query.depoId

    const [data, setData] = useState([])
    const depoSwr = getDetailDepoSwr(depoId)
    useEffect(() => {
        if(depoSwr.data) {
            setData(depoSwr.data)
        }
    }, [depoSwr.data])

    const [openFormEdit, setOpenFormEdit] = useState(false)
    const [openOfficerForm, setOpenOfficerForm] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    const [userId, setUserId] = useState(null)
    const confirmDelete = (id) => {
        setUserId(id)
        setOpenDialog(true)
    }

    const deleteDepo = async () => {
        setOpenDialog(false)
        try {
            await deleteDepoOfficerApi(depoId, userId)
            depoSwr.mutate()
        } catch(err) {
            console.log(err)
        }
    }

    return <AdminBaseLayout title="Depo">
        <Grid container spacing={4}>
            <Grid item lg={6}>
                <div className="card mb-5">
                    <h3 className="mb-4">Depo</h3>
                    <div>
                        <Typography variant="body2" color="textSecondary">Name</Typography>
                        <Typography className="mb-3">{data?.name ?? "-"}</Typography>
                        <Typography variant="body2" color="textSecondary">Address</Typography>
                        <Typography className="mb-3">{data?.address ?? "-"}</Typography>
                        <Typography variant="body2" color="textSecondary">City</Typography>
                        <Typography className="mb-3">{data?.city ?? "-"}</Typography>
                        <Typography variant="body2" color="textSecondary">Country</Typography>
                        <Typography className="mb-3">{data?.country ?? "-"}</Typography>
                        <Typography variant="body2" color="textSecondary">Postal Code</Typography>
                        <Typography className="mb-3">{data?.postal_code ?? "-"}</Typography>
                        <Typography variant="body2" color="textSecondary">Contact Person</Typography>
                        {data?.cp?.map(cp => (
                            <Typography className="mb-3">{cp?.name} / {cp?.telp} / {cp?.email}</Typography>
                        ))}
                        <Typography variant="body2" color="textSecondary">Telp</Typography>
                        <Typography className="mb-3">{data?.telp ?? "-"}</Typography>
                        <Typography variant="body2" color="textSecondary">Fax</Typography>
                        <Typography className="mb-3">{data?.fax ?? "-"}</Typography>
                    </div>
                    <Button 
                        variant="contained" 
                        size="small" 
                        onClick={() => setOpenFormEdit(true)}
                        disableElevation>
                        <Icon style={{fontSize: 16, marginRight: 4}}>edit</Icon> Edit
                    </Button>
                </div>
                <div className="card">
                    <div className="display-space-between mb-4">
                        <h3>Depo Officer</h3>
                        <Button 
                            variant="contained" 
                            size="small" 
                            color="secondary" 
                            onClick={() => setOpenOfficerForm(true)}
                            disableElevation>
                            <Icon style={{fontSize: 20, marginRight: 4}}>add</Icon> Add Officer
                        </Button>
                    </div>
                    {data?.officers?.map(officer => (
                        <Card className="display-space-between p-2 mb-3" variant="outlined">
                            <div className="flex-center">
                                <Avatar className="account-button me-3" alt="Admin" src={officer?.photo} />
                                <Typography>{officer?.name}</Typography>
                            </div>
                            <IconButton
                                onClick={() => confirmDelete(officer?.id)}>
                                <Icon>close</Icon>
                            </IconButton>
                        </Card>
                    ))}
                </div>
            </Grid>
        </Grid>
        <DepoForm 
          open={openFormEdit} 
          closeModal={() => setOpenFormEdit(false)} 
          dataUpdated={depoSwr?.mutate}
          isEdit={true}
          data={data} />
        <DepoOfficerForm 
            closeModal={() => setOpenOfficerForm(false)} 
            depoId={depoId}
            dataInserted={depoSwr?.mutate}
            dataUpdated={depoSwr?.mutate}
            open={openOfficerForm}/>
        <AlertDialog 
            open={openDialog} 
            cancelAction={() => setOpenDialog(false)} 
            okAction={() => deleteDepo()} 
            title="Delete confirmation" 
            body="Are you sure want to delete this design?"/>
    </AdminBaseLayout>
}