import React, { useEffect, useState } from "react";
import {data, Link} from "react-router-dom";
import "./styles/style.css";
import "./styles/favorites.css";
import Header from './Header';
import axios from "axios";
import {useAuth} from "../context/authContext";

const Favorites = ({ products: initialProducts }) => {
    const [products, setProducts] = useState([]);
    const [favouriteProducts, setFavouriteProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const auth = useAuth();

    const fetchUserById = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Person.json`);
            const data = res.data;

            if (!data) {
                return
            }

            for (let key in data) {
                if (data[key]) {
                    if (key === auth.currentUser.uid) {
                        return data[key].id;
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            return null;
        }
    };

    const fetchUserFavoriteItems = async () => {
        setLoading(true);
        setError(null);

        const userId = await fetchUserById()

        try {
            const res = await axios.get(
                `${process.env.REACT_APP_DB_LINK}Favourite.json?orderBy="person_id"&equalTo=${userId}`
            );
            console.log(res);
            const favouriteData = res.data;

            const favouriteItemIds = [];

            if (favouriteData) {
                for (const key in favouriteData) {
                    if (favouriteData.hasOwnProperty(key)) {
                        favouriteItemIds.push(favouriteData[key].item_id);
                    }
                }
            }
            console.log(`User ${userId}'s Favourite Item IDs:`, favouriteItemIds);

            setFavouriteProducts(initialProducts.filter(item => favouriteItemIds.includes(item.id)));

        } catch (err) {
            console.error("Error fetching user's favourite products:", err);
            setError("Failed to fetch favourite products.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserFavoriteItems();
    }, [initialProducts]);

    useEffect(() => {
        const updated = favouriteProducts.map(p => ({
            ...p,
            quantity: p.quantity === undefined ? 1 : p.quantity,
        }));
        setProducts(updated);
    }, [favouriteProducts]);

    const updateQuantityByIndex = (index, delta) => {
        const updated = [...products];
        updated[index].quantity = Math.max(1, updated[index].quantity + delta);
        setProducts(updated);
    };

    const getCategoryMap = () => {
        const map = {};
        products.forEach(item => {
            if (!map[item.category]) map[item.category] = [];
            map[item.category].push(item);
        });
        return map;
    };

    const updateSummary = () => {
        const count = products.reduce((sum, item) => sum + item.quantity, 0);
        const subtotalWithoutDiscount = products.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const discountAmount = products.reduce((sum, item) => {
            if (item.discount > 0) {
                return sum + item.quantity * item.price * (item.discount / 100);
            }
            return sum;
        }, 0);
        const total = subtotalWithoutDiscount - discountAmount;
        return { count, subtotal: subtotalWithoutDiscount, discount: discountAmount, total };
    };

    const categoryMap = getCategoryMap();
    const summary = updateSummary();

    const deleteFromFavourite = async (item_id) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Favourite.json`)
            if (res.data) {
                let objectToDeleteKey = null
                for (const key in res.data) {
                    if (res.data[key] && res.data[key].item_id === item_id &&
                        res.data[key].person_id === await fetchUserById()) {
                        objectToDeleteKey = key;
                        break
                    }
                }

                const deleteObj = await
                    axios.delete(`${process.env.REACT_APP_DB_LINK}Favourite/${objectToDeleteKey}.json`)
                console.log(deleteObj);
                fetchUserFavoriteItems()
            }
        } catch (error) {
            console.error(error);
        }
    }

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
                                        {items.map((item,) => {
                                            const oldPrice = Math.round(item.price * 1.1 / 100) * 100;
                                            return (
                                                <div key={item.id} className="cart-item">
                                                    <img src={item.image} alt={item.title}/>
                                                    <div className="cart-item-details">
                                                        <div className="cart-item-title">{item.title}</div>
                                                        <div className="cart-item-desc">{item.desc}</div>
                                                        {/*<Link to="/" className="cart-item-fav">Add to Favorite</Link>*/}
                                                    </div>
                                                    <div className="cart-item-actions">
                                                        <div className="quantity-control">
                                                            <button
                                                                onClick={() => updateQuantityByIndex(products.indexOf(item), -1)}>-
                                                            </button>
                                                            <span>{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantityByIndex(products.indexOf(item), 1)}>+
                                                            </button>
                                                        </div>
                                                        <div className="cart-item-price">
    <span className="current-price">
        {(item.price * (item.discount > 0 ? (1 - item.discount / 100) : 1) * item.quantity).toFixed(0)}₴
    </span><br/>
                                                            {item.discount > 0 && (
                                                                <span className="old-price">
            {Math.round(item.price * item.quantity)}₴
        </span>
                                                            )}
                                                        </div>
                                                        <button className="delete-btn"
                                                                onClick={() => deleteFromFavourite(item.id)}>
                                                            {/* SVG і текст */}
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                        <div id="category-summary"></div>
                    </div>

                    <div className="right-side">
                        <div className="summary-title">
                            Your cart <span id="item-count">{summary.count}</span><span>Products</span>
                        </div>
                        <div className="summary-item">Products <span id="subtotal">{summary.subtotal}₴</span></div>
                        <div className="summary-item">Discount <span id="discount">{summary.discount}₴</span></div>
                        <div className="line"></div>
                        <div className="summary-item">Delivery <span>Free</span></div>
                        <div className="line"></div>
                        <div className="summary-total">Total cost <span id="total">{summary.total}₴</span></div>
                        <Link to="/cart">
                            <button className="btn-payment">Proceed to payment</button>
                        </Link>
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