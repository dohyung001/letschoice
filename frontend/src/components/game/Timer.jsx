import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Timer = ({ isRunning, onTimeUpdate, currentRound }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          onTimeUpdate && onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, onTimeUpdate]);

  useEffect(() => {
    setTime(0); // 라운드가 바뀔 때 타이머 초기화
  }, [currentRound]);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <TopInfo>
      <Round>{currentRound} 라운드</Round>
      <Time>{formatTime(time)}</Time>
    </TopInfo>
  );
};

export default Timer;

const TopInfo = styled.div`
  background-color: #444;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
`;

const Time = styled.p`
  font-size: 32px;
  margin: 5px 0 0 0;
`;

const Round = styled.h2`
  font-size: 24px;
  margin: 0;
`;
