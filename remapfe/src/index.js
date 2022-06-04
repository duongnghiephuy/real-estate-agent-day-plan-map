import App from "./components/App";
import { ChakraProvider } from '@chakra-ui/react'

const container = ReactDOM.createRoot(document.getElementById("app"));
container.render(
    <ChakraProvider>
        <App />
    </ChakraProvider>
);