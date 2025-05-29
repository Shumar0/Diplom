import {Link, replace, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { History, Truck, Package } from "lucide-react";
import "./styles/style.css"
import "./styles/breadcrumb.css"
import "./styles/product_page.css"
import {useAuth} from "../context/authContext";
import Header from "./Header";
import Footer from './Footer';

export default function Product() {

    const param = useParams();
    const [item, setItem] = useState({});
    const [groupedConfigs, setGroupedConfigs] = useState({});
    const navigate = useNavigate();

    const auth = useAuth();

    function getNextDay(date = new Date()) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 2);
        return nextDay.toISOString().split('T')[0];
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_DB_LINK}Item.json`)
            .then(res => {
                const data = res.data;
                if (!data) return;
                for (let k in data) {
                    if (data[k] && k === param.id) {
                        setItem({
                            id: k,
                            brand: data[k].brand,
                            title: data[k].title,
                            price: data[k].price,
                            image: data[k].image,
                            amount_on_stock: data[k].amount_on_stock,
                            category: data[k].category,
                            available: data[k].amount_on_stock > 0,
                            discount: data[k].discount,
                        });
                    }
                }
            })
            .catch(console.error);

        axios.get(`${process.env.REACT_APP_DB_LINK}Config.json`)
            .then(res => {
                const data = res.data;
                const grouped = {};
                for (let key in data) {
                    if (data[key]) {
                        if (String(data[key].item_id) === String(param.id)) {
                            const k = data[key].key;
                            const v = data[key].value;
                            if (!grouped[k]) grouped[k] = [];
                            if (!grouped[k].includes(v)) grouped[k].push(v);
                        }
                    }
                }
                setGroupedConfigs(grouped);
            })
            .catch(console.error);
    }, [param.id]);


    const createConfigBlock = (title, id, values, isColor = false) => {
        if (!values || values.length === 0) return null;

        return (
            <div key={id} className="config-section">
                <h3>{title}</h3>
                <div className="options" id={id}>
                    {values.map(value => {
                        const baseStyle = {
                            margin: '0 5px',
                            cursor: 'pointer',
                            transition: 'border 0.2s ease-in-out'
                        };

                        const style = isColor
                            ? {
                                ...baseStyle,
                                backgroundColor: value,
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                            }
                            : {
                                ...baseStyle,
                                padding: '6px 12px',
                                borderRadius: '4px',
                            };

                        return (
                            <button
                                key={value}
                                className={`option-button`}
                                style={style}
                                title={isColor ? value : undefined}
                            >
                                {!isColor && value}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const addToCart = () => {
        const objectToCart = {
            amount: 1,
            item: item,
            total_price: item.price,
        };

        const cartString = localStorage.getItem('cart');
        let cart = cartString ? JSON.parse(cartString) : [];
        const itemIndex = cart.findIndex(item => Number(item.item.id) === Number(param.id));

        if (itemIndex > -1) {
            cart[itemIndex].amount += objectToCart.amount;
            cart[itemIndex].total_price += objectToCart.total_price;
        } else {
            cart.push(objectToCart);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        navigate('/catalog');
    };

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

    const addToFavourite = async () => {
        const personId = await fetchUserById();
        console.log("Person id: ", personId);

        const favourite = {
            item_id: Number(item.id),
            person_id: personId,
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_DB_LINK}Favourite.json`, favourite);
            console.log("Добавлено в избранное:", res.data);
        } catch (e) {
            console.log(e);
        }

    }

    return (
        <div id="product">
            <Header />

            <div className="header-page">
                <h1 id="product-title-heading" className="product-title">{item.brand} {item.title}</h1>
                <div id="product-price" className="product-price">
                    {item.discount > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ color: '#888', textDecoration: 'line-through', marginRight: '5px', fontSize: '0.9em' }}>
                                From {item.price}₴
                            </div>
                            <div style={{ color: 'green', fontWeight: 'bold' }}>
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
                    <img id="product-image" src={item.image} alt="Product Image"/>
                </div>
                <div className="product-right configurator">
                    {Object.entries(groupedConfigs).map(([key, values]) =>
                        createConfigBlock(key, key, values, key.toLowerCase() === 'color')
                    )}
                </div>
            </div>

            <div className="product-info-block" id="productInfo">
                <div className="inner-container">
                    <div className="product-info-left">
                        <h2>Your New <br/><span id="productName"></span></h2>
                        <p className="subtitle">Just the way you want it</p>
                    </div>

                    <div className="product-info-right">
                        <div className="product-summary">
                            <p className="price">
                                {item.discount > 0 ? (
                                    <>
                                        From <strong style={{ color: '#888', textDecoration: 'line-through', marginRight: '5px', fontSize: '0.9em' }}>
                                        {item.price}₴
                                    </strong>
                                        <strong id="productPrice" style={{ color: 'green', fontWeight: 'bold' }}>
                                            {(item.price * (1 - item.discount / 100)).toFixed(0)}₴
                                        </strong>
                                    </>
                                ) : (
                                    <>From <strong id="productPrice">{item.price}₴</strong></>
                                )}
                            </p>
                            <p className="bonuses">Bonuses: <span id="productBonus">{item.price / 100}</span></p>

                            <p className="save-note">Need a moment?<br/>
                                <span>Keep your selections by saving this device to Your Saves.</span>
                            </p>
                            <button onClick={() => {
                                addToFavourite()
                                navigate("/catalog")
                            }} className="save-link">💙 Save for later</button>
                        </div>

                        <div className="product-info-extra">
                            <ul className="product-details-list">
                                <li>
                                    <History />
                                    Delivery time: <strong id="productDelivery">{item.available ? getNextDay() :
                                    'No info'}</strong></li>
                                <li>
                                    <Truck />
                                    Free shipping
                                </li>
                                <li>
                                    <Package />
                                    Availability: <span id="productAvailability">{item.available ? 'In stock' :
                                    'Out of stock'}</span></li>
                            </ul>

                            <button
                                disabled={!item.available}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: item.available ? '#007bff' : '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: item.available ? 'pointer' : 'not-allowed',
                                    fontSize: '16px',
                                }}
                                onClick={() => addToCart()}
                            >
                                {item.available ? 'Order' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-navigation">
                <button className="nav-item active" data-target="features">All features</button>
                <button className="nav-item" data-target="description">Description</button>
                <button className="nav-item" data-target="reviews">Reviews</button>
                <button className="nav-item" data-target="accessories">Accessories</button>
                <button className="nav-item" data-target="tradein">Trade-in</button>
            </div>


            <div className="product-content">
                <div className="content-section active" id="features">
                    <h3>All Features</h3>
                    <p>...</p>
                </div>
                <div className="content-section" id="description">
                    <h3>Description</h3>
                    <p>...</p>
                </div>
                <div className="content-section" id="reviews">
                    {/*Ліва частина: заголовок + відгуки*/}
                    <div className="review-area">
                        <div className="review-title">
                            <span className="review-count"></span>
                            <span className="product-name"></span>
                        </div>
                        <div id="reviewsContainer"></div>
                    </div>

                    {/*Права частина: зірки + бари*/}
                    <div className="rating-summary">
                        <div className="star-average">
                            <div className="stars" id="starIcons"></div>
                            <span id="averageScoreText">0.0 / 5.0</span>
                        </div>
                        <div className="rating-bars" id="ratingBars"></div>
                    </div>
                </div>
                <div className="content-section" id="accessories">
                    <h3>Accessories</h3>
                    <p>...</p>
                </div>
                <div className="content-section" id="tradein">
                    <h3>Trade-in</h3>
                    <p>...</p>
                </div>
            </div>

            <Footer />
        </div>
    )
}