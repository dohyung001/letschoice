import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const GameStartPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const [end, setEnd] = useState(false);
  const { id: roomId } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000); // 1초 후에 글자가 나타나도록 설정

    return () => {
      clearTimeout(timer);
    }
  }, []);

  // 애니메이션 후 2초 후에 페이지 전환
  useEffect(() => {
    if (isVisible) {

      const navigateTimer = setTimeout(() => {
        navigate(`/gamePage/${roomId}`)
      }, 2500);

      return () => {
        clearTimeout(navigateTimer);
      };
    }
  }, [isVisible, navigate]);



  return (
    <GameStartContainer>
      {isVisible && (
        <GameStartText>
          <div>
            {'GAME'.split('').map((char, index) => (
              <GameStartLetter key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                {char}
              </GameStartLetter>
            ))}
          </div>
          <div>
            {'START!'.split('').map((char, index) => (
              <GameStartLetter key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                {char}
              </GameStartLetter>
            ))}
          </div>
        </GameStartText>
      )}
    </GameStartContainer>
  );
}
export default GameStartPage;

// 애니메이션 정의
const grow = keyframes`
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const GameStartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding-bottom: 80px; // 상단 여백을 추가하여 위치를 좀 더 위로 올림
`;

const GameStartText = styled.div`
  text-align: center;
  margin-left: 4rem;
`;

const GameStartLetter = styled.span`
  font-size: 13rem;
  color: white; // 텍스트 색상 추가
  font-weight: bold;
  opacity: 0;
  transform: scale(0);
  animation: ${grow} 0.5s forwards;
  margin-right: 0.2rem; // 문자 간격을 띄우기 위한 margin 추가


  /* 글씨 테두리 추가 */
  -webkit-text-stroke: 2px #6E4FDF; /* 테두리 두께 및 색상 */
`;

