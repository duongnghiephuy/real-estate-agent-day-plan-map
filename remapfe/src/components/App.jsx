import React, { useState, useId } from 'react';
import ReactDOM from 'react-dom/client';


function FileInput(props) {

    return (<div class="file-input">
        <input type="file"></input>
    </div>);
}



function SearchInput(props) {
    const id = useId();
    const [center, setCenter] = useState("");
    const [unit, setUnit] = useState("1");
    const [maxDistance, setMaxDistance] = useState("km");
    const [addressColumn, setAddressColumn] = useState("");
    const columns = props.columns;

    function handleUnitChange(event) {
        setUnit(event.target.value);
    }

    function handleMaxDistanceChange(event) {
        setMaxDistance(event.target.value);
    }

    function handleColumnChange(event) {
        setAddressColumn(event.target.value);
    }

    function handleCenter(event) {
        setCenter(event.target.value);
    }
    function handleSubmit(event) {
        event.preventDefault();

    }

    return (<form class="search-input" onSubmit={handleSubmit}>
        <label>
            Center Address:
            <input type="text" value={center} name="center-address" onChange={handleCenter}>  </input>
        </label>
        <label>
            Maximum Distance:
            <input type="number" value={maxDistance} step="any" min="0" name="max-distance"
                list={id + "-distances"} onChange={handleMaxDistanceChange}>  </input>
        </label>
        <datalist id={id + "-distances"}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="100">10</option>
        </datalist>
        <label>
            Unit:
            <select value={unit} onChange={handleUnitChange} name="unit">
                <option value="m">m</option>
                <option value="km">km</option>
            </select>
        </label>

        {
            columns.length > 0 && (
                <label>
                    Address Column:
                    <select value={addressColumn} onChange={handleColumnChange} name="address-column">
                        {
                            columns.map((c) => (<option value={c}>{c}</option>))
                        }

                    </select>
                </label>)
        }
        <input type="submit">Search</input>

    </form >);
}


function App(props) {
    return (<div class="content">
        <h1>
            App for realtors to plan day travel
        </h1>
        <FileInput />

    </div>);
}
const container = ReactDOM.createRoot(document.getElementById("app"));
container.render();