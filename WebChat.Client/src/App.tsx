import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import { StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material/styles";
import store from "./store";
import AppNav from "./layouts/AppNav";
import GlobalElement from "./layouts/GlobalElement";
import GlobalError from "./layouts/global-error/GlobalError";
import CloudChat from "./pages/CloudChat";
import LoadingPage from "./pages/LoadingPage";
import StartBox from "./pages/StartBox";
import UserChat from "./pages/UserChat";
import FriendRequests from "./pages/friend-requests/FriendRequests";
import GroupChat from "./pages/group-chat/GroupChat";
import GroupRequests from "./pages/group-requests/GroupRequests";

const theme = createTheme({
  palette: {
    secondary: grey,
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: "normal",
    },
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
            <GlobalElement>
              <LoadingPage>
                <Stack overflow="hidden" direction="row" height="100%">
                  <AppNav />
                  <Routes>
                    <Route path="/Cloud" element={<CloudChat />} />
                    <Route path="/User/:userId" element={<UserChat />} />
                    <Route path="/Group/:groupId" element={<GroupChat />} />
                    <Route path="/FriendRequests" element={<FriendRequests />} />
                    <Route path="/GroupRequests" element={<GroupRequests />} />
                    <Route path="*" element={<StartBox />} />
                  </Routes>
                </Stack>
                <GlobalError />
              </LoadingPage>
            </GlobalElement>
          </BrowserRouter>
        </StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  );
}
