import { Avatar, Button, Card, Divider, Grid, Icon, InputBase, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { CircularProgressCustom } from "../../base_component/spinner";
import BaseLayoutContainer from "../../base_layout/base-layout-container";
import { accountApi, editPasswordApi, editProfileApi } from '../../../services/api/account.api';
import getRoute from "../../../helpers/router";
import { useRouter } from "next/router";
import useSWR from "swr";
import { accountSwr } from "../../../services/swr/account.swr";

window.objects

export default function Page() {

    const { data, error, mutate } = accountSwr()

    useEffect(() => {
        setName(data?.name)
        setEmail(data?.email)
        setUsername(data?.username)
    }, [data])

    const [name, setName] = useState("")
    const [nameErrorText, setNameErrorText] = useState("")
    const [email, setEmail] = useState("")
    const [emailErrorText, setEmailErrorText] = useState("")
    const [username, setUsername] = useState("")
    const [usernameErrorText, setUsernameErrorText] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [errorText, setErrorText] = useState("")

    const router = useRouter()

    useEffect(() => {
        setNameErrorText("")
    }, [name])
    
    useEffect(() => {
        setEmailErrorText("")
    }, [email])
    
    useEffect(() => {
        setUsernameErrorText("")
    }, [username])

    function resetErrorText() {
        setNameErrorText("")
        setEmailErrorText("")
        setUsernameErrorText("")
    }

    function checkValidation() {
        var isValid = true
        resetErrorText()
        if(name == "") {
            isValid = false
            setNameErrorText("Name can't be empty")
        }
        if(username == "") {
            isValid = false
            setUsernameErrorText("Username can't be empty")
        }
        if(email == "") {
            isValid = false
            setEmailErrorText("Email can't be empty")
        }
        return isValid
    }

    function editProfileProcess() {
        if(checkValidation()) {
            setLoading(true);
            editProfileApi(name, email, username).then((data) => {
                setLoading(false);
                router.push(getRoute("profile"))
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
                        <Typography variant="h3" className="mb-5" gutterBottom>Edit Profile</Typography>
                        <div className="mb-3">
                            <Typography variant="body2" className="mb-2" paragraph>Name</Typography>
                            <InputBase
                                color="secondary"
                                className="input input-large"
                                placeholder="Your Name"
                                value={name}
                                error={nameErrorText != ""}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{nameErrorText}</small>
                        </div>
                        <div className="mb-3">
                            <Typography variant="body2" className="mb-2" paragraph>Username</Typography>
                            <InputBase
                                color="secondary"
                                className="input input-large"
                                placeholder="Username"
                                value={username}
                                error={usernameErrorText != ""}
                                onChange={(e) => setUsername(e.target.value)}
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{usernameErrorText}</small>
                        </div>
                        <div className="mb-3">
                            <Typography variant="body2" className="mb-2" paragraph>Email</Typography>
                            <InputBase
                                color="secondary"
                                className="input input-large"
                                placeholder="Email"
                                value={email}
                                error={emailErrorText != ""}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                fullWidth>
                            </InputBase>
                            <small className="text-error">{emailErrorText}</small>
                        </div>
                        <div className="text-center mb-3"><small className="text-error">{errorText}</small></div>
                        <Button 
                            variant="contained" 
                            size="large"
                            color="primary"
                            fullWidth={true}
                            onClick={editProfileProcess}
                            disabled={isLoading}
                            disableElevation={true}>
                            {isLoading ? <CircularProgressCustom size={26} /> : "Save Changes"}
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