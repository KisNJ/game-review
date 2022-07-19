import {
  Stack,
  Title,
  Badge,
  Text,
  Divider,
  Group,
  ActionIcon,
  LoadingOverlay
} from "@mantine/core";
import { Bucket, Plus, Edit,Minus,X } from "tabler-icons-react";
import { auth,db } from "../firebase-config";
import React,{useState} from "react";
import ReplyForm from "./ReplyForm"
import { updateDoc,doc } from "firebase/firestore";
import { NotificationsProvider,showNotification,hideNotification  } from '@mantine/notifications';
import { nanoid } from "nanoid";
interface Props {
  name: string;
  text: string;
  edited: boolean;
  reply_to: string;
  author_id: string;
  game_id:string;
  index:number;
  close:(index: number, nesting: number)=> void;
}

const Comment: React.FC<Props> = ({
  name,
  text,
  edited,
  reply_to,
  game_id,
  author_id,
  index,
  close,
}) => {
  function submitComment(text:string){

    let splitted=reply_to.split('/')
    let zero=splitted[0]
    splitted.shift()
    let path=`replies`
    for(let i=0;i<splitted.length;i++){
        path=path+`.${splitted[i]}.replies`
    }
    let id=nanoid()
    setVisible(true)
    updateDoc(doc(db,`games/${game_id}/Comments`,reply_to.split('/')[0]),{[`${path}.${id}`]:{replies:{},text:text,author_id:auth.currentUser?.uid,edited:false,name:auth.currentUser?.displayName,reply_to:`${reply_to}/${id}`}}).then(()=>{
      setShowReply(false)
      setVisible(false)
    })    
  }
  function addComment(){
    console.log("shoe")
    if(auth.currentUser===null){
      showNotification({
        onClose: () => hideNotification('msg'),
        autoClose: 3000,
        color:"red",
        message: 'Login to comment',
        id:"msg"
      })
      setShowReply(false)
    }else{
      setShowReply(old=>!old)
    }
  }
  const[showReply,setShowReply]=useState<boolean>(false)
  const[visible,setVisible]=useState<boolean>(false)
  console.log(index)
  console.log(reply_to.split("/").length)
  return (
    <>
     <NotificationsProvider zIndex={2077} limit={1}>
      {reply_to.split("/").length === 1 && (
        <Divider
        onClick={()=>close(index,reply_to.split("/").length)}
          label={
            <Title order={3}>
              {name} {edited && <Badge>Edited</Badge>}
            </Title>
          }
        />
      )}
      <Stack
        onClick={()=>close(index,reply_to.split("/").length)}
        spacing={0}
        justify="flex-start"
        ml={(reply_to.split("/").length - 1) * 15}
      >
        {reply_to.split("/").length !== 1 && (
          <Title order={3} style={{ marginBottom: "0" }}>
            {name} {edited && <Badge>Edited</Badge>}
          </Title>
        )}
        <Text style={{ fontSize: "20px" }}>{text}</Text>
        {auth.currentUser&&showReply&&<div style={{position: 'relative' }}><LoadingOverlay visible={visible}/><ReplyForm submit={submitComment}/></div>}
        <Group position="right" style={{ height: "48px" }}>
          <ActionIcon title="Reply" onClick={()=>addComment()}>
            {showReply?<Minus size={48}/>:<Plus size={48} />}
          </ActionIcon>
          {auth.currentUser !== null && auth.currentUser.uid === author_id && (
            <ActionIcon title="Edit">
              <Edit size={48} />
            </ActionIcon>
          )}
          {auth.currentUser !== null && auth.currentUser.uid === author_id && (
            <ActionIcon variant="filled" color="red" title="Delete">
              <Bucket size={48} />
            </ActionIcon>
          )}
        </Group>
      </Stack>
      </NotificationsProvider>
    </>
  );
};

export default Comment;
