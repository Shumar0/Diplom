import React from "react";
import './styles/style.css'
import './styles/header.css'
import './styles/footer.css'
import './styles/breadcrumb.css'
import './styles/catalog.css'
import './styles/pagination.css'
import {Link} from "react-router-dom";

export default function Catalog(props) {

    const products = props.products;

    return (
        <div id="catalog-page">
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
                        <img src="images/logo.png" alt="NextTech Logo" className="logo"/>
                    </Link>
                </div>

                <div className="header-right">
                    <div className="search-bar">
                        <input type="text" placeholder="Site search..."/>
                        <button className="search-button">
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

            {/*BREAD CRUMB*/}
            <nav className="breadcrumb" id="breadcrumb"></nav>

            <div className="catalog-header">
                <h2 id="product-count">Found 0 products in 0 categories</h2>
                <div className="active-filters" id="active-filters"></div>
            </div>

            <div className="main">
                <div className="filters-container">

                    {/*BRAND FILTER*/}
                    <div className="filter-group">
                        <button className="filter-toggle">Brand
                            <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9l6 6 6-6" stroke="#000" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <div className="filter-options">
                            <label className="custom-radio">
                                <input type="checkbox" name="brand" value="Apple"/>
                                <span className="checkmark"></span>
                                Apple
                            </label>
                            <label className="custom-radio">
                                <input type="checkbox" name="brand" value="Asus"/>
                                <span className="checkmark"></span>
                                Asus
                            </label>
                            <label className="custom-radio">
                                <input type="checkbox" name="brand" value="HP"/>
                                <span className="checkmark"></span>
                                HP
                            </label>
                        </div>
                    </div>

                    {/*PRICE FILTER*/}
                    <div className="filter-group">
                        <button className="filter-toggle">Price
                            <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9l6 6 6-6" stroke="#000" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <div className="filter-options">
                            <div className="range-container">
                                <div className="slider-track"></div>
                                <input type="range" id="min-price" className="range-slider"/>
                                <input type="range" id="max-price" className="range-slider"/>
                            </div>
                            <div className="range-labels">
                                <span id="min-price-label">0</span> ₴ —
                                <span id="max-price-label">10000</span> ₴
                            </div>
                        </div>
                    </div>

                    {/*AVAILABLE FILTER (завжди відкритий)*/}
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
                    {products.map(product => (
                        <div className="product-card">
                            <div className="product-card" data-id={product.id}>
                                <div className="left-product-block">
                                    <div className="product-image-block">
                                        <div className="product-image-slider">
                                            <img className="product-image" src={product.image}
                                                 alt={product.title}/>
                                        </div>
                                        <div className="image-controls">
                                            <button className="img-btn"></button>
                                            <button className="img-btn"></button>
                                            <button className="img-btn"></button>
                                            <button className="img-btn"></button>
                                            <button className="img-btn"></button>
                                        </div>
                                    </div>
                                    <div className="product-info-block">
                                        <div className="product-controls">
                                            <div className="add-to-fav product-controls-btn"></div>
                                            <div className="add-to-comp product-controls-btn"></div>
                                        </div>
                                        <p className="product-category data-field">{product.category}</p>
                                        <h3 className="product-name">{product.title}</h3>
                                        <div className="product-data">
                                            <div className="chahracteristics-block">
                                                <p className="chahracteristic-name data-field">Processor</p>
                                                <p className="chahracteristic-name data-field">Screen Size</p>
                                                <p className="chahracteristic-name data-field">Video card</p>
                                                <p className="chahracteristic-name data-field">RAM</p>
                                                <p className="chahracteristic-name data-field">Volume</p>
                                            </div>
                                            <div className="chahracteristics-data">
                                                <p className="cpu-info data-field">{Array.isArray(product.processor) ? product.processor[0] : product.processor || '—'}</p>
                                                <p className="screen-info data-field">{Array.isArray(product.screenSize) ? product.screenSize[0] : product.screenSize || '—'}</p>
                                                <p className="gpu-info data-field">{Array.isArray(product.videoCard) ? product.videoCard[0] : product.videoCard || '—'}</p>
                                                <p className="ram-info data-field">{Array.isArray(product.ram) ? product.ram[0] : product.ram || '—'}</p>
                                                <p className="volume-info data-field">{Array.isArray(product.volume) ? product.volume[0] : product.volume || '—'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="right-product-block">
                                    <div className="product-status">
                                        <div className="status-indicator"
                                             style={{ backgroundColor: product.available ? 'green' : 'red' }}></div>
                                        <p className="status-text">{product.available ? 'In stock' : 'Out of stock'}</p>
                                    </div>
                                    <div className="delivery-block">
                                        <div className="delivery-icon">
                                            <svg className="icon-small" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                                                <g style={{
                                                    stroke: 'none',
                                                    strokeWidth: 0,
                                                    strokeDasharray: 'none',
                                                    strokeLinecap: 'butt',
                                                    strokeLinejoin: 'miter',
                                                    strokeMiterlimit: 10,
                                                    fill: 'none',
                                                    fillRule: 'nonzero',
                                                    opacity: 1
                                                }}
                                                   transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                                                    <path
                                                        d="M 45 37.605 c -0.254 0 -0.509 -0.048 -0.749 -0.146 l -16.076 -6.494 c -1.024 -0.414 -1.519 -1.58 -1.105 -2.604 c 0.414 -1.024 1.58 -1.519 2.604 -1.105 L 45 33.448 l 36.253 -14.646 L 45 4.157 L 8.747 18.803 l 11.485 4.64 c 1.024 0.414 1.519 1.58 1.105 2.604 c -0.414 1.025 -1.58 1.52 -2.604 1.105 L 2.659 20.657 c -0.756 -0.306 -1.251 -1.039 -1.251 -1.854 s 0.495 -1.549 1.251 -1.854 L 44.251 0.146 c 0.48 -0.194 1.018 -0.194 1.498 0 l 41.593 16.803 c 0.756 0.306 1.251 1.039 1.251 1.854 s -0.495 1.549 -1.251 -1.854 L 45.749 37.46 C 45.509 37.557 45.254 37.605 45 37.605 z"
                                                        style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(0,122,255)', fillRule: 'nonzero', opacity: 1 }}
                                                        transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round"/>
                                                    <path
                                                        d="M 45 90 c -0.393 0 -0.783 -0.116 -1.119 -0.342 C 43.331 89.286 43 88.665 43 88 V 35.605 c 0 -0.815 0.495 -1.549 1.251 -1.854 l 41.593 -16.803 c 0.615 -0.249 1.316 -0.176 1.867 0.196 c 0.552 0.372 0.882 0.993 0.882 1.658 v 52.395 c 0 0.815 -0.495 1.549 -1.251 1.854 L 45.749 89.854 C 45.508 89.952 45.253 90 45 90 z M 47 36.955 v 48.081 l 37.593 -15.187 V 21.768 L 47 36.955 z"
                                                        style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(0,122,255)', fillRule: 'nonzero', opacity: 1 }}
                                                        transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round"/>
                                                    <path
                                                        d="M 45 90 c -0.253 0 -0.508 -0.048 -0.749 -0.146 L 2.659 73.052 c -0.756 -0.306 -1.251 -1.039 -1.251 -1.854 V 18.803 c 0 -0.665 0.331 -1.286 0.882 -1.658 c 0.55 -0.372 1.251 -0.446 1.867 -0.196 l 16.075 6.495 c 1.024 0.414 1.519 1.58 1.105 2.604 c -0.414 1.025 -1.578 1.52 -2.604 1.105 L 5.408 21.768 v 48.081 L 43 85.035 V 36.955 l -14.825 -5.989 c -1.024 -0.414 -1.519 -1.58 -1.105 -2.604 c 0.414 -1.024 1.58 -1.519 2.604 -1.105 l 16.076 6.494 C 46.505 34.057 47 34.79 47 35.605 V 88 c 0 0.665 -0.33 1.286 -0.882 1.658 C 45.783 89.884 45.393 90 45 90 z"
                                                        style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(0,122,255)', fillRule: 'nonzero', opacity: 1 }}
                                                        transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round"/>
                                                    <path
                                                        d="M 28.924 53.036 c -0.253 0 -0.507 -0.048 -0.749 -0.146 l -9.441 -3.813 c -0.756 -0.306 -1.251 -1.039 -1.251 -1.854 V 25.297 c 0 -0.815 0.495 -1.549 1.251 -1.854 L 60.326 6.64 c 0.48 -0.194 1.018 -0.194 1.498 0 l 9.441 3.814 c 0.756 0.306 1.251 1.039 1.251 1.854 s -0.495 1.549 -1.251 1.854 L 30.924 30.46 v 20.576 c 0 0.665 -0.331 1.286 -0.881 1.658 C 29.708 52.92 29.317 53.036 28.924 53.036 z M 21.483 45.874 l 5.441 2.198 v -18.96 c 0 -0.815 0.495 -1.549 1.251 -1.854 l 37.002 -14.948 l -4.103 -1.657 L 21.483 26.646 V 45.874 z"
                                                        style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(0,122,255)', fillRule: 'nonzero', opacity: 1 }}
                                                        transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round"/>
                                                    <path
                                                        d="M 52.372 78.616 c -0.792 0 -1.541 -0.473 -1.855 -1.252 c -0.414 -1.024 0.081 -2.189 1.105 -2.604 l 9.44 -3.813 c 1.025 -0.411 2.19 0.081 2.604 1.105 c 0.414 1.024 -0.081 2.189 -1.105 2.604 l -9.44 3.813 C 52.875 78.568 52.621 78.616 52.372 78.616 z"
                                                        style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(0,122,255)', fillRule: 'nonzero', opacity: 1 }}
                                                        transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round"/>
                                                    <path
                                                        d="M 52.372 71.526 c -0.792 0 -1.541 -0.473 -1.855 -1.252 c -0.414 -1.023 0.081 -2.189 1.105 -2.604 l 9.44 -3.814 c 1.025 -0.411 2.19 0.081 2.604 1.105 c 0.414 1.023 -0.081 2.189 -1.105 2.604 l -9.44 3.814 C 52.875 71.479 52.621 71.526 52.372 71.526 z"
                                                        style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(0,122,255)', fillRule: 'nonzero', opacity: 1 }}
                                                        transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round"/>
                                                    <path
                                                        d="M 52.372 64.436 c -0.792 0 -1.541 -0.473 -1.855 -1.252 c -0.414 -1.024 0.081 -2.189 1.105 -2.604 l 9.44 -3.813 c 1.025 -0.412 2.19 0.081 2.604 1.105 c 0.414 1.024 -0.081 2.189 -1.105 2.604 l -9.44 3.813 C 52.875 64.388 52.621 64.436 52.372 64.436 z"
                                                        style={{ stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(0,122,255)', fillRule: 'nonzero', opacity: 1 }}
                                                        transform=" matrix(1 0 0 1 0 0) " strokeLinecap="round"/></g></svg>
                                        </div>
                                        <p className="delivery-data">Delivery: {product.delivery}</p>
                                    </div>
                                    <div className="price-block">
                                        <h3 className="product-price">${product.price}₴</h3>
                                        <div className="bonuses-block">
                                            <p className="bonuses-amount">+${product.bonus}</p>
                                            <p>bonuses</p>
                                        </div>
                                    </div>
                                    <button
                                        className={`add-to-cart ${!product.available ? 'out-of-stock' : ''}`}
                                        disabled={!product.available}>
                                        {product.available ? 'Into a basket' : 'Not available'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <div id="pagination" className="pagination"></div>

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
                                <li><Link to="/">Information</Link></li>
                                <li><Link to="/">Delivery</Link></li>
                                <li><Link to="/">Guarantee</Link></li>
                                <li><Link to="/">Promotions and discount</Link></li>
                                <li><Link to="/">Public offer</Link></li>
                                <li><Link to="/">Gift Cards</Link></li>
                                <li><Link to="/">Exchanges and returns</Link></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3>Partners</h3>
                            <ul>
                                <li><Link to="/">Information</Link></li>
                                <li><Link to="/">Working conditions</Link></li>
                                <li><Link to="/">Guarantee</Link></li>
                                <li><Link to="/">Public offer</Link></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3>Company</h3>
                            <ul>
                                <li><Link to="/">About Us</Link></li>
                                <li><Link to="/">Contacts</Link></li>
                                <li><Link to="/">Hotline</Link></li>
                                <li><Link to="/">Company policy</Link></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3>Contacts</h3>
                            <p><Link to="/">Address of shops</Link></p>
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
                    <Link to="/">Privacy Policy</Link>
                    <span>|</span>
                    <Link to="/">Terms of Use</Link>
                    <span>|</span>
                    <Link to="/">Sales and Refunds</Link>
                </div>

            </footer>
        </div>
    )
}