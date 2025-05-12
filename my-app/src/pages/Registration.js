import { useAuth } from "../context/authContext";
import {
    doCreateUserWithEmailAndPassword,
    doSignInWithGoogle
} from "../firebase/auth";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Registration() {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email || !password || !confirmPassword) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setIsRegistering(true);
        try {
            await doCreateUserWithEmailAndPassword(email, password);
        } catch (error) {
            setErrorMessage(error.message);
            setIsRegistering(false);
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        setIsRegistering(true);
        try {
            await doSignInWithGoogle();
        } catch (error) {
            setErrorMessage(error.message);
            setIsRegistering(false);
        }
    };

    if (userLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return (
        <div id="registration">
            <h2>Create an Account</h2>
            <form onSubmit={onSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
