import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navba.css";
import translations from "../../translate/translate";
import { useLanguage } from "../../context/Lancontext";
import { useProductClasses } from "../../context/ProductClassesContext";
import axios from "axios";

import SaleCart from "../../Models/SaleCart";
import left_row from "../../assets/free-icon-left-arrow-109618.png";
import lupa from "../../assets/free-icon-loupe-251022.png";

function Navbar({ subcategories = {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSubcat, setActiveSubcat] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchOpen1, setSearchOpen1] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const [categoryTitle, setCategoryTitle] = useState("");
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const productGroups = useProductClasses();

  const [isHomePage, setIsHomePage] = useState(location.pathname === "/");
  const [isHomePage1, setIsHomePage1] = useState(location.pathname === "/");
  const isDiscountPage = location.pathname.startsWith("/discounts");

  // 🔹 Формируем группы из контекста
  const groups = Object.entries(productGroups).map(([key, categories]) => {
    const titlesMap = {
      liquids: "Ichimliklar",
      meats: "Gosht",
      vegetables_fruits: "Sabzavotlar va mevalar",
      milky: "Sutli mahsulotlar",
      candy: "Shirinliklar",
      hamir: "Hamir mahsulotlar",
      others: "Boashqalar",
    };
    return {
      title: titlesMap[key] || key,
      categories,
    };
  });

  useEffect(() => {
    const saved = localStorage.getItem("selectedCategory");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const title = parsed[language] || parsed;
        setCategoryTitle(title);
      } catch (e) {
        console.error("Ошибка при чтении selectedCategory:", e);
      }
    }
  }, [language]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      const offsets = Object.keys(subcategories).map((key) => {
        const el = document.getElementById(key);
        return el ? { key, offset: el.getBoundingClientRect().top } : null;
      });
      const visible = offsets.find(
        (entry) =>
          entry && entry.offset >= 0 && entry.offset < window.innerHeight / 2
      );
      if (visible) setActiveSubcat(visible.key);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [subcategories]);

  useEffect(() => {
    const fromMain = localStorage.getItem("openNavbarSearch");
    if (fromMain === "true") {
      setSearchOpen(true);
      setSearchOpen1(true);
      setIsHomePage(false);
      setTimeout(() => inputRef.current?.focus(), 100);
      localStorage.removeItem("openNavbarSearch");
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        setNoResults(false);
        return;
      }

      setIsLoading(true);

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGM5YTI3NjZhYzRiYjVhNDhlNzY0YiIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc1NDA0NDk4MH0.qf3j2DKdniHYeDMoJuTt7dU7p_MgI7tcyGRpqrhXIdI";
      axios
        .get("https://server-gamma-tawny.vercel.app/api/v1/token/product/get", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const products = Array.isArray(res.data) ? res.data : [];
          const filtered = products.filter((p) =>
            p?.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
          );

          setSearchResults(filtered);
          setNoResults(filtered.length === 0);
        })
        .catch((err) => {
          console.error("Ошибка при поиске:", err);
          setSearchResults([]);
          setNoResults(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleCategoryClick = (key, nameObj) => {
    setSearchOpen(false);
    setSearchTerm("");
    localStorage.setItem("selectedCategory", JSON.stringify(nameObj));
    navigate(`/category/${key}`);
  };

  const toggleGroup = (title) => {
    setExpandedGroup((prev) => (prev === title ? null : title));
  };

  const navbarStyle = {
    position: "fixed",
    top: scrolled ? "20px" : "-120px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "100vw",
    height: isHomePage || searchOpen ? "70px" : "110px",
    backgroundColor: "white",
    zIndex: 999,
    transition: "top 0.4s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 10px 0 10px",
    borderRadius: "25px",
    boxShadow: "0 6px 6px -4px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  };

  const navbarsub = {
    position: "fixed",
    top: scrolled ? "40px" : "-40px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "100vw",
    height: !searchOpen ? "50px" : "0px",
    backgroundColor: "white",
    zIndex: 999,
    transition: "top 0.4s ease",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    overflowX: "auto",
    padding: "0px",
    boxShadow: "0 6px 6px -4px rgba(0, 0, 0, 0.2)",
  };

  useEffect(() => {
    document.body.style.overflow = searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  function open() {
    setSearchOpen(true);
    setSearchOpen1(true);
  }

  function close1() {
    setSearchOpen(false);
    setSearchOpen1(false);
    if (isHomePage1) {
      setIsHomePage(true);
    }
  }

  useEffect(() => {
    if (searchOpen1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen1]);

  function comeback() {
    setIsHomePage(true);
    navigate("/");
  }

  return (
    <>
      <nav>
        {!isHomePage && !searchOpen && (
          <div className="subcat_nav_scroll" style={navbarsub}>
            {Object.keys(subcategories).map((subcat) => (
              <a
                key={subcat}
                href={`#${subcat}`}
                className={activeSubcat === subcat ? "active-subcat" : ""}
              >
                <button>{translations[language]?.[subcat] || subcat}</button>
              </a>
            ))}
          </div>
        )}

        <div className="nav_nav">
          {!isHomePage && (
            <div className="nav_categ_ad">
              <div className="nav_asest">
                <button
                  className="go_to_home"
                  onClick={() => (searchOpen1 ? close1() : comeback())}
                >
                  <img src={left_row} alt="" />
                </button>

                {searchOpen1 ? (
                  <div className="ssas">
                    <input
                      type="text"
                      ref={inputRef}
                      className="nav_inp_btn"
                      placeholder="Найти в магазине"
                      onFocus={() => setSearchOpen(true)}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                    />
                  </div>
                ) : (
                  <>
                    <span className="poplo">
                      {isDiscountPage ? "Скидки" : categoryTitle}
                    </span>
                    <button className="lupa_nav" onClick={open}>
                      <img src={lupa} alt="" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {isHomePage && (
            <div className="spusk" style={navbarStyle}>
              <div className="search_sec_nav">
                <input
                  type="text"
                  placeholder="Найти в магазине"
                  onFocus={() => setSearchOpen(true)}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
                {searchOpen && (
                  <button
                    className="search-close-arrow"
                    onClick={() => setSearchOpen(false)}
                  >
                    ⬆
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {searchOpen && (
        <div
          className="search-modal"
          style={searchOpen1 ? { top: "40px" } : {}}
        >
          {searchTerm.trim() === "" ? (
            groups.map((group) => (
              <div key={group.title} className="search-group">
                <button
                  className="group-title-button"
                  onClick={() => toggleGroup(group.title)}
                >
                  {group.title} {expandedGroup === group.title ? "▲" : "▼"}
                </button>
                <div
                  className={`group-content ${
                    expandedGroup === group.title ? "" : "collapsed"
                  }`}
                  style={{
                    maxHeight: expandedGroup === group.title ? "500px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                  }}
                >
                  <div className="search-categories">
                    {group.categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() =>
                          handleCategoryClick(cat._id, cat.category)
                        }
                        className="search-cat-btn"
                      >
                        {cat.category?.ru || cat.category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : isLoading ? (
            <p style={{ padding: "20px", textAlign: "center" }}>
              🔄 Идёт поиск...
            </p>
          ) : noResults ? (
            <p style={{ padding: "20px", textAlign: "center" }}>
              ❌ Продукт не найден
            </p>
          ) : (
            <div className="search_res" style={{ padding: "10px" }}>
              {searchResults.map((item, index) => (
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
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
