import api from "../api"

export const fetchJobs = async({url}) => {
    const {data} = await api.post("/trabalhos",{url})
    return data;
}

export const fetchEmail = async({email,lista}) => {
    const {data} = await api.post("/email",{email,lista})
    return data;
}

