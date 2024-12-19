import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import logo from "../../assets/imgs/LOGO2.png";
import person from "../../assets/icons/Person.png";
import AuthModal from "../modals/authModals/AuthModal";
import { logout } from "../../redux/authSlice"; // Redux의 logout 액션 가져오기

import { useNavigate } from "react-router-dom";
const HeadBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const selectedDifficulty = useSelector(
    (state) => state.page.selectedDifficulty
  ); //선택된 난이도
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Redux 로그인 상태 가져오기
  const username = useSelector((state) => state.auth.username);
  const dispatch = useDispatch();
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  // 페이지에 따른 텍스트 설정
  const renderHeaderText = () => {
    switch (location.pathname) {
      case "/":
        return " ";
      case "/rooms":
        return `난이도  ${selectedDifficulty}`;
      case "/waitingroom":
        return `난이도  ${selectedDifficulty} 대기실`;
      case `/managepage`:
        return `관리자페이지`;
      case `/mypage`:
        return `마이페이지`;
      default:
        return "게임 진행 중";
    }
  };

  const handleLogin = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleLogout = () => {
    navigate("/");
    dispatch(logout()); // Redux로 로그아웃 처리
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };
  const handleMypage = () => {
    navigate("/mypage");
  };

  //관리자페이지의 경우 헤더
  if (["/managepage"].includes(location.pathname)) {
    return (
      <>
        <Header>
          <LogoContainer>
            <Logo src={logo} alt="로고" />
            <h1>{renderHeaderText()}</h1>
          </LogoContainer>
          <Buttons>
            <MainButton onClick={handleLogout}>로그아웃</MainButton>
          </Buttons>
        </Header>
      </>
    );
  }

  // /, /rooms, /waitingroom 이외의 경로인 경우 간단한 헤더만 리턴
  if (!["/", "/rooms", "/waitingroom"].includes(location.pathname)) {
    return (
      <>
        <Header>
          <LogoContainer>
            <Logo src={logo} alt="로고" />
            <h1>{renderHeaderText()}</h1>
          </LogoContainer>
          <Buttons />
        </Header>
      </>
    );
  }

  return (
    <>
      <Header>
        <LogoContainer>
          <Logo src={logo} alt="로고" />
          <h1>{renderHeaderText()}</h1>
        </LogoContainer>
        <Buttons>
          {isLoggedIn ? (
            <>
              <MainButton onClick={handleMypage}>
                <img src={person} alt="사용자 아이콘" /> {userId}
              </MainButton>
              <MainButton onClick={handleLogout}>로그아웃</MainButton>
            </>
          ) : (
            <MainButton onClick={handleLogin}>
              {" "}
              <img src={person} alt="사용자 아이콘" /> 로그인
            </MainButton>
          )}
        </Buttons>
      </Header>
      {isModalOpen && <AuthModal closeModal={closeModal} />}
    </>
  );
};

export default HeadBar;

// Styled-components 정의

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
  height: 130px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 110px;
  height: auto;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin-right: 100px;
`;

const MainButton = styled.div`
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
