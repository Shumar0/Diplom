import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { History, Truck, Package } from "lucide-react";
import "./styles/style.css"
import "./styles/header.css"
import "./styles/breadcrumb.css"
import "./styles/footer.css"
import "./styles/product_page.css"

export default function Product() {

    const param = useParams();
    const [item, setItem] = useState({});
    const [groupedConfigs, setGroupedConfigs] = useState({});
    const navigate = useNavigate();

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

    return (
        <div id="product">
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
                                      style={{ fill: "#007AFF" }}/></g>
                        </svg>
                        <span>Delivery to</span>
                        <select>
                            <option value="ukraine">Ukraine</option>
                            <option value="germany">Germany</option>
                            <option value="poland">Poland</option>
                        </select>
                    </div>
                    <button className="catalog-button">Catalog</button>
                </div>

                <div className="header-center">
                    <Link to="/">
                        <img src="/images/logo.png" alt="NextTech Logo" className="logo"/>
                    </Link>
                </div>

                <div className="header-right">
                    <div className="search-bar">
                        <input type="text" placeholder="Site search..."/>
                        <button className="search-button">
                            <img src="/images/search.svg" alt="Search" className="icon-small"/>
                        </button>
                    </div>
                    <div className="header-icons">
                        <Link to="/cart">
                            <button className="icon-button">
                                <img src="/images/cart.svg" alt="Cart" className="icon icon-cart"/>
                            </button>
                        </Link>
                        <Link to="/favorites">
                            <button className="icon-button">
                                <img src="/images/heart.svg" alt="Favorites" className="icon icon-heart"/>
                            </button>
                        </Link>
                        <Link to="/account">
                            <button className="icon-button">
                                <img src="/images/user.svg" alt="Profile" className="icon icon-user"/>
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/*BREAD CRUMB*/}
            <nav className="breadcrumb" id="breadcrumb"></nav>

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
                            <a href="#" className="save-link">💙 Save for later</a>
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

            <footer className="footer">
                <div className="footer-top">
                    <div className="newsletter-text">
                        <p>I want to keep up to date with promotions and new products</p>
                    </div>
                    <div className="newsletter-form">
                        <input type="email" placeholder="My e-mail"/>
                        <div className="footer-bottons">
                            <button>Sign</button>
                        </div>
                    </div>
                </div>

                <hr/>

                <div className="footer-main">
                    <div className="app-download">
                        <div className="app-image">
                            {/*Місце для QR коду або картинки*/}
                        </div>
                        <p>Point your camera and download the free NameStore app</p>
                        <div className="app-icons">
                            <div className="app-icon"></div>
                            <div className="app-icon"></div>
                            <div className="app-icon"></div>
                            <div className="app-icon"></div>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h3>Buyers</h3>
                            <ul>
                                <li><a href="#">Information</a></li>
                                <li><a href="#">Delivery</a></li>
                                <li><a href="#">Guarantee</a></li>
                                <li><a href="#">Promotions and discount</a></li>
                                <li><a href="#">Public offer</a></li>
                                <li><a href="#">Gift Cards</a></li>
                                <li><a href="#">Exchanges and returns</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3>Partners</h3>
                            <ul>
                                <li><a href="#">Information</a></li>
                                <li><a href="#">Working conditions</a></li>
                                <li><a href="#">Guarantee</a></li>
                                <li><a href="#">Public offer</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3>Company</h3>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Contacts</a></li>
                                <li><a href="#">Hotline</a></li>
                                <li><a href="#">Company policy</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3>Contacts</h3>
                            <p><a href="#">Address of shops</a></p>
                            <p>12345678900</p>
                            <button className="ask-button">Ask question</button>
                        </div>

                        <div className="footer-column">
                            <h3>We're on social media</h3>
                            <div className="social-icons">
                                <div className="social-icon"></div>
                                <div className="social-icon"></div>
                                <div className="social-icon"></div>
                                <div className="social-icon"></div>
                                <div className="social-icon"></div>
                                <div className="social-icon"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr/>

                <div className="footer-bottom">
                    <a href="#">Privacy Policy</a>
                    <span>|</span>
                    <a href="#">Terms of Use</a>
                    <span>|</span>
                    <a href="#">Sales and Refunds</a>
                </div>
            </footer>
        </div>
    )
}