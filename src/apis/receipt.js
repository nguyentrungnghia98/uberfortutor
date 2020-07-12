import {Api} from './api';
import checksum from '../utils/checksumToken';

class Receipt extends Api{
  constructor(){
    super();
    this.module = 'receipt';
  }

  async  getListByTimeScope(data){
    const timestamp = new Date().getTime();
    data = {...data, timestamp, checksumToken: checksum.genarateToken(timestamp)}
    const setting = {
      method: 'POST',
      url: this.getUrl('getListByTimeScope'),
      headers: this.tokenHeader,
      data
    }

    const hashedQuery = this.hash({url: 'getListByTimeScope',...data});
    if (
      this.hashCache[hashedQuery] &&
      this.hashCache[hashedQuery].expired > new Date()
    ) {
      let items = this.hashCache[hashedQuery].item;
      return items;
    }

    const response = await this.exec(setting);


    const item =  response.data.results.object;
    
    this.hashCache[hashedQuery] = {
      item,
      expired: this.moment()
          .add(3, "minutes")
          .toDate(),
      isGetList: true
    };

    return item;
  }

}

export default Receipt;
