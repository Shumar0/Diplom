import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
// import Catalog from "./pages/Catalog";
// import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
// import Product from "./pages/Product";
// import Cart from "./pages/Cart";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          {/*<Route path="/catalog" element={<Catalog />} />*/}
          {/*<Route path="/favorites" element={<Favorites />} />*/}
          <Route path="/account" element={<Account />} />
          {/*<Route path="/product" element={<Product />} />*/}
          {/*<Route path="/cart" element={<Cart />} />*/}
        </Routes>
      </Router>
  );
}

export default App;
