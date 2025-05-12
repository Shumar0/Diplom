import React, { useEffect, useState } from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import "./styles/style.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/slider.css";
import "./styles/account.css";
import { doSignOut } from "../firebase/auth";


const Account = (props) => {

    const navigate = useNavigate();

    const loyaltyData = {
        levels: [
            { name: "Basic", min: 0, max: 10000 },
            { name: "Medium", min: 10000, max: 30000 },
            { name: "Pro", min: 30000, max: 50000 }
        ],
        currentPoints: 1
    };

    const products = props.products;

    const [activeSection, setActiveSection] = useState("profile");
    const [recommendations, setRecommendations] = useState([]);
    const [deliveryDate, setDeliveryDate] = useState("");

    useEffect(() => {
        // Встановлення доставки
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        const day = tomorrow.getDate();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        setDeliveryDate(`We'll deliver in ${day} ${monthNames[tomorrow.getMonth()]} 10:00 – 22:00`);

        // Рекомендації
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 4));
    }, []);

    const getLoyaltyInfo = () => {
        const { currentPoints, levels } = loyaltyData;
        let currentLevel = levels[0];
        let nextLevel = levels[1] || null;

        for (let i = 0; i < levels.length; i++) {
            if (currentPoints >= levels[i].min) {
                currentLevel = levels[i];
                nextLevel = levels[i + 1] || null;
            }
        }

        const progress = nextLevel
            ? ((currentPoints - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
            : 100;

        return {
            level: currentLevel.name,
            points: currentPoints,
            progress: progress.toFixed(1),
            message: nextLevel
                ? `Need ${nextLevel.min - currentPoints} more points to reach ${nextLevel.name}`
                : "You have reached the maximum level"
        };
    };

    const loyalty = getLoyaltyInfo();

    const sections = {
        profile: (
            <div id="account">
                <div className="profile-layout">
                    <div className="profile-box">
                        <div className="avatar"></div>
                        <div className="profile-name">Profile Name</div>
                        <div className="arrow">➤</div>
                    </div>
                    <div className="loyalty-card">
                        <div className="loyalty-header">
                            <h2 className="section-title">Loyalty Program</h2>
                            <div className="loyalty-title">{loyalty.level}</div>
                            <div className="loyalty-progress">{loyalty.points}</div>
                            <div className="loyalty-next-level">{loyalty.message}</div>
                        </div>
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${loyalty.progress}%` }}></div>
                        </div>
                        <div className="loyalty-footer">
                            Learn more about the loyalty program <span className="arrow">➤</span>
                        </div>
                    </div>
                </div>

                <h2 className="section-title">Orders</h2>
                <div className="order-card">
                    <img src="/images/144249716-Photoroom.png" alt="Product" />
                    <div className="order-info">
                        <strong>On the way</strong>
                        <div className="light">{deliveryDate}</div>
                    </div>
                </div>

                <section className="recommend-section">
                    <h2 className="section-title">You may like</h2>
                    <div className="recommend-grid">
                        {recommendations.map((product, i) => (
                            <div key={i} className="recommend-card">
                                <div className="card-top">
                                    <button className="like-btn">♡</button>
                                </div>
                                <img src={product.image} alt={product.title} className="product-img"/>
                                <div className="product-info">
                                    <p className="product-category">{product.category}</p>
                                    <h3 className="product-title">{product.title}</h3>

                                    <div className="card-bottom">
                                        <a href="#" className="go-btn">Go to</a>
                                        <span className="product-price">{product.price}₴</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        ),
        orders: <div>[Order Info]</div>,
        bonuses: <div>[Bonuses Info]</div>,
        privileges: <div>[Privileges Content]</div>,
        favorites: <div>[Favorites]</div>,
        comparison: <div>[Comparison Items]</div>,
        data: <div>[Personal Data Form]</div>,
        cards: <div>[Gift Cards Info]</div>
    };

    const navItems = [
        {id: "profile", label: "Personal account"},
        {id: "orders", label: "Orders" },
        { id: "bonuses", label: <>Bonuses <span className="bonus-info">0 <img src="/images/Group.svg" alt="bonus" /></span></> },
        { id: "privileges", label: "Your privileges" },
        { id: "favorites", label: "Favorites" },
        { id: "comparison", label: "Comparison" },
        { id: "data", label: "Personal data" },
        { id: "cards", label: "Gift Cards" }
    ];

    const handleLogout = async () => {
        navigate("/", { replace: true });
        await doSignOut();
    };

    return (
        <div id="account">
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
                <button onClick={handleLogout}>Logout</button>
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

export default Account;
