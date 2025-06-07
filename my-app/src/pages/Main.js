import React, { useEffect } from 'react';
import "./styles/style.css"
import "./styles/slider.css"
import "./styles/main_page.css"
import Header from './Header';
import Footer from './Footer';
import {Link} from "react-router-dom";

const Main = (props) => {

    const products = props.products;

  return (
      <div id="main">

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


          <Footer />
      </div>
  );
};

export default Main;
