import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Main from "./pages/Main";
import Catalog from "./pages/Catalog";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Account_manager from "./pages/Account_manager";
import axios from "axios";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import {AuthProvider, useAuth} from "./context/authContext";

const ProtectedRoute = ({children}) => {
    const { userLoggedIn } = useAuth()

    if (!userLoggedIn) {
        return <Navigate to="/auth/login" replace={true}/>
    }

    return children
}

function App() {

    const [items, setItems] = useState([])

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_DB_LINK}Item.json`)
            .then(res => {
                const data = res.data;

                if (!data) {
                    console.warn('No data');
                    setItems([]);
                    return;
                }

                const loadedItems = [];

                for (const key in data) {
                    if (data[key]) {
                        loadedItems.push({
                            id: data[key].id,
                            brand: data[key].brand,
                            title: data[key].title,
                            price: data[key].price,
                            image: data[key].image,
                            amount_on_stock: data[key].amount_on_stock,
                            category: data[key].category,
                            available: data[key].amount_on_stock > 0,
                            discount: data[key].discount
                        });
                    }
                }

                setItems(loadedItems);
            })
            .catch(err => console.error('Error: ', err));
    }, []);


    return (
      <AuthProvider>
          <Router>
              <Routes>
                  <Route path="/" element={<Main products={items} />} />
                  <Route path="/catalog" element={<Catalog products={items} />} />
                  <Route path="/favorites" element={<ProtectedRoute><Favorites products={items} /></ProtectedRoute>} />
                  <Route path="/account" element={<ProtectedRoute><Account products={items} /></ProtectedRoute>} />
                  <Route path="/account-manager" element={<ProtectedRoute><Account_manager products={items} /></ProtectedRoute>} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/registration" element={<Registration />} />
              </Routes>
          </Router>
      </AuthProvider>
  );
}

export default App;
