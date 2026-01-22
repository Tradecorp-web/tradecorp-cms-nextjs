import {useRouter} from 'next/router'
import { 
    Card, 
    Button, 
    Grid, 
    Link, 
    Typography, 
    InputBase,
    CircularProgress
} from '@material-ui/core'
import BaseLayoutWithoutAppBar from '../../base_layout/base-layout-without-appbar'
import getRoute from '../../../helpers/router';
import { useEffect, useState } from 'react';
import Loading from '../../helper/loading';
import { CircularProgressCustom } from '../../base_component/spinner';
import { loginApi } from '../../../services/api/auth.api';
import { LOCAL_STORAGE_DEVICE,LOCAL_STORAGE_DEV_ID } from "../../../helpers/consts"

export default function LoginPage() {

    const [username, setUsername] = useState("")
    const [usernameErrorText, setUsernameErrorText] = useState("")
    const [password, setPassword] = useState("")
    const [passwordErrorText, setPasswordErrorText] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [errorText, setErrorText] = useState("")

    const router = useRouter()

    const device = localStorage.getItem(LOCAL_STORAGE_DEVICE)
    const devid = localStorage.getItem(LOCAL_STORAGE_DEV_ID)

    useEffect(() => {
        setErrorText("")
        setUsernameErrorText("")
    }, [username])

    useEffect(() => {
        setErrorText("")
        setPasswordErrorText("")
    }, [password])

    function toForgotPassword(e) {
        e.preventDefault();
        router.push(getRoute("auth.forgot.password"))
    }

    function keyPress(e) {
        if (e.keyCode == 13) {
            loginProccess()
        }
    }

    function checkValidation() {
        var isValid = true
        setUsernameErrorText("")
        setPasswordErrorText("")
        if(username == "") {
            isValid = false
            setUsernameErrorText("Username can't be empty")
        }
        if(password == "") {
            isValid = false
            setPasswordErrorText("Password can't be empty")
        }

        return isValid
    }

    function loginProccess() {
        if(checkValidation()) {
            setLoading(true);
            loginApi(username, password, device, devid).then((data) => {
                setLoading(false);
                router.push(getRoute("home"))
            }).catch((err) => {
                setErrorText(err);
                setLoading(false);
            })
        }
    }

    return (
        <BaseLayoutWithoutAppBar title="Login"> 
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}>
                <img style={{ width: '200px'}} className="mb-6" src="logo.png"/>
                <Grid 
                    item 
                    xs={12}
                    className="mb-5">
                    <div 
                        variant="outlined" 
                        className="p-5 card"
                        style={{ width: '400px' }}>
                        <h1 className="mb-5">Login</h1>
                        <form noValidate autoComplete="off">
                            <div className="mb-3">
                                <Typography variant="body2" className="mb-2" paragraph>Username/Email</Typography>
                                <InputBase
                                    color="secondary"
                                    className="input input-large"
                                    placeholder="Username"
                                    value={username}
                                    error={usernameErrorText != ""}
                                    onChange={(e) => setUsername(e.target.value)}
                                    inputProps={{
                                        onKeyDown: (e) => {keyPress(e)}
                                    }}
                                    fullWidth>
                                </InputBase>
                                <small className="text-error">{usernameErrorText}</small>
                            </div>
                            <div className="mb-4">
                                <Typography variant="body2" className="mb-2" paragraph>Password</Typography>
                                <InputBase
                                    color="secondary"
                                    className="input input-large"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    error={passwordErrorText != ""}
                                    onChange={(e) => setPassword(e.target.value)}
                                    inputProps={{
                                        onKeyDown: (e) => {keyPress(e)}
                                    }}
                                    fullWidth>
                                </InputBase>
                                <small className="text-error">{passwordErrorText}</small>
                            </div>
                            <div className="text-center mb-3"><small className="text-error">{errorText}</small></div>
                            <Grid
                                justify="center"
                                container>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    color="primary"
                                    className="mb-5"
                                    fullWidth={true}
                                    onClick={loginProccess}
                                    disabled={isLoading}
                                    disableElevation={true}>
                                    {isLoading ? <CircularProgressCustom size={26} /> : "Login"}
                                </Button>
                                <Link href={getRoute("auth.forgot.password")}>
                                    <a onClick={(e) => toForgotPassword(e)}>Forgot Password</a>
                                </Link>
                            </Grid>
                        </form>
                    </div>
                </Grid>   
            </Grid> 
        </BaseLayoutWithoutAppBar>
    )
}