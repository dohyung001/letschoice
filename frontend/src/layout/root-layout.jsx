import { Outlet } from "react-router-dom";
import styled from 'styled-components';
import MainBackground from '../components/backgrounds/MainBackground';


const RootLayout = () => {
  return (
    <>
      <MainBackground>
        <Outlet />
      </MainBackground>

    </>
  );
};

export default RootLayout;

const CustomOutlet = styled(Outlet)`

`