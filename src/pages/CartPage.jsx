import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./cart.css";
const CartPage = () => {
  const { cartItems, updateCart } = useOutletContext();
  const [items, setItems] = useState(cartItems);

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const saveAndUpdate = (newItems) => {
    localStorage.setItem("cart", JSON.stringify(newItems));
    updateCart();
  };

  const increment = (id) => {
    const newItems = items.map((item) => {
      if (item.id === id && item.quantity < item.stock) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    saveAndUpdate(newItems);
  };

  const decrement = (id) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;

    if (target.quantity <= 1) {
      const filtered = items.filter((item) => item.id !== id);
      saveAndUpdate(filtered);
    } else {
      const newItems = items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      saveAndUpdate(newItems);
    }
  };

  const total = items.reduce((sum, item) => {
    const price = item.discount
      ? Math.floor((item.price / 100) * (100 - item.discount))
      : item.price;
    return sum + price * (item.quantity || 1);
  }, 0);
  console.log(items);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Savat</h2>
        {items.length === 0 ? (
          <p>Savat bosh</p>
        ) : (
          <>
            <ul>
              {items.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <div className="cart_products_kor">
                    <img src={item.img} alt={item.title} width="50" />
                    <div className="cart_prod_details">
                      <div className="cart_prod_title">
                        <span>{item.title}</span>
                      </div>
                      <div className="cart_prod_price_and_discount">
                        <span>
                          {item.discount
                            ? Math.floor(
                                (item.price / 100) * (100 - item.discount)
                              )
                            : item.price}{" "}
                          som
                        </span>
                        <span className="cart_prod_weight">
                          {item.weight} {item.unit}
                        </span>
                      </div>
                    </div>
                    <div className="cart_quantity_controls">
                      <button onClick={() => decrement(item.id)}>-</button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => increment(item.id)}>+</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {/* <h3>Итого: {total.toLocaleString()} som</h3> */}
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
  