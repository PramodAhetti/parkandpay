import React from 'react';
import { Link } from 'react-router-dom';
import {  Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
export default function Nav() {
  let user=useSelector(state=>state.user);
  console.log(user)
  return (
    <div className='navbox'>
      <div className="logo">@PARKNPAY</div>
      <nav className='nav_box'>
        <Link className='routes' to='/'>HOME</Link>
        <Link className='routes'  to='/about'>ABOUT</Link>
        <Link className='routes'  to='/about'>FEATURES</Link>
        {(user.name==undefined)?(   <>     <Link className='routes'  to='/login'>LOGIN</Link>
        <Link className='routes'  to='/signup'>SIGNUP</Link></>):( <Link className='routes'  to='/login'>{user.name}</Link>)}
      </nav>
      <Outlet />
    </div>
  );
}
