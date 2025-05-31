import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/style.css";
import "./styles/favorites.css";
import Header from './Header';
import axios from "axios";
import { useAuth } from "../context/authContext";

const Favorites = ({ products: initialProducts }) => {
    const [products, setProducts] = useState([]);
    const [favouriteProducts, setFavouriteProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const auth = useAuth();
    const navigate = useNavigate();

    // Отримання userId з БД за uid авторизованого користувача
    const fetchUserById = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Person.json`);
            const data = res.data;
            if (!data) return null;

            for (let key in data) {
                if (key === auth.currentUser.uid) {
                    return data[key].id;
                }
            }
            return null;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            return null;
        }
    };

    // Отримання улюблених товарів користувача з БД
    const fetchUserFavoriteItems = async () => {
        setLoading(true);
        setError(null);
        const userId = await fetchUserById();
        if (!userId) {
            setError("User not found");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get(
                `${process.env.REACT_APP_DB_LINK}Favourite.json?orderBy="person_id"&equalTo=${userId}`
            );
            const favouriteData = res.data || {};
            const favouriteItemIds = Object.values(favouriteData).map(fav => fav.item_id);

            const filteredProducts = initialProducts.filter(item =>
                favouriteItemIds.includes(item.id)
            );

            setFavouriteProducts(filteredProducts);
        } catch (err) {
            console.error("Error fetching favourite products:", err);
            setError("Failed to fetch favourite products.");
        } finally {
            setLoading(false);
        }
    };

    // Підготовка масиву products з quantity (за замовчуванням 1)
    useEffect(() => {
        fetchUserFavoriteItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialProducts]);

    useEffect(() => {
        const updated = favouriteProducts.map(p => ({
            ...p,
            quantity: p.quantity ?? 1,
        }));
        setProducts(updated);
    }, [favouriteProducts]);

    // Змінити кількість товару за індексом
    const updateQuantityByIndex = (index, delta) => {
        setProducts(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    // Групування товарів за категоріями
    const getCategoryMap = () => {
        const map = {};
        products.forEach(item => {
            if (!map[item.category]) map[item.category] = [];
            map[item.category].push(item);
        });
        return map;
    };

    // Підрахунок підсумку
    const updateSummary = () => {
        const count = products.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = products.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const discount = products.reduce((sum, item) => {
            if (item.discount > 0) {
                return sum + item.quantity * item.price * (item.discount / 100);
            }
            return sum;
        }, 0);
        return { count, subtotal, discount, total: subtotal - discount };
    };

    // Видалення товару з улюблених в БД
    const deleteFromFavourite = async (item_id) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Favourite.json`);
            if (res.data) {
                for (const key in res.data) {
                    const fav = res.data[key];
                    if (
                        fav.item_id === item_id &&
                        fav.person_id === await fetchUserById()
                    ) {
                        await axios.delete(`${process.env.REACT_APP_DB_LINK}Favourite/${key}.json`);
                        break;
                    }
                }
                // Оновлюємо список улюблених після видалення
                fetchUserFavoriteItems();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const moveFavoritesToCart = async () => {
        try {
            // 1. Отримуємо userId
            const userId = await fetchUserById();
            if (!userId) {
                console.error("User not found");
                return;
            }

            // 2. Отримуємо favorites з Firebase
            const resFav = await axios.get(`${process.env.REACT_APP_DB_LINK}Favourite.json?orderBy="person_id"&equalTo=${userId}`);
            const favData = resFav.data || {};

            // 3. Формуємо масив товарів у favorites з даних з БД
            const favoriteItemsInDB = Object.entries(favData).map(([key, val]) => ({ key, ...val }));

            // 4. Переносимо товари у localStorage Cart (як ти робив)
            const currentCartString = localStorage.getItem("cart");
            let cart = currentCartString ? JSON.parse(currentCartString) : [];

            favoriteItemsInDB.forEach(favItem => {
                // Знаходимо повний об'єкт товару у products по item_id
                const product = products.find(p => p.id === favItem.item_id);
                if (!product) return;

                // Кількість беремо з стану products
                const quantity = product.quantity || 1;

                const existingIndex = cart.findIndex(c => c.item.id === favItem.item_id);
                if (existingIndex >= 0) {
                    cart[existingIndex].amount += quantity;
                    cart[existingIndex].total_price = cart[existingIndex].amount * cart[existingIndex].item.price;
                } else {
                    cart.push({
                        item: product,
                        amount: quantity,
                        total_price: quantity * product.price,
                    });
                }
            });

            localStorage.setItem("cart", JSON.stringify(cart));

            // 5. Видаляємо всі favorite записи користувача у Firebase
            for (const fav of favoriteItemsInDB) {
                await axios.delete(`${process.env.REACT_APP_DB_LINK}Favourite/${fav.key}.json`);
            }

            // 6. Оновлюємо локальні стани — прибираємо всі товари з favorites
            setProducts([]);
            setFavouriteProducts([]);

            // 7. Навігація до кошика
            navigate("/cart");
        } catch (error) {
            console.error("Error moving favorites to cart:", error);
        }
    };
    const categoryMap = getCategoryMap();
    const summary = updateSummary();

    return (
        <>
            <Header />
            <div className="main">
                <div className="cart-header">
                    <h2>Favorites</h2>
                </div>
                <div className="container">
                    <div className="left-side">
                        <div id="cart-items">
                            {Object.entries(categoryMap).map(([category, items]) => {
                                const count = items.reduce((sum, i) => sum + i.quantity, 0);
                                const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);
                                return (
                                    <div key={category}>
                                        <div className="category-header">
                                            <h3>{category}</h3>
                                            <p>({count}) {total}₴</p>
                                        </div>
                                        {items.map((item) => (
                                            <div key={item.id} className="cart-item">
                                                <img src={item.image} alt={item.title}/>
                                                <div className="cart-item-details">
                                                    <div className="cart-item-title">{item.title}</div>
                                                    <div className="cart-item-desc">{item.desc}</div>
                                                </div>
                                                <div className="cart-item-actions">
                                                    <div className="quantity-control">
                                                        <button onClick={() => updateQuantityByIndex(products.indexOf(item), -1)}>-</button>
                                                        <span>{item.quantity}</span>
                                                        <button onClick={() => updateQuantityByIndex(products.indexOf(item), 1)}>+</button>
                                                    </div>
                                                    <div className="cart-item-price">
                                                        <span className="current-price">
                                                            {(item.price * (1 - (item.discount || 0) / 100) * item.quantity).toFixed(0)}₴
                                                        </span>
                                                        {item.discount > 0 && (
                                                            <span className="old-price">{Math.round(item.price * item.quantity)}₴</span>
                                                        )}
                                                    </div>
                                                    <button className="delete-btn" onClick={() => deleteFromFavourite(item.id)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="right-side">
                        <div className="summary-title">
                            Your cart <span>{summary.count}</span><span>Products</span>
                        </div>
                        <div className="summary-item">Products <span>{summary.subtotal}₴</span></div>
                        <div className="summary-item">Discount <span>{summary.discount}₴</span></div>
                        <div className="line"></div>
                        <div className="summary-item">Delivery <span>Free</span></div>
                        <div className="line"></div>
                        <div className="summary-total">Total cost <span>{summary.total}₴</span></div>

                        <button className="btn-payment" onClick={moveFavoritesToCart}>
                            Proceed to payment
                        </button>

                        <div className="line"></div>
                        <div className="promo-section">
                            <input type="text" className="promo-input" placeholder="Promocode"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Favorites;
