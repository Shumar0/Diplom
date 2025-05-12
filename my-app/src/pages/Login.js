import { doSignInWithEmailAndPassword, doSignInWithGoogle, doPasswordReset } from '../firebase/auth';
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import './styles/Login.css'
import { FcGoogle } from "react-icons/fc";

export default function Login() {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSigningIn(true);
        try {
            await doSignInWithEmailAndPassword(email, password);
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
            await doSignInWithGoogle();
        } catch (err) {
            setErrorMessage(err.message);
            setIsSigningIn(false);
        }
    };

    if (userLoggedIn) return <Navigate to="/" replace />;

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

                {/*<Link className="forgot-link" to="/auth/reset" onClick={(email) => doPasswordReset()}>Forgot the password</Link>*/}

                <p className="register-text">
                    Don’t have an account? <Link to="/auth/registration">Register here</Link>
                </p>

                {errorMessage && <p className="error-text">{errorMessage}</p>}
            </div>
        </div>
    );
}
