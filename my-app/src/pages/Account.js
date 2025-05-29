import React, { useEffect, useState } from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import "./styles/style.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/slider.css";
import "./styles/account.css";
import { doSignOut } from "../firebase/auth";
import {useAuth} from "../context/authContext";
import axios from "axios";


const Account = (props) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const products = props.products;

    const [activeSection, setActiveSection] = useState("profile");
    const [recommendations, setRecommendations] = useState([]);
    const [deliveryDate, setDeliveryDate] = useState("");
    const [user, setUser] = useState({});
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const loyaltyData = {
        levels: [
            { name: "Basic", min: 0, max: 10000 },
            { name: "Medium", min: 10000, max: 30000 },
            { name: "Pro", min: 30000, max: 50000 },
        ],
        currentPoints: user.bonuses || 0,
    };

    const getUserFromDB = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const uid = currentUser.uid;

            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Person.json`);
            const data = res.data || {};

            if (data[uid]) {
                const userData = data[uid];

                const userInfo = {
                    uid: uid, // 🔑 firebase uid
                    id: userData.id, // 🔑 person id (1)
                    address: userData.address,
                    bonuses: userData.bonuses,
                    email: userData.email,
                    fullname: userData.fullname,
                    phone: userData.phone,
                    role: userData.role,
                };

                setUser(userInfo);

                // Завантажуємо замовлення, прив'язані до person.id
                fetchOrders(userData.id);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchOrders = async (personId) => {
        try {
            const [ordersRes, itemsRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_DB_LINK}Order.json`),
                axios.get(`${process.env.REACT_APP_DB_LINK}Order_Item.json`)
            ]);

            const ordersData = ordersRes.data || {};
            const itemsData = itemsRes.data || {};

            const userOrders = Object.values(ordersData)

                .map(order => {
                    const orderItems = Object.values(itemsData).filter(item => item.order_id === order.id);
                    return { ...order, products: orderItems };
                });

            setOrders(userOrders);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        

        // Рекомендации (случайные товары)
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 4));

        getUserFromDB();
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
                : "You have reached the maximum level",
        };
    };

    const loyalty = getLoyaltyInfo();

    const handleLogout = async () => {
        navigate("/", { replace: true });
        await doSignOut();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered":
                return "order-card delivered";
            case "On way":
                return "order-card on-way";
            case "Is being drawn up":
                return "order-card pending";
            default:
                return "order-card";
        }
    };

    const handleSaveChanges = async () => {
        try {
            await axios.patch(`${process.env.REACT_APP_DB_LINK}Person/${user.uid}.json`, {
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                address: user.address,
            });
            setIsEditing(false); // Вихід з режиму редагування
            alert("Дані успішно оновлено");
        } catch (e) {
            console.error(e);
            alert("Помилка при оновленні даних");
        }
    };



    const sections = {
        profile: (
            <div id="account-profile">
                <div className="profile-layout">
                    <div className="profile-box">
                        <img className="avatar" src={auth.currentUser?.photoURL} alt="avatar"/>
                        <div className="profile-name">{user.fullname}</div>
                        <div className="arrow">➤</div>
                    </div>

                    <div className="loyalty-card">
                        <div className="loyalty-header">
                            <h2 className="section-title">Loyalty Program</h2>
                            <div className="loyalty-title">{loyalty.level}</div>
                            <div className="loyalty-progress">{user.bonuses}</div>
                            <div className="loyalty-next-level">{loyalty.message}</div>
                        </div>
                        <div className="progress-bar">
                            <div className="progress" style={{width: `${loyalty.progress}%`}}></div>
                        </div>
                        <div className="loyalty-footer">
                            Learn more about the loyalty program <span className="arrow">➤</span>
                        </div>
                    </div>
                </div>

                <h2 className="section-title">Orders</h2>
                <div className="orders-container">
                    {Array.isArray(orders) && orders.length > 0 ? (
                        orders
                            .filter(order =>
                                order.person === user.id &&
                                (order.status === "On way" || order.status === "In process")
                            )
                            .slice(0, 3)
                            .map((order, index) => (
                                <div key={index} className="order-card">
                                    <img
                                        src={products.find(p => p.id === order.products[0]?.item_id)?.image}
                                        alt="Product"
                                        className="ordered-product-img"
                                    />
                                    <div className="order-info">
                                        <strong>{order.status}</strong>
                                        <div className="light">
                                            {order.delivery_date} {order.delivery_time}
                                        </div>
                                    </div>
                                </div>
                        ))
                    ) : (
                        <p>No current orders in progress.</p>
                    )}
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
                                        <a href="#" className="go-btn">
                                            Go to
                                        </a>
                                        <span className="product-price">{product.price}₴</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        ),

        orders: (
            <div id="account-orders">
                <h2 className="section-title">Orders</h2>
                {orders.length > 0 ? (
                    <div className="orders-container">
                        {orders.map((order, index) => (
                            <div key={index} className={getStatusClass(order.status)}>
                                <div className="order-products">
                                    {order.products.map((item, idx) => {
                                        const product = products.find(p => p.id === item.item_id);
                                        if (!product) return null;
                                        return (
                                            <div key={idx} className="product-card">
                                                <img src={product.image} alt={product.title} className="product-img"/>
                                                <div className="product-details">
                                                    <div className="product-info">
                                                        <h4>{product.title}</h4>
                                                        <p>Price: {product.price}₴</p>
                                                    </div>
                                                    <div className="order-info">
                                                        <strong>{order.status}</strong>
                                                        <div
                                                            className="light">{order.delivery_date} {order.delivery_time}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No current orders in progress.</p>
                )}
            </div>
        ),

        bonuses: <div>[Bonuses Info]</div>,
        privileges: <div>[Privileges Content]</div>,
        favorites: <div>[Favorites]</div>,
        comparison: <div>[Comparison Items]</div>,
        data: user ? (
            <div id="account-details">
                <div className="profile-section">
                    <div className="profile-box">
                        <img
                            className="avatar"
                            src={auth.currentUser?.photoURL || "/default-avatar.png"}
                            alt="User Avatar"
                        />
                        <div className="profile-name">{user.fullname}</div>
                        <div className="arrow">➤</div>
                    </div>

                    <div className="account-details">
                        <div className="header-row">
                            <h2>Account details</h2>
                            {!isEditing && (
                                <button type="button" onClick={() => setIsEditing(true)}>Change</button>
                            )}
                        </div>

                        <form className="details-grid" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <p><strong>Full Name:</strong></p>
                                <p><strong>Account status:</strong></p>
                                <p><strong>Email:</strong></p>
                                <p><strong>Telephone:</strong></p>
                                <p><strong>Address:</strong></p>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={user.fullname}
                                    onChange={(e) => setUser({...user, fullname: e.target.value})}
                                    disabled={!isEditing}
                                />
                                <p>{user.role}</p>
                                <input
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({...user, email: e.target.value})}
                                    disabled={!isEditing}
                                />
                                <input
                                    type="tel"
                                    value={user.phone || ""}
                                    onChange={(e) => setUser({...user, phone: e.target.value})}
                                    disabled={!isEditing}
                                />
                                <input
                                    type="text"
                                    value={user.address || ""}
                                    onChange={(e) => setUser({...user, address: e.target.value})}
                                    disabled={!isEditing}
                                />
                            </div>

                            {isEditing && (
                                <div className="form-actions">
                                    <button type="button" onClick={handleSaveChanges}>Save</button>
                                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        ) : (
            <p>Loading profile...</p>

        ),

        cards: <div>[Gift Cards Info]</div>,
    };

    const navItems = [
        {id: "profile", label: "Personal account"},
        {id: "orders", label: "Orders"},
        {
            id: "bonuses",
            label: (
                <>
                    Bonuses{" "}
                    <span className="bonus-info">
            {user.bonuses} <img src="/images/Group.svg" alt="bonus"/>
          </span>
                </>
            ),
        },
        {id: "privileges", label: "Your privileges"},
        {id: "favorites", label: "Favorites"},
        {id: "comparison", label: "Comparison"},
        {id: "data", label: "Personal data"},
        {id: "cards", label: "Gift Cards"},
        {
            id: "logout",
            label: (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // щоб не активувалась навігація
                        handleLogout(); // викликає вихід
                    }}
                    className="logout-button"
                >
                    <span>Logout</span>
                    <svg
                        fill="#fff"
                        height="20"
                        width="20"
                        viewBox="0 0 490.3 490.3"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3
                          s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6
                          c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1
                          C27.9,58.95,0,86.75,0,121.05z"
                        />
                        <path
                            d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9
                          c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63
                          C380.6,325.15,380.6,332.95,385.4,337.65z"
                        />
                    </svg>
                </button>
            ),
        },
    ];


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
                    {navItems.map(item =>
                        item.id === "logout" ? (
                            <div key={item.id} className="logout-wrapper">
                                {item.label}
                            </div>
                        ) : (
                            <div
                                key={item.id}
                                className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                                onClick={() => setActiveSection(item.id)}
                            >
                                {item.label}
                            </div>
                        )
                    )}
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

export default Account;
