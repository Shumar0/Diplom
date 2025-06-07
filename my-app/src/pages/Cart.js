import React, { useState, useEffect } from 'react';
import { Link, replace, useNavigate } from 'react-router-dom';
import './styles/style.css';
import './styles/breadcrumb.css';
import './styles/footer.css';
import './styles/cart.css';
import { useAuth } from "../context/authContext";
import axios from "axios";
import Header from './Header';
import * as emailjs from "emailjs-com";

export default function Cart(props) {

    const { userLoggedIn } = useAuth();
    const auth = useAuth();

    const [user, setUser] = useState({});
    const [cartItems, setCartItems] = useState([]);

    const [userName, setUserName] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState("Credit card");
    const [deliveryMethod, setDeliveryMethod] = useState("By courier");
    const [deliveryTime, setDeliveryTime] = useState("09:00–12:00");

    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Person/${auth.currentUser.uid}.json`);
            setUser(res.data);
            console.log(res.data);
            setUserName(res.data.fullname);
            setAddress(res.data.address);
        } catch (e) {
            console.log(e);
        }
    };

    const fetchUserById = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Person.json`);
            const data = res.data;

            if (!data) {
                return null; // Return null if no data
            }

            for (let key in data) {
                if (data[key]) {
                    if (key === auth.currentUser.uid) {
                        return data[key].id;
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            return null;
        }
    };

    const getProductsFromCart = () => {
        const cartString = localStorage.getItem('cart');
        let cartData = cartString ? JSON.parse(cartString) : [];
        console.log(cartData);
        setCartItems(cartData);
    };

    useEffect(() => {
        getProductsFromCart();
        if (userLoggedIn) {
            fetchUser();
        }
    }, [userLoggedIn]); // Added userLoggedIn to dependency array for clarity

    // This useEffect will correctly update the summary whenever cartItems changes
    useEffect(() => {
        updateSummary();
    }, [cartItems]);

    const updateQuantity = (index, delta) => {
        setCartItems(currentCartItems => {
            const newCartItems = [...currentCartItems];
            if (newCartItems[index]) {
                const currentAmount = newCartItems[index].amount;
                const maxAmount = newCartItems[index].item.amount_on_stock || Infinity;

                let newAmount = currentAmount + delta;
                if (newAmount < 1) newAmount = 1;
                if (newAmount > maxAmount) newAmount = maxAmount;

                newCartItems[index].amount = newAmount;
                newCartItems[index].total_price = newAmount * newCartItems[index].item.price;
            }

            localStorage.setItem('cart', JSON.stringify(newCartItems));
            return newCartItems;
        });
    };

    const removeItem = (itemId) => {
        const updatedCart = cartItems.filter(item => item.item.id !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const updateSummary = () => {
        let itemCount = 0;
        let subtotal = 0;
        let totalDiscount = 0;

        cartItems.forEach(cartItem => {
            const item = cartItem.item;
            if (item.available && cartItem.amount > 0) {
                itemCount += cartItem.amount;
                subtotal += item.price * cartItem.amount;
                if (item.discount > 0) {
                    totalDiscount += Math.round((item.price * cartItem.amount) * (item.discount / 100));
                }
            }
        });

        const total = subtotal - totalDiscount;

        document.getElementById("item-count").textContent = itemCount;
        document.getElementById("subtotal").textContent = `${subtotal}₴`;
        document.getElementById("discount").textContent = `-${totalDiscount}₴`;
        document.getElementById("total").textContent = `${total}₴`;
    };

    const renderCartItems = () => {
        if (cartItems.length === 0) {
            return <p className="empty-cart-message">Your cart is empty</p>;
        }

        const categoryMap = {};
        cartItems.forEach(cartItem => {
            const item = cartItem.item;
            if (!categoryMap[item.category]) {
                categoryMap[item.category] = [];
            }
            categoryMap[item.category].push(cartItem);
        });

        const cartItemElements = [];
        for (const category in categoryMap) {
            const categoryItems = categoryMap[category];
            const count = categoryItems.reduce((acc, cartItem) => acc + cartItem.amount, 0);
            const total = categoryItems.reduce((acc, cartItem) => acc + cartItem.amount * cartItem.item.price, 0);

            cartItemElements.push(
                <div key={category} id="category-header">
                    <h3>{category}</h3>
                    <p>({count}) {total}₴</p>
                </div>
            );

            categoryItems.forEach((cartItem) => {
                const item = cartItem.item;
                const newPrice = item.price - Math.round(item.price * item.discount / 100);

                // Используем indexOf для корректного индекса
                const cartIndex = cartItems.indexOf(cartItem);

                cartItemElements.push(
                    <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.title} />
                        <div className="cart-item-details">
                            <div className="cart-item-title">{item.title}</div>
                            <div className="cart-item-desc">{item.desc}</div>
                        </div>
                        <div className="cart-item-actions">
                            <div className="quantity-control">
                                <button onClick={() => updateQuantity(cartIndex, -1)}>-</button>
                                <span>{cartItem.amount}</span>
                                <button onClick={() => updateQuantity(cartIndex, 1)}>+</button>
                            </div>
                            <div className="cart-item-price">
                                {item.discount > 0 ? (
                                    <>
                                        <span className="current-price">{newPrice * cartItem.amount}₴</span><br />
                                        <span className="old-price">{item.price * cartItem.amount}₴</span>
                                    </>
                                ) : (
                                    <span className="current-price">{item.price * cartItem.amount}₴</span>
                                )}
                            </div>
                            <button className="delete-btn" onClick={() => removeItem(item.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                );
            });
        }
        return cartItemElements;
    };

    const getLastOrderId = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}/Order.json`);
            let maxId = 0;
            for (const key in res.data) {
                if (res.data[key]) {
                    const currentId = parseInt(res.data[key].id, 10);
                    if (!isNaN(currentId) && currentId > maxId) {
                        maxId = currentId;
                    }
                }
            }
            return maxId + 1;
        } catch (e) {
            console.error(e);
            return 1; // Fallback to 1 if fetching orders fails
        }
    };

    function getNextDay(date = new Date()) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 2);
        return nextDay.toISOString().split('T')[0];
    }

    const createOrder = async () => {
        if (userName.trim().length < 1) {
            alert("Please enter your full name.");
            return;
        }
        if (address.trim().length < 1) {
            alert("Please enter your address.");
            return;
        }
        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add items before placing an order.");
            return;
        }

        const id = await getLastOrderId();

        const order = {
            address: address,
            date: new Date().toISOString(),
            delivery_time: deliveryTime,
            delivery_date: getNextDay(),
            delivery_way: deliveryMethod,
            payment_way: paymentMethod,
            person: userLoggedIn ? await fetchUserById() : "",
            person_email: user.email || "", // Use user.email if logged in, otherwise empty
            status: "In process",
            id: id
        };

        try {
            await axios.post(`${process.env.REACT_APP_DB_LINK}/Order.json`, order);
            console.log("Order has been created");
        } catch (e) {
            console.error("Error creating order:", e);
            alert("Failed to create order. Please try again.");
            return;
        }

        let bonuses = 0;
        // Use cartItems state directly, as it's the source of truth
        for (const cartItem of cartItems) {
            const item = {
                amount: cartItem.amount,
                item_id: parseInt(cartItem.item.id, 10),
                order_id: id,
                total: cartItem.total_price
            };

            bonuses += parseInt(cartItem.total_price, 10) || 0;

            try {
                await axios.post(`${process.env.REACT_APP_DB_LINK}/Order_Item.json`, item);
                console.log("Item has been added to order");
            } catch (e) {
                console.error(`Error adding item ${cartItem.item.id} to order:`, e);
            }
        }

        bonuses = Math.floor(bonuses / 100);
        console.log('Calculated bonuses:', bonuses);

        if (userLoggedIn && auth.currentUser.uid) { // Only update bonuses if user is logged in
            const newUser = {
                ...user,
                bonuses: (user.bonuses || 0) + bonuses
            };

            try {
                await axios.put(`${process.env.REACT_APP_DB_LINK}/Person/${auth.currentUser.uid}.json`, newUser);
                console.log("User bonuses updated");
            } catch (e) {
                console.error("Error updating user bonuses:", e);
            }
        }

        const email = user.email;
        const customerName = userName;

        const itemsHtml = cartItems.map(({ item, amount, total_price }) => ( // Use cartItems
            `<tr style="border-bottom: 1px solid #ddd;">
                 <td style="padding: 10px;"><img src="${item.image}" alt="${item.name}" width="64" style="border-radius: 4px;" /></td>
                 <td style="padding: 10px;">
                   <div style="font-weight: 600;">${item.brand} ${item.title}</div>
                   <div style="color: #777; font-size: 12px;">Qty: ${amount}</div>
                 </td>
                 <td style="padding: 10px; text-align: right; font-weight: bold;">${total_price.toFixed(2)}₴</td>
            </tr>`
        )).join("");

        const emailParams = {
            id: id,
            email: email, // Use the fetched email
            customerName: customerName,
            items_html: itemsHtml,
            cost: {
                total: cartItems.reduce((sum, it) => sum + it.total_price, 0).toFixed(2) // Use cartItems
            }
        };

        try {
            await emailjs.send(
                'service_ooqb1lm',
                'template_bx8di34',
                emailParams,
                'aE5meQcvMfU7WOGsW'
            );
            console.log("Email sent successfully!");
        } catch (e) {
            console.error("Failed to send email:", e);
        }

        localStorage.removeItem("cart"); // Clear cart after successful order

        // Use navigate to redirect instead of window.location.reload() for better SPA behavior
        navigate("/");
        window.location.reload(); // Reload needed if Header/other components rely on a full page reload for cart state
    };

    return (
        <div id="cart">

            <nav className="breadcrumb" id="breadcrumb"></nav>

            <div className="main">
                <div className="header-page">
                    <h2>Placing an order</h2>
                </div>

                <div className="order-layout">
                    <div className="order-left">
                        <div className="order-form">
                            <div className="form-block">
                                <div className="form-header form-row">
                                    <span className="form-label">Full name and delivery address</span>
                                </div>
                                <div className="form-content" id="view-mode">
                                    <div className="form-row">
                                        <div className="form-label">Full name:</div>
                                        <div className="form-value" id="name-value">{userName}</div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-label">Address:</div>
                                        <div className="form-value" id="address-value">{address}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-block">
                                <div className="form-header">Payment method</div>
                                <div className="form-content">
                                    <label><input type="radio" name="payment" defaultChecked
                                                  onChange={() => setPaymentMethod("Credit card")} />
                                        Credit card</label><br />
                                    <label><input type="radio" name="payment"
                                                  onChange={() => setPaymentMethod("Cash to the courier")} />
                                        Cash to the courier</label><br />
                                    <label><input type="radio" name="payment"
                                                  onChange={() => setPaymentMethod("Online payment")} />
                                        Online payment</label>
                                </div>
                            </div>

                            <div className="form-block">
                                <div className="form-header">Delivery method</div>
                                <div className="form-content">
                                    <label><input type="radio" name="delivery" defaultChecked
                                                  onChange={() => setDeliveryMethod("By courier")} />
                                        By courier</label><br />
                                    <label><input type="radio" name="delivery"
                                                  onChange={() => setDeliveryMethod("Pick up from pick-up\n" +
                                                      "                                        point")} />
                                        Pick up from pick-up point</label><br />
                                    <label><input type="radio" name="delivery"
                                                  onChange={() => setDeliveryMethod("Pick up from warehouse")} />
                                        Pick up from warehouse</label>
                                </div>
                            </div>

                            <div className="form-block delivery-container">
                                <h4 className="form-header">Delivery date and time</h4>

                                <div id="date-buttons" className="date-buttons"></div>

                                <div className="time-select-container">
                                    <label htmlFor="time-select">Select time:</label>
                                    <select
                                        id="time-select"
                                        onChange={(event) =>
                                            setDeliveryTime(event.target.value)}>
                                        <option value="09:00–12:00">09:00–12:00</option>
                                        <option value="12:00–15:00">12:00–15:00</option>
                                        <option value="15:00–18:00">15:00–18:00</option>
                                        <option value="18:00–21:00">18:00–21:00</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="list-products">
                            <h2 className="list-title">List of products</h2>
                            <div className="left-side">
                                <div id="list-items">
                                    {renderCartItems()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*Right: Cart Summary*/}
                    <div className="order-right">
                        <div className="summary-title">Your cart</div>
                        <div className="summary-item">
                            Products (<span id="item-count">0</span>) <span id="subtotal">0₴</span>
                        </div>
                        <div className="summary-item">
                            Discount <span id="discount">0₴</span>
                        </div>
                        <div className="summary-item">
                            Delivery <span>Free</span>
                        </div>
                        <div className="summary-total">
                            Total cost <span id="total">0₴</span>
                        </div>
                        <button className="btn-payment" onClick={createOrder}>Proceed to payment</button>
                    </div>
                </div>
            </div>
        </div>
    );
}