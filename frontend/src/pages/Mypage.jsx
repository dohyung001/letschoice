import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Chart.js 로드
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import BackButton from '../components/buttons/BackButton';
import BigBack from '../assets/imgs/Bigback.png';
import cat from '../assets/imgs/cutecat_small.png';
import download from "../assets/icons/download.png";
import Selectbtn from '../components/buttons/Selectbtn';

const MyPage = () => {
  const navigate = useNavigate();

  // 뒤로가기
  const handleBackButton = () => {
    navigate('/');
  };

  const handleDownload = async () => {
    try {
      console.log("스크린샷 다운로드 요청 시작...");

      // 서버에서 스크린샷 다운로드
      const response = await axios.get('/download/pdf', {
          responseType: 'blob', // Blob 형식으로 응답 받기
      });

      console.log("스크린샷 다운로드 응답 수신 완료. 파일 생성 중...");

      // Blob 데이터로 파일 다운로드 트리거
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'screenshot.png'); // 다운로드 파일명 설정
      document.body.appendChild(link);
      link.click();
      link.remove();

      // 메모리 해제
      window.URL.revokeObjectURL(url);

      console.log("스크린샷 다운로드가 완료되었습니다.");
  } catch (error) {
      console.error("스크린샷 다운로드 중 오류:", error);
      alert("스크린샷 다운로드 중 문제가 발생했습니다. 다시 시도해주세요.");
  }
};


  // 상태 관리
  const [username, setUsername] = useState('');
  const [userBirth, setUserBirth] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('상');
  const [winRates, setWinRates] = useState([]);
  const [dailyWinRates, setDailyWinRates] = useState([]);
  const [userId, setUserId] = useState('');

  // 사용자 정보 요청 함수
  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`/scores/user/${userId}`);
      const { username, birthday } = response.data;
      setUsername(username);
      setUserBirth(birthday);
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
    }
  };

  // 승률 데이터 요청 함수
  const fetchWinRate = async (userId) => {
    try {
      const { data } = await axios.get(`/scores/player/${userId}/winrate`);
      setWinRates(data); // 데이터 설정
    } catch (error) {
      console.error('승률 데이터 가져오기 실패:', error);
    }
  };

  // 일별 승률 데이터 요청 함수
  const fetchDailyWinRate = async () => {
    try {
      const { data } = await axios.get(`/scores/player/${userId}/winrate/daily`);
      setDailyWinRates(data.dailyWinRates);
    } catch (error) {
      console.error('일별 승률 데이터 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWinRate(userId);
      fetchDailyWinRate(userId);
    }
  }, [userId]);

  // 사용자 ID 가져오기 및 정보 가져오기 (컴포넌트 마운트 시 실행)
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserInfo(storedUserId);
    } else {
      console.error('userId가 sessionStorage에 없습니다.');
    }
  }, []);

  // 난이도별 데이터
  const difficultyData = useMemo(() => {
    if (!Array.isArray(dailyWinRates)) {
        console.error('dailyWinRates is not an array:', dailyWinRates);
        return { 상: [], 중: [], 하: [] };
    }

    return {
        상: dailyWinRates.map(item => {
            const winRateData = item.levelWinRates?.find(l => l.gamelevel === '상');
            return winRateData ? winRateData.winRate : 0;
        }),
        중: dailyWinRates.map(item => {
            const winRateData = item.levelWinRates?.find(l => l.gamelevel === '중');
            return winRateData ? winRateData.winRate : 0;
        }),
        하: dailyWinRates.map(item => {
            const winRateData = item.levelWinRates?.find(l => l.gamelevel === '하');
            return winRateData ? winRateData.winRate : 0;
        }),
    };
}, [dailyWinRates]);



  // 차트에 표시할 데이터
  const data = useMemo(() => ({
    labels: dailyWinRates.map(item => item.date), // 날짜 라벨 설정
    datasets: [
        {
            label: '정확도',
            data: difficultyData[selectedDifficulty], // 선택된 난이도 데이터
            borderColor: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 2,
        },
    ],
}), [selectedDifficulty, difficultyData, dailyWinRates]);

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { color: '#fff' },
      },
      y: {
        ticks: { color: '#fff' },
        min: 0,
        max: 100,
      },
    },
  };

  // 난이도 버튼 클릭 핸들러
  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };
  console.log(winRates.winRates);
  console.log('dailyWinRates:', dailyWinRates);


  return (
    <Background>
      <PageContainer>
        <MainSection>
          <Bigback>
            <ImageWrapper>
              <CatImage src={cat} alt="고양이 이미지" />
            </ImageWrapper>
            <UserIdText>{userId}</UserIdText>
            <UserNameText>{username}</UserNameText>
            <UserBirthText>{userBirth}</UserBirthText>
          </Bigback>
          <Tactics>
            {Array.isArray(winRates.winRates) && winRates.winRates.length > 0 ? (
              winRates.winRates.map((rate, index) => (
                <p key={index}>
                  {rate.gamelevel}: {rate.wins}승 {rate.loses}패 ({rate.winRate}%)
                </p>
              ))
            ) : (
              <p>승률 데이터가 없습니다.</p>
            )}  
          </Tactics>

          <Footer>
            <BackButton text="돌아가기" onClick={handleBackButton} />
          </Footer>
        </MainSection>

        <GraphSection>
          <GraphWrapper>
            <Line data={data} options={options} />
          </GraphWrapper>
          <DifficultySection>
            {['상', '중', '하'].map(difficulty => (
              <Selectbtn
                key={difficulty}
                text={`${difficulty}`}
                onClick={() => handleDifficultyClick(difficulty)}
                isSelected={selectedDifficulty === difficulty}
                
              />
            ))}
          </DifficultySection>
        </GraphSection>
        <MainButton onClick={handleDownload}>
                <img src={download} alt="다운로드 아이콘" /> PDF              </MainButton>
      </PageContainer>
    </Background>
  );
};

