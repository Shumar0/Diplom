import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/style.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/slider.css";
import "./styles/account_manager.css";


const Account_manager = (props) => {

    const products = props.products;

    const users = {
        user1: {
            fullName: "John Smith",
            statuses: ["Admin"],
            email: "john.smith@example.com",
            telephone: "+1 234 567 8900"
        },
        user2: {
            fullName: "Emily Johnson",
            statuses: ["Manager"],
            email: "emily.johnson@example.com",
            telephone: "+1 987 654 3210"
        }
    };

    const orders = [
        {
            id: 1,
            name: 'Marc Arnold',
            address: 'Poltava city, M. Kotsiubynskyi lane, 18',
            delivery: 'by courier on May 25 at 15:00',
            status: 'On way',
            productId: 1
        },
        {
            id: 2,
            name: 'Marc Arnold',
            address: 'Poltava city, M. Kotsiubynskyi lane, 18',
            delivery: 'by courier on May 25 at 15:00',
            status: 'Delivered',
            productId: 1
        },
        {
            id: 3,
            name: 'Marc Arnold',
            address: 'Poltava city, M. Kotsiubynskyi lane, 18',
            delivery: 'by courier on May 25 at 15:00',
            status: 'Is being drawn up',
            productId: 1
        }
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Delivered':
                return 'order-card delivered';
            case 'On way':
                return 'order-card on-way';
            case 'Is being drawn up':
                return 'order-card pending';
            default:
                return 'order-card';
        }
    };

    const loggedInUserId = "user2";

    const currentUser = users[loggedInUserId];

    const [activeSection, setActiveSection] = useState("profile");


    const sections = {
        profile: (
            <div className="profile-section">
                <div className="profile-box">
                    <div className="avatar"></div>
                    <div className="profile-name">{currentUser.fullName}</div>
                    <div className="arrow">➤</div>
                </div>

                <div className="account-details">
                    <h2>Account details</h2>
                    <div className="details-grid">
                        <div>
                            <p><strong>Full Name:</strong></p>
                            <p><strong>Account status:</strong></p>
                            <p><strong>Email:</strong></p>
                            <p><strong>Telephone:</strong></p>
                        </div>
                        <div>
                            <p>{currentUser.fullName}</p>
                            <p>{currentUser.statuses.join(", ")}</p>
                            <p>{currentUser.email}</p>
                            <p>{currentUser.telephone}</p>
                        </div>
                    </div>
                </div>
            </div>
        ),
        orders: (
            <div className="orders-section">
                <h2>User Orders</h2>
                <div className="orders-grid">
                    {orders.map(order => {
                        const product = products.find(p => p.id === order.productId);
                        return (
                            <div className={getStatusClass(order.status)} key={order.id}>
                                <div className="image-wrapper">
                                    {product && (
                                        <img className="order-image" src={product.image} alt={product.title}/>
                                    )}
                                </div>
                                <div className="order-details">
                                    <p><strong>Name:</strong> {order.name}</p>
                                    <p>
                                        <strong>Address:</strong>
                                        <span>{order.address}</span>
                                    </p>
                                    <p><strong>Delivery:</strong> {order.delivery}</p>
                                    <p><strong>Delivery status:</strong> {order.status}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ),
    };

    const navItems = [
        {id: "profile", label: "Personal account"},
        {id: "orders", label: "Orders"},
        {id: "dashboard", label: "Dashboard"},
        {id: "content management", label: "Content management"},
    ];

    return (
        <div id="account-manager">
            {/* ...Header code... */}
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
            <div id="search-results"></div>


            <div className="account-wrapper">
                <div className="navigation-container">
                    {navItems.map(item => (
                        <div
                            key={item.id}
                            className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>

                <div className="account-content">
                    {sections[activeSection]}
                </div>
            </div>

            {/* ...Footer code... */}
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
    );
};

export default Account_manager;
