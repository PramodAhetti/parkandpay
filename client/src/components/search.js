import React from 'react'
import Map from '../components/map'
import Displayinfo from '../components/info'
import { useContext } from 'react'
import userdetails from '../context/userdetails/userdetail'
export default function Search() {
  console.log("from search")
  let userstate=useContext(userdetails);
  function near(){
         navigator.geolocation.getCurrentPosition((data)=>{
          let pos={
            latitude:data.coords.latitude,
            longitude:data.coords.longitude,
            radius:10
          }
          userstate.near(pos);

    }
    );
  }
  return (
    <>  
        <div className='titleforsearch'> Park N Pay</div>

        <Displayinfo curspot={userstate.currentspot}></Displayinfo>
        <Map className="mapbox" lat={userstate.currentspot.latitude} lon={userstate.currentspot.longitude}></Map>
        <center className='searchbox'>
        <input placeholder="Location find" className="searchbar location"></input>
        <button className ="searchbar find" onClick={near}>Find</button>
        {
        (userstate.currentspot.status==true)?
        (<button className ="searchbar find" onClick={userstate.cancel}>cancel</button>)
        :(<button className ="searchbar find" onClick={userstate.book}>book</button>)
        }
        <button className='searchbar find' onClick={userstate.updatecurrentspot}>Next</button>
        <button className ="searchbar find" onClick={userstate.sell}>Sell</button>
    </center>
    </>
  )
}
