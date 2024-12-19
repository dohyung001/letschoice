// Selectbtn.jsx
import React from 'react';
import styled from 'styled-components';
import selectbtn from '../../assets/imgs/selectbtn.png';
import selectedbtn from '../../assets/imgs/selectedbtn.png'

const Selectbtn = ({ text, onClick, isSelected }) => {
  return (
    <Button onClick={onClick} isSelected={isSelected}>
      <Text>{text}</Text>
    </Button>
  );
};

export default Selectbtn;

const Button = styled.div`
  background-image: url(${(props) => (props.isSelected ? selectedbtn : selectbtn)});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  cursor: pointer;
  transition: background-image 0.3s ease;
`;

const Text = styled.span`
  position: relative;
  z-index: 1;
  pointer-events: none;
  color: white;
  font-size: 60px;
  font-weight: bold;
`;
