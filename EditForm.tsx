import React,{useState} from "react";
import { ActionIcon, Button, Input, Textarea,Group } from "@mantine/core";
import { auth } from "../firebase-config";
import { Minus } from "tabler-icons-react";
interface Props {
  text: string;
  edit: (texta:string) => void;
  setShowEdit:React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditForm: React.FC<Props> = ({ edit, text,setShowEdit }) => {
    const[value,setValue]=useState(text)
  return (
    <div>
      <Input
        mt="sm"
        disabled
        placeholder={auth.currentUser?.displayName as string}
      ></Input>
      <Textarea value={value} onChange={(e)=>setValue(e.target.value)} required placeholder="Edit post" autosize minRows={2} />
      <Group>
    <Button mx="xl" mt="sm" onClick={()=>edit(value)}>
        Submit Edit
      </Button>
      <ActionIcon onClick={()=>setShowEdit(false)}>
        <Minus />
      </ActionIcon>
      </Group>

    </div>
  );
};
