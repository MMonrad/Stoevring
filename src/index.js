import "src/utils/polyfills";

import React from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import { Provider } from "react-redux";
import { render } from "react-dom";
import { OptimistProvider } from "react-optimist";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import { HashRouter } from "react-router-dom";

import { configureStore } from "src/redux/configureStore";
import App from "src/react/App";

import { Rest } from "src/utils/rest/rest";
import taskUpdateChecker from "src/utils/task/taskUpdateChecker";

/* import AppInsights */
import { AppInsights } from "applicationinsights-js";

injectTapEventPlugin();

const { store } = configureStore();
Rest.Instance.setStore(store);
taskUpdateChecker.setStore(store);

/* Call downloadAndSetup to download full ApplicationInsights script from CDN and initialize it with instrumentation key */
AppInsights.downloadAndSetup({ instrumentationKey: "06e2743f-9828-4e2d-bca8-60654612ed3b" });

//disse flyttes senere
const sekoiaColors = {
    primary: {
        dark: "#29434e",
        light: "#819ca9",
        main: "#546e7a",
        contrastText: "#ffffff"
    },
    secondary: {
        contrastText: "#fff",
        dark: "#005005",
        light: "#60ad5e",
        main: "#2e7d32"
    }
};

const theme = createMuiTheme({
    palette: {
        background: {
            default: "#FFFFFF"
        },
        primary: {
            contrastText: sekoiaColors.primary.contrastText,
            dark: sekoiaColors.primary.dark,
            light: sekoiaColors.primary.light,
            main: sekoiaColors.primary.main
        },
        secondary: {
            contrastText: sekoiaColors.secondary.contrastText,
            dark: sekoiaColors.secondary.dark,
            light: sekoiaColors.secondary.light,
            main: sekoiaColors.secondary.main
        }
    },
    typography: {
        display1: {
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: "1.5em",
            color: "rgba(0, 0, 0, 0.87)"
        },
        display2: {
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: "1.5em",
            color: "rgba(0, 0, 0, 0.54)",
            marginBottom: "0.5rem"
        },
        body1: {
            whiteSpace: "pre-line"
        }
    },
    overrides: {
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: sekoiaColors.primary.dark
            }
        }
    }
});

render(
    <Provider store={store}>
        <HashRouter forceRefresh={false}>
            <MuiThemeProvider theme={theme}>
                <OptimistProvider>
                    <CssBaseline />
                    <App />
                </OptimistProvider>
            </MuiThemeProvider>
        </HashRouter>
    </Provider>,
    document.getElementById("content")
);
