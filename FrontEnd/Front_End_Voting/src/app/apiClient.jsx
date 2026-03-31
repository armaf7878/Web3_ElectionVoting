import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.SEVER_API_URL,
    headers: {
        "Content-Type":"application/json",
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(!token){
        console.log("Token not found");
    }
    if(token){
        config.headers.authorization  = `Bearer ${token}`;
    };
    return config;
});

export default axiosClient;