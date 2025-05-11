import { useAuth } from "../context/authContext"
import { doCreateUserWithEmailAndPassword} from "../firebase/auth";
import {useState} from "react";
import {Navigate} from "react-router-dom";

export default function Registration() {

    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isRegistering) {
            setIsRegistering(true)
            await doCreateUserWithEmailAndPassword(email, password)
        }
    }

    return (
        <div id="registration">
            {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
            <div>
                <input type="email" id="email" placeholder="Email" />
                <input type="password" id="password" placeholder="Password" />

                <button>SignIn with google</button>
            </div>
        </div>
    )
}