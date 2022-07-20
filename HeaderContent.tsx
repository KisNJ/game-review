import React,{useEffect,useState} from "react";
import { UnstyledButton, Group,Button, Title, ColorScheme, ActionIcon } from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";
import {auth,provider} from "../firebase-config"
import {signInWithPopup,signOut} from "firebase/auth"
import {Link} from "react-router-dom"
interface Props {
  toggle: (value?: ColorScheme) => void;
  dark: boolean;
  setLogged:React.Dispatch<React.SetStateAction<boolean>>;
}
const HeaderContent: React.FC<Props> = ({ toggle, dark,setLogged }) => {
    //  const[logged,setLogged2]=useState(false)
    function login(){
        signInWithPopup(auth,provider)
    }
    function signO(){
        signOut(auth)
    }
    return (
    <Group align="center" position="apart"style={{ height: "100%" }}>
      <UnstyledButton<typeof Link>  component={Link} to="/">
      <Title order={1}>Game Reviews</Title>
      </UnstyledButton>
    <Group>
        <Button<typeof Link>  size="lg" component={Link} to="/games">Games</Button>
        <Button size="lg" onClick={()=>{
            if(auth.currentUser!==null){
                signO()
            }else{
                login()
            }
            }} variant="light">{auth.currentUser!==null?"Sign out":"Login"}</Button>
    <ActionIcon
        size="lg"
        variant="outline"
        color={dark ? "yellow" : "blue"}
        onClick={() => toggle()}
        title="Toggle color scheme"
      >
        {dark ? <Sun size={18} /> : <MoonStars size={18} />}
      </ActionIcon>
    </Group>

    </Group>
  );
};

export default HeaderContent;
