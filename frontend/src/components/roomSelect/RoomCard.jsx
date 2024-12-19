import React, { useState } from 'react';
import styled from 'styled-components';
import roomCard from '../../assets/imgs/room_card.png';
import RoomJoinModal from '../modals/RoomJoinModal.jsx';

const RoomCard = ({ room }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  //카드 클릭
  const handleCardClick = () => {
    if (room.participants < 2) {
      setIsModalOpen(true);
    }
  };
  //모달 닫기 함수
  const closeModal = () => {
    console.log(1);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        isFull={room.participants >= 2} // 참가인원 초과하면 못들감
      >
        <h1>{room.name}</h1>
        <span>
          Player {room.participants}/2
          {room.isPasswordProtected && ' 🔒'}
        </span>
      </Card>
      {isModalOpen && <RoomJoinModal room={room} closeModal={closeModal} />}
    </>
  );
};

export default RoomCard;

const Card = styled.div`
  background-image: url(${roomCard});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 400px;
  height: auto;
  aspect-ratio: 432/235;
  color: ${(props) => (props.isFull ? '#aaa' : '#fff')}; 

  text-align: center;
  padding: 30px 0px 50px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  filter: ${(props) => (props.isFull ? 'grayscale(1)' : 'none')}; 
  pointer-events: ${(props) => (props.isFull ? 'none' : 'auto')}; 

  &:hover {
    filter: ${(props) => (props.isFull ? 'grayscale(1)' : 'brightness(0.8)')};
    cursor: ${(props) => (props.isFull ? 'default' : 'pointer')};
  }
`;
