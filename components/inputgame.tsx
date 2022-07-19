import React,{useState} from 'react'
import {db} from "../firebase-config"
import { TextInput, Paper,MantineProvider,LoadingOverlay, Button, Text, Container} from '@mantine/core';
import {addDoc,collection} from "firebase/firestore"
const Inputgame = () => {
  const [inputdata,setInputData]=useState({
    avg:0,
    background_img:"",
    cover_img:"",
    description:"",
    name:"",
    plot:"",
    review_count:0
  })
  const [visible, setVisible] = useState(false);
  async function handleClick(){
    setVisible(true)
   addDoc(collection(db,"games"),{...inputdata}).then(()=>{
    setInputData({
      avg:0,
      background_img:"",
      cover_img:"",
      description:"",
      name:"",
      plot:"",
      review_count:0
    })
    setVisible(false)
   }).catch((err)=>{
    console.log(err)
    setVisible(false)
   })
  }
  function change(e:React.ChangeEvent<HTMLInputElement>){
    setInputData(old=>({
      ...old,
      [e.target.id]:e.target.value
    }))
  return (
    <MantineProvider
    theme={{
      colorScheme: "dark",
      fontSizes:{
        lg:20,
        xl:30
      },
      primaryColor: "cyan",
    }}>
    <Paper   style={{position: 'relative' }} className="App">
      <LoadingOverlay visible={visible} />
      <Paper p="xl" sx={(theme)=>({height:"100vh"})}>
      <Container p="xl" sx={(theme)=>({background:theme.colors.dark[9]})}>
        <TextInput value={inputdata.background_img} onChange={(e)=>change(e)} label="Bacgkround img link" name="bc" id="background_img" />
        <TextInput value={inputdata.cover_img} onChange={change}size="lg"label="Cover img link" name="cv" id="cover_img" />
        <TextInput value={inputdata.name}label="Name" onChange={change}name="nm" id="name" />
        <TextInput multiple required value={inputdata.description} onChange={change}label="Description" name="dc" id="description" />
        <TextInput value={inputdata.plot}label="Plot"onChange={change} name="pt" id="plot" />
      <Button variant='gradient' gradient={{ from: "cyan", to: 'pink', deg: 45 }}
        onClick={()=>handleClick()} my="md"size="xl"><Text size='xl'>Add to database</Text></Button>
      </Container>
      </Paper>
    </Paper>
    </MantineProvider>
  )
}
}
export default Inputgame