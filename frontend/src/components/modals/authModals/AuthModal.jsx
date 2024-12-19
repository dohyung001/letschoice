import React from 'react';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMode } from '../../../redux/authSlice';

const AuthModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const isLoginMode = useSelector((state) => state.auth.isLoginMode);

  //로그인 회원가입 전환
  const handleToggleMode = () => {
    dispatch(toggleMode());
  };

  return (
    <ModalBackground>
      <ModalContent>
        <CloseButton onClick={closeModal}>X</CloseButton>
        {isLoginMode ? <LoginForm closeModal={closeModal} /> : <SignupForm />}
        <Button onClick={handleToggleMode}>
          {isLoginMode ? '회원가입으로 전환' : '로그인으로 전환'}
        </Button>
      </ModalContent>
    </ModalBackground>
  );
}

export default AuthModal;

// Styled-components 정의
const Button = styled.button`
  color: black;
  width: 150px;
  height: 30px;
  border-radius: 10px;
  border: none;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: darkgray;
  }
  
`;

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

const CloseButton = styled.button`
  background: none;
  border: none;
  margin-bottom: 10px;
  font-size: 20px;
  align-self: flex-end;
`;

const ModalContent = styled.div`
  background-color: gray;
  padding: 20px;
  border-radius: 10px;
  width: 700px;
  max-width: 100%;
`;
