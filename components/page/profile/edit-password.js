import { Avatar, Button, Card, Divider, Grid, Icon, InputBase, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { CircularProgressCustom } from "../../base_component/spinner";
import BaseLayoutContainer from "../../base_layout/base-layout-container";
import { editPasswordApi } from '../../../services/api/account.api';
import getRoute from "../../../helpers/router";
import { useRouter } from "next/router";

window.objects

export default function Page() {

    const [oldPassword, setOldPassword] = useState("")
    const [oldPasswordErrorText, setOldPasswordErrorText] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordErrorText, setNewPasswordErrorText] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [errorText, setErrorText] = useState("")

    const router = useRouter()

    useEffect(() => {
        resetErrorText()
    }, [oldPassword])
    
    useEffect(() => {
        resetErrorText()
    }, [newPassword])
    
    useEffect(() => {
        resetErrorText()
    }, [newPassword])

    function resetErrorText() {
        setNewPasswordErrorText("")
        setOldPasswordErrorText("")
        setConfirmPasswordErrorText("")
    }

    function checkValidation() {
        var isValid = true
        resetErrorText()
        if(oldPassword == "") {
            isValid = false
            setNewPasswordErrorText("Old Password can't be empty")
        }
        if(newPassword == "") {
            isValid = false
            setOldPasswordErrorText("New Password can't be empty")
        }
        if(confirmPassword == "") {
            isValid = false
            setConfirmPasswordErrorText("Password Confirmation can't be empty")
        } else if(confirmPassword != newPassword) {
            isValid = false
            setConfirmPasswordErrorText("New Password is not match")
        }
        return isValid
    }

    function editPasswordProcess() {
        if(checkValidation()) {
            setLoading(true);
            editPasswordApi(oldPassword, newPassword).then((data) => {
                setLoading(false);
                router.push(getRoute("home"))
            }).catch((err) => {
                setErrorText(err);
                setLoading(false);
            })
        }
    }

    return <BaseLayoutContainer title="Profile">
        <div className="pt-5 pb-5 mt-5">
            <Grid 
                container
                alignItems="center"
                justify="center">
                <Grid item lg={6}>
                    <Card className="p-4" variant="outlined">
                        <Typography variant="h3" className="mb-5" gutterBottom>Edit Password</Typography>
                        <div className="mb-3">
                            <Typography variant="body2" className="mb-2" paragraph>Old Password</Typography>
                            <InputBase
                                color="secondary"
                                className="input input-large"
                                placeholder="Old Password"
                                type=""
                                value={oldPassword}
                                error={oldPasswordErrorText != ""}
                                onChange={(e) => setOldPassword(e.target.value)}
                                type="password"
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{oldPasswordErrorText}</small>
                        </div>
                        <div className="mb-3">
                            <Typography variant="body2" className="mb-2" paragraph>New Password</Typography>
                            <InputBase
                                color="secondary"
                                className="input input-large"
                                placeholder="New Password"
                                value={newPassword}
                                error={newPasswordErrorText != ""}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type="password"
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{newPasswordErrorText}</small>
                        </div>
                        <div className="mb-3">
                            <Typography variant="body2" className="mb-2" paragraph>Confirm New Password</Typography>
                            <InputBase
                                color="secondary"
                                className="input input-large"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                error={confirmPasswordErrorText != ""}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{confirmPasswordErrorText}</small>
                        </div>
                        <div className="text-center mb-3"><small className="text-error">{errorText}</small></div>
                        <Button 
                            variant="contained" 
                            size="large"
                            color="primary"
                            fullWidth={true}
                            onClick={editPasswordProcess}
                            disabled={isLoading}
                            disableElevation={true}>
                            {isLoading ? <CircularProgressCustom size={26} /> : "Edit Password"}
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </div>

        <style jsx>{`
            .profile-card  {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        `}</style>
    </BaseLayoutContainer>
}