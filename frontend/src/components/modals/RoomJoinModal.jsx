import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


const RoomJoinModal = ({ room, closeModal }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  console.log(room);
  const handleJoinRoom = () => {
    if (room.isPasswordProtected && password !== room.password) {
      setError('비밀번호가 올바르지 않습니다.');
      return;
    }
    closeModal();
    alert(`${room.name} 방에 입장합니다!`);
    navigate(`/waitingroom/${room.id}`);

  };

  return (
    <ModalBackground>
      <ModalContent>

        <h1>{room.name}</h1>
        <p>Player {room.participants}/2</p>
        {room.isPasswordProtected && (
          <>
            <label>비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </>
        )}
        <ButtonContainer>
          <Button onClick={handleJoinRoom}>입장</Button>
          <Button cancel onClick={closeModal}>
            취소
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalBackground>
  );
};

export default RoomJoinModal;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: gray;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  text-align: center;
  color: white;
`;


const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.cancel ? '#bdbdbd' : '#009688')};
  color: white;

  &:hover {
    background-color: ${(props) =>
    props.cancel ? '#9e9e9e' : '#00796b'};
  }
`;
