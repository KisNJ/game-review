import React,{useEffect, useState} from 'react'
import StarRating from './StarRating'
import { GameType,StarType } from './gameType'
import {auth,db} from "../firebase-config"
import {Text,Group} from "@mantine/core"
import { nanoid } from 'nanoid'
import Star from './Star'
import {
    doc,
    updateDoc,
    increment,
  } from "firebase/firestore";
interface Props{
    game:GameType;
}
const FullStarRating:React.FC<Props> = ({game}) => {
    
  let user = auth.currentUser?.uid;
  function getInitialValue() {
    if (auth.currentUser === null) {
      return undefined;
    }
    if (auth.currentUser?.uid !== undefined || auth.currentUser?.uid !== null) {
      if (game.stars !== undefined) {
        if (user !== undefined) {
          // console.log(game.stars[user as keyof {uid:StarType}])
          return game.stars[user as keyof { uid: StarType }];
        }
      }
    } else {
      return undefined;
    }
  }
  useEffect(()=>{
    setCurrentRating(getInitialValue())
  },[game])
    const [currentRating, setCurrentRating] = useState(getInitialValue());
    const [currentHover, setCurrentHover] = useState<number>(0);
    async function updateYourRating(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
      e.stopPropagation();
        if (auth.currentUser !== null) {
          let uid = auth.currentUser.uid;
          let sum = 0;
          let stars2 = game.stars as { uid: StarType };
          let length = 0;
          for (const k in stars2) {
            if (k !== auth.currentUser.uid) {
    
              sum += stars2[k as keyof { uid: StarType }].value;
            }
            if (game.stars !== undefined) {
              
              if (uid !== game.stars[k as keyof { uid: StarType }].uid) {
                
                length += 1;
              } else if (
                currentHover !== game.stars[k as keyof { uid: StarType }].value
              ) {
                length += 1;
              }
            }
          }
          if (game.stars !== undefined) {
            if (game.stars[uid as keyof { uid: StarType }] === undefined) {
              sum += currentHover;
            } else if (
              currentHover !== game.stars[uid as keyof { uid: StarType }].value
            ) {
              sum += currentHover;
            }
          }
          if (game.stars !== undefined) {
            if (game.stars[uid as keyof { uid: StarType }] === undefined) {
              length++;
            }
          }
    
          let avg2 = sum / length;
          if (game.stars !== undefined) {
            if (game.stars[uid as keyof { uid: StarType }] !== undefined) {
              if (
                currentHover !== game.stars[uid as keyof { uid: StarType }].value
              ) {
                await updateDoc(doc(db, "games", game.id), {
                  ["stars." + uid]: {
                    uid: auth.currentUser.uid,
                    value: currentHover,
                  },
                });
                await updateDoc(doc(db, "games", game.id), {
                  avg: avg2,
                });
                if (0 === game.stars[uid as keyof { uid: StarType }].value) {
                  await updateDoc(doc(db, "games", game.id), {
                    review_count: increment(1),
                  });
                }
              } else {
                await updateDoc(doc(db, "games", game.id), {
                  review_count: increment(-1),
                });
                await updateDoc(doc(db, "games", game.id), {
                  ["stars." + uid]: {
                    uid: auth.currentUser.uid,
                    value: 0,
                  },
                });
                if(isNaN(avg2)){
                  avg2=0
                }
                await updateDoc(doc(db, "games", game.id), {
                  avg: avg2,
                });
              }
            } else {
              await updateDoc(doc(db, "games", game.id), {
                ["stars." + uid]: {
                  uid: auth.currentUser.uid,
                  value: currentHover,
                },
                review_count: increment(1),
              });
              
              await updateDoc(doc(db, "games", game.id), {
                avg: avg2,
              });
            }
          }
        }
      }
    let avg: number = game.avg as number;
    let fillArr: number[] = [];
    let myRatingArr: number[] = [];
  
    while (Math.floor(avg) > 0) {
      avg -= 1;
      fillArr.push(1);
    }
    if (fillArr.length < 5) {
      fillArr.push(avg);
    }
    while (fillArr.length < 5) {
      fillArr.push(0);
    }
    fillArr = fillArr.map((f) => Math.abs(f));
    let tempR: number;
    if (currentRating === undefined) {
      tempR = currentHover;
    } else {
      tempR = Math.max(currentRating.value as number, currentHover);
    }
    while (tempR > 0) {
      tempR -= 1;
      myRatingArr.push(1);
    }
    while (myRatingArr.length < 5) {
      myRatingArr.push(0);
    }
  return (
    <>

      <Group>
    <Text>Rating:</Text>
        <Group noWrap spacing="xs">
          {fillArr.map((num, i) => {
            return (
              <Star
                id2={i + 1}
                key={nanoid()}
                myRating={false}
                fill={num * 100}
              />
            );
          })}
        </Group>
        <Text>({game.review_count})</Text>
        </Group>
        
      <Text>
        <Group
          noWrap
          spacing="xs"
          onClick={(e)=>updateYourRating(e)}
          onMouseLeave={() => setCurrentHover(0)}
        >
          <Text>
            {currentRating === undefined ? "Rate this game:" : "Your rating"}
          </Text>

          <StarRating myRatingArr={myRatingArr} game={game} currentHover={currentHover} setCurrentHover={setCurrentHover} currentRating={currentRating}/>
        </Group>
      </Text>
    </>
  )
}

export default FullStarRating