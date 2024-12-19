  import React, { useState, useEffect } from "react";
  import styled from "styled-components";
  import { useParams, useNavigate } from "react-router-dom";
  import { io } from "socket.io-client";
  import axios from "axios";

  import BackButton from "../components/buttons/BackButton";
  import ReadyButton from "../components/buttons/ReadyButton";
  import BigBack from "../assets/imgs/Bigback.png";

  import cat from "../assets/imgs/cutecat_small.png";
  import waitcat from "../assets/imgs/waitcat.png";
  import leftcat from "../assets/imgs/leftcat.png";

  import winlossscore from "../assets/imgs/winscore.png";
  import leftwaitimage from "../assets/imgs/leftwait.png";
  import rightwaitimage from "../assets/imgs/rightwait.png";
  import leftreadyimage from "../assets/imgs/leftready.png";
  import rightreadyimage from "../assets/imgs/rightready.png";
  import { useSelector } from "react-redux";

  const WaitingRoomPage = () => {
    const { id: roomId } = useParams();
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [remainingSlots, setRemainingSlots] = useState(0);
    const [room, setRoom] = useState(null);
    const [players, setPlayers] = useState([]);
    const [winRates, setWinRates] = useState([]);
    const [readyStates, setReadyStates] = useState({
      player1: false,
      player2: false,
    });
    const [readyButtonDisabled, setReadyButtonDisabled] = useState(true);
    const [gameStartText, setGameStartText] = useState("");
    const [isWaiting, setIsWaiting] = useState(true); // 대기 상태 관리
    const [gamelevel, setGamelevel] = useState(""); // gamelevel 상태 추가
    const [readyButtonVisible, setReadyButtonVisible] = useState(true);
    const ifId = useSelector((state) => state.auth.userId);
    const userId = sessionStorage.getItem("userId") || ifId;

    const [socket, setSocket] = useState(null);

    useEffect(() => {
      const newSocket = io();
      setSocket(newSocket);
      const storeduserId = sessionStorage.getItem("userId");
      console.log("stored ID:", storeduserId);

      //방 참가
      function joinRoom() {
        newSocket.emit("joinRoom", { roomId, userId }, (response) => {
          console.log("Join Room Response:", response);
          if (response.success) {
            setRoom(response.room);
            console.log(`받은 Room: ${JSON.stringify(response.room, null, 2)}`); //level도 전달되는지 보려고
            setRemainingSlots(response.remainingSlots);
            setGamelevel(response.room.gamelevel); // 서버 응답에서 gamelevel 설정
            console.log(`방 ${roomId}에 입장 성공`);
          } else {
            console.error("방 입장 실패:", response.message);
            navigate("/"); // 실패 시 메인 화면으로 이동
          }
        });
      }
      const fetchPlayers = async (userId) => {
        try {
          const { data } = await axios.get(`/scores/player/${userId}/winrate`);
          setWinRates(data.winRates); // 데이터 설정
          console.log("data:", data);
        } catch (error) {
          console.error("승률 데이터 가져오기 실패:", error);
        }
      };

      fetchPlayers(storeduserId);
      console.log("fetchplayers:", storeduserId);
      joinRoom();
      // 참가자 상태 업데이트
      newSocket.on("updateRoomPlayers", ({ players }) => {
        console.log(players);
        setPlayers(players);

        // 대기 상태 관리
        if (players.length < 2) {
          setReadyButtonDisabled(true); // 레디 버튼 비활성화
          setIsWaiting(true); // 대기 상태 활성화
        } else {
          setReadyButtonDisabled(false); // 레디 버튼 활성화
          setIsWaiting(false); // 대기 상태 비활성화
        }
      });

      // 레디 상태 업데이트
      newSocket.on("updateReadyState", ({ players }) => {
        setReadyStates({
          player1: players[0]?.ready || false,
          player2: players[1]?.ready || false,
        });

        if (players.some((player) => player.name === userId && player.ready)) {
          setReadyButtonDisabled(true);
        } else {
          setReadyButtonDisabled(false);
        }
      });

      //탈주
      newSocket.on(
        "userDisconnected",
        ({
          userId: disconnectedUserId,
          remainingSlots,
          readyStates: newReadyStates,
        }) => {
          setPlayers((prevPlayers) =>
            prevPlayers.filter((player) => player !== disconnectedUserId)
          );
          setRemainingSlots(remainingSlots);
          setReadyStates(newReadyStates);
          setReadyButtonDisabled(true);
          setReadyButtonVisible(true);
          setGameStartText(""); // 게임 시작 메시지 초기화
        }
      );

      //게임 시작
      newSocket.on("startGame", ({ message, gamelevel }) => {
        console.log("게임 시작 이벤트 수신 - 5초 후 게임 페이지로 이동합니다.");
        setReadyButtonVisible(false);
        setGameStartText("잠시 후 게임이 시작됩니다...");
        setTimeout(() => {
          navigate(`/gamestart/${roomId}`);
        }, 5000);
      });

      return () => {
        // 랜덤 시간(0~1000ms) 후 disconnect 실행
        const delay = Math.random() * 2000;
        const timeoutId = setTimeout(() => {
          newSocket.off("updateRoomPlayers");
          newSocket.off("updateReadyState");
          newSocket.off("userDisconnected");
          newSocket.off("startGame");
          newSocket.disconnect();
        }, delay);

        return () => clearTimeout(timeoutId); // 클린업 시 타임아웃 제거
      };
    }, [roomId, userId, navigate]);

    //레디
    const handleReadyButtonClick = () => {
      if (socket) {
        socket.emit("setReady", { roomId, userId }, (response) => {
          if (response.success) {
            console.log(`${userId}님이 준비되었습니다.`);
            setReadyButtonDisabled(true);
          } else {
            console.error("Ready 상태 설정 실패:", response.message);
          }
        });
      }
    };

    const handleBackButton = () => {
      navigate("/");
    };

    const text = "상대방을 기다리는 중입니다...";
    const filteredRates = winRates.filter
    console.log("Filtered Rates:", filteredRates);

  return (
    <Background>
      <PageContainer>
        <Content>
          <Bigback>
            <ImageWrapper>
              <CatImage src={cat} alt="고양이 이미지" />
              <WaitImageStyled
                src={readyStates.player1 ? leftreadyimage : leftwaitimage}
                alt="Wait"
              />
            </ImageWrapper>
            <WinLossContainer>
            
            {players[0]}
            </WinLossContainer>
          </Bigback>

            <StyledH1>Vs</StyledH1>

          <Smallback>
            {players.length > 1 ? (
              <Smallcontainer>
                <SmallImageWrapper>
                  <SmallWaitImageStyled
                    src={readyStates.player2 ? rightreadyimage : rightwaitimage}
                    alt="Wait"
                  />
                  <SmallCatImage src={leftcat} alt="고양이 이미지" />
                </SmallImageWrapper>
                <SmallWinLossContainer>
                  {players[1]}
                </SmallWinLossContainer>
              </Smallcontainer>
            ) : (
              <WaitImageWapper>
                <WaitImage src={waitcat} alt="no partner" />
                <WaitingText>
              {text.split('').map((char, index) => (
                <span key={index} style={{ '--i': index }}>
                  {char}
                </span>
              ))}
            </WaitingText>
              </WaitImageWapper>
            )}
          </Smallback>
        </Content>

          <Footer>
            <BackButton text="돌아가기" onClick={handleBackButton} />
            <ReadyButtonWrapper>
              {!readyButtonVisible ? (
                <GameStartText>
                  {gameStartText || "잠시 후 게임이 시작됩니다..."}
                </GameStartText>
              ) : isWaiting ? (
                <GameStartText>wait ..</GameStartText>
              ) : (
                <ReadyButton
                  text="READY"
                  onClick={handleReadyButtonClick}
                  disabled={readyButtonDisabled}
                />
              )}
            </ReadyButtonWrapper>
          </Footer>
        </PageContainer>
      </Background>
    );
  };

  export default WaitingRoomPage;

  const Background = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100vh - 130px);
  `;

  const PageContainer = styled.div`
    width: 90vw;
    min-width: 1400px;
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 90%;
    padding: 20px;
    background-color: #2e2e2e;
    border-radius: 10px;
  `;

  const Content = styled.main`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  `;

  const Bigback = styled.div`
    background-image: url(${BigBack});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 650px;
    height: auto;
    aspect-ratio: 715/677;

    text-align: center;
    padding: 30px 0px 50px;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `;

  const ImageWrapper = styled.div`
    display: flex;
    align-items: center; // 이미지를 수평으로 정렬
    gap: -5px; // 이미지 간 간격
    justify-content: center; // 이미지들을 중앙에 배치
    margin-bottom: 25px;
  `;

const CatImage = styled.img`
  width: 65%;
  height: auto;
  margin-top: 100px;
  margin-bottom: 0px;

    animation: moveImage 2s ease-in-out infinite; /* 2초마다 좌우로 반복되는 애니메이션 */

    @keyframes moveImage {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(6px); /* 이미지가 10px만큼 오른쪽으로 이동 */
      }
      100% {
        transform: translateY(0); /* 이미지가 원위치로 돌아옴 */
      }
    }
  `;

  const WaitImageStyled = styled.img`
    width: 200px; // Wait 이미지는 더 작게 설정
    height: auto;
    margin-top: -10px; // Wait 이미지 위쪽 여백

    animation: moveImage 2s ease-in-out infinite; /* 2초마다 좌우로 반복되는 애니메이션 */

    @keyframes moveImage {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(4px); /* 이미지가 10px만큼 오른쪽으로 이동 */
      }
      100% {
        transform: translateY(0); /* 이미지가 원위치로 돌아옴 */
      }
    }
  `;

  const UserIdText = styled.div`
    font-size: 40px;
    color: white;
    margin-top: -50px;
  `;

const WinLossContainer = styled.div`
  width: 100%;
  padding:10px 10px 10px 10px;
  text-align: center;
  color: white; // 텍스트 색상을 배경 이미지와 잘 어울리게 설정
  background-image: url(${winlossscore}); // 배경 이미지 설정
  background-size: 60% 100%; // 이미지 크기를 비율에 맞게 조정 (꽉 차지지 않음)
  background-position: center; // 이미지의 중심이 컨테이너 중심에 오도록 설정
  background-repeat: no-repeat; // 이미지를 반복하지 않도록 설정
  border-radius: 8px;
  font-weight: bold;
  font-size:40px;
