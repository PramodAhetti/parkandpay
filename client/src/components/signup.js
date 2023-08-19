import React from 'react'
import axios from 'axios'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';


export default function Signup() {
  const user=useSelector(state=>state.user)
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const newuser=async ()=>{
          let userdata={name:document.getElementById('name').value,
                        email:document.getElementById('email').value,
                        password:document.getElementById('password').value}
          try{
            let res=await axios.post('https://dev-book.onrender.com/user/new',userdata);
            res=res.data;
            console.log(res);
            delete userdata.password;
            userdata.token=res.data.token;
            console.log(userdata);
            dispatch({type:'NEW',payload:userdata});
            navigate('/chat')
          }catch(error){
            alert(error.response.data.err);
            navigate('/signup')
          }

  }

  return (
    <div className='loginbox'>
          <br></br>
          <div>.Signup</div>
          <br></br>
          <input className='input' id="name" placeholder='Name'></input>
          <input className='input' id="email" placeholder='email'></input>
          <input className='input' id="password" placeholder='password'></input>
          <br></br>
          <button className='button' onClick={newuser} >submit</button>
          <br></br>
    </div>
  )
}
