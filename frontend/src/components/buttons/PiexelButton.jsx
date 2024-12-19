import React from 'react';
import styled from 'styled-components';
import pixelbutton from '../../assets/imgs/pixel_button.png';
import graypixelbutton from '../../assets/imgs/gray_pixel_button.png';

const PixelButton = ({ text, onClick }) => {
  return (
    <Button onClick={onClick}>
      <Text>{text}</Text>
    </Button>
  );
}

export default PixelButton;

const Button = styled.button`
  width: 300px; 
  aspect-ratio: 390/150;
  background-image: url(${pixelbutton});
  background-size: cover;
  background-repeat: no-repeat;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 35px;
  font-weight: bold;
  color: black;
  position: relative;
  padding: 0;
  background-color:inherit;
  &:hover {
    //background-image: url(${graypixelbutton});
    filter:brightness(0.8);
    transition: filter 0.2s ease;
  }
`;

const Text = styled.span`
  position: relative;
  z-index: 1;
  pointer-events: none; /* 텍스트는 클릭 이벤트를 받지 않음 */
`;
