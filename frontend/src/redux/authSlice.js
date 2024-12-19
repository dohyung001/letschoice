import { createSlice } from '@reduxjs/toolkit';

//초기값
const initialState = {
  username: null,
  userId:null,
  isLoggedIn: !!sessionStorage.getItem("accessToken"),
  isLoginMode: true,
};

//슬라이스 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => { //로그인 시
      state.userId = action.payload[0];
      state.username = action.payload[1];
      state.isLoggedIn = true;
      console.log(state);
    },
    logout: (state) => {    //로그아웃 시
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userId");
      state.username = null;
      state.isLoggedIn = false;
    },
    toggleMode: (state) => {
      state.isLoginMode = !state.isLoginMode; // 로그인/회원가입 모드 전환
    },
  },
});

export const { login, logout, toggleMode } = authSlice.actions;
export default authSlice.reducer;
