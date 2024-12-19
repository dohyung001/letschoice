import styled from 'styled-components';
import { Link } from "react-router-dom";
import HeadBar from "../bars/HeadBar";
import starBackground from '../../assets/imgs/mainbackground.png';

const BackgroundContainer = styled.div`
  background:black;
  background-image: url(${starBackground}); 
  background-size: auto; 
  background-position: center; 
  background-repeat: repeat;
  background-clip: border-box;
  height:100vh;
  width:100%;
  min-height: 700px;       
  min-width: 1400px;
  display: flex;
  flex-direction: column;
  color: white;
`;

const MainBackground = ({ children }) => {
  return (
    <BackgroundContainer>
      <HeadBar />
      {children}
    </BackgroundContainer>
  );
}

export default MainBackground;
