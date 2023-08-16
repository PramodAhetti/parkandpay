import React from 'react'

export default function Home() {
  let user=localStorage.getItem('auth_token');
  
  return (
   
    <>
    {console.log(user.name)}
    <div className='line1'>.PARK</div><div className='line2'>.PAY</div>
    <div className='user_location'><input placeholder='Enter your location'></input><button>Find</button></div>
    <div className='desc'> Easy to use: Park and Pay is a simple and intuitive app that makes it easy to pay for parking.</div>
    </>
  )
}
