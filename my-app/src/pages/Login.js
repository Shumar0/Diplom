import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth';
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { getDatabase, ref, get } from "firebase/database";
import './styles/Login.css';

export default function Login() {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const getRoleAndRedirect = async (uid) => {
        const dbRef = ref(getDatabase(), 'Person/' + uid);
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            const role = snapshot.val().role;
            if (role === 'admin') {
                navigate('/account-manager');
            } else {
                navigate('/');
            }
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSigningIn(true);

        try {
            const result = await doSignInWithEmailAndPassword(email, password);
            await getRoleAndRedirect(result.user.uid);
        } catch (err) {
            setErrorMessage(err.message);
            setIsSigningIn(false);
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSigningIn(true);

        try {
            const result = await doSignInWithGoogle();
            await getRoleAndRedirect(result.user.uid);
        } catch (err) {
            setErrorMessage(err.message);
            setIsSigningIn(false);
        }
    };

    // if (userLoggedIn) return <Navigate to="/" replace />;

    return (
        <div className="login-overlay">
            <div className="login-modal">
                <h2>LogIn</h2>
                <form onSubmit={onSubmit} className="login-form">
                    <label>Enter your email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    <button type="submit" disabled={isSigningIn}>
                        {isSigningIn ? "Signing in..." : "Login"}
                    </button>
                </form>

                <button onClick={onGoogleSignIn} className="google-btn" disabled={isSigningIn}>
                    <FcGoogle /> Login with Google
                </button>

                <p className="register-text">
                    Don’t have an account? <a href="/auth/registration">Register here</a>
                </p>

                {errorMessage && <p className="error-text">{errorMessage}</p>}
            </div>
        </div>
    );
}