export default MyPage;


const MainButton = styled.div`
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
// Styled-components 정의
const Tactics =styled.div`
height:110px;
margin-left: 130px;
font-size: 30px;
`

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
  min-height:750px;
  padding: 20px;
  background-color: #2e2e2e; 
  border-radius: 10px;
  margin-top:-20px;

  display: flex; /* 수평 정렬을 위해 flex 사용 */
  gap: 40px; /* 섹션 간 간격 */
  align-items: flex-start; /* 위쪽 정렬 */
`;


const MainSection = styled.section`
flex: 0.7; /* 남은 공간을 차지 */
  display: flex;
  gap: 20px;
  flex-direction:column;
  padding:0px 40px 0px;

`;


const Bigback = styled.div`
  background-image: url(${BigBack});
  background-size: contain; 
  background-repeat: no-repeat; 
  background-position: center;
  width:560px;
  height: auto;
  aspect-ratio: 715/677;
 

  text-align: center;
  padding:30px 0px 50px;
  font-size: 18px;
  font-weight: bold;
  display:flex;
  flex-direction:column;
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
  margin-top: 20px; 
  margin-bottom: 0px;
`;


const UserIdText = styled.div`
  font-size: 40px;
  color: white;
  margin-top: -50px; 
`;

const UserNameText = styled.div`
  font-size: 40px;
  color: white;
  margin-top: -50px; 
`;

const UserBirthText = styled.div`
  font-size: 40px;
  color: white;
  margin-top: -50px; 
`;

const GraphSection = styled.div`
    flex: 2; /* 남은 공간을 차지 */
  display: flex;
  width:850px;
  height:auto;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const GraphWrapper = styled.div`
width: 100%; /* 부모의 가로 공간 전체를 사용 */
max-width: 1000px; /* 그래프의 최대 너비 설정 */
height: auto;
aspect-ratio: 2 / 1; /* 가로 세로 비율 설정 */
padding: 20px; /* 그래프와 가장자리 간격 */
position: relative;
`;


const DifficultySection = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
`;


const Footer = styled.footer`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0px;
  margin-top:-10px;
`;


