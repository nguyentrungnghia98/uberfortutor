import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  makeStyles,
  Tabs,
  Tab,
} from '@material-ui/core';
import './Setting.scss'
import BasicInfo from './BasicInfo';
import Job from './Job';
import Salary from './Salary';
import ChangePassword from './ChangePassword';
import { connect } from 'react-redux';
import Withdrawal from './Withdrawal';
import {User} from '../../apis';
import {fetchUser} from '../../actions/user';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'space-between'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: "30%"
  },
  tab: {
    background: 'white',
    boxShadow: '0 4px 12px #c7c7c7',
    width: "63%",
    '& > div': {
      padding: '8px 20px 0'
    }
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%'
  }
}));


const Setting = (props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const {role} = props;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=>{
    async function reload(){
      try {
        const user = await User.getInfo();
        props.fetchUser(user);
      } catch (err) {
        console.log('err', err);
      }
    }
    reload();
  }, [])

  return (
    <div className="setting page-wrapper">
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="Thông tin cơ bản" icon={<i className="fas fa-user" />} {...a11yProps(0)} />
          <Tab label={role === 1 ? "Nghề nghiệp và kĩ năng" : "Nghề nghiệp"} icon={<i className="fas  fa-graduation-cap" />} {...a11yProps(1)} />
          {role === 1 && <Tab label="Thu thập" icon={<i className="fas fa-dollar-sign" />} {...a11yProps(2)} />}
          <Tab label="Đổi mật khẩu" icon={<i className="fas fa-key" />} {...a11yProps(3)} />
          <Tab label="Rút tiền" icon={<i className="fas fa-wallet" />} {...a11yProps(3)} />
        </Tabs>
        <TabPanel className={classes.tab} value={value} index={0}>
          <BasicInfo />
        </TabPanel>
        <TabPanel className={classes.tab} value={value} index={1}>
          <Job />
        </TabPanel>
        {role === 1 && <TabPanel className={classes.tab} value={value} index={2}>
          <Salary />
        </TabPanel>}

        <TabPanel className={classes.tab} value={value} index={role === 1 ? 3 : 2}>
          <ChangePassword />
        </TabPanel>

        <TabPanel className={classes.tab} value={value} index={role === 1 ? 4 : 3}>
          <Withdrawal />
        </TabPanel>
      </div>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    role: state.auth.user.role
  };
};

export default connect(
  mapStateToProps,{fetchUser}
)(Setting);