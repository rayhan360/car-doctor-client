import { useContext } from "react";
import { AuthContext } from "../providers/AuthProviders";


const useAuthContext = () => {
    const auth = useContext(AuthContext)
    return auth
};

export default useAuthContext;