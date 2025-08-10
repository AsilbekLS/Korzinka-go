import React from "react";
import Main from "./components/Main/Main";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./app.css";

import Home from "./pages/Home";
import CategoryPage from "./pages/Catedory";
import DiscountsPage from "./pages/DiscountPage";

import { LanguageProvider } from "./context/Lancontext";

import CartPage from "./pages/CartPage.jsx";
import { ProductClassesProvider } from "./context/ProductClassesContext.jsx";
import { UiContext } from "./context/UiContext.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { index: true, element: <Home /> },
      { path: "/category/:category", element: <CategoryPage /> },
      { path: "/discounts/:category", element: <DiscountsPage /> },
      { path: "/discounts", element: <DiscountsPage /> },
      { path: "/cart", element: <CartPage /> }, // позже заменишь на настоящий компонент
    ],
  },
]);

function App() {
  return (
    <div className="App">
      {/* Вложенные провайдеры: LanguageProvider ⬅️ верхний, CartProvider ⬅️ внутри */}
      <ProductClassesProvider>
        <LanguageProvider>
          <RouterProvider router={routes} />
        </LanguageProvider>
      </ProductClassesProvider>
    </div>
  );
}

export default App;
