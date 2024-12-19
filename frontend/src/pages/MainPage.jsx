import React from 'react';
import styled,{createGlobalStyle} from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setDifficulty } from '../redux/pageSlice';

import cat from '../assets/imgs/cutecat.png';
import speech_bubble from '../assets/imgs/speech_bubble.png';
import PixelButton from '../components/buttons/PiexelButton';


function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);


  
  //난이도 선택 버튼 함수
  const handleButton = (difficulty) => {
    //로그인 안되있으면 이동못함
    if (!isLoggedIn) {
      alert('로그인이 필요합니다!');
      return;
    }
    dispatch(setDifficulty(difficulty));
    navigate('/rooms');
  };

  return (
    <>
      <GlobalStyle /> {/* GlobalStyle 컴포넌트 추가 */}
    <MainConatiner>
      <ImgContainer>
        <CatImage src={cat} alt="고양이 이미지" />
        <SpeechBubbleContainer>
          <SpeechBubble src={speech_bubble} alt="말풍선 이미지" />
          <Description>
            <h1>안녕!</h1>
            <h1>  우리의 게임은 누가 더 문장을 빨리 만드나 겨루는 게임이야. </h1>
            <h1>  누가 더 빨리 상황에 맞는 말 만드는지 승부를 겨뤄봐!</h1>
         </Description>
        </SpeechBubbleContainer>
      </ImgContainer>

      <ButtonContainer>
        <PixelButton text="난이도 하" onClick={() => handleButton('하')} />
        <PixelButton text="난이도 중" onClick={() => handleButton('중')} />
        <PixelButton text="난이도 상" onClick={() => handleButton('상')} />
      </ButtonContainer>
    </MainConatiner>
    </>
  );
}

export default Main;

// Styled-components 정의
const ImgContainer = styled.div`
  display: flex;
  margin-top: 200px;
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 200px);
`;

const MainConatiner = styled.div`
  display: flex;
  flex-direction: row; 
  align-items: center; 
  justify-content: center;
  height: calc(100vh - 130px);
  width: 100vw;
`;

const CatImage = styled.img`
  width: 600px; 
  animation: float 3s ease-in-out infinite; /* 애니메이션 추가 */
`;

const SpeechBubbleContainer = styled.div`
  position: relative;
  width: 650px; 
  top: -250px; 
  left: -200px;
  z-index: 1;
  animation: float 4s ease-in-out infinite; /* 애니메이션 추가 */
`;

const SpeechBubble = styled.img`
  width: 100%; 
  position: relative;
`;

const Description = styled.div`

  position: absolute;
  top: 20px; 
  left: 20px;
  right: 20px;
  width: 480px;
  height: 240px;
  color: black;
  text-align: left;
  margin: 30px 0px 0px 70px;
  line-height:43px;
  h1 {
    font-size: 34px;
    margin: 10px 0;
  }
`;

// 애니메이션 정의
const keyframes = `
  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-25px); /* 위로 15px */
    }
    100% {
      transform: translateY(0);
    }
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${keyframes}
`;