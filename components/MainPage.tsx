import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  Container,
  SegmentedControl,
  Center,
  SimpleGrid,
  ColorScheme,
} from "@mantine/core";
import { db } from "../firebase-config";
import {
  query,
  collection,
  orderBy,
  limit,
  Query,
  onSnapshot
} from "firebase/firestore";
import { GameType } from "./gameType";
import CardForMain from "./CardForMain";
import { nanoid } from "nanoid";
interface Props{
    colorScheme:ColorScheme;
}
const MainPage:React.FC<Props> = ({colorScheme}) => {
  const [value, setValue] = useState("best");
  const [displayThese, setDisplayThese] = useState<GameType[]>([]);
  
  useEffect(() => {
    let q;
    if (value === "best") {
      q = query(collection(db, "games"), orderBy("avg", "desc"), limit(3));
    } else if (value === "most") {
      q = query(
        collection(db, "games"),
        orderBy("review_count", "desc"),
        limit(3)
      );
    }
    const unsub=onSnapshot(q as Query,(data)=>{
      const docs = data.docs;
      const newArr = docs.map((xa) => ({ ...xa.data(), id: xa.id }));
      setDisplayThese(newArr);
    })
    return ()=>{
      unsub()
    }
  }, [value]);

  return (
    <Stack>
      <Container>
        <Text
          align="center"
          style={{ fontWeight: "bold", fontSize: "3rem" }}
          variant="gradient"
          gradient={{ from: "cyan", to: "grape", deg: 150 }}
        >
          Review and Discuss video games
        </Text>
        <Center>
          <SegmentedControl
            size="xl"
            mt="lg"
            value={value}
            onChange={setValue}
            data={[
              { label: "Best Rated", value: "best" },
              { label: "Most Popular", value: "most" },
            ]}
          />
        </Center>
        <SimpleGrid
          mt="xl"
          cols={3}
          breakpoints={[
            { maxWidth: "lg", cols: 3, spacing: "md" },
            { maxWidth: "sm", cols: 2, spacing: "sm" },
            { maxWidth: "xs", cols: 1, spacing: "sm" },
          ]}
        >
          {displayThese.map((game,i) => {
            return (
              <CardForMain game={game} key={nanoid()} colorScheme={colorScheme} />
            );
          })}
        </SimpleGrid>
      </Container>
    </Stack>
  );
};

export default MainPage;
