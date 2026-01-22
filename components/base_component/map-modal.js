import { Button, Chip, Divider, Icon, IconButton, Modal } from "@material-ui/core"
import { Autocomplete, GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api"
import React, { useRef, useState } from "react"
import { googleMapApiKey } from "../../helpers/api_key";
import { loadPlaceDetailByLatLng, loadPlaceDetailByPlaceId, searchAddresAutocomplete } from "../../services/api/maps.api";
import MapLayer from "./map-layer";
import SearchBar from "./searchbar";

export default function MapModal(props) {

    function pickLocation(val) {
        props?.closeModal()
        props?.locationPicked(val)
    }

    return <>
        <Modal open={props?.open}
            onClose={() => props?.closeModal()}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <div 
                className="modal-wrapper" 
                style={{
                    width: "calc(100vw - 100px)", 
                    height: "calc(100vh - 150px)", 
                    borderRadius: 8, 
                    overflow: "hidden",
                }}>

                <MapLayer 
                    width="calc(100vw - 100px)" 
                    height="calc(100vh - 150px)"
                    pickupLoaction={props?.pickupLoaction}
                    usePickupLocation={true}
                    locationPicked={pickLocation}/>

            </div>
        </Modal>
    </>

}