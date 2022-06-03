import React, { useState, useId } from 'react';
import ReactDOM from 'react-dom/client';
import { useForm } from "react-hook-form";

function FileInput(props) {

    function handleChange(event) {
        props.onFileUpload(event.target.files[0]);
    }
    return (<div class="file-input">
        <label>
            Upload File:
            <input type="file" onChange={handleChange} onClick={(e) => (e.target.value = null)} />
        </label>
    </div>);
}



function SearchInput(props) {
    const id = useId();

    const columns = props.columns;

    const { register, handleSubmit, watch, formState: { errors } } = useForm();



    function onSubmit(data) {
        console.log(data);
    }

    return (<form class="search-input" onSubmit={handleSubmit(onSubmit)}>
        <label>
            Center Address:
            <input type="text" name="center" placeholder="Center Address" {...register("center", { required: true })} />
        </label>
        {errors.center && <p>This field is required</p>}
        <label>
            Maximum Distance:
            <input type="number" step="any" min="0" name="max-distance" placeholder='distance'
                list={id + "-distances"} {...register("distance", { required: true, min: 0 })} />
        </label>
        <datalist id={id + "-distances"}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="100">10</option>
        </datalist>
        {errors.distance && <p>This field is required</p>}
        <label>
            Unit:
            <select defaultValue="km" name="unit" {...register("unit", { required: true })}>
                <option value="m">m</option>
                <option value="km">km</option>
            </select>
        </label>
        {errors.unit && <p>This field is required</p>}



        <label>
            Address Column:
            <select name="address-column" {...register("addressColumn", { required: true })}>
                {
                    columns.length > 0 && columns.map((c) => (<option value={c} key={c.toString()}>{c}</option>))
                }

            </select>
        </label>
        {errors.addressColumn && <p>This field is required</p>}


        <input type="submit" />

    </form >);
}

function TableSample(props) {

}

function App(props) {
    [isFile, setisFile] = useState(false);

    let columns = null;
    let table_sample = null;

    function handlejsonTable(json) {
        columns = json["columns"];

    }


    function handleFileUpload(fileUpload) {

        const formData = new FormData();
        formData.append("file", fileUpload);
        const fetchPromise = fetch("", {
            method: "POST",
            body: formData,
        });
        fetchPromise.then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
            .then(json => { handlejsonTable(json); }).catch(error => {
                console.error(`Could not receive file parse after upload: ${error}`);
            });

    }

    return (<div class="content">
        <h1>
            App for realtors to plan day travel
        </h1>
        <FileInput onFileUpload={handleFileUpload} />
        <SearchInput />
        {isFile && <TableSample />}

    </div >);
}
const container = ReactDOM.createRoot(document.getElementById("app"));
container.render();