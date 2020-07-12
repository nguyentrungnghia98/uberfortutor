import {Api} from './api';

class Conversation extends Api{
  constructor(){
    super();
    this.module = 'conversation';
  }

  async sendMessage(data){
    const setting = {
      method: 'POST',
      url: this.getUrl('sendMessage'),
      headers: this.tokenHeader,
      data
    }
    const response = await this.exec(setting);

    return response.data;
  }

  async  getListConversation(data){
    const setting = {
      method: 'POST',
      url: this.getUrl('getListConversation'),
      headers: this.tokenHeader,
      data
    }
    const response = await this.exec(setting);

    return response.data.results.object;
  }

  async  getListMessages(data){
    const setting = {
      method: 'POST',
      url: this.getUrl('getListMessages'),
      headers: this.tokenHeader,
      data
    }
    const response = await this.exec(setting);

    return response.data.results.object;
  }
}

export default Conversation;
