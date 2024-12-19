import React from "react";
import styled from "styled-components";

const ScoreItem = ({ round, winner, playerTimes }) => {
  return (
    <Item>
      라운드 {round}: 승자 {winner}
      <br/>
      {Object.entries(playerTimes)
        .map(([player, time]) => `${player}: ${time}s`)
        .join(", ")}
    </Item>
  );
};

export default ScoreItem;

const Item = styled.p`
  font-size: 18px;
  margin: 5px 0;
  border-radius: 5px;
  border: 2px solid rgba(255,255,255,0.5);
  padding:5px;
`;