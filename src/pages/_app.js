import Head from "next/head";
import { useState } from "react";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthConsumer, AuthProvider } from "src/contexts/auth-context";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import "simplebar-react/dist/simplebar.min.css";
import { ToastProvider } from "react-toast-notifications";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "src/slices/storeCart";
import "../../global.scss"
const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [subId, setSubId] = useState("all");
  const [subId2, setSubId2] = useState("all");

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>TMA Admin</title>
            <meta name="viewport" content="initial-scale=1, width=device-width" />
          </Head>
          <ToastProvider autodismiss autoDismissTimeout={2000} placement="bottom-right">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <AuthProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <AuthConsumer>
                    {(auth) =>
                      auth.isLoading ? (
                        <SplashScreen />
                      ) : (
                        getLayout(
                          <Component
                            {...pageProps}
                            subId={subId}
                            setSubId={setSubId}
                          
                          />
                        )
                      )
                    }
                  </AuthConsumer>
                </ThemeProvider>
              </AuthProvider>
            </LocalizationProvider>
          </ToastProvider>
        </CacheProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
