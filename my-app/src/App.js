import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/Main";
import Catalog from "./pages/Catalog";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Account_manager from "./pages/Account_manager";
import Header from "./pages/Header"; // Correctly imported Header
import axios from "axios";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { AuthProvider, useAuth } from "./context/authContext";

const ProtectedRoute = ({ children }) => {
    const { userLoggedIn } = useAuth();

    if (!userLoggedIn) {
        return <Navigate to="/auth/login" replace={true} />;
    }

    return children;
};

function App() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_DB_LINK}Item.json`)
            .then((res) => {
                const data = res.data;

                if (!data) {
                    console.warn("No data received from Firebase.");
                    setItems([]);
                    return;
                }

                const loadedItems = Object.entries(data)
                    .filter(([key, item]) => item !== null)
                    .map(([key, item]) => {
                        // image може бути об’єктом або рядком
                        const imagesRaw = item.image;

                        // Преобразуємо у масив рядків або пустий масив
                        const images = Array.isArray(imagesRaw)
                            ? imagesRaw
                            : (typeof imagesRaw === "object" && imagesRaw !== null)
                                ? Object.values(imagesRaw)
                                : (typeof imagesRaw === "string")
                                    ? [imagesRaw]
                                    : [];

                        // title беремо або з item.title, або з specs.title
                        const title = item.title || (item.specs && item.specs.title) || "";

                        return {
                            id: item.id || key,
                            brand: item.brand || "",
                            title: title,
                            price: item.price || 0,
                            image: images,
                            banner: item.banner || "",
                            amount_on_stock: item.amount_on_stock || 0,
                            category: item.category || "",
                            available: (item.amount_on_stock || 0) > 0,
                            discount: item.discount || 0,
                            specs: item.specs || {},
                        };
                    });

                setItems(loadedItems);
            })
            .catch((err) => {
                console.error("Error fetching data from Firebase:", err);
                // Optionally set items to empty array on error to prevent undefined issues
                setItems([]);
            });
    }, []); // Empty dependency array means this runs once on component mount

    return (
        <AuthProvider>
            <Router>
                {/* Header is now correctly imported and passed products */}
                <Header products={items} />
                <Routes>
                    <Route path="/" element={<Main products={items} />} />
                    <Route path="/catalog" element={<Catalog products={items} />} />
                    {/* Protected routes */}
                    <Route path="/favorites" element={<ProtectedRoute><Favorites products={items} /></ProtectedRoute>} />
                    <Route path="/account" element={<ProtectedRoute><Account products={items} /></ProtectedRoute>} />
                    <Route path="/account-manager" element={<ProtectedRoute><Account_manager products={items} /></ProtectedRoute>} />

                    <Route path="/product/:id" element={<Product />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/registration" element={<Registration />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;