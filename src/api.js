import axios from "axios"

const dsUrl = "https://randomuser.me"

export const api = axios.create({
    baseURL: `${dsUrl}/api/`,
});