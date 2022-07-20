import React, { useEffect, useState } from "react";
import { Title, Text, SimpleGrid, ColorScheme,Container } from "@mantine/core";
import {nanoid} from "nanoid"
import {
  query,
  Query,
  orderBy,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { GameType } from "./gameType";
import { db } from "../firebase-config";
import CardForMain from "./CardForMain";
interface Props{
  colorScheme:ColorScheme;
}
const Games:React.FC<Props> = ({colorScheme}) => {
  const [displayThese, setDisplayThese] = useState<GameType[]>([]);
  useEffect(() => {
    let q = query(collection(db, "games"), orderBy("name"));
    const unsub = onSnapshot(q as Query, (data) => {
      const docs = data.docs;
      const newArr = docs.map((xa) => ({ ...xa.data(), id: xa.id }));
      setDisplayThese(newArr);
    });
    return () => {
      unsub();
    };
  }, []);
  return (
    <Container>
      <SimpleGrid
        mt="xl"
        cols={3}
        breakpoints={[
          { maxWidth: "lg", cols: 3, spacing: "md" },
          { maxWidth: "sm", cols: 2, spacing: "sm" },
          { maxWidth: "xs", cols: 1, spacing: "sm" },
        ]}
      >
        {displayThese.map((game, i) => {
          return (
            <CardForMain game={game} key={nanoid()} colorScheme={colorScheme} />
          );
        })}
      </SimpleGrid>
    </Container>
  );
};

export default Games;
