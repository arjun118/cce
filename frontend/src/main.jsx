import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./context/AuthProvider";
import { extendTheme } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
// const config = {
//   initialColorMode: "dark",
//   useSystemColorMode: false,
// };
// const theme = extendTheme({ config });
// console.log(theme.config.initialColorMode);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        {/* <ColorModeScript initialColorMode={theme.config.initialColorMode} / */}
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
