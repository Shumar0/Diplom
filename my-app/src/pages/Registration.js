import { useAuth } from "../context/authContext";
import {
    doCreateUserWithEmailAndPassword,
    doSignInWithGoogle
} from "../firebase/auth";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function Registration() {
    const { userLoggedIn } = useAuth();

    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getNewId = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Person.json`);
            const data = res.data || {};
            const ids = Object.keys(data).map(id => parseInt(id, 10));
            const maxId = ids.length > 0 ? Math.max(...ids) : 0;
            return maxId + 1;
        } catch (e) {
            console.log(e);
        }
    };

    const saveUserData = async (id, userData) => {
        try {
            await axios.put(`${process.env.REACT_APP_DB_LINK}Person/${id}.json`, userData);
        } catch (err) {
            console.error("Error saving user data:", err);
        }
    };

    const emailExists = async (emailToCheck) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Person.json`);
            const data = res.data || {};

            for (let key in data) {
                if (data[key].email === emailToCheck) {
                    return true
                }
            }

            return false;
        } catch (e) {
            console.error("Error checking email:", e);
            return false;
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email || !password || !confirmPassword || !fullName || !address || !phone) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setIsRegistering(true);
        try {
            const exists = await emailExists(email);
            if (exists) {
                setErrorMessage("A user with this email already exists.");
                setIsRegistering(false);
                return;
            }

            const result = await doCreateUserWithEmailAndPassword(email, password);
            const newId = await getNewId();
            await saveUserData(newId, {
                fullname: fullName,
                address: address,
                phone: phone,
                email: email,
                password: password,
                bonuses: 0
            });
        } catch (error) {
            setErrorMessage(error.message);
            setIsRegistering(false);
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        setIsRegistering(true);
        try {
            const result = await doSignInWithGoogle();
            const userEmail = result.user.email;

            const exists = await emailExists(userEmail);
            console.log('Email exists:', exists);
            if (exists) return;

            const newId = await getNewId();
            await saveUserData(newId, {
                fullname: result.user.displayName,
                address: "",
                phone: "",
                email: userEmail,
                password: "",
                bonuses: 0
            });
        } catch (error) {
            setErrorMessage(error.message);
            setIsRegistering(false);
        }
    };


    if (userLoggedIn) return <Navigate to="/" replace />;

    return (
        <div id="registration">
            <h2>Create an Account</h2>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />

                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />

                <button type="submit" disabled={isRegistering}>
                    {isRegistering ? "Registering..." : "Register"}
                </button>
            </form>

            <button onClick={onGoogleSignIn} disabled={isRegistering}>
                Sign in with Google
            </button>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
}
