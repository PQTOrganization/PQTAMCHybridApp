import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { createTheme, ThemeProvider } from "@mui/material";
import { ConfigProvider } from "./context/configcontext";
import { ValidationProvider } from "./context/validationcontext";
import { AuthProvider } from "./context/authcontext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  palette: {
    primary: {
      main: "#8B0037",
    },
    secondary: {
      main: "#747474",
      light: "#666666",
    },
    success: {
      main: "#007A48",
    },
  },
  typography: {
    fontFamily: ["Ubuntu", "sans-serif"].join(","),
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ConfigProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
