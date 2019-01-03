import * as React from 'react';
import { render } from 'react-dom';
import { HashRouter } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import App from 'src/App';
import * as serviceWorker from './serviceWorker';

// Import a pre-configured instance of i18next
import i18n from './i18n';

import "src/utils/polyfills";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    }
});

render(
        <HashRouter >
            <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                    <App />
            </MuiThemeProvider>
        </HashRouter>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
