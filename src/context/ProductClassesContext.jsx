import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ProductClassesContext = createContext();

export const ProductClassesProvider = ({ children }) => {
  const [groups, setGroups] = useState({
    liquids: [],
    meats: [],
    vegetables_fruits: [],
    milky: [],
    candy: [],
    hamir: [],
    others: [],
  });

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGM5YTI3NjZhYzRiYjVhNDhlNzY0YiIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc1NDA0NDk4MH0.qf3j2DKdniHYeDMoJuTt7dU7p_MgI7tcyGRpqrhXIdI";

    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://server-gamma-tawny.vercel.app/api/v1/token/category/get",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data || [];

        const liquidKeywords = ["ichimliklar", "cola", "напиток"];
        const meatKeywords = [
          "go'sht va parranda",
          "dengiz mahsulotlari",
          "turli xil konservalar",
          "tayyor ovqat",
        ];
        const vegetablesFruitsKeywords = ["sabzavot va mevalar", "chilla"];
        const milkyKeywords = ["sut mahsulotlari"];
        const candyKeywords = ["shirinliklar", "bolalar uchun", "muzqaymoq"];
        const hamirKeywords = ["non mahsulotlari", "oziq ovqat mahsulotlari"];

        const liquids = [];
        const meats = [];
        const vegetables_fruits = [];
        const milky = [];
        const candy = [];
        const hamir = [];
        const others = [];

        data.forEach((category) => {
          const name = category.category.toLowerCase();

          if (liquidKeywords.some((word) => name.includes(word))) {
            liquids.push(category);
          } else if (meatKeywords.some((word) => name.includes(word))) {
            meats.push(category);
          } else if (
            vegetablesFruitsKeywords.some((word) => name.includes(word))
          ) {
            vegetables_fruits.push(category);
          } else if (milkyKeywords.some((word) => name.includes(word))) {
            milky.push(category);
          } else if (candyKeywords.some((word) => name.includes(word))) {
            candy.push(category);
          } else if (hamirKeywords.some((word) => name.includes(word))) {
            hamir.push(category);
          } else {
            others.push(category);
          }
        });

        setGroups({
          liquids,
          meats,
          vegetables_fruits,
          milky,
          candy,
          hamir,
          others,
        });
      } catch (err) {
        console.error("Ошибка при получении категорий:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <ProductClassesContext.Provider value={groups}>
      {children}
    </ProductClassesContext.Provider>
  );
};

export const useProductClasses = () => useContext(ProductClassesContext);
