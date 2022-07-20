import React from 'react'
import {nanoid} from "nanoid"
interface Props{
    fill:number;
    id2:number;
    myRating:boolean;
    setCurrentHover?:React.Dispatch<React.SetStateAction<number>>;
}
const Star:React.FC<Props> = ({fill,id2,setCurrentHover}) => {
  let id=nanoid()
  function handleHover(){
    if(setCurrentHover!==undefined){
      setCurrentHover(id2)
    }
  }
  return (
    <svg onMouseOver={()=>handleHover()} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="256px" height="256px" viewBox="0 0 32 32">
    <defs>
      <linearGradient id={id}>
        <stop offset={`${fill}%`} stopColor="#F08C00"/>
        <stop offset={`${fill===0?0:100-fill}%`} stopColor="#868e96"/>
      </linearGradient>
    </defs>
    <path fill={`url(#${id})`} d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118
  l11.547-1.2L16.026,0.6L20.388,10.918z"/>
  </svg>
  )
}

export default Star