import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./mini.css";

const MiniCartModal = ({ cartItems }) => {
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.discount
      ? Math.floor((item.price / 100) * (100 - item.discount))
      : item.price;
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <div className="mini-cart-modal">
      <div className="mini-cart-content">
        <p>
          🛒 Всего: <strong>{totalPrice.toLocaleString()} сум</strong>
        </p>
        <button onClick={() => navigate("/cart")}>Посмотреть корзину</button>
      </div>
    </div>
  );
};

export default MiniCartModal;
