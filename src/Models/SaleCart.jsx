import React, { useState, useEffect } from "react";
import "./salecart.css";
import ProductModal from "./ModelCat";
import { useOutletContext } from "react-router-dom";

function SaleCart({
  id,
  title,
  price,
  weight,
  unit,
  discount,
  img,
  descriprion,
  product_ingredients,
  nutritional_value,
  unit_description,
  expiration,
  fun,
  isInModal = false, // Новый флаг: карточка рендерится внутри модалки
}) {
  const [showModal, setShowModal] = useState(false);
  const { updateCart } = useOutletContext();
  const stock = 10;
  const discoun = discount ? discount.percent : 0;

  const product = {
    id,
    title,
    price,
    weight,
    unit,
    discount: discoun,
    img,
    stock,
    descriprion,
    unit_description,
    product_ingredients,
    nutritional_value,
    expiration,
  };

  const getQuantity = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find((el) => el.id === id);
    return item ? item.quantity : 0;
  };

  const [quantity, setQuantity] = useState(getQuantity());

  useEffect(() => {
    setQuantity(getQuantity());
  }, []);

  const handleAdd = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find((el) => el.id === id);

    if (item) {
      if (item.quantity < stock) {
        item.quantity += 1;
      }
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setQuantity(getQuantity());
    updateCart();
  };

  const increment = () => {
    if (quantity < stock) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const updated = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      setQuantity(quantity + 1);
      updateCart();
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const updated = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      setQuantity(quantity - 1);
      updateCart();
    } else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const updated = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      setQuantity(0);
      updateCart();
    }
  };

  const handleImageClick = () => {
    if (isInModal && fun) {
      // В модалке — просто переключаем товар
      fun(product);
    } else {
      // Снаружи — открываем модалку
      setShowModal(true);
    }
  };

  const handleModalClose = (a) => {
    setShowModal(a);
  };

  return (
    <>
      <div className="sale_cart">
        <div className="sale_cart_texts">
          {discount && (
            <div className="event_cart">
              <div className="discount_event">
                <span>-{discount.percent}%</span>
              </div>
            </div>
          )}
          <img
            className="sale_img_cart"
            src={img}
            alt=""
            onClick={handleImageClick}
          />
          <p className="sale_cart_p1">
            {discount
              ? `${Math.floor((price / 100) * (100 - discount.percent))} сум`
              : `${price} сум`}
          </p>
          {discount && <p className="sale_cart_p2">{price} сум</p>}
          <p className="sale_cart_p3">{title}</p>
          <p className="sale_cart_p4">{weight}.</p>
        </div>

        {quantity > 0 ? (
          <div className="quantity-buttons">
            <button onClick={decrement}>–</button>
            <span>{quantity}</span>
            <button onClick={increment}>+</button>
          </div>
        ) : (
          <button className="sale_cart_btn" onClick={handleAdd}>
            В корзину
          </button>
        )}
      </div>

      {!isInModal && showModal && (
        <ProductModal product={product} onClose={handleModalClose} />
      )}
    </>
  );
}

export default SaleCart;
