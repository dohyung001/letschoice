import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams, useNavigate } from 'react-router-dom';
import DroppableArea from '../components/game/DroppableArea';
import Timer from '../components/game/Timer';
import ScoreSection from '../components/game/ScoreSection';
import GameModal from '../components/modals/GameModal'; // 모달 컴포넌트 추가
import {
  setWords,
  addWordToAnswers,
  removeWordFromAnswers,
  reorderAnswers,
  resetRound
} from '../redux/gameSlice';
import { io } from 'socket.io-client';
import axios from 'axios';

const GamePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const words = useSelector((state) => state.game.words);
  const answers = useSelector((state) => state.game.answers);
  const originalWords = useSelector((state) => state.game.originalWords);
  const gamelevelRef = useRef('');
  const [document, setDocument] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [scoreHistory, setScoreHistory] = useState([]); // 점수 기록 상태 추가
  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false); // 모달 상태 추가
  const [isHintVisible, setIsHintVisible] = useState(false); //힌트
  const { id: roomId } = useParams();
  const userId = sessionStorage.getItem('userId') || 'defaultUser';
  const [socket, setSocket] = useState(null);

  // 소켓 연결 및 joinRoom 이벤트 처리
  useEffect(() => {
    const newSocket = io();
  
    // 랜덤 딜레이 생성 (0 ~ 1000ms)
    const delay = Math.random() * 2000;
  
    // 딜레이 후 소켓 연결
    const timeoutId = setTimeout(() => {
      setSocket(newSocket);
  
      newSocket.emit('joinRoom', { roomId, userId }, (response) => {
        if (response.success) {
          gamelevelRef.current = response.room.gamelevel;
          fetchDocument();
        } else {
          console.error('방 참여 실패:', response.message);
        }
      });
    }, delay);
  
    // 컴포넌트 언마운트 시 타임아웃 정리
    return () => {
      clearTimeout(timeoutId);
      newSocket.disconnect();
    };
  }, []);

  const fetchDocument = async () => {
    if (!gamelevelRef.current) return;

    try {
      const endpoint =
        gamelevelRef.current === '하' || gamelevelRef.current === '상'
          ? '/gameLevel1/questions2/random'
          : '/gameLevel3/questions/random';

      const response = await axios.get(endpoint);
      const data = response.data;

      if (gamelevelRef.current === '하' || gamelevelRef.current === '상') {
        if (data.description) {
          const wordsArray = data.description
            .split(/(?<!,)\s+/)
            .map((word) => word.replace(/\([^)]*\)/g, ''))
            .filter((word) => !/[a-zA-Z]/.test(word))
            .filter((word) => word.trim().length > 0);
          dispatch(setWords(wordsArray));
        } else {
          console.error('Document description is missing.');
        }
      } else if (gamelevelRef.current === '중') {
        if (data.question && data.correctAnswer) {
          const wordsArray = data.correctAnswer
            .split(/\s+/)
            .map((word) => word.trim())
            .filter((word) => word.length > 0);
          dispatch(setWords(wordsArray));
        } else {
          console.error('Question or correctAnswer is missing.');
        }
      }
      console.log(data);
      setDocument(data);
    } catch (error) {
      console.error('문서 가져오기 실패:', error);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'answers') {
        dispatch(
          reorderAnswers({
            sourceIndex: source.index,
            destinationIndex: destination.index,
          })
        );
      }
    }

    if (source.droppableId === 'words' && destination.droppableId === 'answers') {
      dispatch(
        addWordToAnswers({
          word: words[source.index],
          destinationIndex: destination.index,
        })
      );
    }

    if (source.droppableId === 'answers' && destination.droppableId === 'words') {
      dispatch(
        removeWordFromAnswers({
          word: answers[source.index],
          sourceIndex: source.index,
        })
      );
    }
  };

  useEffect(() => {
    const isCorrect = JSON.stringify(answers) === JSON.stringify(originalWords);
    if (isCorrect) {
      console.log('Round completed. Submitting answer...');
      setIsTimerRunning(false);

      // 정답 모달 열기
      setIsCorrectModalOpen(true);

      if (socket) {
        socket.emit(
          'endRound',
          { roomId, timeElapsed, userId, round: currentRound },
          (response) => {
            if (response.success) {
              console.log('Round score submitted successfully:', response.message);
            } else {
              console.error('Failed to submit round score:', response.message);
            }
          }
        );
      }
    }
  }, [answers, originalWords]);

  useEffect(() => {
    if (socket) {
      socket.on('nextRound', async ({ message, winner, round, playerTimes }) => {
        console.log(message);

        // 이전 라운드 점수 기록
        setScoreHistory((prev) => [
          ...prev,
          {
            round: currentRound,
            winner,
            playerTimes,
          },
        ]);

        // 모달 닫기
        setIsCorrectModalOpen(false);

        // 라운드 상태 초기화
        setIsHintVisible(false);
        setCurrentRound(round);
        setIsTimerRunning(false);
        setTimeElapsed(0);
        dispatch(resetRound());

        // 새로운 라운드 데이터 가져오기
        try {
          await fetchDocument();
          setIsTimerRunning(true);
        } catch (error) {
          console.error('다음 라운드 데이터 가져오기 실패:', error);
        }
      });

      return () => {
        socket.off('nextRound');
      };
    }
  }, [socket, currentRound]);


  useEffect(() => {
    if (socket) {
      // endGame 이벤트 처리
      socket.on("endGame", ({ message, wins, winner,loser }) => {
        console.log(message);
        console.log("승리 횟수:", wins);
        console.log("최종 승자:", winner);
        console.log("최종 패자:",loser);

        // 소켓 연결 종료
        socket.disconnect();

        // 다음 페이지로 이동 (예: 결과 페이지)
        navigate(`/finishgame/${roomId}`, {
          state: { winner, loser }, // 전달할 데이터
        });
      });

      return () => {
        socket.off("endGame");
      };
    }
  }, [socket, navigate]);
  const handleHintClick = () => {
    setIsHintVisible((prev) => !prev); // 현재 상태를 토글
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Background>
        <PageContainer>
          <LeftSection>
            {gamelevelRef.current === '하' && document?.photo && (
              <ImageContainer>
                <img src={document.photo} alt="문서 이미지" />
              </ImageContainer>
            )}
            {gamelevelRef.current === '중' && document && (
              <ImageContainer>
                <h3>문제:</h3>
                <p>{document.question}</p>
              </ImageContainer>
            )}
            <DroppableArea id="words" items={words} />
            <DroppableArea id="answers" items={answers} />
          </LeftSection>
          <RightSection>
            <Timer
              isRunning={isTimerRunning}
              onTimeUpdate={setTimeElapsed}
              currentRound={currentRound}
            />
            <ScoreSection scoreHistory={scoreHistory} />
            {document && (
  <DocumentContainer onClick={handleHintClick}>
    {isHintVisible ? (
      gamelevelRef.current === '중' ? (
        <p>{document.correctAnswer}</p>
      ) : (
        <p>{document.description}</p>
      )
    ) : (
      <h3>힌트</h3>
    )}
  </DocumentContainer>
)}
          </RightSection>

          {isCorrectModalOpen && (
            <GameModal>
              <h2>정답입니다!</h2>
              <p>잠시 다음 라운드를 준비해주세요.</p>
            </GameModal>
          )}
        </PageContainer>
      </Background>
    </DragDropContext>
  );
};

export default GamePage;

const Background = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

const PageContainer = styled.div`
  width: 1600px;
  height: 750px;
  display: grid;
  grid-template-columns: 1200px 400px;

  background-color: #2e2e2e;
  border-radius: 10px;
`;

const LeftSection = styled.div`
  display: grid;
  grid-template-rows: 6fr 2fr 1fr;
  gap: 20px;
  padding: 20px;
`;

const ImageContainer = styled.div`
  background-color: #333;
  padding: 10px;
  border-radius: 10px;
  width: 100%;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size:30px;

  img {
    height: 100%;
    object-fit: contain;
    border-radius: 10px;
  }
`;

const RightSection = styled.div`
  display: grid;
  grid-template-rows: 150px auto;
  gap: 20px;
  padding: 20px;
`;

const DocumentContainer = styled.button`
  text-align: center;
  border:2px solid gray;
  border-radius: 5px;
  padding:5px;
  background-color: inherit;
  height: 40px;
`;
