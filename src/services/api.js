import axios from "axios"

const api = axios.create({
    baseURL : "https://job-crawler.herokuapp.com"
})

export default api;