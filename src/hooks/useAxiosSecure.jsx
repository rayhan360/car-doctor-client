import axios from "axios";
import { useEffect } from "react";
import useAuthContext from "./useAuthContext";
import { useNavigate } from "react-router-dom";

const axiosSecur = axios.create({
    baseURL: 'https://car-doctor-server-henna-nu.vercel.app',
    withCredentials: true
})
const useAxiosSecure = () => {
    const { logOut } = useAuthContext();
    const navigate = useNavigate();
    useEffect(() => {
        axiosSecur.interceptors.response.use(res => {
            return res;
        }, error => {
            console.log('error tracked in the interceptor', error.response)
            if (error.response.status === 401 || error.response.status === 403) {
                console.log('logout the user')
                logOut()
                    .then(() => {
                        navigate('/login')
                    })
                    .catch(error => console.log(error))
            }
        })
    }, [])

    return axiosSecur;
};

export default useAxiosSecure;