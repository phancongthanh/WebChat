import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import auth from "./backend/auth";
import AccountPage from "./pages/account/AccountPage";
import App from "./App";
import "./setup";

const root = ReactDOM.createRoot(document.getElementById("root")!);

auth.checkLogged().then((isLogged) => {
  const app = isLogged ? <App /> : <AccountPage />;
  root.render(<React.StrictMode>{app}</React.StrictMode>);
});
