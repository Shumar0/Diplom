import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Catalog from "./pages/Catalog";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
// import Product from "./pages/Product";
// import Cart from "./pages/Cart";


const products = [
    {
        id: 1,
        image: '/images/489285567-Photoroom.png',
        brand: 'Asus',
        category: 'Laptop',
        title: 'Asus ROG Strix',
        model: 'G834JY-N6087',
        processor: 'Intel Core i9-13980HX',
        screenSize: '18"',
        videoCard: ['NVIDIA GeForce RTX 4090', 'NVIDIA GeForce RTX 4080'],
        ram: '32GB',
        volume: ['2TB', '1TB', '3TB'],
        delivery: '29.12.2024',
        price: 45000,
        bonus: 450,
        desc: 'Mixed Black, 2.6kg',
        available: true
    },
    {
        id: 2,
        image: '/images/483979386-Photoroom.png',
        brand: 'Asus',
        category: 'Laptop',
        title: 'Asus TUF Gaming',
        model: 'FX506',
        processor: 'AMD Ryzen 7 4800H',
        screenSize: ['15.6"', '18"'],
        videoCard: 'NVIDIA GeForce GTX 1660 Ti',
        ram: '16GB',
        volume: ['512GB','1TB', '2TB', '3TB'],
        delivery: '01.01.2025',
        price: 27000,
        bonus: 270,
        available: false
    },
    {
        id: 3,
        image: '/images/22_f19k-js.png',
        imageBaner: '/images/Rectangle69.png',
        brand: 'Apple',
        category: 'Smartphone',
        title: 'iPhone 15 Pro Max',
        models: ["iPhone 15 Pro", "iPhone 15 Pro Max"],
        processor: 'Apple A17 Pro',
        screenSize: '6.7"',
        videoCard: 'Integrated',
        colors: ["#d8cfc4", "#f7e7ce", "#d0e3d3", "#dee3e7", "#2f2f2f"],
        ram: '8GB',
        volume: ["128GB", "256GB", "512GB", "1TB"],
        delivery: '02.05.2025',
        price: 58999,
        bonus: 589,
        available: true
    },
    {
        id: 4,
        image: '/images/airpods-max.webp',
        brand: 'Apple',
        category: 'Audio',
        title: 'AirPods Pro Max',
        processor: 'Apple H1',
        delivery: '03.05.2025',
        price: 12999,
        bonus: 130,
        desc: 'Color green, 300g',
        available: true,
        type: 'Over-ear',
        batteryLife: '20 hours',
        noiseCanceling: 'Active',
        bluetoothVersion: '5.0',
        weight: '384g'
    },
    {
        id: 5,
        image: '/images/469528067-Photoroom.png',
        imageBaner: '/images/ps5-buy-now-product-thumbnail-01-en-18mar22.webp',
        brand: 'Sony',
        category: 'Console',
        title: 'PlayStation 5',
        processor: 'AMD Zen 2 8-core',
        screenSize: 'N/A',
        videoCard: 'AMD RDNA 2',
        ram: '16GB',
        volume: '1TB',
        delivery: '05.05.2025',
        price: 19999,
        bonus: 200,
        available: true
    },
    {
        id: 6,
        image: '/images/398085826-Photoroom.png',
        brand: 'Samsung',
        category: 'Smartphone',
        title: 'Samsung Galaxy S21C',
        processor: 'Exynos 2100',
        screenSize: '6.2"',
        videoCard: 'Integrated',
        ram: '8GB',
        volume: '256GB',
        delivery: '04.05.2025',
        price: 28999,
        bonus: 290,
        desc: 'Color green, 300g',
        available: true
    },
    {
        id: 7,
        image: '/images/433662567-Photoroom.png',
        brand: 'Apple',
        category: 'Tablet',
        title: 'iPad 9',
        processor: 'A13 Bionic',
        screenSize: '10.2"',
        videoCard: 'Integrated',
        ram: '3GB',
        volume: '64GB',
        delivery: '06.05.2025',
        price: 13999,
        bonus: 140,
        available: true
    }
];

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Main products={products} />} />
          <Route path="/catalog" element={<Catalog products={products} />} />
          {/*<Route path="/favorites" element={<Favorites />} />*/}
          {/*<Route path="/account" element={<Account />} />*/}
          <Route path="/" element={<Main />} />
          {/*<Route path="/catalog" element={<Catalog />} />*/}
            <Route path="/favorites" element={<Favorites products={products} />} />
          <Route path="/account" element={<Account product={products} />} />
          {/*<Route path="/product" element={<Product />} />*/}
          {/*<Route path="/cart" element={<Cart />} />*/}
        </Routes>
      </Router>
  );
}

export default App;
