import axios from "./axios";
import toast from "../utils/toast";
import * as hash from "object-hash";
import * as moment from "moment";

export class Api{
  module = '';

//   hashCache: {
//     [hash: string]: {
//         pagination: iCrudPagination;
//         items: T[];
//         expired: Date;
//         isGetList: boolean;
//     };
// };
  hashCache = {}

  get hash(){
    return hash;
  }

  get moment(){
    return moment;
  }

  get axios(){
    return axios;
  }
  get alert(){
    return toast;
  }

  alertError(error){
    if(typeof(error) === 'string'){
      this.alert.error(error);
    }
    let message = 'Some thing wrong!';
    if (error.response && error.response.data && error.response.data.message) message = error.response.data.message;
    this.alert.error(message);
  }

  get tokenHeader() {
    const userToken = localStorage.getItem('userToken');
    return { authorization : userToken }
  }
  getUrl(path=""){
    if(!this.module) return '/';
    return `/${this.module}/${path}`
  }

  async  getList(){
    const setting = {
      method: 'GET',
      url: this.getUrl(),
      headers: this.tokenHeader,
    }
    const response = await this.exec(setting);

    return response.data.results.objects;
  }

  async exec(option) {
    if (!option) throw new Error("option undefined in exec")
    try {
      return await axios(option)
    } catch (resError) {
      // this.alertService.alert(resError.error.message, 'error');
      throw resError;
    }
  }

  async  getItem(id = ''){
    const setting = {
      method: 'GET',
      url: this.getUrl(id),
      headers: this.tokenHeader,
    }
    const response = await this.exec(setting);

    return response.data.results.object;
  }

  async  update(id = '', data){
    const setting = {
      method: 'POST',
      url: this.getUrl(id),
      headers: this.tokenHeader,
      data
    }
    const response = await this.exec(setting);

    return response.data.results.object;
  }
}
const api  = new Api();
export default api;