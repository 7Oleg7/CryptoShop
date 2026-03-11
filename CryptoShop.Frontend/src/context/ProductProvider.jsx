import React, { useState } from 'react';
import { ProductContext } from './ProductContext';


const MOCK_PRODUCTS = [
  // Electronics (8 товаров)
  {
    id: "1",
    name: "Смартфон X10 Pro",
    description: "6.7-дюймовый AMOLED дисплей, 108MP камера, 256GB памяти",
    price: 24999,
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
    stockQuantity: 15,
    category: "Electronics",
    categoryName: "Электроника",
    averageRating: 4.5,
    reviewsCount: 12
  },
  {
    id: "2",
    name: "Ноутбук UltraBook Air",
    description: "Intel Core i7, 16GB RAM, 512GB SSD, вес 1.2кг",
    price: 45999,
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=480",
    stockQuantity: 8,
    category: "Electronics",
    categoryName: "Электроника",
    averageRating: 4.8,
    reviewsCount: 8
  },
  {
    id: "4",
    name: "Планшет Tab S9",
    description: "11-дюймовый экран, 128GB, стилус в комплекте",
    price: 18999,
    imageUrl: "https://images.unsplash.com/photo-1544244011-0c3f8aae28d2?w=400",
    stockQuantity: 12,
    category: "Electronics",
    categoryName: "Электроника",
    averageRating: 4.6,
    reviewsCount: 7
  },
  {
    id: "5",
    name: "Наушники AirPods Pro",
    description: "Беспроводные наушники с шумоподавлением",
    price: 4999,
    imageUrl: "https://images.unsplash.com/photo-1588156979435-379b9d8021c5?w=400",
    stockQuantity: 25,
    category: "Electronics",
    categoryName: "Электроника",
    averageRating: 4.7,
    reviewsCount: 15
  },
  {
    id: "6",
    name: "Умные часы Watch 6",
    description: "GPS, пульсометр, сон, 7 дней работы",
    price: 6999,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    stockQuantity: 18,
    category: "Electronics",
    categoryName: "Электроника",
    averageRating: 4.4,
    reviewsCount: 9
  },
  {
    id: "7",
    name: "Игровая консоль PlayBox",
    description: "1TB SSD, 2 геймпада в комплекте",
    price: 32999,
    imageUrl: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400",
    stockQuantity: 5,
    category: "Electronics",
    categoryName: "Электроника",
    averageRating: 4.9,
    reviewsCount: 6
  },
  {
    id: "8",
    name: "Монитор 27 4K",
    description: "IPS панель, HDR, 144Hz",
    price: 15999,
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    stockQuantity: 10,
    category: "Electronics",
    categoryName: "Электроника",
    averageRating: 4.5,
    reviewsCount: 4
  },
  {
    id: "9",
    name: "Внешний SSD 1TB",
    description: "USB 3.2, скорость чтения 1000MB/s",
    price: 3999,
    imageUrl: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400",
    stockQuantity: 30,
    category: "Electronics",
    categoryName: "Электроника",
    averageRating: 4.3,
    reviewsCount: 11
  },

  // Clothing (6 товаров)
  {
    id: "10",
    name: "Футболка хлопковая",
    description: "100% хлопок, классический крой, размеры S-XXL",
    price: 899,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    stockQuantity: 120,
    category: "Clothing",
    categoryName: "Одежда",
    averageRating: 4.3,
    reviewsCount: 23
  },
  {
    id: "11",
    name: "Джинсы классические",
    description: "Удобные джинсы из качественного денима",
    price: 1899,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
    stockQuantity: 65,
    category: "Clothing",
    categoryName: "Одежда",
    averageRating: 4.4,
    reviewsCount: 17
  },
  {
    id: "12",
    name: "Куртка демисезонная",
    description: "Водоотталкивающая, с утеплителем",
    price: 3999,
    imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400",
    stockQuantity: 25,
    category: "Clothing",
    categoryName: "Одежда",
    averageRating: 4.6,
    reviewsCount: 8
  },
  {
    id: "13",
    name: "Худи оверсайз",
    description: "Мягкий футер, капюшон, карман кенгуру",
    price: 1499,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    stockQuantity: 45,
    category: "Clothing",
    categoryName: "Одежда",
    averageRating: 4.5,
    reviewsCount: 14
  },
  {
    id: "14",
    name: "Спортивный костюм",
    description: "Трикотаж, куртка+штаны",
    price: 2799,
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
    stockQuantity: 30,
    category: "Clothing",
    categoryName: "Одежда",
    averageRating: 4.4,
    reviewsCount: 9
  },

  // Footwear (5 товаров)
  {
    id: "3",
    name: "Кроссовки спортивные",
    description: "Удобные кроссовки для бега, амортизация",
    price: 2499,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    stockQuantity: 42,
    category: "Footwear",
    categoryName: "Обувь",
    averageRating: 4.5,
    reviewsCount: 19
  },
  {
    id: "16",
    name: "Кеды классические",
    description: "Парусина, резиновая подошва",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400",
    stockQuantity: 55,
    category: "Footwear",
    categoryName: "Обувь",
    averageRating: 4.2,
    reviewsCount: 21
  },
  {
    id: "17",
    name: "Туфли женские",
    description: "Лодочки, каблук 7см, кожа",
    price: 3199,
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
    stockQuantity: 12,
    category: "Footwear",
    categoryName: "Обувь",
    averageRating: 4.3,
    reviewsCount: 5
  },
  {
    id: "18",
    name: "Сандалии летние",
    description: "Кожаные, регулируемые ремешки",
    price: 999,
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    stockQuantity: 38,
    category: "Footwear",
    categoryName: "Обувь",
    averageRating: 4.1,
    reviewsCount: 13
  },

  // Accessories (4 товара)
  {
    id: "19",
    name: "Рюкзак городской",
    description: "15 литров, отделение для ноутбука",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    stockQuantity: 37,
    category: "Accessories",
    categoryName: "Аксессуары",
    averageRating: 4.2,
    reviewsCount: 10
  },
  {
    id: "20",
    name: "Солнцезащитные очки",
    description: "Поляризационные, UV защита",
    price: 899,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
    stockQuantity: 28,
    category: "Accessories",
    categoryName: "Аксессуары",
    averageRating: 4.3,
    reviewsCount: 7
  },
  {
    id: "21",
    name: "Кошелек кожаный",
    description: "Натуральная кожа, 6 отделений",
    price: 699,
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
    stockQuantity: 22,
    category: "Accessories",
    categoryName: "Аксессуары",
    averageRating: 4.4,
    reviewsCount: 8
  },
  {
    id: "22",
    name: "Часы наручные",
    description: "Кварцевые, хронограф, водозащита",
    price: 2199,
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
    stockQuantity: 14,
    category: "Accessories",
    categoryName: "Аксессуары",
    averageRating: 4.5,
    reviewsCount: 6
  }
];

