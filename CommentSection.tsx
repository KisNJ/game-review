import React, { useEffect, useState,useRef } from "react";
import { CommentType } from "./GamePage";
import Comment from "./Comment";
import { LoadingOverlay } from "@mantine/core";
import ReplyForm from "./ReplyForm";
import { auth, db } from "../firebase-config";
import { setDoc, doc,serverTimestamp  } from "firebase/firestore";
import { nanoid } from "nanoid";
interface Props {
  comments: CommentType[];
  game_id: string;
}
const CommentSection: React.FC<Props> = ({ comments, game_id }) => {
  let flattenedArr: CommentType[] | any[] = [...comments];
  const [flattenedArrState, setFlattenedArrState] = useState<
    CommentType[] | any[]
  >([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [closed, setClosed] = useState<number[]>([]);
  const [hover, setHover] = useState<number[]>([]);
  const [visible,setVisible]=useState(false)
  let makeRef=useRef()
  useEffect(() => {
    for (let i = 0; i < flattenedArr.length; i++) {
      if (flattenedArr[i] !== undefined) {
        // console.log(Object.keys(flattenedArr[i].replies));
        if(flattenedArr[i].replies!==undefined){
        if (Object.keys(flattenedArr[i].replies).length !== 0) {
          let t = i;
          for (const key in flattenedArr[i].replies) {
            flattenedArr.splice(t + 1, 0, flattenedArr[i].replies[key]);
            t++;
          }
        }

        }

      }
    }
    setFlattenedArrState(flattenedArr);
  }, [comments]);
  function close(index: number, nesting: number) {
    let tempArr = [...closed];
    if (tempArr.includes(index + 1)) {
      //open
      for (let i = index + 1; i < flattenedArrState.length; i++) {
        if (nesting < flattenedArrState[i].reply_to.split("/").length) {
          let rI=tempArr.indexOf(i)  
          if (rI>-1) {
              tempArr.splice(rI,1);
            }
        } else {
          break;
        }
      }
    } else {
      //close
      for (let i = index + 1; i < flattenedArrState.length; i++) {
        if (nesting < flattenedArrState[i].reply_to.split("/").length) {
            if (!closed.includes(i)) {
              tempArr.push(i);
            }
        } else {
          break;
        }
      }
    }

    console.log(tempArr);
    setClosed([...tempArr]);
  }
  function calculateMouseOver(index: number, nesting: number) {
    let tempArr = [index];
    for (let i = index + 1; i < flattenedArrState.length; i++) {
      if (nesting < flattenedArrState[i].reply_to.split("/").length) {
        tempArr.push(i);
      } else {
        break;
      }
    }
    setHover([...tempArr]);
  }
  function submitNewComment(text: string) {
    setVisible(true)
    let id = nanoid();
    setDoc(doc(db, `games/${game_id}/Comments`, id), {
      replies: {},
      text: text,
      reply_to: id,
      author_id: auth.currentUser?.uid,
      name: auth.currentUser?.displayName,
      edited: false,
      timestamp: serverTimestamp(),
    }).then(()=>{
      setVisible(false)
    })
  }
  return (
    <>
      <div onMouseLeave={() => setHover([])}>
        {flattenedArrState.map((comment, index) => {
          if (!closed.includes(index)) {
            return (
              <Comment
                index={index}
                game_id={game_id}
                key={
                  comment.reply_to?.split("/")[
                    comment.reply_to?.split("/").length - 1
                  ]
                }
                name={comment.name}
                author_id={comment.author_id}
                reply_to={comment.reply_to}
                text={comment.text}
                edited={comment.edited}
                close={close}
                calculateMouseOver={calculateMouseOver}
                hovered={hover}
                closed={closed}
                replies={comment.replies}
              />
            );
          }
        })}
      </div>
      <div style={{position:"relative"}}>
      <LoadingOverlay visible={visible}/>
      {auth.currentUser !== null && <ReplyForm submit={submitNewComment} />}  
      </div>
    </>
  );
};

export default CommentSection;
