import { Icon, IconButton, InputBase } from "@material-ui/core";
import { useState } from "react";
import { CircularProgressCustom } from "../base_component/spinner";

export default function SearchBar(props) {

    const [searchInput, setSearchInput] = useState("")
    var typingSearchTimer;
    var doneTypingSearchInterval = 700; 
    function onSearch() {
        props.onSearch(searchInput)
    }

    return <div className="search-bar" style={props?.style}>
        <InputBase
            placeholder={props?.placeholder ?? "Search..."}
            className="search-input"
            disabled={props?.isLoading}
            renderSuffix={() => {
                if (props?.isLoading) {
                    return <CircularProgressCustom size={20} />
                } else {
                    return <IconButton onClick={onSearch} size="small"><Icon>search</Icon></IconButton>
                }
            }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyUp={(e) => {
                clearTimeout(typingSearchTimer)
                typingSearchTimer = setTimeout(onSearch, doneTypingSearchInterval)
            }}
            onKeyDown={(e) => clearTimeout(typingSearchTimer)}
            inputProps={{ 'aria-label': 'search' }}
        />


    </div>
}