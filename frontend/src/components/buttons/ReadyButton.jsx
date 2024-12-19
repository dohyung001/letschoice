import React from 'react';
import styled from 'styled-components';
import Readybutton from '../../assets/imgs/ReadyButton.png'
import ReadyhoevrButton from '../../assets/imgs/ReadyhoverButton.png'

const ReadyButton = ({ text, onClick }) => {
    return (
      <Button onClick={onClick}>
        <Text>{text}</Text>
      </Button>
    );
  }
  
  export default ReadyButton;
  
  const Button = styled.button`
    width: 150px; 
    aspect-ratio: 390/150;
    background-image: url(${Readybutton});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center; /* 중앙에 위치 */
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
    color: black;
    position: relative;
    padding: 0;
    background-color:inherit;
    &:hover {
      background-image: url(${ReadyhoevrButton});
    }
  `;
  
  const Text = styled.span`
    position: relative;
    z-index: 1;
    pointer-events: none; /* 텍스트는 클릭 이벤트를 받지 않음 */
  `;
  