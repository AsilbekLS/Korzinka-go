import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import { useLanguage } from "../context/Lancontext";
import { useProductClasses } from "../context/ProductClassesContext";
import SaleCart from "../Models/SaleCart";
import row from "../assets/free-icon-thin-arrow-12857769.png";
import small_row from "../assets/free-icon-right-arrow-angle-54833.png";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const groups = useProductClasses();
  const [discountProducts, setDiscountProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGM5YTI3NjZhYzRiYjVhNDhlNzY0YiIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc1NDA0NDk4MH0.qf3j2DKdniHYeDMoJuTt7dU7p_MgI7tcyGRpqrhXIdI";

  useEffect(() => {
    const fetchDiscountProducts = async () => {
      try {
        const productRes = await axios.get(
          "https://server-gamma-tawny.vercel.app/api/v1/token/product/get",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const products = productRes.data || [];
        const now = new Date();

        // Фильтруем только товары с активной скидкой
        const discounted = products.filter((prod) =>
          (prod.discount_log || []).some((discount) => {
            if (discount.status !== "active") return false;
            const start = new Date(discount.start_date);
            const end = discount.end_date ? new Date(discount.end_date) : null;
            return start <= now && (!end || now <= end);
          })
        );

        // Сортировка по времени создания — новые первыми
        const sortedByDate = discounted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Берём максимум 7
        setDiscountProducts(sortedByDate.slice(0, 7));
      } catch (error) {
        console.error("Ошибка при получении продуктов со скидкой:", error);
      }
    };

    fetchDiscountProducts();
  }, []);

  if (!groups) return <div>Загрузка категорий...</div>;

  const handleSubcategoryClick = (categoryId, category) => {
    navigate(`/category/${categoryId}`);
    localStorage.setItem("selectedCategory", JSON.stringify(category));
  };

  const handleProductClick = (product) => {
    setModalProduct(product);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setModalProduct(null);
  };

  const getButtonClass = (count) => {
    if (count >= 2 && count <= 7)
      return `category-buttons ${
        ["zero", "one", "two", "three", "four", "five", "six", "seven"][count]
      }`;
    if (count > 7) return "category-buttons many";
    return "category-buttons";
  };

  const getCategoryStyleByName = (categoryName) => {
    const name = categoryName.toLowerCase();

    if (
      name.includes("вода") ||
      name.includes("cola") ||
      name.includes("чай") ||
      name.includes("сок")
    ) {
      return { backgroundColor: "#4da7db", color: "#fff" };
    } else if (name.includes("говядина")) {
      return { backgroundColor: "#c0392b", color: "#fff" };
    } else if (name.includes("курица")) {
      return { backgroundColor: "#e67e22", color: "#fff" };
    } else if (name.includes("баранина")) {
      return { backgroundColor: "#9b59b6", color: "#fff" };
    } else if (name.includes("мясо")) {
      return { backgroundColor: "#d9534f", color: "#fff" };
    } else {
      return { backgroundColor: "#6c757d", color: "#fff" };
    }
  };

  const renderCategoryGroup = (title, items = []) => {
    const className = getButtonClass(items.length);

    return (
      <div className="category-group">
        <h2>{title}</h2>
        <div className={className}>
          {items.map((cat) => {
            const style = getCategoryStyleByName(cat.category);
            return (
              <button
                key={cat._id}
                onClick={() => handleSubcategoryClick(cat._id, cat.category)}
                className="category-button"
                style={style}
              >
                {cat.category}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="home">
      <Navbar />

      {/* 🎯 Слайдер со скидками */}
      {discountProducts.length > 0 && (
        <div className="discount-slider-section1">
          <div className="discount-slider-header">
            <h2>{"Chegirmali mahsulotlar"}</h2>
            <button
              className="show-all-discount-page-button"
              onClick={() => navigate("/discounts")}
            >
              {"Hammasi"}
              <img src={small_row} alt="" />
            </button>
          </div>

          <div className="discount-slider">
            {discountProducts.map((item, index) => (
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
                discount={item.discount_log?.find((d) => d.status === "active")}
                onProductClick={() => handleProductClick(item)}
              />
            ))}
            <div className="show_all_div">
              <button
                className="show_all_c"
                onClick={() => navigate("/discounts")}
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

      {/* Категории */}
      {renderCategoryGroup("Suv va ichimliklar", groups.liquids)}
      {renderCategoryGroup("Gosht", groups.meats)}
      {renderCategoryGroup("Sabzavot va mevalar", groups.vegetables_fruits)}
      {renderCategoryGroup("Sut mahsulotlari", groups.milky)}
      {renderCategoryGroup("Shirinliklar", groups.candy)}
      {renderCategoryGroup("Hamir", groups.hamir)}
      {renderCategoryGroup("Boshqalar", groups.others)}
    </div>
  );
};

export default Home;
