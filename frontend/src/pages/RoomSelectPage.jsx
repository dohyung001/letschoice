import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import BackButton from '../components/buttons/BackButton';
import SmallPixelButton from '../components/buttons/SmallPixelButton';
import RoomCard from '../components/roomSelect/RoomCard';
import search from '../assets/icons/search.png';
import CreateRoomModals from '../components/modals/CreateRoomModals';
import { setRooms } from '../redux/roomSlice'; 

const fetchRooms = async () => {
  const response = await axios.get('rooms/getRooms');
  return response.data;
};
const RoomSelectionPage = () => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const gamelevel = useSelector((state) => state.page.selectedDifficulty);


  const { data: rooms, isLoading, isError } = useQuery({
    queryKey:['rooms'],
    queryFn: fetchRooms, 
    onSuccess: (data) => {
      dispatch(setRooms(data));
    }
  });

  // rooms가 로드되었을 때만 filteredRooms를 계산하도록 수정
const filteredRooms = !isLoading && rooms ? rooms.filter(room => room.gamelevel === gamelevel) : [];


  //모달 열기
  const handleCreateRoom = () => {
    setisModalOpen(true);
  };

  //모달 닫기
  const closeModal = () => {
    setisModalOpen(false);
  };

  //뒤로가기
  const handleBackButton = () => {
    navigate('/');
  };

  if (isLoading) {
    return <LoadingMessage>로딩 중...</LoadingMessage>;
  }

  if (isError) {
    return <ErrorMessage>방 정보를 불러오는데 실패했습니다. 다시 시도해주세요.</ErrorMessage>;
  }

  return (
    <Background>
      <PageContainer>
        <Header>
        
        </Header>
        <MainSection>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
              />
            ))
          ) : (
            <EmptyMessage>방이 없습니다. 새로운 방을 만들어주세요.</EmptyMessage>
          )}
        </MainSection>
        <Footer>
          <BackButton text="돌아가기" onClick={handleBackButton} />
          <SmallPixelButton text="+방 만들기" onClick={handleCreateRoom} />
        </Footer>
      </PageContainer>
      {isModalOpen && <CreateRoomModals closeModal={closeModal} />}
    </Background>
  );
}

export default RoomSelectionPage;

// Styled-components 정의
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

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: bold;
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: inherit;
  border: none;
  color: white;
`;

const MainSection = styled.section`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  justify-items: center;
  align-items: center;
  gap: 20px;
`;

const Footer = styled.footer`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const EmptyMessage = styled.div`
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  grid-column: span 3;
`;

const LoadingMessage = styled.div`
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  grid-column: span 3;
`;

const ErrorMessage = styled.div`
  font-size: 20px;
  color: red;
  text-align: center;
  grid-column: span 3;
`;
