import { Button, Chip, Divider, Icon, IconButton, Modal } from "@material-ui/core"
import { Autocomplete, GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api"
import React, { useEffect, useRef, useState } from "react"
import { googleMapApiKey } from "../../helpers/api_key";
import { loadPlaceDetailByLatLng, loadPlaceDetailByPlaceId, searchAddresAutocomplete } from "../../services/api/maps.api";
import SearchBar from "./searchbar";

export default function MapLayer(props) {

    // *----------MAPS----------*
    const [map, setMap] = useState(null)
    const refMap = useRef(null);
    console.log(props?.markers)
    const [marker, setMarker] = useState([])

    useEffect(() => {
        setMarker(props?.markers ?? [])
    }, [props?.markers])

    const { isLoaded } = useJsApiLoader({
        id: "driver-map",
        googleMapsApiKey: googleMapApiKey
    })
    
    const mapContainer = {
        width: props?.width,
        height: props?.height,
    }
    
    const [center, setCenter] = useState({
        lat: props?.pickupLoaction?.location?.lat ?? -6.236390394518134,
        lng: props?.pickupLoaction?.location?.lng ?? 106.8690311572749,
    })

    const onLoad = React.useCallback((map) => {
        refMap.current = map
    }, [])

    const onUnmount = React.useCallback((map) => {
        setMap(null)
    }, [])

    const handleBoundsChanged = () => {
        if(isLoaded) {
            const mapCenter = refMap?.current?.getCenter().toJSON() ?? center
            setCenter(mapCenter)
            getLPlaceDetailByLatLng(mapCenter)
        }
    };

    // *----------------PICK LOCATION----------------*
    const [address, setAddress] = useState(props?.pickupLoaction?.address ?? null)
    const getLPlaceDetailByLatLng = async (center) => {
        loadPlaceDetailByLatLng(center?.lat, center?.lng).then((res) => {
            setAddress(res?.results[0]?.formatted_address)
        }).catch((err) => {
            setAddress(null)
        })
    }
    
    const getLPlaceDetailByPlaceId = async (placeId) => {
        loadPlaceDetailByPlaceId(placeId).then((res) => {
            setAddress(res?.result?.formatted_address)
            setCenter(res?.result?.geometry?.location)
        }).catch((err) => {
            setAddress(null)
        })
    }

    function pickLocation() {
        props?.locationPicked({
            address: address,
            location: center
        })
    }
    // *----------------PICK LOCATION----------------*
    

    // *----------------SEARCH MAP----------------*
    const [isSearchAddressMode, setSearchAddressMode] = useState(false)
    const [isSearchingAddress, setSearchingAddress] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState(null)
    const [searchAddressResult, setSearchAddressResult] = useState(null)

    function closeSearchAddres() {
        setSearchAddressResult(null)
        setSearchAddressMode(false)
    }

    const searchAddress = async (keyword) => {
        setSearchingAddress(true)
        setSearchKeyword(keyword)
        setSearchAddressResult(null)
        searchAddresAutocomplete(keyword).then((res) => {
            setSearchingAddress(false)
            setSearchAddressResult(res)
        }).catch((err) => {
            setSearchingAddress(false)
            setSearchAddressResult(res)
        })
    }
    
    function selectAddress(address) {
        setSearchAddressResult(null)
        setSearchAddressMode(false)
        setAddress(address?.description)
        getLPlaceDetailByPlaceId(address?.place_id)
    }
    // *----------------SEARCH MAP----------------*

    return <>
        <div>

            {isLoaded && <GoogleMap 
                ref={refMap}
                mapContainerStyle={mapContainer} 
                center={center} 
                zoom={15} 
                onDragEnd={handleBoundsChanged}
                onLoad={onLoad} 
                onUnmount={onUnmount}>
                
                {/* MARKER */}
                {marker?.map((item,i) => (
                    <Marker 
                    key={i}
                    draggable={true}
                    position={item} />
                    ))}

            </GoogleMap>}

            {props?.usePickupLocation && <img className="marker-fixed-center" src="http://localhost/images/markers/first_stop.png" />}

            <div className={`box ${isSearchAddressMode ? "full-height" : ""} card no-padding`}>
                
                {isSearchAddressMode && <div className="p-3">
                    <div className="display-space-between pb-3">
                        <IconButton 
                            onClick={closeSearchAddres} 
                            size="small" 
                            className="me-3">
                            <Icon>arrow_back</Icon>
                        </IconButton>
                        <SearchBar 
                            onSearch={(val) => searchAddress(val)} 
                            isLoading={isSearchingAddress}/>
                    </div>
                    <div>
                        {searchAddressResult?.predictions?.map((item, i) => {
                            return <div 
                                className="address-list-item"
                                onClick={() => selectAddress(item)}>
                                <span>{item?.structured_formatting?.main_text},</span>
                                <small className="ms-1 text-muted">{item?.structured_formatting?.secondary_text}</small>
                            </div>
                        })}
                    </div>
                </div>}

                {(!isSearchAddressMode && props?.usePickupLocation) && <div className="p-3">
                    <Chip
                        className="mb-3"
                        icon={<Icon>search</Icon>}
                        label="Search location by address"
                        clickable
                        onClick={() => setSearchAddressMode(true)}
                        color="basic"/>
                    <div>{address}</div>
                    <div className="mt-1">
                        <small className="text-muted">Coordinate: {center?.lat?.toFixed(6)},{center?.lng?.toFixed(6)}</small>
                    </div>
                    <Button 
                        variant="contained" 
                        size="large"
                        color="secondary"
                        className="mt-3"
                        fullWidth={true}
                        onClick={pickLocation}
                        // disabled={isLoading}
                        disableElevation={true}>
                        PICK LOCATION
                    </Button>
                </div>}
            </div>

        </div>
        {/*language=CSS*/}
        <style jsx>{`
            .marker-fixed-center {
                height: 40px;
                position: absolute;
                top: calc(50% - 65px);
                left: calc(50% - 15px);
                z-index: 98;
                width: 30px;
            }
            .box {
                z-index: 99;
                width: 30%;
                position: absolute;
                bottom: 120px;
                left: 80px;
            }
            .box.full-height {
                height: calc(100% - 240px)
            }
            .search-button {
                display: flex;
                align-items: center;
                cursor: pointer;
                color: #999;
                font-weight: 500;
            }
            .search-button:hover {
                color: #333;
            }
            .address-list-item {
                border-radius: 8px;
                padding: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                color: #444;
                background: #ffffff;
            }
            .address-list-item:hover {
                background: #efefef;
            }
            .address-list-item span {
                font-size: 14px;
            }
        `}</style>
    </>

}