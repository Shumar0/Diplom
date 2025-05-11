import {doSignInWithEmailAndPassword, doSignInWithGoogle} from '../firebase/auth'
import { useAuth } from "../context/authContext"
import {useState} from "react";

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true)
            await doSignInWithEmailAndPassword(email, password)
        }
    }

    const onGoogleSignIn = (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle().catch(e => {
                setIsSigningIn(false)
            })
        }
    }

    return (
        <div id="login">
            <div onSubmit={onSubmit}>
                <input type="email" id="email" placeholder="Email" />
                <input type="password" id="password" placeholder="Password" />
                <button type={'submit'}>Login</button>
            </div>

            <button onClick={(e) => onGoogleSignIn(e)}>Login with google</button>
        </div>
    )
}