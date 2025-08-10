import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SaleCart from "../Models/SaleCart";
import Navbar from "../components/Navbar/Navbar";
import translations from "../translate/translate";
import row from "../assets/free-icon-thin-arrow-12857769.png";
import small_row from "../assets/free-icon-right-arrow-angle-54833.png";
import { useLanguage } from "../context/Lancontext";
import "./categ.css";

function CategoryPage() {
  const { category } = useParams(); // categoryId
  const [subcategories, setSubcategories] = useState({});
  const [discountItems, setDiscountItems] = useState([]);
  const { language } = useLanguage();

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGM5YTI3NjZhYzRiYjVhNDhlNzY0YiIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc1NDA0NDk4MH0.qf3j2DKdniHYeDMoJuTt7dU7p_MgI7tcyGRpqrhXIdI";

  useEffect(() => {
    const fetchData = async () => {
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
        const allCategories = categoryRes.data || [];
        console.log(products);

        const currentCategory = allCategories.find(
          (cat) => cat._id === category
        );
        if (!currentCategory) return;

        const filteredProducts = products.filter(
          (prod) => prod.category === category
        );

        const subsMap = {};
        const discounted = [];
        const now = new Date();

        currentCategory.subcategories.forEach((sub) => {
          subsMap[sub.subcategory] = [];
        });

        filteredProducts.forEach((prod) => {
          const sub = currentCategory.subcategories.find(
            (s) => s._id === prod.subcategory
          );
          if (!sub) return;

          const subName = sub.subcategory;
          if (!subsMap[subName]) subsMap[subName] = [];
          subsMap[subName].push(prod);

          const activeDiscount = (prod.discount_log || []).find((discount) => {
            if (discount.status !== "active") return false;

            const start = new Date(discount.start_date);
            const end = discount.end_date ? new Date(discount.end_date) : null;

            return start <= now && (!end || now <= end);
          });

          if (activeDiscount) {
            discounted.push({
              ...prod,
              discount_log: [activeDiscount], // только активная скидка
            });
          }
        });

        setSubcategories(subsMap);
        setDiscountItems(discounted);
        console.log(discountItems);
        console.log(products);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, [category]);
  // function updateCart() {
  //   Object.entries(subcategories).map(([subcat, items]) =>
  //     items.map((item) => {
  //       console.log(item.product_description);
  //     })
  //   );
  //   // Функция для обновления корзины, если нужно
  // }
  // updateCart();
  return (
    <div>
      <Navbar subcategories={subcategories} />

      {/* Якорные кнопки */}
      <div className="anchor-buttons">
        {Object.keys(subcategories).map((subcat) => (
          <a key={subcat} href={`#${subcat}`}>
            <button>{translations[language]?.[subcat] || subcat}</button>
          </a>
        ))}
      </div>

      {/* Скидки */}
      {discountItems.length > 0 && (
        <div className="discount-slider-section">
          <div className="discount-slider-header">
            <h2>Chegirmali mahsulotlar</h2>
            <button
              className="show-all-discount-page-button"
              onClick={() => (window.location.href = `/discounts/${category}`)}
            >
              {"Hammasi"}
              <img src={small_row} alt="" />
            </button>
          </div>

          <div className="discount-slider">
            {discountItems.slice(0, 7).map((item, index) => (
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
                discount={item.discount_log[0] || null}
              />
            ))}
            <div className="show_all_div">
              <button
                className="show_all_c"
                onClick={() =>
                  (window.location.href = `/discounts/${category}`)
                }
              >
                <img src={row} alt="" />
              </button>
              <span className="show_all_sp">
                {language === "ru" ? "Смотреть все" : "Hammasi ko‘rish"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Продукты по подкатегориям */}
      {Object.entries(subcategories).map(([subcat, items]) => (
        <div className="carts_categ" key={subcat} id={subcat}>
          <h2>{subcat}</h2>
          {items.length === 0 ? (
            <p>"Mahsulotlar yo‘q"</p>
          ) : (
            <div className="categ_box">
              {items.map((item, index) => {
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
                    unit_description={item.unit_description}
                    expiration={item.expiration}
                    discount={activeDiscount || null}
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CategoryPage;
