import React from 'react'

export default function description(props) {
  return (
   <>
   <img className= "homeimg" src="https://www.iss.nus.edu.sg/images/default-source/default-album/software-dev.jpg?Status=Master&sfvrsn=aa8aa05f_0"></img>
   <div className='description'>
     <center className="title">{props.title}</center>
     <center className="desc">{props.desc}</center>   
   </div>
   </>
  )
}
