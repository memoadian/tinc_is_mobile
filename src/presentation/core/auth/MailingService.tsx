import axios from "axios";
import { ApiCore } from "../../config/api";


const MailingService = axios.create({
    baseURL: ApiCore.BASE_URL + ApiCore.MAILING
})


export default MailingService