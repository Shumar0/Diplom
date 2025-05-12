import { useAuth } from "../context/authContext";
import {
    doCreateUserWithEmailAndPassword,
    doSignInWithGoogle
} from "../firebase/auth";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import './styles/Registration.css'
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from 'lucide-react';

export default function Registration() {
    const { userLoggedIn } = useAuth();

    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getNewId = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_DB_LINK}Person.json`);
            const data = res.data || {};
            const ids = Object.values(data)
                .map(user => user.id)
                .filter(id => typeof id === 'number');
            const maxId = ids.length > 0 ? Math.max(...ids) : 0;
            return maxId + 1;
        } catch (e) {
            console.log("Error getting new ID:", e);
            return 1;
        }
    };

    const saveUserData = async (uid, newId, userData) => {
        try {
            await axios.put(`${process.env.REACT_APP_DB_LINK}Person/${uid}.json`, {
                ...userData,
                id: newId,
            });
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
            const uid = result.user.uid;
            const newId = await getNewId();

            await saveUserData(uid, newId, {
                fullname: fullName,
                address,
                phone,
                email,
                password,
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
            const uid = result.user.uid;
            const email = result.user.email;

            const exists = await emailExists(email);
            if (exists) {
                setIsRegistering(false);
                return;
            }

            const newId = await getNewId();
            await saveUserData(uid, newId, {
                fullname: result.user.displayName || "",
                address: "",
                phone: "",
                email,
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
        <div className="registration-overlay">
            <div id="registration">
                <h2>Create an Account</h2>
                <form onSubmit={onSubmit}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                    />

                    <label>Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                    />

                    <label>Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    <label>Confirm Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-icon">
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    <button type="submit" disabled={isRegistering}>
                        {isRegistering ? "Registering..." : "Registration"}
                    </button>
                </form>

                <button onClick={onGoogleSignIn} className="google-btn" disabled={isRegistering}>
                    <FcGoogle /> Sign in with Google
                </button>

                {errorMessage && <p className="error-text">{errorMessage}</p>}
            </div>
        </div>
    );
}