import React, { useEffect, useState } from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import "./styles/style.css";
import "./styles/slider.css";
import "./styles/account.css";
import { doSignOut } from "../firebase/auth";
import {useAuth} from "../context/authContext";
import axios from "axios";
import Footer from "./Footer";

import Bonus from "./Bonus";


const Account = (props) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const products = props.products; // Products prop is likely the list of all items from your DB

    const [activeSection, setActiveSection] = useState("profile");
    const [recommendations, setRecommendations] = useState([]);
    const [user, setUser] = useState({});
    const [orders, setOrders] = useState([]); // This will hold user-specific orders with their items
    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: "" });

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

            // Fetch user data directly from their UID path
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Person/${uid}.json`);
            const userData = res.data; // data will be null if no user is found

            if (userData) {
                const userInfo = {
                    uid: uid, // Use Firebase Auth UID here
                    id: userData.id, // This is your internal numeric ID
                    address: userData.address,
                    bonuses: userData.bonuses,
                    email: userData.email,
                    fullname: userData.fullname,
                    phone: userData.phone,
                    role: userData.role,
                };

                setUser(userInfo);

                // Load orders tied to person.id
                // Ensure personId passed here is the internal numeric ID from your DB
                fetchOrders(userData.id);
            } else {
                console.log("No user data found for current UID.");
                // Optionally redirect to login or show a message
            }
        } catch (e) {
            console.error("Error fetching user from DB:", e);
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

            // Filter orders belonging to this user (by personId)
            const userOrders = Object.values(ordersData)
                .filter(order => String(order.person) === String(personId)) // IMPORTANT: Ensure types match
                .map(order => {
                    // Attach order items to each order
                    const orderItemsForThisOrder = Object.values(itemsData).filter(item => item.order_id === order.id);

                    // For each order item, find the full product details from the 'products' prop
                    const productsWithDetails = orderItemsForThisOrder.map(orderItem => {
                        const productDetail = products.find(p => p.id === orderItem.item_id);
                        return {
                            ...orderItem,
                            // Add item details, handling cases where product might not be found
                            item: productDetail || { title: "Unknown Product", image: "/default-product.png", price: 0 }
                        };
                    });
                    return { ...order, products: productsWithDetails };
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

            setOrders(userOrders);
        } catch (e) {
            console.error("Error fetching orders:", e);
        }
    };

    useEffect(() => {
        getUserFromDB(); // Call this to fetch user data and then their orders

        // Recommendations (random products)
        if (products && products.length > 0) {
            const shuffled = [...products].sort(() => 0.5 - Math.random());
            setRecommendations(shuffled.slice(0, 4));
        }
    }, [auth.currentUser, products]); // Re-run effect if current user or products change

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
        await doSignOut();
        navigate("/", { replace: true }); // Redirect to home after logout
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
            setIsEditing(false);
            setToast({ visible: true, message: "Data has been successfully updated" });
            setTimeout(() => setToast({ visible: false, message: "" }), 3000);
        } catch (e) {
            console.error("Error saving changes:", e);
            setToast({ visible: true, message: "Error updating data" });
            setTimeout(() => setToast({ visible: false, message: "" }), 3000);
        }
    };

    const sections = {
        profile: (
            <div id="account-profile">
                <div className="profile-layout">
                    <div className="profile-box">
                        <img
                            className="avatar"
                            src={auth.currentUser?.photoURL || "/default-avatar.png"}
                            alt="User Avatar"
                        />
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

                <h2 className="section-title">Current Orders</h2>
                <div className="orders-container">
                    {Array.isArray(orders) && orders.length > 0 ? (
                        orders
                            .filter(order =>
                                order.status === "On way" || order.status === "Is being drawn up"
                            )
                            .slice(0, 3)
                            .map((order) => (
                                <div key={order.id} className={`order-card ${getStatusClass(order.status)}`}>
                                    {order.products && order.products.length > 0 && (
                                        <img
                                            src={
                                                order.products?.[0]?.item
                                                    ? (Array.isArray(order.products[0].item.image) && order.products[0].item.image.length > 0
                                                        ? order.products[0].item.image[0]
                                                        : order.products[0].item.image || "/default-product.png")
                                                    : "/default-product.png"
                                            }
                                            alt={order.products?.[0]?.item?.title || "Product"}
                                            className="ordered-product-img"
                                            style={{
                                                objectFit: 'contain',
                                                borderRadius: '8px',
                                                width: '120px',
                                                height: '120px'
                                            }}
                                        />
                                    )}
                                    <div className="order-info">
                                        <strong>{order.status}</strong>
                                        <div className="light">
                                            {order.delivery_date} {order.delivery_time}
                                        </div>
                                        <div className="order-total-sum">
                                        Total: {order.products.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2)}₴
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
                                <img
                                    src={Array.isArray(product.image) ? product.image[0] : product.image}
                                    alt={product.title} className="product-img"
                                />
                                <div className="product-info">
                                    <p className="product-category">{product.category}</p>
                                    <h3 className="product-title">{product.title}</h3>

                                    <div className="card-bottom">
                                        <Link to={`/product/${product.id}`} className="go-btn">
                                            Go to
                                        </Link>
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
                <h2 className="section-title">My Orders</h2>
                {orders.length > 0 ? (
                    <div className="orders-container">
                        {orders.map((order) => {
                            const productsInOrder = order.products || [];

                            const totalSum = productsInOrder.reduce((sum, item) => {
                                return sum + (item.total || 0);
                            }, 0);

                            const maxVisible = 3;
                            const displayedProducts = productsInOrder.slice(0, maxVisible);
                            const extraCount = productsInOrder.length - maxVisible;

                            // Функція для безпечного отримання першого зображення
                            const getFirstImage = (image) => {
                                if (!image) return "/default-product.png"; // дефолтне зображення
                                if (Array.isArray(image) && image.length > 0) return image[0];
                                if (typeof image === "string") return image;
                                return "/default-product.png";
                            };

                            return (
                                <div key={order.id} className={`order-card ${getStatusClass(order.status)}`}>
                                    <div className="order-images">
                                        {productsInOrder.length === 1 && productsInOrder[0].item ? (
                                            <img
                                                src={getFirstImage(productsInOrder[0].item.image)}
                                                alt={productsInOrder[0].item.title || "Product"}
                                                className="order-single-image"
                                            />
                                        ) : (
                                            <div className="order-images-grid">
                                                {displayedProducts.map((item, idx) =>
                                                    item.item ? (
                                                        <img
                                                            key={idx}
                                                            src={getFirstImage(item.item.image)}
                                                            alt={item.item.title || "Product"}
                                                        />
                                                    ) : null
                                                )}
                                                {extraCount > 0 && (
                                                    <div className="order-more-images">+{extraCount}</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="order-info" style={{ flexGrow: 1 }}>
                                        <strong className="order-status">{order.status}</strong>
                                        <div className="order-delivery-date">
                                            Delivery: {order.delivery_date} {order.delivery_time}
                                        </div>
                                        <div className="order-total-sum">
                                            Total: {totalSum.toFixed(2)}₴
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>You have no orders to display.</p>
                )}
            </div>
        ),


        bonuses: <div>[Bonuses Content]</div>,
        privileges: <div>[Privileges Content]</div>,
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
                            {isEditing ? (
                                <div className="edit-buttons">
                                    <button type="button" onClick={handleSaveChanges}>Save</button>
                                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            ) : (
                                <button type="button" onClick={() => setIsEditing(true)}>Change</button>
                            )}
                        </div>
                        <form id="account-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="details-row">
                                <p><strong>Full Name:</strong></p>
                                <input
                                    type="text"
                                    value={user.fullname || ''}
                                    onChange={(e) => setUser({...user, fullname: e.target.value})}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="details-row">
                                <p><strong>Account status:</strong></p>
                                <p className="static-field">{user.role}</p>
                            </div>
                            <div className="details-row">
                                <p><strong>Email:</strong></p>
                                <input
                                    type="email"
                                    value={user.email || ''}
                                    onChange={(e) => setUser({...user, email: e.target.value})}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="details-row">
                                <p><strong>Telephone:</strong></p>
                                <input
                                    type="tel"
                                    value={user.phone || ""}
                                    onChange={(e) => setUser({...user, phone: e.target.value})}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="details-row">
                                <p><strong>Address:</strong></p>
                                <input
                                    type="text"
                                    value={user.address || ""}
                                    onChange={(e) => setUser({...user, address: e.target.value})}
                                    disabled={!isEditing}
                                />
                            </div>
                        </form>
                    </div>
                </div>
                {toast.visible && (
                    <div className="toast-notification">
                        {toast.message}
                    </div>
                )}
            </div>
        ) : (
            <p>Loading profile...</p>

        ),

        cards: <div>[Gift Cards Info]</div>,
    };

    const navItems = [
        {id: "profile", label: "Personal account"},
        {id: "orders", label: "Orders"},
        {id: "bonuses",
            label: (
                <>Bonuses{" "} <span className="bonus-info"> {user.bonuses} <Bonus fillColor="#007AFF" width={24} height={24} /> </span> </>
            ),
        },
        {id: "privileges", label: "Your privileges"},
        {id: "data", label: "Personal data"},
        {id: "cards", label: "Gift Cards"},
        {
            id: "logout",
            label: (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
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

            <Footer />
        </div>
    );
};

export default Account;