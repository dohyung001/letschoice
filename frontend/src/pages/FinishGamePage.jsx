import React, { useState, useEffect } from 'react';
import styled,{keyframes} from 'styled-components';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import losecat from '../assets/imgs/losecat.png';
import wincat from '../assets/imgs/wincat.png';
import Firework from '../assets/imgs/firework.png';
import axios from 'axios';

import Home from "../assets/icons/Home.png";

const FinishGamePage = () => {
  const navigate = useNavigate();
  const { id: roomId } = useParams();
  console.log('roomId from useParams:', roomId);

  
  const location = useLocation();
  const { winner, loser } = location.state || {};
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeleteRoom = async (roomId) => {
    try {
      console.log('삭제할 방 ID:', roomId);
      const response = await axios.delete('/adminRouter/rooms', {
        headers: {
          'room-id': roomId, // 헤더에 roomId 추가
        },
      });
      console.log('삭제 응답:', response.data);
      alert('게임이 정상적으로 종료되었습니다.');
    } catch (e) {
      console.error('방 삭제 중 오류:', e.response ? e.response.data : e.message);

    }
  };

  const handleHomeBackButton = () => {
    navigate('/');
  };

  useEffect(() => {
    if (roomId) {
      handleDeleteRoom(roomId);
    } else {
      setErrorMessage('Room ID is missing.');
    }
  }, [roomId]);


  return (
    <Background>
      <PageContainer>
        <WinscoreWrapper>
        <GameText>
        <span style={{ "--index": 0 }}>G</span>
        <span style={{ "--index": 1 }}>A</span>
        <span style={{ "--index": 2 }}>M</span>
        <span style={{ "--index": 3 }}>E</span>
      </GameText>

          <WinWrapper>
            <Winner>{winner} </Winner>
            <WincatImage src={wincat} alt="wincat"></WincatImage>
            <FireworkImage src={Firework} alt="firework"></FireworkImage>
          </WinWrapper>
        </WinscoreWrapper>
        <LosescoreWrapper>
          <LoseWrapper>
            <Loser>{loser}</Loser>
            <LosecatImage src={losecat} alt="losecat"></LosecatImage>
          </LoseWrapper>
          <OverText>
        <span style={{ "--index": 0 }}>O</span>
        <span style={{ "--index": 1 }}>V</span>
        <span style={{ "--index": 2 }}>E</span>
        <span style={{ "--index": 3 }}>R</span>
      </OverText>
        </LosescoreWrapper>

        <MainButton onClick={handleHomeBackButton}>
                <img src={Home} alt="다운로드 아이콘" /> home</MainButton>

      </PageContainer>
    </Background>
  );
}
export default FinishGamePage;


// Styled-components 정의
const Background = styled.div`
  display: flex;
  align-items: center; 
  justify-content: center;
  width: 100%;
  height: calc(100vh - 130px);
  
`;

// GAME 텍스트 스타일
const GameText = styled.div`
  margin-left: 100px;
  color: white;
  font-size: 130px;
  display: flex;
  gap: 5px;

  /* 각 글자 애니메이션 */
  span {
    opacity: 0;
    transform: translateY(-10px);
    animation: fadeIn 0.5s ease forwards;
    animation-delay: calc(var(--index) * 0.2s); /* 글자별 딜레이 */
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// OVER 텍스트 스타일
const OverText = styled.div`
  margin-left: 30px;
  color: white;
  font-size: 130px;
  display: flex;
  gap: 5px;

  /* 각 글자 애니메이션 */
  span {
    opacity: 0;
    transform: translateY(-10px);
    animation: fadeIn 0.5s ease forwards;
    animation-delay: calc(1.2s + var(--index) * 0.2s); /* GAME 끝난 후 시작 */
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MainButton = styled.div`
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  margin-top:570px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageContainer = styled.div`
  
  min-width:1800px;
  display: flex;
  justify-content: space-between;  /* 요소들을 수평으로 나열 */
  align-items: center; /* 수직 정렬 */
  height: 90%;
  padding: 20px;
  background-color: #2e2e2e; /* 배경색 */
  border-radius: 10px;
  gap: 1px; // 이미지 간 간격
  width: 80%; /* 부모 컨테이너의 너비를 100%로 설정 */

  /*min-width:1800px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 90%;
  padding: 20px;
  background-color: #2e2e2e; 
  border-radius: 10px;
  */
`;
const WinscoreWrapper = styled.div`
  display: flex;
  flex: 1; /* 공간을 균등하게 나누도록 설정 */
  align-items: center; // 이미지를 수평으로 정렬
  gap: 5px; // 이미지 간 간격
  justify-content: center; // 이미지들을 중앙에 배치
  
`;


const WinWrapper = styled.div`
  display: flex;
  flex-direction: row; /* 수평 정렬 */
  align-items: center;  /* 수직 가운데 정렬 */
  justify-content: center;  /* 수평 중앙 정렬 */
  gap: 20px; /* 이미지 간 간격 */
  position: relative; /* 사용자 ID와 폭죽 이미지를 올바르게 배치하기 위해 부모를 relative로 설정 */
`;

const FireworkImage = styled.img`
  width: 100px; /* 폭죽 이미지 크기 설정 */
  height: auto;
  position: absolute; /* 캣 이미지와 텍스트 오른쪽에 배치하려면 absolute 사용 */
  top: 0; /* 캣 이미지 위로 올리지 않도록 상단 위치를 0으로 설정 */
  right: -120px; /* 캣 이미지 오른쪽에 배치하기 위해 설정 */
  z-index: 1; /* 캣 이미지 뒤에 배치 */
`;

const Winner = styled.div`
  font-size: 30px;
  position: absolute; /* 캣 이미지 위에 위치시키기 위해 absolute 사용 */
  top: -30px; /* 캣 이미지 위쪽에 텍스트 위치 */
  z-index: 2; /* 텍스트가 캣 이미지 위로 오도록 설정 */
  right: 140px; /* 캣 이미지 오른쪽에 배치하기 위해 설정 */
`;

const WincatImage = styled.img`
  width: 120%; 
  height: auto;
  margin-top: 20px; 
  margin-bottom: 0px;
  z-index: 0; /* 폭죽 이미지와 텍스트 아래에 배치 */
`;


const LosescoreWrapper = styled.div`
  display: flex;
  flex: 1; /* 공간을 균등하게 나누도록 설정 */
  align-items: center; // 이미지를 수평으로 정렬
  gap: 50px; // 이미지 간 간격
  justify-content: center; // 이미지들을 중앙에 배치
`;

const LoseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;  // 수평 가운데 정렬 (선택 사항)
  justify-content: center;  // 수직 가운데 정렬 (선택 사항)
`;
const Loser = styled.div`
font-size: 30px;
`;
const LosecatImage = styled.img`

  width: 100%;
  height: auto;
  margin-top: 10px; 
  margin-left:70px;
  margin-bottom: -120px;
`;
