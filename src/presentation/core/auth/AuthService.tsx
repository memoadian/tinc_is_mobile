import axios from "axios";
import { ApiCore } from "../../config/api";


const AuthService = axios.create({
    baseURL: ApiCore.BASE_URL + ApiCore.AUTH
})


export default AuthService