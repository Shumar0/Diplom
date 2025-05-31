import React, { useState, useEffect } from "react";
import './styles/style.css'
import './styles/breadcrumb.css'
import './styles/catalog.css'
import './styles/pagination.css'
import Header from './Header';
import Footer from './Footer';
import Delivery_box from './Delivery_box';
import {Link, useNavigate} from "react-router-dom";


export default function Catalog(props) {
    const products = props.products;
    const [configs, setConfigs] = useState({});
    const navigator = useNavigate();
    const [notificationMessages, setNotificationMessages] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;



    // Групуємо specs з товарів, для масивів беремо лише перший елемент
    useEffect(() => {
        const grouped = {};

        for (const product of products) {
            if (!product.id || !product.specs) continue;
            const specsArray = Object.entries(product.specs).map(([key, value]) => {
                let displayValue = value;
                if (Array.isArray(value)) {
                    displayValue = value[0];
                }
                return { key, value: displayValue };
            });
            grouped[product.id] = specsArray;
        }

        setConfigs(grouped);
    }, [products]);

    function getNextDay(date = new Date()) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 2);
        return nextDay.toISOString().split('T')[0];
    }

    const renderConfig = (itemId) => {
        const confList = configs[itemId] || [];
        if (confList.length === 0) {
            return <p className="no-config">Empty list</p>;
        }

        return (
            <div className="product-data">
                <div className="chahracteristics-block">
                    {confList.map((conf, index) => (
                        <p key={`key-${index}`} className="chahracteristic-name data-field">{conf.key}</p>
                    ))}
                </div>
                <div className="chahracteristics-block">
                    {confList.map((conf, index) => {
                        const value = conf.value;
                        const isColor = typeof value === 'string' && (
                            /^#([0-9a-f]{3}){1,2}$/i.test(value) ||
                            /^rgb/.test(value) ||
                            ['red', 'green', 'blue', 'black', 'white', 'gray', 'yellow', 'purple', 'orange'].includes(value.toLowerCase())
                        );

                        return (
                            <p
                                key={`val-${index}`}
                                className="chahracteristic-value data-field"
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                {isColor ? (
                                    <span style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        backgroundColor: value,
                                        border: '1px solid #ccc',
                                        display: 'inline-block',
                                    }} />
                                ) : (
                                    <span>{value}</span>
                                )}
                            </p>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Компонент повідомлення
    const NotificationItem = ({ id, text, index, onRemove }) => {
        const [visible, setVisible] = useState(false);

        useEffect(() => {
            const appearDelay = index * 150;
            const disappearDelay = 3000 + index * 400;

            const appearTimeout = setTimeout(() => setVisible(true), appearDelay);
            const hideTimeout = setTimeout(() => setVisible(false), disappearDelay);
            const removeTimeout = setTimeout(() => onRemove(id), disappearDelay + 400);

            return () => {
                clearTimeout(appearTimeout);
                clearTimeout(hideTimeout);
                clearTimeout(removeTimeout);
            };
        }, [id, index, onRemove]);

        return (
            <div className={`notification ${visible ? 'show' : ''}`}>
                {text}
            </div>
        );
    };

    const addNotification = (text) => {
        const id = Date.now() + Math.random();
        setNotificationMessages(prev => [...prev, { id, text }]);
    };

    const removeNotification = (idToRemove) => {
        setNotificationMessages(prev => prev.filter(({ id }) => id !== idToRemove));
    };

    const addToCart = (product) => {
        const objectToCart = {
            amount: 1,
            item: product,
            total_price: product.discount
                ? parseInt(product.price - (product.price * product.discount / 100), 10)
                : product.price,
        };

        const cartString = localStorage.getItem('cart');
        let cart = cartString ? JSON.parse(cartString) : [];
        const itemIndex = cart.findIndex(item => Number(item.item.id) === Number(product.id));

        if (itemIndex > -1) {
            cart[itemIndex].amount += objectToCart.amount;
            cart[itemIndex].total_price += objectToCart.total_price;
        } else {
            cart.push(objectToCart);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        addNotification(`Product "${product.title}" added to your cart`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div id="catalog-page">
            {/* Повідомлення */}
            <div className="notifications-container">
                {notificationMessages.map(({id, text}, index) => (
                    <NotificationItem
                        key={id}
                        id={id}
                        text={text}
                        index={index}
                        onRemove={removeNotification}
                    />
                ))}
            </div>

            <Header/>

            {/* Хлібні крихти */}
            <nav className="breadcrumb" id="breadcrumb"></nav>

            <div className="catalog-header">
                <h2 id="product-count">Found {products.length} items</h2>
                <div className="active-filters" id="active-filters"></div>
            </div>

            <div className="main">
                <div className="filters-container">
                    {/* BRAND FILTER */}
                    <div className="filter-group">
                        <button className="filter-toggle">Brand
                            <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9l6 6 6-6" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <div className="filter-options">
                            {["Apple", "Asus", "HP"].map(brand => (
                                <label className="custom-radio" key={brand}>
                                    <input type="checkbox" name="brand" value={brand}/>
                                    <span className="checkmark"></span>
                                    {brand}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* PRICE FILTER */}
                    <div className="filter-group">
                        <button className="filter-toggle">Price
                            <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9l6 6 6-6" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <div className="filter-options">
                            <div className="range-container">
                                <div className="slider-track"></div>
                                <input type="range" id="min-price" className="range-slider"/>
                                <input type="range" id="max-price" className="range-slider"/>
                            </div>
                            <div className="range-labels">
                                <span id="min-price-label">0</span> ₴ — <span id="max-price-label">10000</span> ₴
                            </div>
                        </div>
                    </div>

                    {/* AVAILABLE FILTER */}
                    <div className="filter-group open">
                        <div className="filter-title">Available</div>
                        <div className="filter-options">
                            <label className="custom-radio">
                                <input type="checkbox" id="availability-checkbox" value="inStock"/>
                                <span className="checkmark"></span>
                                In stock
                            </label>
                        </div>
                    </div>
                </div>

                <div className="products" id="product-list">
                    {currentProducts.map(product => (
                        <div
                            key={product.id}
                            className="product-card"
                        >
                            <div className="left-product-block" onClick={() =>
                                navigator(`/product/${product.id}`)}>
                                <div className="product-image-block">
                                    <div className="product-image-slider">
                                        <img className="product-image" src={product.image} alt={product.title}/>
                                    </div>
                                </div>
                                <div className="product-info-block">
                                    <div className="product-controls">
                                        <div className="add-to-fav product-controls-btn"></div>
                                        <div className="add-to-comp product-controls-btn"></div>
                                    </div>
                                    <p className="product-category data-field">{product.category}</p>
                                    <h3 className="product-name">{product.title}</h3>
                                    {renderConfig(product.id)}
                                </div>
                            </div>
                            <div className="right-product-block">
                                <div className="product-status">
                                    <div className="status-indicator"
                                         style={{backgroundColor: product.available ? 'green' : 'red'}}></div>
                                    <p className="status-text">{product.available ? 'In stock' : 'Out of stock'}</p>
                                </div>
                                <div className="delivery-block">
                                    <div className="delivery-icon">
                                        <Delivery_box width="100" height="100"/>
                                    </div>
                                    <p className="delivery-data">
                                        {product.available ? `Delivery: ${getNextDay()}` : 'No info'}
                                    </p>
                                </div>
                                <div className="price-block">
                                    {product.discount > 0 && (
                                        <h3 style={{
                                            color: '#888',
                                            textDecoration: 'line-through',
                                            fontSize: '0.9rem'
                                        }}>{product.price} ₴</h3>
                                    )}
                                    <h2 className="product-price">{product.discount > 0
                                        ? (product.price - product.price * product.discount / 100).toFixed(0)
                                        : product.price} ₴
                                    </h2>
                                    <button className="add-to-cart" onClick={() => addToCart(product)}>
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pagination">
                {Array.from({length: totalPages}, (_, index) => (
                    <div
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>

            <Footer/>
        </div>
    );
}