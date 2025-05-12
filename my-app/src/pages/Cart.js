import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/style.css';
import './styles/header.css';
import './styles/breadcrumb.css';
import './styles/footer.css';
import './styles/cart.css';

export default function Cart(props) {

    const [cartItems, setCartItems] = useState([]);

    const getProductsFromCart = () => {
        const cartString = localStorage.getItem('cart');
        let cartData = cartString ? JSON.parse(cartString) : [];
        console.log(cartData);
        setCartItems(cartData);
    };

    useEffect(() => {
        getProductsFromCart();
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

    return (
        <div id="cart">
            {/* Header, Breadcrumb, and other static elements remain the same */}
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
                                      style={{ fill: "#007AFF" }}/>
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
                                    <Link to="/" id="edit-toggle">Change</Link>
                                </div>
                                <div className="form-content" id="view-mode">
                                    <div className="form-row">
                                        <div className="form-label">Full name:</div>
                                        <div className="form-value" id="name-value"></div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-label">Address:</div>
                                        <div className="form-value" id="address-value"></div>
                                    </div>
                                </div>
                                <div className="form-edit" id="edit-mode">
                                    <label>
                                        Full name:<br/>
                                        <input type="text" id="full-name" defaultValue=""/>
                                    </label><br/>
                                    <label>
                                        Address:<br/>
                                        <input type="text" id="address" defaultValue=""/>
                                    </label><br/>
                                    <button id="save-btn">Save</button>
                                    <button id="cancel-btn" type="button">Cancel</button>
                                </div>
                            </div>
                            <div className="form-block">
                                <div className="form-header">Payment method</div>
                                <div className="form-content">
                                    <label><input type="radio" name="payment" defaultChecked/> Credit card</label><br/>
                                    <label><input type="radio" name="payment"/> Cash to the courier</label><br/>
                                    <label><input type="radio" name="payment"/> Online payment</label>
                                </div>
                            </div>

                            <div className="form-block">
                                <div className="form-header">Delivery method</div>
                                <div className="form-content">
                                    <label><input type="radio" name="delivery" defaultChecked/> By courier</label><br/>
                                    <label><input type="radio" name="delivery"/> Pick up from pick-up
                                        point</label><br/>
                                    <label><input type="radio" name="delivery"/> Pick up from warehouse</label>
                                </div>
                            </div>

                            <div className="form-block delivery-container">
                                <h4 className="form-header">Delivery date and time</h4>

                                <div id="date-buttons" className="date-buttons"></div>

                                <div className="time-select-container">
                                    <label htmlFor="time-select">Select time:</label>
                                    <select id="time-select">
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
                        <button className="btn-payment">Proceed to payment</button>
                    </div>
                </div>
            </div>
        </div>
    );
}