const MOCK_CATEGORIES = [
  { id: "1", name: "Electronics", description: "Электроника и гаджеты", productCount: 8 },
  { id: "2", name: "Clothing", description: "Одежда", productCount: 5 },
  { id: "3", name: "Footwear", description: "Обувь", productCount: 5 },
  { id: "4", name: "Accessories", description: "Аксессуары", productCount: 4 }
];

export const ProductProvider = ({ children }) => {
  const [products] = useState(MOCK_PRODUCTS);
  const [categories] = useState(MOCK_CATEGORIES);
  const [loading] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: null,
    search: '',
    minPrice: null,
    maxPrice: null,
    sortBy: 'name'
  });

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      categoryId: null,
      search: '',
      minPrice: null,
      maxPrice: null,
      sortBy: 'name'
    });
  };

  const getProduct = (id) => {
    return new Promise((resolve) => {
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      resolve(product);
    });
  };

  const filteredProducts = products.filter(product => {
    if (filters.categoryId) {
      const category = categories.find(c => c.id === filters.categoryId);
      if (category && product.category !== category.name) {
        return false;
      }
    }
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <ProductContext.Provider value={{
      products: sortedProducts,
      categories,
      loading,
      filters,
      updateFilters,
      resetFilters,
      getProduct,
      fetchProducts: () => {}
    }}>
      {children}
    </ProductContext.Provider>
  );
};