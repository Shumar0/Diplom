import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDatabase, ref, get, child } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./styles/style.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/slider.css";
import "./styles/account_manager.css";
import Header from './Header';
import {useAuth} from "../context/authContext";


const Account_manager = ({ products }) => {
    const [activeSection, setActiveSection] = useState("profile");
    const [currentUser, setCurrentUser] = useState(null);
    const [userOrders, setUserOrders] = useState({});
    const [orderItems, setOrderItems] = useState({}); // товари в замовленнях
    const [orderUserNames, setOrderUserNames] = useState({}); // fullname користувачів для замовлень


    const auth = useAuth();

    useEffect(() => {
        const authInstance = getAuth();
        const db = getDatabase();
        const dbRef = ref(db);

        // Завантажуємо дані залогіненого користувача
        const fetchUserData = async () => {
            const user = authInstance.currentUser;
            if (!user) return;

            const snapshot = await get(child(dbRef, `Person/${user.uid}`));
            if (snapshot.exists()) {
                setCurrentUser(snapshot.val());
            }
        };

        // Завантажуємо замовлення, товари у замовленнях і повні імена користувачів для цих замовлень
        const fetchOrdersAndItems = async () => {
            const db = getDatabase();
            const dbRef = ref(db);

            // Загружаем заказы
            const orderSnap = await get(child(dbRef, "Order"));
            const orders = orderSnap.val() || {};
            setUserOrders(orders);

            // Загружаем всех пользователей
            const usersSnap = await get(child(dbRef, "Person"));
            const users = usersSnap.val() || {};

            // Создаем словарь userId (число) -> fullname
            const userNames = {};
            Object.values(users).forEach((user) => {
                if (user.id !== undefined) {
                    userNames[user.id] = user.fullname || "Unknown User";
                }
            });
            setOrderUserNames(userNames);

            // Загружаем товары в заказах
            const orderItemSnap = await get(child(dbRef, "Order_Item"));
            const orderItemData = orderItemSnap.val() || {};

            // Получаем уникальные item_id
            const itemIds = [
                ...new Set(
                    Object.values(orderItemData)
                        .map((item) => item.item_id)
                        .filter(Boolean)
                ),
            ];

            const itemData = {};
            // Загружаем данные о товарах
            for (let id of itemIds) {
                const itemSnap = await get(child(dbRef, `Item/${id}`));
                if (itemSnap.exists()) {
                    itemData[id] = itemSnap.val();
                }
            }

            // Группируем товары по order_id
            const groupedByOrder = {};
            Object.values(orderItemData).forEach((orderItem) => {
                const { order_id } = orderItem;
                if (!groupedByOrder[order_id]) groupedByOrder[order_id] = [];
                groupedByOrder[order_id].push({
                    ...orderItem,
                    item: itemData[orderItem.item_id],
                });
            });

            setOrderItems(groupedByOrder);
        };

        fetchUserData();
        fetchOrdersAndItems();
    }, []);

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

    const sections = {
        profile: currentUser ? (
            <div className="profile-section">
                <div className="profile-box">
                    <img
                        className="avatar"
                        src={auth.currentUser?.photoURL || "/default-avatar.png"}
                        alt="User Avatar"
                    />
                    <div className="profile-name">{currentUser.fullname}</div>
                    <div className="arrow">➤</div>
                </div>
                <div className="account-details">
                    <h2>Account details</h2>
                    <div className="details-grid">
                        <div>
                            <p>
                                <strong>Full Name:</strong>
                            </p>
                            <p>
                                <strong>Account status:</strong>
                            </p>
                            <p>
                                <strong>Email:</strong>
                            </p>
                            <p>
                                <strong>Telephone:</strong>
                            </p>
                        </div>
                        <div>
                            <p>{currentUser.fullname}</p>
                            <p>{currentUser.role}</p>
                            <p>{currentUser.email}</p>
                            <p>{currentUser.phone || "—"}</p>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <p>Loading profile...</p>
        ),

        orders: (
            <div className="orders-section">
                <h2>User Orders</h2>
                <div className="orders-grid">
                    {Object.entries(userOrders).map(([key, order]) => (
                        <div
                            className={getStatusClass(order.status || "Is being drawn up")}
                            key={key}
                        >
                            {/* Вивід товарів із зображеннями */}
                            <div className="ordered-products-list">
                                {orderItems[order.id] &&
                                    orderItems[order.id].map((orderItem, index) => (
                                        <div key={index} className="ordered-product">
                                            <img
                                                src={orderItem.item?.image || "/no-image.png"}
                                                alt={orderItem.item?.title || "Product"}
                                                className="order-image"
                                            />
                                        </div>
                                    ))}
                            </div>

                            {/* Інформація про користувача і замовлення */}
                            <div className="order-details">
                                <p>
                                    <strong>User:</strong> {orderUserNames[order.person] || "Loading..."}
                                </p>
                                <p>
                                    <strong>Address:</strong> {order.address}
                                </p>
                                <p>
                                    <strong>Delivery:</strong> {order.delivery_way} {order.delivery_time}
                                </p>
                                <p>
                                    <strong>Status:</strong> {order.status || "Is being drawn up"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),

        dashboard: (
            <div className="dashboard">
                <h2>Dashboard</h2>
                <p>Additional dashboard data here...</p>
            </div>
        ),
    };

    const navItems = [
        { id: "profile", label: "Personal account" },
        { id: "orders", label: "Orders" },
        { id: "dashboard", label: "Dashboard" },
        { id: "content management", label: "Content management" },
    ];

    return (
        <div id="account-manager">

            <Header />
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
