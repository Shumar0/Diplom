import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth';
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

export default function Login() {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    if (userLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return (
        <div id="login">
            <h2>Log in to your account</h2>

            <form onSubmit={onSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={isSigningIn}>
                    {isSigningIn ? "Signing in..." : "Login"}
                </button>
            </form>

            <button onClick={onGoogleSignIn} disabled={isSigningIn}>
                Login with Google
            </button>

            <p>
                Don’t have an account? <Link to="/auth/registration">Register here</Link>
            </p>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}
