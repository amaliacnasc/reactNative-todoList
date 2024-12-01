import axios from "axios";

const api = axios.create({
    baseURL:'https://api-to-do-list-gv2p.onrender.com/'
})

export default api;