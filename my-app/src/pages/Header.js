import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './styles/style.css';
import './styles/header.css';

const Header = ({ products }) => {
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Header отримав products:", products);
    }, [products]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (!value.trim()) {
            setFiltered([]);
            setShowDropdown(false);
            return;
        }

        const results = products.filter((p) =>
            p.title.toLowerCase().includes(value.toLowerCase())
        );

        setFiltered(results);
        setShowDropdown(results.length > 0);

        console.log("Пошук:", value);
        console.log("Фільтровані товари:", results);
    };

    const handleProductClick = (id) => {
        setQuery("");
        setShowDropdown(false);
        navigate(`/product/${id}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="header">
            <div className="header-left">
                <div className="delivery">
                    <svg className="icon-small" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
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
                                  style={{ fill: "#007AFF" }}
                            />
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
                    <img src="https://firebasestorage.googleapis.com/v0/b/market-4376c.firebasestorage.app/o/logo.png?alt=media&token=74639de1-46ad-47c0-9236-058de8f19b3d"
                         alt="NextTech Logo" className="logo" />
                </Link>
            </div>

            <div className="header-right">
                <div className="search-bar" ref={dropdownRef}>
                    <input
                        type="text"
                        placeholder="Site search..."
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => query && setShowDropdown(true)}
                    />
                    <div className="search-button">
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/market-4376c.firebasestorage.app/o/search.svg?alt=media&token=f3cc5479-5ef3-4ae4-aa8d-cc4a2e8d55f2" // заміни на свою іконку
                            alt="search"
                        />
                    </div>

                    {showDropdown && (
                        <div className="search-dropdown">
                            {filtered.length === 0 ? (
                                <p className="no-results">Нічого не знайдено</p>
                            ) : (
                                filtered.slice(0, 5).map((product) => (
                                    <div
                                        key={product.id}
                                        className="search-item"
                                        onClick={() => handleProductClick(product.id)}
                                    >
                                        <div className="search-item-inner">
                                            <img src={product.image} alt={product.title}/>
                                            <div>
                                                <p style={{margin: 0}}>{product.title}</p>
                                                <p style={{margin: 0, fontSize: "0.8em", color: "#555"}}>
                                                    {product.price} грн
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <div className="header-icons">
                    <Link to="/cart">
                        <button className="icon-button">
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/market-4376c.firebasestorage.app/o/cart.svg?alt=media&token=b3fd4578-5e7b-4e90-89d9-767281054677"
                                alt="Cart" className="icon icon-cart"/>
                        </button>
                    </Link>
                    <Link to="/favorites">
                        <button className="icon-button">
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/market-4376c.firebasestorage.app/o/heart.svg?alt=media&token=a75130aa-146f-42b1-9c10-526018d4b695"
                                alt="Favorites" className="icon icon-heart"/>
                        </button>
                    </Link>
                    <Link to="/account">
                        <button className="icon-button">
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/market-4376c.firebasestorage.app/o/user.svg?alt=media&token=20951306-0fa1-4433-8127-f01b4ba1c769"
                                alt="Profile" className="icon icon-user"/>
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
