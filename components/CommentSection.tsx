import React, { useEffect, useState, useRef } from "react";
import { CommentType } from "./GamePage";
import Comment from "./Comment";
import { Accordion } from "@mantine/core";
interface Props {
  comments: CommentType[];
  game_id: string;
}
const CommentSection: React.FC<Props> = ({ comments, game_id }) => {
  let flattenedArr: CommentType[] | any[] = [...comments];
  const [flattenedArrState, setFlattenedArrState] = useState<
    CommentType[] | any[]
  >([]);
  const [closed, setClosed] = useState<number[]>([]);
  useEffect(() => {
    for (let i = 0; i < flattenedArr.length; i++) {
      if (flattenedArr[i] !== undefined) {
        // console.log(Object.keys(flattenedArr[i].replies));
        if (Object.keys(flattenedArr[i].replies).length !== 0) {
          let t = i;
          for (const key in flattenedArr[i].replies) {
            flattenedArr.splice(t + 1, 0, flattenedArr[i].replies[key]);
            t++;
          }
        }
      }
    }
    setFlattenedArrState(flattenedArr);
  }, [comments]);
  function close(index: number, nesting: number) {
    if (closed.includes(index+1)){
      setClosed([])
      return
    }
    let tempArr = [];
    for (let i = index + 1; i < flattenedArrState.length; i++) {
      if (nesting < flattenedArrState[i].reply_to.split("/").length) {
        tempArr.push(i);
      }else{
        break
      }
    }
    setClosed([...tempArr]);
  }
  const array1 = [1, 2, 3];
  return (
    <>
      {flattenedArrState.map((comment, index) => {
        if (!closed.includes(index)) {
          return (
            <Comment
              index={index}
              game_id={game_id}
              key={
                comment.reply_to.split("/")[
                  comment.reply_to.split("/").length - 1
                ]
              }
              name={comment.name}
              author_id={comment.author_id}
              reply_to={comment.reply_to}
              text={comment.text}
              edited={comment.edited}
              close={close}
            />
          );
        }
      })}
    </>
  );
};

export default CommentSection;
