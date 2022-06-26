import React, { useCallback, useMemo, useState, useId, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useForm } from "react-hook-form";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
    Center, Container, VStack, Heading, Text,
    FormControl, FormLabel, Input, Button, Select,
    NumberInput, FormErrorMessage, VisuallyHidden, Flex,
    NumberInputField, Table, SimpleGrid,
    Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, GridItem,
} from "@chakra-ui/react";
import axios from 'axios';

function FileInput(props) {

    function handleChange(event) {
        props.onFileUpload(event.target.files[0]);
    }
    return (<div className="file-input">
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

    return (<VStack spacing={10} w="full" h="full">
        <form className="search-input" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.center}>

                <VisuallyHidden>
                    <FormLabel htmlFor={id + "-center"}>Center Address</FormLabel>
                </VisuallyHidden>
                <Input id={id + "-center"} name="center" placeholder="Center Address" {...register("center", { required: "This is required" })} />
                <FormErrorMessage>
                    {errors.center && errors.center.message}
                </FormErrorMessage>
            </FormControl>

            <SimpleGrid marginTop="2rem" columns={2} columnGap="1.5rem" rowGap="2rem" w="full">
                <GridItem>
                    <FormControl isInvalid={errors.distance}>
                        <VisuallyHidden>
                            <FormLabel htmlFor={id + "-maxdistance"}>Max Distance</FormLabel>
                        </VisuallyHidden>
                        <NumberInput min={0} step="any" id={id + "-maxdistance"} name="maxdistance" {...register("distance", { required: 'This is required', min: { value: 0, message: "Min value is 0" } })}>
                            <NumberInputField placeholder="Max Distance" />
                        </NumberInput>
                        <FormErrorMessage>
                            {errors.distance && errors.distance.message}
                        </FormErrorMessage>
                    </FormControl>
                </GridItem>

                <GridItem>
                    <FormControl isInvalid={errors.unit}>
                        <VisuallyHidden>
                            <FormLabel htmlFor={id + "-unit"}>unit</FormLabel>
                        </VisuallyHidden>
                        <Select id={id + "-unit"} name="unit" {...register("unit", { required: "This is required" })}>
                            <option value="m">m</option>
                            <option value="km">km</option>
                        </Select>
                        <FormErrorMessage>
                            {errors.unit && errors.unit.message}
                        </FormErrorMessage>
                    </FormControl>
                </GridItem>
            </SimpleGrid>

            <FormControl isInvalid={errors.addressColumn}>
                <VisuallyHidden>
                    <FormLabel htmlFor={id + "-addrcolumn"}>Address Column</FormLabel></VisuallyHidden>

                <Select marginTop="2rem" id={id + "-addrcolumn"} name="addresscolumn" placeholder='Address Column' {...register("addressColumn", { required: "This field is required" })}>
                    {
                        columns && columns.length > 0 && columns.map((c) => (<option value={c} key={c.toString()}>{c}</option>))
                    }
                </Select>
                <FormErrorMessage>
                    {errors.addressColumn && errors.addressColumn.message}
                </FormErrorMessage>

            </FormControl>
            <Button marginTop="2rem" type="submit">Search</Button>
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
                        {props.columns.map((c) => (<Th key={c.toString()}>{c}</Th>))}
                    </Tr>
                </Thead>
                <Tbody>
                    {props.data.map((row) => {
                        return <Tr key={row[0].toString()}>{row.map((cell) => (<Th key={cell.toString()}>{cell}</Th>))}</Tr>;
                    })}
                </Tbody>
            </Table>

        </TableContainer >);

}

function LocationMarkers(props) {
    return props.locations.map((loc) => (
        <Marker position={loc.coordinate}>
            <Popup>
                {loc.address}
            </Popup>
        </Marker>));

}

function Map(props) {
    const [map, setMap] = useState(null);


    return (
        <div>
            <MapContainer className='leaflet-container'
                center={props.center}
                zoom={13}
                scrollWheelZoom={false}
                ref={setMap}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {props.locations.length > 0 && <LocationMarkers locations={props.locations} />}

                <Marker position={props.center}>
                    <Popup>
                        Center
                    </Popup>
                </Marker>

            </MapContainer>

        </div>
    )


}


function App(props) {
    const [isFile, setisFile] = useState(false);
    const [tableSample, settableSample] = useState({ "columns": null });
    const [searchOutput, setsearchOutput] = useState(null);
    const [userFile, setUserFile] = useState(null);


    function handlejsonTable(json) {
        try {
            const newtableSample = { columns: json["columns"], data: json["data"] };
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
        const fetchPromise = axios.post("uploadfile", { data: formData });
        fetchPromise.then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            setUserFile(fileUpload);
            return response.json();
        })
            .then(json => { handlejsonTable(json); }).catch(error => {
                console.error(`Could not receive file parse after upload: ${error}`);
                setisFile(false);
            });

    }

    function handlejsonSearch(json) {
        try {
            const newsearchOuput = { outputURL: json["outputURL"], locations: json["locations"], center: json["center"] };
            setsearchOutput(newsearchOuput);
        }
        catch (error) {
            throw new Error("Could not get the search result");
        }


    }

    function handleSearch(data) {
        const formData = new FormData();
        formData.append("file", userFile);
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        const fetchPromise = fetch("search", {
            method: "POST",
            credentials: "include",
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
        <VStack w="100%" h="full" p={2} spacing="2rem" maxWidth="1400px">

            <Heading>
                App for realtors to plan day travel
            </Heading>
            <FileInput onFileUpload={handleFileUpload} />
            <SearchInput columns={tableSample.columns} onSearch={handleSearch} />
            {searchOutput && <a href={searchOutput.outputURL} download>searchresult.csv</a>}
            {!isFile && <p>File was not uploaded or not parsed due to file format</p>}
            {isFile && <TableSample {...tableSample} />}
            {searchOutput && <Map {...searchOutput} />}
        </VStack>
    </Container >);
}

export { FileInput, App };