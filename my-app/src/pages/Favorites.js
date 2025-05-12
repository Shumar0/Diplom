import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/style.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/slider.css";
import "./styles/favorites.css";
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

    useEffect(() => {
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

    const deleteFromFavourite = async (key) => {
        // try {
        //     const res = axios.delete(`${process.env.REACT_APP_DB_LINK}Favourite/${key}.json`);
        // } catch (e) {
        //     console.error(e);
        // }
    }

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <div className="delivery">
                        <svg className="icon-small" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                             viewBox="0 0 256 256">
                            <g transform="translate(1.41 1.41) scale(2.81)">
                                <path d="M 45 0 C 27.677 0 13.584 14.093 13.584 31.416
                    c 0 4.818 1.063 9.442 3.175 13.773
                    c 2.905 5.831 11.409 20.208 20.412 35.428
                    l 4.385 7.417 C 42.275 89.252 43.585 90 45 90
                    s 2.725 -0.748 3.444 -1.966 l 4.382 -7.413
                    c 8.942 -15.116 17.392 -29.4 20.353 -35.309
                    c 0.027 -0.051 0.055 -0.103 0.08 -0.155
                    c 2.095 -4.303 3.157 -8.926 3.157 -13.741
                    C 76.416 14.093 62.323 0 45 0 z
                    M 45 42.81 c -6.892 0 -12.5 -5.607 -12.5 -12.5
                    c 0 -6.893 5.608 -12.5 12.5 -12.5
                    c 6.892 0 12.5 5.608 12.5 12.5
                    C 57.5 37.202 51.892 42.81 45 42.81 z"
                                      fill="#007AFF"/>
                            </g>
                        </svg>
                        <span>Delivery to</span>
                        <select>
                            <option value="ukraine">Ukraine</option>
                            <option value="germany">Germany</option>
                            <option value="poland">Poland</option>
                        </select>
                    </div>
                    <Link to="/catalog">
                        <button className="catalog-button">Catalog</button>
                    </Link>
                </div>

                <div className="header-center">
                    <Link to="/">
                        <img src="images/logo.png" alt="NextTech Logo" className="logo"/>
                    </Link>
                </div>

                <div className="header-right">
                    <div className="search-bar">
                        <input type="text" id="search-input" placeholder="Site search..."/>
                        <button className="search-button" id="search-button">
                            <img src="images/search.svg" alt="Search" className="icon-small"/>
                        </button>

                    </div>

                    <div className="header-icons">
                        <Link to="/cart">
                            <button className="icon-button">
                                <img src="images/cart.svg" alt="Cart" className="icon icon-cart"/>
                            </button>
                        </Link>
                        <Link to="/favorites">
                            <button className="icon-button">
                                <img src="images/heart.svg" alt="Favorites" className="icon icon-heart"/>
                            </button>
                        </Link>
                        <Link to="/account">
                            <button className="icon-button">
                                <img src="images/user.svg" alt="Profile" className="icon icon-user"/>
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

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