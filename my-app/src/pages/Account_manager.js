import React, { useEffect, useState } from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import { getDatabase, ref, get, child } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./styles/style.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/slider.css";
import "./styles/account_manager.css";
import { useAuth } from "../context/authContext";
import Footer from "./Footer";
import {doSignOut} from "../firebase/auth";


const Account_manager = ({ products }) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("profile");
    const [currentUser, setCurrentUser] = useState(null);
    const [userOrders, setUserOrders] = useState({}); // This holds the raw object from Firebase
    const [orderItems, setOrderItems] = useState({}); // products in orders
    const [orderUserNames, setOrderUserNames] = useState({}); // fullnames of users for orders

    const auth = useAuth(); // Assuming useAuth provides currentUser directly

    const handleLogout = async () => {
        await doSignOut();
        navigate("/", { replace: true }); // Redirect to home after logout
    };

    useEffect(() => {
        const authInstance = getAuth();
        const db = getDatabase();
        const dbRef = ref(db);

        // Load logged-in user data
        const fetchUserData = async () => {
            const user = authInstance.currentUser; // Get current user from Firebase Auth
            if (!user) {
                // If no user is logged in, perhaps redirect or show a login message
                setCurrentUser(null);
                return;
            }

            try {
                const snapshot = await get(child(dbRef, `Person/${user.uid}`));
                if (snapshot.exists()) {
                    setCurrentUser(snapshot.val());
                } else {
                    console.log("No user data found for UID:", user.uid);
                    setCurrentUser(null); // Or set a default user object if desired
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setCurrentUser(null);
            }
        };

        // Load orders, order items, and user full names for these orders
        const fetchOrdersAndItems = async () => {
            const db = getDatabase();
            const dbRef = ref(db);

            try {
                // Load orders
                const orderSnap = await get(child(dbRef, "Order"));
                const ordersData = orderSnap.val() || {}; // This is an object
                setUserOrders(ordersData); // Store the object

                // Load all users
                const usersSnap = await get(child(dbRef, "Person"));
                const users = usersSnap.val() || {};

                // Create a map userId (number) -> fullname
                const userNames = {};
                Object.values(users).forEach((user) => {
                    if (user && user.id !== undefined) { // Check if user and user.id exist
                        userNames[user.id] = user.fullname || "Unknown User";
                    }
                });
                setOrderUserNames(userNames);

                // Load items in orders
                const orderItemSnap = await get(child(dbRef, "Order_Item"));
                const orderItemData = orderItemSnap.val() || {};

                // Get unique item_id from order items
                const itemIds = [
                    ...new Set(
                        Object.values(orderItemData)
                            .map((item) => item.item_id)
                            .filter(Boolean)
                    ),
                ];

                const itemData = {};
                // Load product data
                for (let id of itemIds) {
                    const itemSnap = await get(child(dbRef, `Item/${id}`));
                    if (itemSnap.exists()) {
                        itemData[id] = itemSnap.val();
                    }
                }

                // Group items by order_id
                const groupedByOrder = {};
                Object.values(orderItemData).forEach((orderItem) => {
                    const { order_id } = orderItem;
                    if (order_id !== undefined) { // Ensure order_id exists
                        if (!groupedByOrder[order_id]) groupedByOrder[order_id] = [];
                        groupedByOrder[order_id].push({
                            ...orderItem,
                            item: itemData[orderItem.item_id], // Attach actual item data
                        });
                    }
                });
                setOrderItems(groupedByOrder);

            } catch (error) {
                console.error("Error fetching orders and items:", error);
            }
        };

        fetchUserData();
        fetchOrdersAndItems();
    }, [auth.currentUser]); // Re-run effect if auth.currentUser changes


    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered":
                return "order-card delivered";
            case "On way":
                return "order-card on-way";
            case "In process": // Changed from "Is being drawn up" based on previous Cart.js logic
                return "order-card pending";
            default:
                return "order-card";
        }
    };

    // THIS IS THE KEY CHANGE: Removed the .filter() method
    const ordersArray = Object.keys(userOrders)
        .map(key => ({ id: key, ...userOrders[key] }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first


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
                            <p>
                                <strong>Bonuses:</strong>
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
            <div id="order_manager">
                <h2 className="section-title">Orders</h2>
                {ordersArray.length > 0 ? ( // Use ordersArray
                    <div className="orders-container">
                        {ordersArray.map((order) => { // Use ordersArray.map
                            const productsInOrder = orderItems[order.id] || []; // Get items for this order

                            const totalSum = productsInOrder.reduce((sum, item) => {
                                // `item.total` already holds the total price for that order_item (amount * price)
                                return sum + (item.total || 0);
                            }, 0);

                            const maxVisible = 3;
                            const displayedProducts = productsInOrder.slice(0, maxVisible);
                            const extraCount = productsInOrder.length - maxVisible;

                            return (

                                <div
                                    key={order.id}
                                    className={`order-card ${getStatusClass(order.status)}`}
                                >
                                    <div className="order-images">
                                        {productsInOrder.length === 1 && productsInOrder[0].item ? (
                                            <img
                                                src={productsInOrder[0].item.image}
                                                alt={productsInOrder[0].item.title}
                                                className="order-single-image"
                                            />
                                        ) : (
                                            <div className="order-images-grid">
                                                {displayedProducts.map((item, idx) =>
                                                    item.item ? (
                                                        <img
                                                            key={idx}
                                                            src={item.item.image}
                                                            alt={item.item.title}
                                                        />
                                                    ) : null
                                                )}
                                                {extraCount > 0 && (
                                                    <div className="order-more-images">
                                                        +{extraCount}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="order-info">
                                        <strong className="order-status">
                                            {order.status}
                                        </strong>
                                        <div className="order-id">
                                            Order ID: {order.id}
                                        </div>
                                        <div className="order-delivery-date">
                                            Delivery: {order.delivery_date} {order.delivery_time}
                                        </div>
                                        {order.person && orderUserNames[order.person] && (
                                            <div className="order-customer">
                                                Customer: {orderUserNames[order.person]}
                                            </div>
                                        )}
                                        <div className="order-total-sum">
                                            Total: {totalSum.toFixed(2)}₴
                                        </div>
                                    </div>
                                </div>

                            );
                        })}
                    </div>
                ) : (
                    <p>No current orders in progress.</p>
                )}
            </div>
        ),

        dashboard: (
            <div className="dashboard">
                <h2>Dashboard</h2>
                <p>Additional dashboard data here...</p>
            </div>
        ),
        "content management": (
            <div className="content-management-section">
                <h2>Content Management</h2>
                <p>This section is for managing content, e.g., product listings, categories, etc.</p>
                {/* You can add forms/tables for content management here */}
            </div>
        )
    };

    const navItems = [
        {id: "profile", label: "Personal account"},
        {id: "orders", label: "Orders"},
        {id: "dashboard", label: "Dashboard"},
        {id: "content management", label: "Content management"},
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
        <div id="account-manager">

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

            <Footer/>
        </div>
    );
};

export default Account_manager;