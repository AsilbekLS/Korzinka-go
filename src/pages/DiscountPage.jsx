import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SaleCart from "../Models/SaleCart";
import Navbar from "../components/Navbar/Navbar";
import { useLanguage } from "../context/Lancontext";
import "./disc.css";

function DiscountsPage() {
  const { category } = useParams(); // может быть undefined, если /discounts
  const [discountedItems, setDiscountedItems] = useState([]);
  const { language } = useLanguage();

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGM5YTI3NjZhYzRiYjVhNDhlNzY0YiIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc1NDA0NDk4MH0.qf3j2DKdniHYeDMoJuTt7dU7p_MgI7tcyGRpqrhXIdI";

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          axios.get(
            "https://server-gamma-tawny.vercel.app/api/v1/token/product/get",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            "https://server-gamma-tawny.vercel.app/api/v1/token/category/get",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const products = productRes.data || [];
        const now = new Date();

        let filteredProducts = products;

        // если передана категория в URL — фильтруем
        if (category) {
          filteredProducts = filteredProducts.filter(
            (prod) => prod.category === category
          );
        }

        // оставляем только товары с активной скидкой
        const discounted = filteredProducts.filter((prod) => {
          const activeDiscount = (prod.discount_log || []).find((discount) => {
            if (discount.status !== "active") return false;

            const start = new Date(discount.start_date);
            const end = discount.end_date ? new Date(discount.end_date) : null;

            return start <= now && (!end || now <= end);
          });
          return Boolean(activeDiscount);
        });

        setDiscountedItems(discounted);
      } catch (error) {
        console.error("Ошибка при загрузке скидок:", error);
      }
    };

    fetchDiscounts();
  }, [category]);

  return (
    <div className="dis_box">
      <Navbar />
      <h2>
        {language === "ru"
          ? "🔻 Все товары со скидками"
          : "🔻 Chegirmali mahsulotlar"}
      </h2>
      {discountedItems.length === 0 ? (
        <p>{language === "ru" ? "Нет скидок" : "Chegirmalar yo‘q"}</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {discountedItems.map((item, idx) => {
            const activeDiscount = (item.discount_log || []).find(
              (discount) => {
                if (discount.status !== "active") return false;

                const now = new Date();
                const start = new Date(discount.start_date);
                const end = discount.end_date
                  ? new Date(discount.end_date)
                  : null;

                return start <= now && (!end || now <= end);
              }
            );

            return (
              <SaleCart
                key={idx}
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
                unit_description={item.unit_description}
                expiration={item.expiration}
                discount={activeDiscount || null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DiscountsPage;
