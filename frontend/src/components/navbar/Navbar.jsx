import React, { useState, useEffect } from 'react';
import "./navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import balance from '../../assets/navbar/balance.png'
import notification from '../../assets/navbar/notification.png'
// import profile from '../../assets/navbar/profile.png'
import profile from '../../assets/navbar/profileuser.png'

import { GiToggles } from "react-icons/gi";
import SideDrawer from '../sidebar/SideDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios'

function Navbar() {
    const isLargeScreen = useMediaQuery('(max-width:1024px)');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [profileImg,setProfileImg] = useState('');
    const toggleDrawer = (newOpen) => () => {
        setDrawerOpen(newOpen);
    };

    useEffect(() => {
        const fetchUserName = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await axios.get('/api/user_profile', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const imageUrl = response.data.image;
                const updatedImageUrl = `${imageUrl}?timestamp=${new Date().getTime()}`;
                    setUserName(response.data.name);
                    setProfileImg(updatedImageUrl)
                } catch (error) {
                    console.error('Error fetching user name:', error);
                }
            }
        };
        fetchUserName();
    }, []);
    return (
        <>
            <div className='nav-parent-container'>
                <div>
                    {isLargeScreen && (<GiHamburgerMenu  onClick={toggleDrawer(true)} className='sidenav-toggle' />)}
                    <SideDrawer open={drawerOpen} toggleDrawer={toggleDrawer} />
                </div>
                <div className='nav-main-container'>
                    <div className='balance-main-container'>
                        <img className='nav-balance-img' src={balance} alt="balance" />
                        <div className='balance-inner-container'>
                            <p className='balance-text'>Total Balance</p>
                            <p className='balance-value'>$0.00</p>
                        </div>
                    </div>
                    <div className='notification-main-container'>
                        <img className='nav-noti-img' src={notification} alt="notification" />
                    </div>
                    <div className='profile-main-container'>
                        <p className='profile-text'>{userName}</p>
                        <img className='nav-profile-img' src={profileImg || profile } alt="profile" />
                        
                    </div>
                </div>
            </div>
        </>
    )
}
export default Navbar