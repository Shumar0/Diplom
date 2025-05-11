import React, { useEffect } from 'react';
import "./styles/style.css"
import "./styles/header.css"
import "./styles/footer.css"
import "./styles/slider.css"
import "./styles/main_page.css"
import {Link} from "react-router-dom";

const Main = (props) => {

    const products = props.products;

  return (
      <div id="main">
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

          <div className="slider">
              <div className="slide active">
                  <img src="/images/Frame.png" alt="Slide 1"/>
              </div>
              <div className="slide">
                  <img src="/images/Frame.png" alt="Slide 2"/>
              </div>
              <div className="slide">
                  <img src="/images/Frame.png" alt="Slide 3"/>
              </div>
          </div>

          <div className="slider-controls">
              <button id="prev">&#10094;</button>
              <div id="slide-indicator">1 / 3</div>
              <button id="next">&#10095;</button>
          </div>

          <div className="services-menu">
              <button className="service-button">
                  <img src="/images/gitf-card.png" alt="Gift Cards"/>
                  <p>Gift Cards</p>
              </button>
              <button className="service-button">
                  <img src="/images/activegameplay.png" alt="Active gameplay"/>
                  <p>Active gameplay</p>
              </button>
              <button className="service-button">
                  <img src="/images/worldwide.png" alt="Worldwide delivery"/>
                  <p>Worldwide delivery</p>
              </button>
              <button className="service-button">
                  <img src="/images/favorable offers.png" alt="Favorable offers"/>
                  <p>Favorable offers</p>
              </button>
              <button className="service-button">
                  <img src="/images/save deals.png" alt="Save deals"/>
                  <p>Save deals</p>
              </button>
              <button className="service-button">
                  <img src="/images/Partnership.png" alt="Partnership Program"/>
                  <p>Partnership Program</p>
              </button>
              <button className="service-button">
                  <img src="/images/all for the smart home.png" alt="All for the smart home"/>
                  <p>All for the smart home</p>
              </button>
          </div>


          <div className="best-sellers-header">
              <div className="best-sellers-left">
                  <h2>Best Sellers</h2>
                  <div className="sort-options">
                      <span>Sort by</span>
                      <button className="sort-button">In stock</button>
                      <button className="sort-button">Special offer</button>
                      <button className="sort-button">Most New</button>
                      <button className="sort-button price-button">Price ▼</button>
                  </div>
              </div>
              <div className="best-sellers-right">
                  <Link to="/catalog" className="catalog-link">Go to catalog →</Link>
              </div>
          </div>

          <div id="productCatalog">
              {products.map(product => (
                  <div key={product.id} className="product-card" data-stock={product.available} data-special={product.isSpecial} data-new={product.isNew}>
                      <img src={product.image} alt={product.name} className="product-image"/>
                      <div className="product-info">
                          <span className="product-category">{product.category}</span>
                          <h3 className="product-name">{product.brand} {product.title}</h3>
                          <div className="product-stock">
                              <span className={`status-circle ${product.available ? 'in-stock' : 'out-of-stock'}`}></span>
                              <span className="stock-text">{product.available ? 'In stock' : 'Out of stock'}</span>
                          </div>
                          <div className="product-price">{product.price}₴</div>
                      </div>
                      <div className="product-icons">
                          <button className="icon-button heart-icon">
                              <img src="/images/heart.svg" alt="Favorite"/>
                          </button>
                          <button className="icon-button compare-icon">
                              <img src="/images/compare.svg" alt="Compare"/>
                          </button>
                          <button className="icon-button cart-icon">
                              <img src="/images/cart.svg" alt="Cart"/>
                          </button>
                      </div>
                  </div>
              ))}
          </div>

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

export default Main;
