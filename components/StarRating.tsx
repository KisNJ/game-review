import React from 'react'
import Star from './Star';
import { nanoid } from 'nanoid';
import { GameType, StarType } from './gameType';
interface Props{
    game:GameType;
    currentHover:number;
    currentRating:StarType|undefined;
    setCurrentHover:React.Dispatch<React.SetStateAction<number>>;
    myRatingArr:number[];
}
const StarRating:React.FC<Props> = ({game,currentHover,currentRating,setCurrentHover,myRatingArr}) => {
  return (
    <>
        {myRatingArr.map((num, i) => {
            return (
              <Star
                id2={i + 1}
                key={nanoid()}
                myRating={true}
                setCurrentHover={setCurrentHover}
                fill={num * 100}
              />
            );
          })}
    </>
  )
}

export default StarRating