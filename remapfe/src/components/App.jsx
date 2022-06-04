import React, { useCallback, useMemo, useState, useId, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useForm } from "react-hook-form";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
    Center, Container, VStack, Heading, Text,
    FormControl, FormLabel, Input, Button, Select,
    NumberInput, FormErrorMessage, VisuallyHidden, Flex,
    NumberInputField, Table,
    Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer,
} from "@chakra-ui/react";


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
        props.onSearch(data);
    }

    return (<VStack>
        <form class="search-input" onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
                <Flex p={0} wrap="wrap">
                    <VisuallyHidden>
                        <FormLabel htmlFor={id + "-center"}>Center Address</FormLabel>
                    </VisuallyHidden>
                    <Input id={id + "-center"} name="center" placeholder="Center Address" {...register("center", { required: "This is required" })} />
                    <FormErrorMessage>
                        {errors.center && errors.center.message}
                    </FormErrorMessage>

                    <FormLabel htmlFor={id + "-maxdistance"}>Max Distance</FormLabel>
                    <NumberInput min={0} step="any" id={id + "-maxdistance"} name="maxdistance" {...register("distance", { min: { value: 0, message: "Min value is 0" } })}>
                        <NumberInputField placeholder="Max Distance" />
                    </NumberInput>
                    <FormErrorMessage>
                        {errors.distance && errors.distance.message}
                    </FormErrorMessage>

                    <VisuallyHidden>
                        <FormLabel htmlFor={id + "-unit"}>unit</FormLabel>
                    </VisuallyHidden>
                    <Select defaultValue="km" placeholder='Unit' id={id + "-unit"} name="unit" {...register("unit", { required: "This is required" })}>
                        <option value="m">m</option>
                        <option value="km">km</option>
                    </Select>
                    <FormErrorMessage>
                        {errors.unit && errors.unit.message}
                    </FormErrorMessage>
                </Flex >

                <FormLabel htmlFor={id + "-addrcolumn"}>Address Column</FormLabel>

                <Select id={id + "-addrcolumn"} name="addresscolumn" placeholder='Address Column' {...register("addressColumn", { required: "This field is required" })}>
                    {
                        columns.length > 0 && columns.map((c) => (<option value={c} key={c.toString()}>{c}</option>))
                    }
                </Select>
                <FormErrorMessage>
                    {errors.addressColumn && errors.addressColumn.message}
                </FormErrorMessage>

            </FormControl>
            <Button type="submit">Search</Button>
        </form >
    </VStack>);
}

function TableSample(props) {
    return (
        < TableContainer >
            <Table>
                <TableCaption>
                    Your file sample
                </TableCaption>
                <Thead>
                    <Tr>
                        {props.columns.map((c) => (<Th>{c}</Th>))}
                    </Tr>
                </Thead>
                <Tbody>
                    {props.data.map((row) => {
                        return <Tr>{row.map((cell) => (<Th>{cell}</Th>))}</Tr>;
                    })}
                </Tbody>
            </Table>

        </TableContainer >);

}

function LocationMarkers(props) {
    return props.locations.map((loc) => (
        <Marker position={loc}>
            <Popup>
                Property within Max Distance
            </Popup>
        </Marker>));

}

function Map(props) {
    const [map, setMap] = useState(null);

    useEffect(() => {
        map.setView(props.center, 13);
    }, [map, props.center, props.locations]);
    const displayMap = useMemo(
        () => (
            <MapContainer
                center={props.center}
                zoom={13}
                scrollWheelZoom={false}
                ref={setMap}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarkers locations={props.locations} />

                <Marker position={props.center}>
                    <Popup>
                        Center
                    </Popup>
                </Marker>

            </MapContainer>
        ),
        [],
    )
    return (
        <div>
            {displayMap}
        </div>
    )


}


function App(props) {
    [isFile, setisFile] = useState(false);
    [tableSample, settableSample] = useState(null);
    [searchOutput, setsearchOutput] = useState(null);


    function handlejsonTable(json) {
        try {
            const newtableSample = { "columns": json["columns"], "data": json["data"] };
            settableSample(newtableSample);
            setisFile(true);
        }
        catch (error) {
            throw new Error("Could not load the sample");
        }
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
                setisFile(false);
            });

    }

    function handlejsonSearch(json) {
        try {
            const newsearchOuput = { "outputURL": json["outputURL"], "locations": json["locations"], "center": json["center"] };
            setsearchOutput(newsearchOuput);
        }
        catch (error) {
            throw new Error("Could not get the search result");
        }


    }

    function handleSearch(data) {
        const formData = new FormData();
        formData.append("data", data);
        const fetchPromise = fetch("", {
            method: "POST",
            body: formData,
        });
        fetchPromise.then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        }).then(json => { handlejsonSearch(json); }).catch(error => {
            console.error(`Could not receive search output: ${error}`);
        });
    }

    return (<Container p={0}>
        <VStack w="full" h="full" p={2} spacing={5}>

            <Heading>
                App for realtors to plan day travel
            </Heading>
            <FileInput onFileUpload={handleFileUpload} />
            <SearchInput columns={columns} onSearch={handleSearch} />
            {isFile && <TableSample tableSample={...tableSample} />}
            {searchOutput ? <Map searchOutput={...searchOutput} /> : null}
        </VStack>
    </Container >);
}
