import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { History, Truck, Package } from "lucide-react";
import "./styles/style.css";
import "./styles/breadcrumb.css";
import "./styles/product_page.css";
import { useAuth } from "../context/authContext";
import Header from "./Header";
import Footer from "./Footer";
import Bonus from "./Bonus";
import Save_for_later from "./Save_for_later";

export default function Product() {
    const param = useParams();
    const [item, setItem] = useState(null);
    const [groupedConfigs, setGroupedConfigs] = useState({});
    const [selectedSpecs, setSelectedSpecs] = useState({});
    const [toastMessage, setToastMessage] = useState("");
    const navigate = useNavigate();
    const auth = useAuth();

    // Toast компонент
    const Toast = ({ message, onClose, duration = 3000 }) => {
        useEffect(() => {
            const timer = setTimeout(() => onClose(), duration);
            return () => clearTimeout(timer);
        }, [duration, onClose]);

        return (
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    backgroundColor: "#333",
                    color: "#fff",
                    padding: "12px 20px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    zIndex: 9999,
                    fontSize: "14px",
                    userSelect: "none",
                }}
            >
                {message}
            </div>
        );
    };

    function getNextDay(date = new Date()) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 2);
        return nextDay.toISOString().split("T")[0];
    }

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_DB_LINK}Item.json`)
            .then((res) => {
                const data = res.data;
                if (!data) return;

                if (data[param.id]) {
                    const product = data[param.id];
                    setItem({
                        id: param.id,
                        brand: product.brand,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        amount_on_stock: product.amount_on_stock,
                        category: product.category,
                        available: product.amount_on_stock > 0,
                        discount: product.discount,
                        specs: product.specs || {},
                    });

                    // Групуємо specs у формат для рендерингу
                    const grouped = {};
                    if (product.specs) {
                        for (const [key, value] of Object.entries(product.specs)) {
                            grouped[key] = Array.isArray(value) ? value : [value];
                        }
                    }
                    setGroupedConfigs(grouped);
                }
            })
            .catch(console.error);
    }, [param.id]);

    const createConfigBlock = (title, id, values, isColor = false) => {
        if (!values || values.length <= 1) return null;

        return (
            <div key={id} className="config-section">
                <h3>{title}</h3>
                <div
                    className="options"
                    style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
                >
                    {values.map((value) => {
                        const isSelected = selectedSpecs[id] === value;

                        if (isColor) {
                            return (
                                <div
                                    key={value}
                                    style={{
                                        padding: "4px",
                                        borderRadius: "50%",
                                        border: isSelected
                                            ? "2px solid #0071e3"
                                            : "2px solid transparent",
                                        transition: "all 0.2s ease-in-out",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            setSelectedSpecs((prev) => ({ ...prev, [id]: value }))
                                        }
                                        style={{
                                            width: "24px",
                                            height: "24px",
                                            borderRadius: "50%",
                                            backgroundColor: value,
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                        title={value}
                                        type="button"
                                    />
                                </div>
                            );
                        }

                        const isSelectedStyle = isSelected
                            ? { border: "2px solid #0071e3" }
                            : { border: "1px solid #000" };

                        return (
                            <button
                                key={value}
                                style={{
                                    padding: "10px 24px",
                                    borderRadius: "12px",
                                    fontSize: "18px",
                                    fontWeight: "500",
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    ...isSelectedStyle,
                                }}
                                onClick={() =>
                                    setSelectedSpecs((prev) => ({ ...prev, [id]: value }))
                                }
                                type="button"
                            >
                <span style={{ fontSize: "20px", fontWeight: "600" }}>
                  {value.toString().replace(/[^\d]/g, "")}
                </span>
                                <span
                                    style={{
                                        fontSize: "12px",
                                        marginLeft: "2px",
                                        verticalAlign: "super",
                                    }}
                                >
                  {value.toString().replace(/\d+/g, "")}
                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const addToCart = () => {
        if (!item) return;
        const objectToCart = {
            amount: 1,
            item: item,
            total_price: item.discount
                ? Math.round(item.price - (item.price * item.discount) / 100)
                : item.price,
        };

        const cartString = localStorage.getItem("cart");
        let cart = cartString ? JSON.parse(cartString) : [];
        const itemIndex = cart.findIndex(
            (cartItem) => Number(cartItem.item.id) === Number(item.id)
        );

        if (itemIndex > -1) {
            cart[itemIndex].amount += objectToCart.amount;
            cart[itemIndex].total_price += objectToCart.total_price;
        } else {
            cart.push(objectToCart);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        navigate("/catalog");
    };

    // Функція для отримання personId за поточним користувачем
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

    // Додавання в улюблені з toast і прокруткою вгору, без перенаправлення
    const addToFavourite = async () => {
        const personId = await fetchUserById();
        if (!personId) {
            setToastMessage("User not found!");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const favourite = {
            item_id: Number(item.id),
            person_id: personId,
        };

        try {
            await axios.post(`${process.env.REACT_APP_DB_LINK}Favourite.json`, favourite);
            setToastMessage("Added to favourites!");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e) {
            console.error(e);
            setToastMessage("Failed to add to favourites.");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (!item) return <p>Loading product...</p>;

    return (
        <div id="product">
            <Header />

            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage("")} />
            )}

            <div className="header-page">
                <h1 id="product-title-heading" className="product-title">
                    {item.brand} {item.title}
                </h1>
                <div id="product-price" className="product-price">
                    {item.discount > 0 ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div
                                style={{
                                    color: "#888",
                                    textDecoration: "line-through",
                                    marginRight: "5px",
                                    fontSize: "0.9em",
                                }}
                            >
                                From {item.price}₴
                            </div>
                            <div style={{ color: "green", fontWeight: "bold" }}>
                                Now from {(item.price * (1 - item.discount / 100)).toFixed(0)}₴
                            </div>
                        </div>
                    ) : (
                        <>From {item.price}₴</>
                    )}
                </div>
            </div>

            <div className="product-main">
                <div className="product-left">
                    <img id="product-image" src={item.image} alt="Product Image" />
                </div>
                <div className="product-right configurator">
                    {Object.entries(groupedConfigs).map(([key, values]) =>
                        createConfigBlock(
                            key,
                            key,
                            values,
                            key.toLowerCase() === "color",
                            selectedSpecs[key] || null,
                            (value) => setSelectedSpecs((prev) => ({ ...prev, [key]: value }))
                        )
                    )}
                </div>
            </div>

            <div className="product-info-block" id="productInfo">
                <div className="inner-container">
                    <div className="product-info-left">
                        <h2>
                            Your New <br />
                            <span id="productName"></span>
                        </h2>
                        <p className="subtitle">Just the way you want it</p>
                    </div>

                    <div className="product-info-right">
                        <div className="product-summary">
                            <p className="price">
                                {item.discount > 0 ? (
                                    <>
                                        From{" "}
                                        <strong
                                            style={{
                                                color: "#888",
                                                textDecoration: "line-through",
                                                marginRight: "5px",
                                                fontSize: "0.9em",
                                            }}
                                        >
                                            {item.price}₴
                                        </strong>
                                        <strong
                                            id="productPrice"
                                            style={{ color: "#008CF6", fontWeight: "bold" }}
                                        >
                                            {(item.price * (1 - item.discount / 100)).toFixed(0)}₴
                                        </strong>
                                    </>
                                ) : (
                                    <>
                                        From <strong id="productPrice">{item.price}₴</strong>
                                    </>
                                )}
                            </p>
                            <p className="bonuses">
                                Bonuses: <span id="productBonus">{item.price / 100}</span>{" "}
                                <Bonus fillColor="#ADACAC" width={20} height={20} className="bonus-icon" />
                            </p>

                            <p className="save-note">
                                Need a moment?
                                <br />
                                <span>Keep your selections by saving this device to Your Saves.</span>
                            </p>
                            <div style={{ marginTop: "20px" }}>
                                <button
                                    onClick={() => {
                                        addToFavourite();
                                    }}
                                    style={{
                                        all: "unset",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        cursor: "pointer",
                                        textAlign: "left",
                                    }}
                                >
                                    <Save_for_later />
                                    Save for later
                                </button>
                            </div>
                        </div>

                        <div className="product-info-extra">
                            <ul className="product-details-list">
                                <li>
                                    <History/>
                                    Delivery time:{" "}
                                    <strong id="productDelivery">
                                        {item.available ? getNextDay() : "No info"}
                                    </strong>
                                </li>
                                <li>
                                    <Truck/>
                                    Free shipping
                                </li>
                                <li>
                                    <Package/>
                                    Availability:{" "}
                                    <strong
                                        id="productAvailability"
                                        style={{
                                            color: item.available ? "green" : "red",
                                        }}
                                    >
                                        {item.available ? "In stock" : "Out of stock"}
                                    </strong>
                                </li>
                                <button
                                    className="Order-button"
                                    id="product-addToCart"
                                    onClick={addToCart}
                                    disabled={!item.available}
                                >
                                    Order
                                </button>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
