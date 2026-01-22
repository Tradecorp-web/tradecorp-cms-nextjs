import { Button, Grid, Icon, IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Backdrop, CircularProgress, TablePagination, TableFooter, Box, Switch, FormControlLabel, Tooltip, Card, CardHeader, CardContent, CardActions, TextField, InputAdornment, Collapse } from "@material-ui/core"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getDetailConfigApi, saveConfigApi } from "../../../services/api/config.api"
import AdminBaseLayout from "../../base_layout/admin_base_layout"
import { ExpandLessRounded, ExpandMore } from '@material-ui/icons'
import clsx from "clsx"
import AlertDialog from "../../../components/base_component/dialog"
import Moment from 'moment'

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}))

export default function Page() {
    const router = useRouter()
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [data, setData] = useState({id:null,company_id:null,login_timeout:null})
    const [errorText, setErrorText] = useState({login_timeout:null})
    const [expanded, setExpanded] = useState(false)

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    const onInputChange = (event) => {
        if (event.target.name == "login_timeout") {
            setData({ ...data, [event.target.name]:parseInt(event.target.value)})
        } else {
            setData({ ...data, [event.target.name]:event.target.value})
        }
    }

    useEffect(async () => {
        try {
            setOpen(true)
            var result = await getDetailConfigApi()
            setData(result)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }, []);

    const refreshConfig = async () => {
        setOpenForm(false)
        try {
            setOpen(true)
            var result = await getDetailConfigApi()
            setData(result)
            setOpen(false)
        } catch(err) {
            console.log(err)
            setOpen(false)
        }
    }

    function checkValidation() {
        var isValid = true
        var eTimeout = ""
        // if(data.login_timeout == "" || data.login_timeout == null) {
        //     isValid = false
        //     eTimeout = "Login timeout can not be empty"
        // }
        setErrorText({ ...errorText, login_timeout:eTimeout})
        return isValid
    }

    const sendData = () => {
        console.log(data)
        setOpen(true)
        if(checkValidation()) {
            saveConfigApi(data).then((res) => {
                setOpen(false)
            }).catch((err) => {
                console.log(err)
                //setErrorText(err)
                setOpen(false)
            })
        }
    }

    return ( <AdminBaseLayout title="Configuration">
        <Grid container spacing={4}>
            <Grid item lg={12}>
                <Box className="card no-padding">
                    <Card>
                        <CardHeader
                            title="Security"
                            action={
                                <IconButton
                                    className={clsx(classes.expand, {
                                        [classes.expandOpen]: expanded,
                                    })}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label="show"
                                >
                                    <ExpandMore />
                                </IconButton>
                            }
                        />
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Box>
                                    <TextField 
                                        name="login_timeout" 
                                        label="Login Timeout" 
                                        variant="outlined" 
                                        type="number"
                                        defaultValue={data.login_timeout} 
                                        error={errorText.login_timeout} 
                                        helperText={errorText.login_timeout} 
                                        onChange={onInputChange} 
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                                        }}
                                    />
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={sendData}
                                    disableElevation>
                                    Save
                                </Button>
                            </CardActions>
                        </Collapse>
                    </Card>
                </Box>
                <Backdrop className={classes.backdrop} open={open}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Grid>
        </Grid>
    </AdminBaseLayout> )
}