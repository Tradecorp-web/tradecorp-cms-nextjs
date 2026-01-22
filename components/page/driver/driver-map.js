import { Button, ButtonGroup, Card, makeStyles, Divider, Grid, Icon, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography, Box, TextField, Backdrop, CircularProgress, Collapse, MenuItem } from "@material-ui/core"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import getRoute from "../../../helpers/router"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
//import { AssignmentReturned,KeyboardArrowUp,KeyboardArrowDown } from '@material-ui/icons'
import { getListDriverSwr, getLocationDriverSwr } from "../../../services/swr/driver.swr"
import { getRequestLocDriverApi, getLocationDriverApi } from "../../../services/api/driver.api"
import { isSafari } from 'react-device-detect'
import { db } from "../../../helpers/firebase"
import BaseLayoutDriver from "../../base_layout/base-layout-driver"

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
          borderBottom: 'unset',
        },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
}))


export default function Page() {
    const router = useRouter()
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [locate, setLocate] = useState("all")
    const [listDriver, setListDriver] = useState([])
    const [map, setMap] = useState(null)
    const [marker, setMarker] = useState([])
    const [info, setInfo] = useState({open:false,position:null,title:null})

    const { isLoaded } = useJsApiLoader({
        id: "driver-map",
        googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
    })

    const mapContainer = {
        width: "1300px",
        height: "600px"
    }

    const center = {
        lat: -2.3932022,
        lng:  118.3796622
    }

    var location = null

    const onLoad = React.useCallback((map) => {
        if (!isSafari) {
            location = db().collection('/drivers')
            location.onSnapshot((snapshot) => {
                var markers = []
                const bounds = new window.google.maps.LatLngBounds()
                snapshot.docChanges().forEach((change) => {
                    const data = change.doc.data()
                    if (!isNaN(data.lat) && !isNaN(data.long)) {
                        markers.push({lat:data.lat,lng:data.long,name:data.driver_name})
                        bounds.extend(new window.google.maps.LatLng(data.lat,data.long))
                    }
                })
                map.fitBounds(bounds)
                setMap(map)
                setMarker(markers)
            })
        } else {
            const bounds = new window.google.maps.LatLngBounds()
            map.fitBounds(bounds)
            setMap(map)
        }
    }, [])

    const onUnmount = React.useCallback((map) => {
        setMap(null)
    }, [])

    let param = { limit: 999 }
    var driverSwr = getListDriverSwr(param)
    
    useEffect(() => {
        if (driverSwr?.data) {
            setListDriver(driverSwr?.data.result ?? [])
        } 
    }, [driverSwr])

    // var locationSwr = getLocationDriverSwr(locate)

    // useEffect(() => {
    //     if (locationSwr?.data) {
    //         setMarker(locationSwr?.data ?? [])
    //         var mp = map
    //         if (mp != null) {
    //             const bounds = new window.google.maps.LatLngBounds()
    //             for (var i=0;i<locationSwr.data.length;i++) {
    //                 bounds.extend(new window.google.maps.LatLng(locationSwr.data[i].lat,locationSwr.data[i].lng))
    //             }
    //             mp.fitBounds(bounds)
    //             setMap(mp)
    //         }
    //     }
    // }, [locationSwr])

    const onDriverChange = async (event) => {
        setLocate(event.target.value)
        if (event.target.value != null) {
            try {
                setOpen(true)
                // await getRequestLocDriverApi(event.target.value)
                // locationSwr = getLocationDriverSwr(event.target.value)
                location = db().collection('/drivers').doc(event.target.value)
                location.onSnapshot((snapshot) => {
                    var markers = []
                    var mp = map
                    const bounds = new window.google.maps.LatLngBounds()
                    snapshot.docChanges().forEach((change) => {
                        const data = change.doc.data()
                        markers.push({lat:data.lat,lng:data.long,name:data.driver_name})
                        bounds.extend(new window.google.maps.LatLng(data.lat,data.long))
                    })
                    setMarker(markers)
                    mp.fitBounds(bounds)
                    setMap(mp)
                })
                setOpen(false)
            } catch(err) {
                console.log(err)
                setOpen(false)
            }
        }
    }

    const clickMarker = (lat,long,title) => {
        setInfo({open:true, position:{lat:lat,lng:long}, title:title})
    }

    const infoClose = () => {
        setInfo({open:false, position:null, title:null})
    }

    return <BaseLayoutDriver title="Driver's Location">
        <Box className="p-5 content-wrapper">
            <Grid container className="page-container" alignItems="center" justify="center">
                <Grid item xs={12} lg={8}>
                        <h1 className="mb-3">Driver's Location</h1>
                        <Box className="card no-padding">
                            <Box className="p-3 display-space-between">
                                <Box style={{width: "25%"}}>
                                    <TextField 
                                        name="search" 
                                        label="Search…"
                                        select 
                                        variant="standard" 
                                        value={locate}
                                        onChange={onDriverChange} 
                                        fullWidth 
                                    >
                                    <MenuItem value={null}><em>None</em></MenuItem>
                                    <MenuItem value="all">All</MenuItem>
                                    {listDriver?.map((item, i) => {
                                        return <MenuItem value={item.id}>{item?.user?.name}</MenuItem>
                                    })}
                                    </TextField>
                                </Box>
                            </Box>
                            <Divider/>
                            {isLoaded &&
                                <GoogleMap mapContainerStyle={mapContainer} center={center} zoom={5} onLoad={onLoad} onUnmount={onUnmount}>
                                    {marker?.map((item,i) => (
                                            <Marker position={item} onClick={() => clickMarker(item.lat,item.lng,item.name)} />
                                        ))}
                                    {info.open && 
                                        <InfoWindow position={info.position} onCloseClick={infoClose}>
                                            <h4>{info.title}</h4>
                                        </InfoWindow>
                                    }
                                </GoogleMap>
                            }
                        </Box>
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    </BaseLayoutDriver>
}