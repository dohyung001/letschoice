import React from "react";
import styled from "styled-components";
import ScoreItem from "./ScoreItem";

const ScoreSection = ({ scoreHistory }) => {
  return (
    <Section>
      <h3>점수</h3>
      {scoreHistory.map((score, index) => (
        <ScoreItem
          key={index}
          round={score.round}
          winner={score.winner}
          playerTimes={score.playerTimes}
        />
      ))}
    </Section>
  );
};

export default ScoreSection;

const Section = styled.div`
  background-color: #444;
  padding: 20px;
  border-radius: 10px;
  color: #fff;
  overflow-y: auto;
  display:flex;
  flex-direction: column;

  align-items: center;
`;