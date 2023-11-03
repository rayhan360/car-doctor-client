/* eslint-disable react/prop-types */
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null)
const auth = getAuth(app)

const AuthProviders = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () => {
        setLoading(true)
        return signOut(auth)
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => 
            {
            const userEmail = currentUser?.email || user?.email
            const loggedUser = { email: userEmail }
            setUser(currentUser);
            console.log('current user', currentUser);
            setLoading(false)
            // if user exist then issue a token
            if (currentUser) {
                axios.post('https://car-doctor-server-henna-nu.vercel.app/jwt', loggedUser, { withCredentials: true })
                    .then(res => {
                        console.log("token response from authproviders",res.data);
                    })
            }
            else{
                axios.post('https://car-doctor-server-henna-nu.vercel.app/logout', loggedUser, {withCredentials: true})
                .then(res => {
                    console.log("logout response token data", res.data);
                })
            }
        });
        return () => {
            return unSubscribe()
        }
    }, [user?.email])

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        logOut
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProviders;