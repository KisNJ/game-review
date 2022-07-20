import { ColorScheme, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { query, doc, onSnapshot, collection, orderBy } from "firebase/firestore";
import { db,auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { GameType } from "./gameType";
import FullStarRating from "./FullStarRating";
import CommentSection from "./CommentSection";
import { Text, Container, Stack, Group } from "@mantine/core";
interface Props {
  colorScheme: ColorScheme;
}
export interface CommentType {
  id: string;
  author_id?: string;
  edited?: boolean;
  name?: string;
  text?: string;
  reply_to?:string;
  replies?:CommentType[];
}
export const GamePage: React.FC<Props> = ({ colorScheme }) => {
  let params = useParams();
  let gameId = params.id?.substring(1) as string;
  const [gameData, setGameData] = useState<GameType>();
  const [comments, setComments] = useState<CommentType[]>();
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "games", gameId), (data) => {
      setGameData({ ...data.data(), id: data.id });
    });
    const q=query(collection(db, `games/${gameId}/Comments`),orderBy("timestamp"))
    const unsub2=onSnapshot(q,(data)=>{
      let dataArr:CommentType[]=[]
      data.docs.forEach((doc) => dataArr.push({ ...doc.data(), id: doc.id }))
      setComments([...dataArr])
    })
    return () => {
      unsub();
      unsub2();
    };
  }, []);
  console.log("re")
  return (
    <>
      {gameData !== undefined && (
        <Container>
          <div className="img-container">
            <img className="cover" src={gameData?.cover_img} alt="" />
            <img
              className="background"
              src={gameData?.background_img}
              alt="aa"
            />
          </div>
          <Stack mt="sm">
            <Group position="apart" align="flex-end">
              <Title
                order={2}
                sx={(theme) => ({ color: theme.colors.indigo[9] })}
              >
                Name:
              </Title>
              <Text style={{ fontSize: "22px", fontWeight: "bold" }}>
                {gameData?.name}
              </Text>
            </Group>
            <Group position="apart" className="bigger">
              <FullStarRating game={gameData as GameType} />
            </Group>
            <Stack spacing={2}>
              <Title
                order={2}
                sx={(theme) => ({ color: theme.colors.indigo[9] })}
              >
                Description:
              </Title>
              <Text style={{ fontSize: "20px", textAlign: "justify" }}>
                {gameData?.description}
              </Text>
            </Stack>
            <Stack spacing={2}>
              <Title
                order={2}
                sx={(theme) => ({ color: theme.colors.indigo[9] })}
              >
                Plot:
              </Title>
              <Text style={{ fontSize: "20px", textAlign: "justify" }}>
                {gameData?.plot}
              </Text>
            </Stack>
            <Stack spacing={2}>
              <Title
                order={2}
                sx={(theme) => ({ color: theme.colors.indigo[9] })}
              >
                Comments:
              </Title>
              {comments&&
              <CommentSection game_id={gameId} comments={comments as CommentType[]}/>
              }
            </Stack>
          </Stack>
        </Container>
      )}
    </>
  );
};
