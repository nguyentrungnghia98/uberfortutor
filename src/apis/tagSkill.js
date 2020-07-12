import {Api} from './api';

class TagSkill extends Api{
  constructor(){
    super();
    this.module = 'tagSkill';
  }

  async getList(){
    const setting = {
      method: 'GET',
      url: this.getUrl('getListTagSkill'),
      headers: this.tokenHeader,
    }

    const hashedQuery = this.hash({url: 'getListTagSkill'});
    if (
      this.hashCache[hashedQuery] &&
      this.hashCache[hashedQuery].expired > new Date()
    ) {
      let items = this.hashCache[hashedQuery].item;
      return items;
    }

    const response = await this.exec(setting);

    const item =  response.data.results.objects;
    
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

export default TagSkill;
