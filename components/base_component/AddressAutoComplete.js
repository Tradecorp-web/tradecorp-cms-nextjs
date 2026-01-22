import {Icon, IconButton, InputBase, OutlinedInput} from "@material-ui/core";
import React, { useState } from "react";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import {makeStyles} from "@material-ui/core/styles";
import {LOCAL_STORAGE_ADDRESS} from "../../helpers/consts";
import { useJsApiLoader } from "@react-google-maps/api";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        margin: 10,
        fontSize: 10,
    },
    inputbasemultiline: {
        fontSize: "12px !important",
    },
    comboOptions: {
        fontSize: "12px",
        color: "#000000",
    },
}));


const PlaceAutocomplete = () => {
    const classes = useStyles();

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search scope here */
        },
        debounce: 300,
    });

    const ref = useOnclickOutside(() => {
        // When user clicks outside the component, we can dismiss
        // the searched suggestions by calling this method
        clearSuggestions();
    });


    const handleInput = (e) => {
        // let getValue = document.getElementById("address").value;
        // Update the keyword of the input element
        // setValue(getValue);
        setValue(e.target.value);
        // console.log(LOCAL_STORAGE_ADDRESS);
        // setValue(document.getElementById("address").value = e.target.value)
        // console.log(budi);
    };


    const handleSelect =
        ({ description }) =>
            () => {
                // When user selects a place, we can replace the keyword without request data from API
                // by setting the second parameter to "false"
                setValue( description, false);
                clearSuggestions();


                // Get latitude and longitude via utility functions
                getGeocode({ address: description }).then((results) => {
                    const { lat, lng } = getLatLng(results[0]);
                    console.log("📍 Coordinates: ", { lat, lng });
                });
                // console.log(description);
                localStorage.setItem(LOCAL_STORAGE_ADDRESS, "");
                localStorage.setItem(LOCAL_STORAGE_ADDRESS, description);

                // return description;
            };

    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li key={place_id} onClick={handleSelect(suggestion)}>
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );

        });

    return (

        // <div className={classes.root}>
            <div ref={ref} className={classes.root}>
            <OutlinedInput
                id="address"
                name="address"
                className={classes.inputbasemultiline}
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Type the customer address here"
                fullWidth
            />
            {/* We can use the "status" to decide whether we should display the dropdown or not */}
            {status === "OK" && <ul className={classes.comboOptions}>{renderSuggestions()}</ul>}
        </div>
    );
};


export default function AddressAutoComplete() {
    const { isLoaded } = useJsApiLoader({
        id: 'AddressAutoComplete',
        googleMapsApiKey:`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
    })
    return (
        <div>
            {isLoaded ? <PlaceAutocomplete /> : <div>Loading...</div>}
        </div>
    );



}