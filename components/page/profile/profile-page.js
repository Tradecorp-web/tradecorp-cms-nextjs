import { Avatar, Button, Fab, Card, Grid, InputLabel, InputBase, Icon, Typography, Divider, IconButton} from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { uploadPathStorage } from "../../../helpers/consts";
import { urlPhoto } from "../../../helpers/general";
import getRoute from "../../../helpers/router";
import { editProfileApi } from "../../../services/api/account.api";
import { uploadFileApi } from "../../../services/api/file.api";
import { accountSwr } from "../../../services/swr/account.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import BaseLayoutContainer from "../../base_layout/base-layout-container";

window.objects

export default function ProfilePage() {

    const [isEditMode, setEditMode] = useState(null)
    const account = accountSwr()
    const [formState, setFormState] = useState(null)
    function onChangeInput(e) {
        setFormState({...formState, [e.target.name]: e.target.value})
    }

    useEffect(() => {
        console.log("SUCCESS")
        setFormState({
            ...formState, 
            name: account?.data?.name,
            email: account?.data?.email,
            username: account?.data?.username,
            photo: account?.data?.photo,
        })
        setLoadingUploadPhoto(false)
    }, [account?.data])

    const router = useRouter()

    const [isLoading, setLoading] = useState(false)
    const [isLoadingUploadPhoto, setLoadingUploadPhoto] = useState(false)

    const uploadFileProccess = async (e) => {
        const file = e.target.files[0];
        var path = uploadPathStorage.photoProfile
        setLoadingUploadPhoto(true)
        try {
            var response = await uploadFileApi(path, file)
            document.getElementById("photoProfile").value = null
            var data = {...formState, photo: response}
            setFormState(data)
            updateProfile(data)
        } catch (err) {
            setLoadingUploadPhoto(false)
            console.log(err)
        }
    }
    
    function checkValidation() {
        var isValid = true
        return isValid
    }
    
    function updateProfile(param) {
        if(checkValidation()) {
            setLoading(true);
            var data = {
                ...account?.data,
                name: param?.name,
                email: param?.email,
                username: param?.username,
                photo: param?.photo,
            }
            editProfileApi(data).then((res) => {
                account.mutate()
                setLoading(false)
                setEditMode(false)
            }).catch((err) => {
                setLoadingUploadPhoto(false)
                setLoading(false)
            })
        }
    }

    return <BaseLayoutContainer title="Profile">
        <div className="pt-5 pb-5">
            <Grid 
                container
                alignItems="center"
                justify="center">
                <Grid item lg={6}>
                    <div className="card">
                        <div className="profile-card">
                            <div className="avatar-wrapper mb-4">
                                {isLoadingUploadPhoto && <div style={{ width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <CircularProgressCustom/>
                                </div>}
                                {!isLoadingUploadPhoto && <Avatar 
                                    src={urlPhoto(account?.data?.photo)}
                                    style={{ width: 100, height: 100 }}/>}
                                <Fab 
                                    color="default" 
                                    className="avatar-edit" 
                                    size="small" 
                                    onClick={() => document.getElementById("photoProfile").click()}
                                    style={{position: "absolute", top: "0px", right: "-16px", boxShadow: "none"}}>
                                    <Icon>camera_alt</Icon>
                                </Fab>
                                <InputBase
                                    onChange={uploadFileProccess}
                                    style={{display: "none"}}
                                    id="photoProfile"
                                    type="file"
                                    accept="image/png, image/jpeg"/>
                            </div>
                            <Typography variant="h3" gutterBottom>{account?.data?.name}</Typography>
                            <Typography variant="body1" className="mb-5" paragraph>{account?.data?.position} at {account?.data?.company?.name}</Typography>
                            <Divider style={{width: "100%"}} />
                            {!isEditMode && <Grid 
                                className="pt-3"
                                container>
                                <Grid>
                                    <div>
                                        <Typography variant="body2" className="text-muted">Name</Typography>
                                        <Typography variant="body1">{account?.data?.name}</Typography>
                                    </div>
                                    <div className="pt-3">
                                        <Typography variant="body2" className="text-muted">Email</Typography>
                                        <Typography variant="body1">{account?.data?.email ?? "-"}</Typography>
                                    </div>
                                    <div className="pt-3">
                                        <Typography variant="body2" className="text-muted">Username</Typography>
                                        <Typography variant="body1">{account?.data?.username ?? "-"}</Typography>
                                    </div>
                                    <div className="pt-3">
                                        {!isEditMode && <Button 
                                            startIcon={<Icon>edit</Icon>} 
                                            color="default" 
                                            variant="contained" 
                                            size="small"
                                            onClick={(e) => setEditMode(true)}
                                            disableElevation>Edit Profile</Button>}
                                    </div>
                                </Grid>
                            </Grid>}
                            {isEditMode && <Grid 
                                className="pt-5"
                                container>
                                <Grid lg={12} item>
                                    <div className="mb-3">
                                        <h3>Edit Profile</h3>
                                    </div>
                                    <div>
                                        <div className="mb-3 text-left">
                                            <InputLabel className="pb-1">
                                                <Typography variant="caption">Name</Typography>
                                            </InputLabel>
                                            <InputBase
                                                name="name"
                                                color="secondary"
                                                className="input"
                                                value={formState?.name}
                                                onChange={onChangeInput}
                                                fullWidth>
                                            </InputBase>
                                        </div>
                                        <div className="mb-3 text-left">
                                            <InputLabel className="pb-1">
                                                <Typography variant="caption">Email</Typography>
                                            </InputLabel>
                                            <InputBase
                                                name="email"
                                                color="secondary"
                                                className="input"
                                                value={formState?.email}
                                                onChange={onChangeInput}
                                                fullWidth>
                                            </InputBase>
                                        </div>
                                        <div className="mb-3 text-left">
                                            <InputLabel className="pb-1">
                                                <Typography variant="caption">Username</Typography>
                                            </InputLabel>
                                            <InputBase
                                                name="username"
                                                color="secondary"
                                                className="input"
                                                value={formState?.username}
                                                onChange={onChangeInput}
                                                fullWidth>
                                            </InputBase>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            onClick={() => updateProfile(formState)}
                                            disableElevation>
                                            {isLoading ? <CircularProgressCustom size={26} /> : "Save"}
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>}
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>

        <style jsx>{`
            .profile-card  {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .avatar-wrapper {
                position: relative;
            }
            .avatar-edit {
                position: absolute !important;
                top: 0 !important;
                right: -16px !important;
            }
        `}</style>
    </BaseLayoutContainer>
}