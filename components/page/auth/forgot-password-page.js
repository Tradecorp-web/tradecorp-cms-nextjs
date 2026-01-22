import {useRouter} from 'next/router'
import { 
    Card, 
    Button, 
    Grid, 
    FormControl, 
    InputLabel, 
    Input, 
    Link, 
    Typography 
} from '@material-ui/core'
import BaseLayoutWithoutAppBar from '../../base_layout/base-layout-without-appbar'

export default function LoginPage() {

    const router = useRouter()

    function toForgotPassword() {
        router.push("/forgot-password")
    }

    return (
        // Change title header here 
        <BaseLayoutWithoutAppBar title="Forgot Password"> 
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
                    <Card 
                        variant="outlined" 
                        className="p-5"
                        style={{ width: '350px' }}>
                        <h2 className="mb-1">Forgot Password</h2>
                        <Typography variant="body2" className="mb-3">Enter your email address to request reset password</Typography>
                        <form noValidate autoComplete="off">
                            <FormControl fullWidth className="mb-5 pb-5">
                                <InputLabel htmlFor="my-input">Email</InputLabel>
                                <Input id="my-input" />
                            </FormControl>
                            <Grid
                                justify="center"
                                container>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    color="primary"
                                    className="mb-1"
                                    fullWidth={true}
                                    disableElevation={true}>
                                    Reset Password
                                </Button>
                            </Grid>
                        </form>
                    </Card>
                </Grid>   
            </Grid> 
        </BaseLayoutWithoutAppBar>
    )
}