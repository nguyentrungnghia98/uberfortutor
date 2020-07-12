import * as moment from 'moment';

export function converCurrency(money) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  });
  return formatter.format(money).slice(1);
}

export function formatDate(_date) {
  if(!_date) return null;
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  const date = new Date(_date)
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ', ' + year;
}

export function formatChatDate(time_message, _cur){
  let end = new Date(time_message)
  let cur = moment(_cur)
  let time = moment.duration(cur.diff(end))
  if (time.asSeconds() <= 60) {
    return "vừa xong"
  } else if (time.asMinutes() <= 60) {
    return Math.floor(time.asMinutes()) + " phút"
  }  else if (time.asHours() <= 24) {
    return Math.floor(time.asHours()) + ' giờ'
  } else {
    return moment(end).format('D MMM')
  }
}