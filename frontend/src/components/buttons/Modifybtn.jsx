import React from 'react';
import styled from 'styled-components';
import pixelbutton from '../../assets/imgs/mypagepixelbtn.png'

const Modifybtn = ({ text, onClick }) => {
    return (
      <Button onClick={onClick}>
        <Text>{text}</Text>
      </Button>
    );
  }
  
  export default Modifybtn;
  
  const Button = styled.button`
    width: 220px; 
    aspect-ratio: 400/150;
    background-image: url(${pixelbutton});
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
    padding: 5;
    background-color:inherit;
   
  `;
  
  const Text = styled.span`
    position: relative;
    z-index: 1;
    pointer-events: none; /* 텍스트는 클릭 이벤트를 받지 않음 */
    margin:10px;
  `;
  