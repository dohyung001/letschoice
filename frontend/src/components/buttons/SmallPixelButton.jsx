import styled from 'styled-components';
import small_pixel_button from '../../assets/imgs/small_pixel_button.png';

const SmallPixelButton = ({ text, onClick }) => {
  return (
    <Button onClick={onClick}>
      <Text>{text}</Text>
    </Button>
  )
}

export default SmallPixelButton;

const Button = styled.button`
  width: 226px; 
  aspect-ratio: 226/68;
  background-image: url(${small_pixel_button});
  background-size: cover;
  background-repeat: no-repeat;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: bold;
  color: black;
  position: relative;
  padding: 0;
  background-color:inherit;
  &:hover {
    transition: filter 0.2s ease;
    filter: brightness(0.8);
}
`;

const Text = styled.span`
  position: relative;
  z-index: 1;
  pointer-events: none; /* 텍스트는 클릭 이벤트를 받지 않음 */
`;