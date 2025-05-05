import React from "react";
import './styles/style.css'
// import './styles/reset.css'
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

                <div className="products" id="product-list"></div>

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