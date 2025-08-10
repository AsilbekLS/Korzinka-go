import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./car.css";
import { useLanguage } from "../context/Lancontext";
import SaleCart from "./SaleCart";

const ANIM_MS = 300; // синхронизировать с CSS

const ProductModal = ({ product, onClose }) => {
  const [shownProduct, setShownProduct] = useState(product);
  const [suggested, setSuggested] = useState([]);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [animState, setAnimState] = useState("opening");
  const { language } = useLanguage();
  const closingTimer = useRef(null);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGM5YTI3NjZhYzRiYjVhNDhlNzY0YiIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc1NDA0NDk4MH0.qf3j2DKdniHYeDMoJuTt7dU7p_MgI7tcyGRpqrhXIdI";

  // При изменении product обновляем shownProduct
  useEffect(() => {
    setShownProduct(product);
    setAnimState("opening");
  }, [product]);

  // Загружаем похожие товары при изменении shownProduct
  useEffect(() => {
    let mounted = true;

    const fetchSimilarProducts = async () => {
      if (!shownProduct) return;
      try {
        const res = await axios.get(
          "https://server-gamma-tawny.vercel.app/api/v1/token/product/get",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const products = res.data || [];
        const real = products.find(
          (item) => item._id === (shownProduct?.id || shownProduct?._id)
        );
        if (!real) {
          if (mounted) setSuggested([]);
          return;
        }

        const filtered = products.filter(
          (item) =>
            item.category === real.category &&
            item._id !== (shownProduct?.id || shownProduct?._id)
        );

        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        if (mounted) setSuggested(shuffled.slice(0, 20));
      } catch (err) {
        console.error("Ошибка при загрузке похожих:", err);
      }
    };

    fetchSimilarProducts();

    return () => {
      mounted = false;
    };
  }, [shownProduct, token]);

  // Блокируем скролл страницы при открытой модалке
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      if (closingTimer.current) clearTimeout(closingTimer.current);
    };
  }, []);

  const handleClose = () => {
    if (animState === "closing") return;
    setAnimState("closing");
    closingTimer.current = setTimeout(() => {
      onClose(false);
    }, ANIM_MS);
  };

  // Переключение товара из списка похожих
  const handleSwitchTo = (apiItem) => {
    if (animState === "closing") return;
    setShownProduct({
      id: apiItem._id,
      title: apiItem.product_name,
      price: apiItem.selling_price,
      weight: apiItem.unit_description,
      unit: apiItem.unit,
      discount:
        apiItem.discount_log?.find((d) => d.status === "active")?.percent || 0,
      img: apiItem.image_log?.[0]?.image_url || "",
      stock: apiItem.total_stock ?? 10,
      descriprion: apiItem.product_description,
      unit_description: apiItem.unit_description,
      product_ingredients: apiItem.product_ingredients,
      nutritional_value: apiItem.nutritional_value,
      expiration: apiItem.expiration,
    });
    setShowMoreInfo(false); // закрываем раскрытую инфу при смене товара
  };

  const prod = shownProduct || {};

  return (
    <div className={`papa_mod ${animState}`}>
      <div className="modal-backdrop" onClick={handleClose}>
        <button className="modal-close-btn" onClick={handleClose}>
          ×
        </button>
        <div className="product-modal" onClick={(e) => e.stopPropagation()}>
          {prod.img && (
            <img
              src={prod.img}
              alt={prod.title}
              className="product-image"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}

          <h2 className="product-title">
            {prod.title || ""}{" "}
            <span className="product_weight">
              {prod.weight} {prod.unit}
            </span>
          </h2>

          <p className="product-description">{prod.descriprion}</p>
          <hr />

          <div className="sostav_mod">
            <span>{prod.unit_description}</span>
            <div className="nutrion_values">
              <div className="nutional_value">
                <span>{prod.nutritional_value?.kkal}</span>
                <p>kkal</p>
              </div>
              <div className="nutional_value">
                <span>{prod.nutritional_value?.fat}</span>
                <p>yoglar</p>
              </div>
              <div className="nutional_value">
                <span>{prod.nutritional_value?.protein}</span>
                <p>oqsillar</p>
              </div>
              <div className="nutional_value">
                <span>{prod.nutritional_value?.uglevod}</span>
                <p>uglevodlar</p>
              </div>
            </div>
          </div>

          <hr />

          <div className="more_information">
            <div className="more-info-toggle">
              <button onClick={() => setShowMoreInfo((s) => !s)}>
                {"Tovar haqida batafsil"}
              </button>
            </div>

            <div
              className={`more-information-panel ${showMoreInfo ? "open" : ""}`}
            >
              <div className="data_obout_more">
                <span>{language === "ru" ? "Состав" : "Tarkibi"}</span>
                <p>{prod.product_ingredients}</p>
              </div>
              <div className="data_obout_more">
                <span>
                  {language === "ru"
                    ? "Срок годности и условия хранения"
                    : "Yaroqlilik muddati, saqlanish sharoyiti"}
                </span>
                <p>{prod.expiration} k.</p>
              </div>
            </div>
          </div>

          <h3 className="suggested-title">
            {language === "ru" ? "Похожие товары" : "Yana nimadir olasizmi?"}
          </h3>

          <div className="suggested-list">
            {suggested.length === 0 && (
              <p>
                {language === "ru"
                  ? "Нет похожих"
                  : "O'xshash mahsulotlar yo'q"}
              </p>
            )}
            {suggested.map((item, index) => (
              <SaleCart
                key={index}
                id={item._id}
                stock={item.total_stock}
                img={item.image_log?.[0]?.image_url}
                title={item.product_name}
                price={item.selling_price}
                weight={item.unit_description}
                descriprion={item.product_description}
                product_ingredients={item.product_ingredients}
                nutritional_value={item.nutritional_value}
                unit={item.unit}
                expiration={item.expiration}
                unit_description={item.unit_description}
                discount={
                  item.discount_log?.find((d) => d.status === "active") || null
                }
                fun={() => handleSwitchTo(item)}
                isInModal={true} // чтобы не открывалась новая модалка
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
