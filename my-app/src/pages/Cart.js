import React, { useState, useEffect } from 'react';
import {Link, replace, useNavigate} from 'react-router-dom';
import './styles/style.css';
import './styles/breadcrumb.css';
import './styles/footer.css';
import './styles/cart.css';
import {useAuth} from "../context/authContext";
import axios from "axios";
import Header from './Header';
import * as emailjs from "emailjs-com";

export default function Cart(props) {

    const { userLoggedIn } = useAuth()
    const auth = useAuth();

    const [user, setUser] = useState({})

    const [cartItems, setCartItems] = useState([]);

    const [userName, setUserName] = useState('')
    const [address, setAddress] = useState('')
    const [paymentMethod, setPaymentMethod] = useState("Credit card");
    const [deliveryMethod, setDeliveryMethod] = useState("By courier");
    const [deliveryTime, setDeliveryTime] = useState("09:00–12:00");

    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const res = await
                axios.get(`${process.env.REACT_APP_DB_LINK}Person/${auth.currentUser.uid}.json`)
            setUser(res.data)
            console.log(res.data)
            setUserName(res.data.fullname)
            setAddress(res.data.address)
        } catch (e) {
            console.log(e)
        }
    }

    const fetchUserById = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Person.json`);
            const data = res.data;

            if (!data) {
                return
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
    }, []);

    useEffect(() => {
        updateSummary();
    }, [cartItems]);

    const updateQuantity = (index, delta) => {
        setCartItems(currentCartItems => {
            const newCartItems = [...currentCartItems];
            if (newCartItems[index]) {
                newCartItems[index].amount = Math.max(1, newCartItems[index].amount + delta);
                newCartItems[index].total_price = newCartItems[index].amount * newCartItems[index].item.price;
            }
            localStorage.setItem('cart', JSON.stringify(newCartItems));

            // Додано — оновити підсумки
            setTimeout(updateSummary, 0);

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
                <div key={category} className="category-header">
                    <h3>{category}</h3>
                    <p>({count}) {total}₴</p>
                </div>
            );

            categoryItems.forEach((cartItem, index) => {
                const item = cartItem.item;
                const newPrice = item.price - Math.round(item.price * item.discount / 100);
                cartItemElements.push(
                    <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.title} />
                        <div className="cart-item-details">
                            <div className="cart-item-title">{item.title}</div>
                            <div className="cart-item-desc">{item.desc}</div>
                            {/*<a href="#" className="cart-item-fav">Add to Favorite</a>*/}
                        </div>
                        <div className="cart-item-actions">
                            <div className="quantity-control">
                                <button onClick={() => updateQuantity(cartItems.indexOf(cartItem), -1)}>-</button>
                                <span>{cartItem.amount}</span>
                                <button onClick={() => updateQuantity(cartItems.indexOf(cartItem), 1)}>+</button>
                            </div>
                            <div className="cart-item-price">
                                {item.discount > 0 ? (
                                    <>
                                        <span className="current-price">{newPrice * cartItem.amount}₴</span><br />
                                        <span className="old-price">{item.price * cartItem.amount}₴</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="current-price">{item.price * cartItem.amount}₴</span><br />
                                    </>
                                )}
                            </div>
                            <button className="delete-btn" onClick={() => removeItem(item.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
                                    {/* SVG path for delete icon */}
                                    <g transform="translate(1.41 1.41) scale(2.81)">
                                        <path d="M 64.71 90 H 25.291 c -4.693 0 -8.584 -3.67 -8.859 -8.355 l -3.928 -67.088 c -0.048 -0.825 0.246 -1.633 0.812 -2.234 c 0.567 -0.601 1.356 -0.941 2.183 -0.941 h 59.002 c 0.826 0 1.615 0.341 2.183 0.941 c 0.566 0.601 0.86 1.409 0.813 2.234 l -3.928 67.089 C 73.294 86.33 69.403 90 64.71 90 z M 18.679 17.381 l 3.743 63.913 C 22.51 82.812 23.771 84 25.291 84 H 64.71 c 1.52 0 2.779 -1.188 2.868 -2.705 l 3.742 -63.914 H 18.679 z" style={{ fill: "#007AFF" }} strokeLinecap="round" />
                                        <path d="M 80.696 17.381 H 9.304 c -1.657 0 -3 -1.343 -3 -3 s 1.343 -3 3 -3 h 71.393 c 1.657 0 3 1.343 3 3 S 82.354 17.381 80.696 17.381 z" style={{ fill: "#007AFF" }} strokeLinecap="round" />
                                        <path d="M 58.729 17.381 H 31.271 c -1.657 0 -3 -1.343 -3 -3 V 8.789 C 28.271 3.943 32.214 0 37.061 0 h 15.879 c 4.847 0 8.789 3.943 8.789 8.789 v 5.592 C 61.729 16.038 60.386 17.381 58.729 17.381 z M 34.271 11.381 h 21.457 V 8.789 C 55.729 7.251 54.478 6 52.939 6 H 37.061 c -1.538 0 -2.789 1.251 -2.789 2.789 V 11.381 z" style={{ fill: "#007AFF" }} strokeLinecap="round" />
                                        <path d="M 58.33 74.991 c -0.06 0 -0.118 -0.002 -0.179 -0.005 c -1.653 -0.097 -2.916 -1.517 -2.819 -3.171 l 2.474 -42.244 c 0.097 -1.655 1.508 -2.933 3.171 -2.819 c 1.653 0.097 2.916 1.516 2.819 3.17 l -2.474 42.245 C 61.229 73.761 59.906 74.991 58.33 74.991 z" style={{ fill: "#007AFF" }} strokeLinecap="round" />
                                        <path d="M 31.669 74.991 c -1.577 0 -2.898 -1.23 -2.992 -2.824 l -2.473 -42.245 c -0.097 -1.654 1.165 -3.073 2.819 -3.17 c 1.646 -0.111 3.073 1.165 3.17 2.819 l 2.473 42.244 c 0.097 1.654 -1.165 3.074 -2.819 3.171 C 31.788 74.989 31.729 74.991 31.669 74.991 z" style={{ fill: "#007AFF" }} strokeLinecap="round" />
                                        <path d="M 45 74.991 c -1.657 0 -3 -1.343 -3 -3 V 29.747 c 0 -1.657 1.343 -3 3 -3 c 1.657 0 3 1.343 3 3 v 42.244 C 48 73.648 46.657 74.991 45 74.991 z" style={{ fill: "#007AFF" }} strokeLinecap="round" />
                                    </g>
                                </svg>
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
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}/Order.json`)
            let maxId = 0
            for (const key in res.data) {
                if (res.data[key]) {
                    const currentId = parseInt(res.data[key].id, 10)
                    if (!isNaN(currentId) && currentId > maxId) {
                        maxId = currentId
                    }
                }
            }

            return maxId + 1
        } catch (e) {
            console.error(e);
        }
    }

    function getNextDay(date = new Date()) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 2);
        return nextDay.toISOString().split('T')[0];
    }

    const createOrder = async () => {
        if (userName.trim().length < 1) {
            return
        }
        if (address.trim().length < 1) {
            return
        }

        const id = await getLastOrderId();

        const order = {
            address: address,
            date: new Date().toISOString(),
            delivery_time: deliveryTime,
            delivery_date: getNextDay(),
            delivery_way: deliveryMethod,
            payment_way: paymentMethod,
            person: userLoggedIn ?  await fetchUserById() : "",
            person_email: "",
            status: "In process",
            id: id
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_DB_LINK}/Order.json`, order);
            console.log("Order has been created");
        } catch (e) {
            console.error(e);
        }

        // add order_items
        let bonuses = 0
        const items = JSON.parse(localStorage.getItem("cart"));
        console.log(items)
        for (const key in items) {
            console.log(items[key])
            const item = {
                amount: items[key].amount,
                item_id: parseInt(items[key].item.id, 10),
                order_id: id,
                total: items[key].total_price
            }

            bonuses += parseInt(items[key].total_price)

            console.log("Item: ", item)

            try {
                const res = await
                    axios.post(`${process.env.REACT_APP_DB_LINK}/Order_Item.json`, item);
                console.log("Item has been added");
            } catch (e) {
                console.error(e);
            }
        }

        bonuses = parseInt((bonuses / 100), 10)
        console.log(bonuses)

        const newUser = {
            ...user,
            bonuses: user.bonuses+bonuses
        }

        try {
            const res = await
                axios.put(`${process.env.REACT_APP_DB_LINK}/Person/${auth.currentUser.uid}.json`, newUser);
            console.log("User has been updated");
        } catch (e) {
            console.error(e);
        }

        const email = user.email;
        const customerName = userName

        // send email

        const itemsHtml = Object.values(items).map(({ item, amount, total_price }) => (
            `<tr style="border-bottom: 1px solid #ddd;">
     <td style="padding: 10px;"><img src="${item.image}" alt="${item.name}" width="64" style="border-radius: 4px;" /></td>
     <td style="padding: 10px;">
       <div style="font-weight: 600;">${item.brand} ${item.title}</div>
       <div style="color: #777; font-size: 12px;">Qty: ${amount}</div>
     </td>
     <td style="padding: 10px; text-align: right; font-weight: bold;">${total_price.toFixed(2)}</td>
   </tr>`
        )).join("");

        const emailParams = {
            id: id,
            email: user.email,
            customerName: userName,
            items_html: itemsHtml,
            cost: {
                total: Object.values(items).reduce((sum, it) => sum + it.total_price, 0)
            }
        }

        try {
            await emailjs.send(
                'service_ooqb1lm',
                'template_bx8di34',
                emailParams,
                'aE5meQcvMfU7WOGsW'
            );
            console.log("Email sent");
        } catch (e) {
            console.error("Failed to send email", e);
        }

        localStorage.removeItem("cart")

        window.location.reload()
        navigate("/")
    }

    return (
        <div id="cart">
            <Header />
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
                                                  onChange={() => setPaymentMethod("Credit card")}/>
                                        Credit card</label><br/>
                                    <label><input type="radio" name="payment"
                                                  onChange={() => setPaymentMethod("Cash to the courier")}/>
                                        Cash to the courier</label><br/>
                                    <label><input type="radio" name="payment"
                                                  onChange={() => setPaymentMethod("Online payment")}/>
                                        Online payment</label>
                                </div>
                            </div>

                            <div className="form-block">
                                <div className="form-header">Delivery method</div>
                                <div className="form-content">
                                    <label><input type="radio" name="delivery" defaultChecked
                                                  onChange={() => setDeliveryMethod("By courier")}/>
                                        By courier</label><br/>
                                    <label><input type="radio" name="delivery"
                                                  onChange={() => setDeliveryMethod("Pick up from pick-up\n" +
                                                      "                                        point")}/>
                                        Pick up from pick-up point</label><br/>
                                    <label><input type="radio" name="delivery"
                                                  onChange={() => setDeliveryMethod("Pick up from warehouse")}/>
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
                                {/* The category summary is now rendered within renderCartItems */}
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