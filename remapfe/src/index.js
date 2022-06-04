import App from "./components/App";
import { ChakraProvider } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client';
import React from 'react';
const container = ReactDOM.createRoot(document.getElementById("app"));
container.render(
    <ChakraProvider>
        <App />
    </ChakraProvider>
);