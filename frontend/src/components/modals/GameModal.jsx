import React from 'react';
import styled from 'styled-components';

const GameModal = ({ children }) => {
  return (
    <Overlay>
      <Content>
        {children}
      </Content>
    </Overlay>
  );
};

export default GameModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color:black;
`;
