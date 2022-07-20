import React from "react";
import {Link,useNavigate} from "react-router-dom"
import { Card, ColorScheme, Text, Group} from "@mantine/core";
import { GameType } from "./gameType";
import FullStarRating from "./FullStarRating";
interface Props {
  game: GameType;
  colorScheme: ColorScheme;
}
const CardForMain: React.FC<Props> = ({ game, colorScheme }) => {
  let navigate=useNavigate()
  return (
    // <Link to={`/games:${game.id}`}>
    <Card
      shadow="lg"
      onClick={()=>navigate(`/games:${game.id}`)}
      styles={(theme) => ({
        root:
          colorScheme === "light"
            ? { backgroundColor: theme.colors.gray[3] }
            : {},
      })}
    >
      <Card.Section>
        <img src={game.cover_img} alt="" />
      </Card.Section>
      <Text align="center" style={{ fontWeight: "bold" }}>
        {game.name}
      </Text>
      <Group>
        <FullStarRating game={game}/>
      </Group>
    </Card>
    // </Link>
  );
};

export default CardForMain;
