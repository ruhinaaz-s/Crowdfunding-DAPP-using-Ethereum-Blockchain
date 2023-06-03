// import React from 'react';

// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

// import { StateContextProvider } from "./context";
// import App from './App.jsx';
// import './index.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//     //Wrapper for our entire application. We need to provide a desired chain id in our case it will be Sepolia
//     <ThirdwebProvider desiredChainId={ChainId.Goerli}>
//     {/* <ThirdwebProvider activeChain={}> */}
//         <Router>
//             <StateContextProvider>
//                 <App />
//             </StateContextProvider>
//         </Router>
//     </ThirdwebProvider>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { StateContextProvider } from "./context";
import App from "./App.jsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <ThirdwebProvider chainId="11155111">
        {" "}
        {/* Replace "0x123456" with the Sepolia chain ID */}
        <Router>
            <StateContextProvider>
                <App />
            </StateContextProvider>
        </Router>
    </ThirdwebProvider>
);