`;

  const WinLossText = styled.div`
    font-size: 30px;
  `;
  const AverageText = styled.div`
    font-size: 40px;
  `;

  const Smallback = styled.div`
    background-image: url(${BigBack});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 550px;
    height: auto;
    aspect-ratio: 715/677;

    text-align: center;
    padding: 30px 0px 50px;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 95px; // 원하는 만큼 아래로 이동
  `;

  const WaitImageWapper = styled.div`
    display: flex;
    flex-direction: column; // 수직 정렬
    gap: -5px; // 이미지 간 간격
    justify-content: center; // 이미지들을 수직 중앙에 배치
    align-items: center; // 수평 중앙 정렬
    margin-bottom: 25px;
  `;

  const WaitImage = styled.img`
    width: 60%;
    height: auto;
    margin-top: 80px;
    margin-bottom: 50px;
    animation: zoomInOut 3s ease-in-out infinite; /* 3초마다 확대/축소 애니메이션 */

    @keyframes zoomInOut {
      0% {
        transform: scale(1); /* 원래 크기 */
      }
      50% {
        transform: scale(1.015); /* 약간 확대 */
      }
      100% {
        transform: scale(1); /* 원래 크기 */
      }
    }
  `;

  const WaitingText = styled.div`
    font-size: 30px;
    color: white;
    margin-top: 0px;
    display: flex;
    justify-content: center;
    align-items: center;

    /* 한 글자씩 애니메이션을 적용 */
    display: inline-block;
    white-space: nowrap;

    span {
      display: inline-block;
      opacity: 0;
      transform: translateY(20px); /* 글자가 아래에서 올라오는 효과 */
      animation: bounce 5s ease infinite; /* 5초 간격으로 애니메이션 반복 */
      animation-delay: calc(
        0.1s * var(--i)
      ); /* 각 글자에 지연시간을 두어 순차적으로 애니메이션 실행 */
    }

    @keyframes bounce {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  const Smallcontainer = styled.div`
    display: flex;
    flex-direction: column; // 수직 정렬
    gap: 10px; // 이미지 간 간격
    justify-content: center; // 이미지들을 수직 중앙에 배치
    align-items: center; // 수평 중앙 정렬
  `;
  const SmallImageWrapper = styled.div`
    display: flex;
    align-items: center; // 이미지를 수평으로 정렬
    gap: -5px; // 이미지 간 간격
    justify-content: center; // 이미지들을 중앙에 배치
    margin-bottom: 45px;
  `;

const SmallCatImage = styled.img`
  width: 70%;
  height: auto;
  margin-top: 120px;
  margin-bottom: 0px;
  animation: moveImage 2s ease-in-out infinite; /* 2초마다 좌우로 반복되는 애니메이션 */

    @keyframes moveImage {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(6px); /* 이미지가 10px만큼 오른쪽으로 이동 */
      }
      100% {
        transform: translateY(0); /* 이미지가 원위치로 돌아옴 */
      }
    }
  `;
  const SmallWaitImageStyled = styled.img`
    width: 190px; // Wait 이미지는 더 작게 설정
    height: auto;
    margin-top: -10px; // Wait 이미지 위쪽 여백

    animation: moveImage 2s ease-in-out infinite; /* 2초마다 좌우로 반복되는 애니메이션 */

    @keyframes moveImage {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(4px); /* 이미지가 10px만큼 오른쪽으로 이동 */
      }
      100% {
        transform: translateY(0); /* 이미지가 원위치로 돌아옴 */
      }
    }
  `;

  const SmallUserIdText = styled.div`
    font-size: 30px;
    color: white;
    margin-top: -30px;
    margin-bottom: 10px;
  `;

const SmallWinLossContainer = styled.div`
  width: 100%;
  padding:10px 10px 10px 10px;
  text-align: center;
  color: white; // 텍스트 색상을 배경 이미지와 잘 어울리게 설정
  background-image: url(${winlossscore}); // 배경 이미지 설정
  background-size: 60% 100%; // 이미지 크기를 비율에 맞게 조정 (꽉 차지지 않음)
  background-position: center; // 이미지의 중심이 컨테이너 중심에 오도록 설정
  background-repeat: no-repeat; // 이미지를 반복하지 않도록 설정
  border-radius: 8px;
  font-weight: bold;
  font-size:40px;
`;

  const SmallWinLossText = styled.div`
    font-size: 30px;
  `;

  // VS 텍스트 스타일링
  const StyledH1 = styled.h1`
    font-size: 150px; // 원하는 크기로 설정
    color: white; // 텍스트 색상을 흰색으로 설정 (필요에 따라 변경)
    margin: 0 30px; // 좌우 여백을 조금 추가하여 텍스트 간격 조정
    font-weight: bold; // 텍스트 두껍게 설정
  `;

const Footer = styled.footer`
  
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height:80px;
  margin-top:-30px;
`;

const ReadyButtonWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-30%);
`;

const GameStartText = styled.div`
  font-size: 30px; // 원하는 크기로 설정
  color: white; // 텍스트 색상을 흰색으로 설정
  font-weight: bold; // 텍스트 두껍게 설정
  text-align: center;
  padding: 10px;
  margin-left:-30px;
`;