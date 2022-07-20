import { Button, Input, Textarea } from "@mantine/core";
import React,{useState,useEffect} from "react";
import { auth } from "../firebase-config";
interface Props{
    submit:(text:string)=>void;
}
const ReplyForm:React.FC<Props> = ({submit}) => {
  const [commentV, setCommentV] = useState("")
    return (
    <>
      <Input
        mt="sm"
        disabled
        placeholder={auth.currentUser?.displayName as string}
      ></Input>
      <Textarea required placeholder="Your comment" autosize minRows={2} value={commentV} onChange={(e)=>setCommentV(e.target.value)}></Textarea>
        <Button mx="xl" mt="sm" onClick={()=>{
          submit(commentV)
           setCommentV("")}}>Add comment</Button>
    </>
  );
};

export default ReplyForm;
