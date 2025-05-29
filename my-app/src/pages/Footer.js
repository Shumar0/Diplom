import React from "react";
import { Link } from "react-router-dom";
import "./styles/footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="newsletter-text">
                    <p>I want to keep up to date with promotions and new products</p>
                </div>
                <div className="newsletter-form">
                    <input type="email" placeholder="My e-mail" />
                    <div className="footer-bottons">
                        <button>Sign</button>
                    </div>
                </div>
            </div>

            <hr />

            <div className="footer-main">
                <div className="app-download">
                    <div className="app-image">
                        {/* Місце для QR коду або картинки */}
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

            <hr />

            <div className="footer-bottom">
                <Link to="/">Privacy Policy</Link>
                <span>|</span>
                <Link to="/">Terms of Use</Link>
                <span>|</span>
                <Link to="/">Sales and Refunds</Link>
            </div>
        </footer>
    );
};

export default Footer;