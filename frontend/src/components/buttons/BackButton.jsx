import styled from 'styled-components';
import redo from '../../assets/icons/Redo.png';

const BackButton = ({ text, onClick }) => {
  return (
    <Button onClick={onClick}>
      <img src={redo} />
      {text}
    </Button>
  )
}

export default BackButton;

const Button = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 25px;
  background-color:inherit;
  border:none;
  color:white;
`;