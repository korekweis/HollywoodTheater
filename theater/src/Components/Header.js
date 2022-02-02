import React, { useEffect, useState } from 'react';
import "./Header.css";
import axios from "../axios";

import Login from "./Modal/Login";
import SignUp from './Modal/SignUp';

import Modal from '@mui/material/Modal';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { Button } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

function getModalStyle() { 
  const top = 40;
  const left = 50;

  return { 
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: { 
    position: "absolute",
    width: 500, 
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
    boxShadow: theme.shadows[5], 
    padding: theme.spacing(2, 4, 3),
  }, 
}));

function Header() {
  const [modalOpen, setModalOpen] = useState(false); // checking if the modal is open or not 
  const changeModal = () => { 
    setModalOpen(!modalOpen)
  }

  const [user, setUser] = useState(null);
  // const changeUser = (userLogIn) => { 
  //   setUser(userLogIn);
  // }
  useEffect(() => { 
    // axios.get('/user/loggedIn', {}, {withCredentials: true})
    axios.get('/user/loggedIn', {}, {withCredentials: true})
    .then(response => { 
      // console.log("RESPONSE FROM LOGGED IN");
      // console.log(response.data);
      setUser(response.data);
    })
  })

  const loggingOut = (e) => { 
    axios.post('/user/loggingOut')
    .then(response => { 
      setUser(null);
    })
  }

  const [modalStyle] = useState(getModalStyle); 
  const classes = useStyles();

  //for modal 
  const [tabValue, setTabValue] = useState("1");
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
      <div class="header">
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
                  <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                    <Tab label="Login" value="1" />
                    <Tab label="Sign Up" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  {/* TODO: UPDATE */}
                  <Login 
                    modalFunc = { changeModal }
                    // changeUser = { changeUser }
                  />
                </TabPanel>
                <TabPanel value="2">
                  <SignUp 
                    modalFunc = { changeModal }
                    // changeUser = { changeUser }
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </Modal>
        <div class="choices">
          <h1>Hollywood</h1>
          <ul>
            <li><Link to="/">Movies</Link></li>
            <li><Link to="/wishlist">Watchlist</Link></li>
            <li><Link to="/myTickets">My Tickets</Link></li>
          </ul>
        </div>
        { user ? (
          <div class="signIn">
            <IconButton onClick={ loggingOut }>
                <AccountCircleIcon fontSize="large" className="Account Circle" style={{ color: 'white' }}/>
            </IconButton>
            <Button onClick={ loggingOut }><h3>Logout, {user['firstName']}</h3></Button>
          </div> 
        ) : (
          <div class="signIn">
            <IconButton onClick={() => setModalOpen(true)}>
                <AccountCircleIcon fontSize="large" className="Account Circle" style={{ color: 'white' }}/>
            </IconButton>
            <Button onClick={() => setModalOpen(true)}><h3>Log In or Create an Account</h3></Button>
          </div>
        )}
      </div>
  )
}

export default Header