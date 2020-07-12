import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Receipt } from '../../apis';
import './Salary.scss';
import {  MenuItem, Select, InputLabel, FormControl, Tab, Tabs, AppBar } from '@material-ui/core';
import {  MuiPickersUtilsProvider, DatePicker  } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import LineChart from './LineChart';
import * as moment from 'moment';
import {converCurrency} from '../../utils/pipe';

function _TabPanel(props) {
  const { children, value, index } = props;
  const [loading, setLoading] = useState(false);
  const [date, setDate] = React.useState('7day');
  const [fromDate, setFromDate] = React.useState(moment().subtract(1, 'days').format());
  const [toDate, setToDate] = React.useState(moment().format());
  const [data, setData] = useState([]);
  const {user} = props;
  const [total, setTotal] = useState(0);

  function getDate(){
    const res = {
      from: fromDate,
      to: toDate
    };
    if(date === '7day'){
      res.from = moment().subtract(7, 'days').format()
      res.to = moment().format()
    }
    if(date === '30day'){
      res.from = moment().subtract(30, 'days').format()
      res.to = moment().format()
    }
    return res
  }

  async function reload() {
    try {
      
      const data = {
        condition:{
          teacher: user._id,
        },
        ...getDate()
      }
      
      const from = moment(data.from).zone("+7:00");
      const to = moment(data.to).zone("+7:00");
      console.log(from,to)
      const count = to.diff(from,'days') + (date === 'custom'?1:0);
      if(count < 0) return Receipt.alert.error('Vui lòng chọn ngày hợp lệ.');

      setLoading(true);
      const response = await Receipt.getListByTimeScope(data);
      
      const map = {};
      for(let i = 0; i < count; i++){
        const date = moment(from).add(i, 'days').format('DD/MM/YYYY');
        console.log('date',count, date)
        map[date] = 0;
      }
      let sum = 0;
      response.forEach(({x,y}) => {
        // const date = moment(x).format('DD/MM/YYYY');
        map[x] = y;
        sum+=y;
      })
      setTotal(sum);
      const dates = Object.entries(map).map(item => {
        var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        return {
          x: new Date(item[0].replace(pattern,'$3-$2-$1')),
          y: item[1]
        }
      })
      console.log('dates', dates)

      setData(dates)

      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
      Receipt.alert.error(error);
    }
  }

  useEffect(() => {
    if(value === index && date !== 'custom'){
      reload()
    }
    
  }, [date])

  useEffect(() => {
    if(value === index && date === 'custom'){
      console.log('CALL RELOAD')
      reload()
    }
    
  }, [fromDate, toDate])

  if (loading) {
    return (
      <div className="page-wrapper teacher-info-container d-flex justify-content-center">
        <div className="spinner-wrapper mt-5" >
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="statistic-box"
    >
      {value === index && (
        <header className="filter-date">
          <FormControl className="select-date">
            <InputLabel id="demo-simple-select-label">Thời gian</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={date}
              onChange={e => setDate(e.target.value)}
            >
              <MenuItem value='7day'>7 ngày trước</MenuItem>
              <MenuItem value='30day'>30 ngày trước</MenuItem>
              <MenuItem value='custom'>Tùy chỉnh</MenuItem>
            </Select>
          </FormControl>

          <div className="pick-date">

            <span>từ</span>
            <DatePicker 
              disableToolbar
              variant="inline"
              format="DD/MM/YYYY"
              margin="normal"
              disabled={date !== 'custom'}
              value={fromDate}
              onChange={date => setFromDate(date)}
            />
            <span>đến</span>
            <DatePicker 
              disableToolbar
              variant="inline"
              format="DD/MM/YYYY"
              margin="normal"
              disabled={date !== 'custom'}
              value={toDate}
              onChange={date => setToDate(date)}
            />
          </div>
        </header>
      )}

      {value === 0 && <div className="pt-3 pb-5">
          <LineChart data={data}/>
          <div className="w-100 text-center mt-3">
            <span>Tổng: <b>{converCurrency(total)} đ</b></span>
          </div>
        </div>}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};
const TabPanel = connect(
  mapStateToProps
)(_TabPanel);

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const Salary = (props) => {
  const [value, setValue] = useState(0);
  const {user} = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  

  return (
    <div className="page-wrapper">
      <div className="salary-container ">
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"

          >
            <Tab label={<div className="statistic-title"><span>Số tiền nhận được</span></div>} {...a11yProps(0)} />
            <Tab label={<div className="statistic-title"><span>Số học sinh</span><h5>{user.numberOfStudent || 0}</h5></div>} {...a11yProps(1)} />
            <Tab label={<div className="statistic-title"><span>Số giờ dạy</span><h5>{user.teachedHour || 0}</h5></div>} {...a11yProps(2)} />
            <Tab label={<div className="statistic-title"><span></span><h5></h5></div>} {...a11yProps(3)} />
          </Tabs>
        </AppBar>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <TabPanel value={value} index={0}>
          </TabPanel>
          <TabPanel value={-1} index={1}>
          </TabPanel>
          <TabPanel value={-1} index={2}>
          </TabPanel>
          <TabPanel value={-1} index={3}>
          </TabPanel>
        </MuiPickersUtilsProvider>
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps
)(Salary);

