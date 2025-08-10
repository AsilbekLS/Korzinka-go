import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/Lancontext";
import "./Main.css";
import MiniCartModal from "../../Models/MiniMod.jsx";

function Main() {
  const { changeLanguage } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [cartItems, setCartItems] = useState([]);

  const updateCart = () => {
    try {
      const stored = localStorage.getItem("cart");
      const parsed = stored ? JSON.parse(stored) : [];
      setCartItems(parsed);
    } catch (e) {
      console.error("Ошибка при чтении корзины:", e);
      setCartItems([]);
    }
  };

  useEffect(() => {
    updateCart();
  }, []);

  return (
    <div className="main" style={isHomePage ? {} : { paddingTop: "50px" }}>
      {isHomePage && (
        <div className="navbar">
          <span className="nav_sp">улица Бабуршах, 5</span>
          <input
            className="inp_main_nav"
            placeholder="Найти в магазине"
            type="text"
            onFocus={() => {
              localStorage.setItem("openNavbarSearch", "true");
              window.location.reload();
            }}
          />
        </div>
      )}

      {/* 👇 Прокидываем cartItems и updateCart как context-like пропсы */}
      <Outlet context={{ cartItems, updateCart }} />

      {cartItems.length > 0 && <MiniCartModal cartItems={cartItems} />}
    </div>
  );
}

export default Main;
