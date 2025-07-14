import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

import "./assets/styles/index.css";
import "./assets/styles/bootstrap.custom.css";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ShippingAddress from "./pages/ShippingAddress.jsx";

// for the routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LogInPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/shipping" element={<ShippingAddress />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
