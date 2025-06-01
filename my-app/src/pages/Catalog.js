import React, { useState, useEffect, useMemo } from "react";
import './styles/style.css';
import './styles/breadcrumb.css';
import './styles/catalog.css';
import './styles/pagination.css';
import Header from './Header';
import Footer from './Footer';
import Delivery_box from './Delivery_box';
import { Link, useNavigate } from "react-router-dom";
import Save_for_later from "./Save_for_later";

export default function Catalog(props) {
    const products = props.products;
    const navigator = useNavigate();

    const [configs, setConfigs] = useState({});
    const [notificationMessages, setNotificationMessages] = useState([]);

    // Фільтри
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [availabilityFilter, setAvailabilityFilter] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 10000]);

    // Для пагінації
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Групування характеристик
    useEffect(() => {
        const grouped = {};
        for (const product of products) {
            if (!product.id || !product.specs) continue;
            const specsArray = Object.entries(product.specs).map(([key, value]) => ({
                key,
                value: Array.isArray(value) ? value[0] : value
            }));
            grouped[product.id] = specsArray;
        }
        setConfigs(grouped);
    }, [products]);

    // Унікальні бренди
    const uniqueBrands = useMemo(() => {
        return Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
    }, [products]);

    // Мін/макс ціни
    const minPrice = Math.min(...products.map(p => p.price));
    const maxPrice = Math.max(...products.map(p => p.price));

    useEffect(() => {
        setPriceRange([minPrice, maxPrice]);
    }, [minPrice, maxPrice]);

    // Стан відкритості фільтрів
    const [brandOpen, setBrandOpen] = useState(false);
    const [priceOpen, setPriceOpen] = useState(false);

    // Відсоток для лінії між повзунками
    const minPercent = ((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100;
    const maxPercent = ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100;

    const removeBrand = (brandToRemove) => {
        setSelectedBrands(selectedBrands.filter(b => b !== brandToRemove));
    };

    const resetPriceRange = () => {
        setPriceRange([minPrice, maxPrice]);
    };

    const activeFilters = [
        ...selectedBrands.map(brand => ({
            id: brand,
            label: brand,
            remove: () => removeBrand(brand),
        })),
        (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && {
            id: 'price',
            label: `Price: ${priceRange[0]} ₴ — ${priceRange[1]} ₴`,
            remove: resetPriceRange,
        },
        availabilityFilter && {
            id: 'availability',
            label: 'In stock',
            remove: () => setAvailabilityFilter(false),
        },
    ].filter(Boolean);

    // Функції відкриття/закриття фільтрів
    const toggleBrand = () => setBrandOpen(prev => !prev);
    const togglePrice = () => setPriceOpen(prev => !prev);

    const handleBrandChange = (e) => {
        const brand = e.target.value;
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const handleAvailabilityChange = (e) => {
        setAvailabilityFilter(e.target.checked);
    };

    // Виправлена логіка, щоб мінімальний повзунок не переходив за максимальний і навпаки
    const handleMinPriceChange = (e) => {
        const value = Math.min(Number(e.target.value), priceRange[1] - 1);
        setPriceRange([value, priceRange[1]]);
    };

    const handleMaxPriceChange = (e) => {
        const value = Math.max(Number(e.target.value), priceRange[0] + 1);
        setPriceRange([priceRange[0], value]);
    };

    const filteredProducts = products.filter(product => {
        const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const matchAvailability = !availabilityFilter || product.available;
        const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchBrand && matchAvailability && matchPrice;
    });

    const getNextDay = (date = new Date()) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 2);
        return nextDay.toISOString().split('T')[0];
    };

    const addNotification = (text) => {
        const id = Date.now() + Math.random();
        setNotificationMessages(prev => [...prev, { id, text }]);
    };

    const removeNotification = (idToRemove) => {
        setNotificationMessages(prev => prev.filter(({ id }) => id !== idToRemove));
    };

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

        return <div className={`notification ${visible ? 'show' : ''}`}>{text}</div>;
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
            cart[itemIndex].amount += 1;
            cart[itemIndex].total_price += objectToCart.total_price;
        } else {
            cart.push(objectToCart);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        addNotification(`Product "${product.title}" added to your cart`);
    };

    const renderConfig = (itemId) => {
        const confList = configs[itemId] || [];
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
                            <p key={`val-${index}`} className="chahracteristic-value data-field" style={{ display: 'flex', alignItems: 'center' }}>
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

    // Пагінація
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div id="catalog-page">
            <div className="notifications-container">
                {notificationMessages.map(({ id, text }, index) => (
                    <NotificationItem key={id} id={id} text={text} index={index} onRemove={removeNotification} />
                ))}
            </div>

            <Header />
            <nav className="breadcrumb" id="breadcrumb"></nav>

            <div className="catalog-header">
                <h2 id="product-count">Found {filteredProducts.length} items</h2>
                <div className="active-filters">
                    {activeFilters.map(filter => (
                        <div
                            key={filter.id}
                            className="active-filter"
                            onClick={filter.remove}
                        >
                            {filter.label}
                        </div>
                    ))}
                </div>
            </div>

            <div className="main">
                <div className="filters-container">
                    {/* BRAND FILTER */}
                    <div className={`filter-group ${brandOpen ? 'open' : ''}`}>
                        <button className="filter-toggle" onClick={toggleBrand}>
                            Brand
                            <span className="arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="2"
                                     strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </span>
                        </button>
                        <div className="filter-options">
                            {uniqueBrands.map(brand => (
                                <label className="custom-radio" key={brand}>
                                    <input
                                        type="checkbox"
                                        value={brand}
                                        onChange={handleBrandChange}
                                        checked={selectedBrands.includes(brand)}
                                    />
                                    <span className="checkmark"></span>
                                    {brand}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* PRICE FILTER */}
                    <div className={`filter-group ${priceOpen ? 'open' : ''}`}>
                        <button className="filter-toggle" onClick={togglePrice}>
                            Price
                            <span className="arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                     strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </span>
                        </button>

                        <div className="filter-options">
                            <div className="range-labels">
                                <span>{priceRange[0]} ₴</span> — <span>{priceRange[1]} ₴</span>
                            </div>

                            <div className="price-range-row">
                                <div className="range-container">
                                    <input
                                        type="range"
                                        min={minPrice}
                                        max={maxPrice}
                                        value={priceRange[0]}
                                        onChange={handleMinPriceChange}
                                        className="range-slider"
                                    />
                                    <input
                                        type="range"
                                        min={minPrice}
                                        max={maxPrice}
                                        value={priceRange[1]}
                                        onChange={handleMaxPriceChange}
                                        className="range-slider"
                                    />

                                    {/* Оновлений трек */}
                                    <div
                                        className="slider-track"
                                        style={{
                                            left: `${minPercent}%`,
                                            width: `${maxPercent - minPercent}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AVAILABLE FILTER */}
                    <div className="filter-group open">
                        <div className="filter-title">Available</div>
                        <div className="filter-options">
                            <label className="custom-radio">
                                <input
                                    type="checkbox"
                                    checked={availabilityFilter}
                                    onChange={handleAvailabilityChange}
                                />
                                <span className="checkmark"></span>
                                In stock
                            </label>
                        </div>
                    </div>
                </div>
                <div className="products" id="product-list">
                    {currentProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="left-product-block" onClick={() => navigator(`/product/${product.id}`)}>
                                <div className="product-image-block">
                                    <div className="product-image-slider">
                                        <img className="product-image" src={product.image} alt={product.title}/>
                                    </div>
                                </div>
                                <div className="product-info-block">
                                    <div className="product-controls">
                                        <div className="add-to-fav product-controls-btn"><Save_for_later/></div>
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
                                    <Delivery_box width="20" height="20"/>
                                    <p className="delivery-data">
                                        {product.available ? `Delivery: ${getNextDay()}` : 'No info'}
                                    </p>
                                </div>
                                <div className="price-block">
                                    {product.discount > 0 && (
                                        <h3 style={{ color: '#888', textDecoration: 'line-through', fontSize: '0.9rem' }}>{product.price} ₴</h3>
                                    )}
                                    <h2 className="product-price">
                                        {product.discount > 0
                                            ? (product.price - product.price * product.discount / 100).toFixed(0)
                                            : product.price} ₴
                                    </h2>
                                    <button className="add-to-cart" onClick={() => addToCart(product)}>Add to cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <div
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}
