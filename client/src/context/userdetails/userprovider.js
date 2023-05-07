import React, { useState } from 'react'
import Userdetails from './userdetail'
import axios from 'axios';
export default function Provider({children}) {
    
    const [currentspot,setcurrentspot]=useState({latitude:13,longitude:85});
    const [nearspots,setnearspots]=useState('');
    const [userposition,setuserposition]=useState({
        "latitude":13,
        "longitude":85
    });

    async function book(){
        try{
             let res=await axios.post('/user/book',{owned_id:currentspot.owned_id,user_id:localStorage.getItem('user_id')});
            //  let updatedcurspot=currentspot;
            //  updatedcurspot.status=false;
             setcurrentspot({...currentspot,status:true});
             console.log("from book",currentspot);
             nearspots[currentspot.index].status=true;
             alert(res.data.message);
          }catch(error){
             alert(error.response.data.message)
        }
    }


    async function cancel(){
        try{
             let res=await axios.post('/user/cancel',{bookedby:localStorage.getItem('user_id')});
             currentspot.status=false;
             updatecurrentspot(currentspot);
             nearspots[currentspot.index].status=false;
             alert(res.data.message);
          }catch(error){
             alert(error.response.data.message)
        }
    }
    async function sell(){
      try{
        let res=await axios.post('/user/sell',{latitude:userposition.latitude,longitude:userposition.longitude,owned_id:localStorage.getItem('user_id')});
        alert(`${res.data.message} at your current location`);
     }catch(error){
        alert(error.response.data.message)
     }     
    }
    function near(pos){
        setuserposition(pos);
        pos.user_id=localStorage.getItem("user_id")
        axios.post('user/near', pos).then((info)=>{
            if(info.data!=''){
              setnearspots(info.data);
              info.data[0].index=0;
              console.log(info.data)
              setcurrentspot(info.data[0]);
              alert("Showing nearest spot");
            }else{
              alert("No parking spots found");
            }
            }).catch((error)=>{
                    alert(error.response.data.message);
            })
    }

    function updatecurrentspot(){
        console.log("hi");
        if(nearspots!=""){
          let index=currentspot.index+1;
          if(index<nearspots.length){
             let nextspot=nearspots[index];
             nextspot.index=index;
             console.log(nextspot)
             setcurrentspot(nextspot);
          }else{
             index=0;
             let nextspot=nearspots[index];
             nextspot.index=index;
             setcurrentspot(nextspot);
          }
        }else{
          alert('No parking spots near you')
        }
    }
    return (
    <Userdetails.Provider value={{currentspot,updatecurrentspot,userposition,near,cancel,book,sell}}>
        {children}
    </Userdetails.Provider>
  )
}
