import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // React Query 추가
import store from './redux/store';

import Main from './pages/MainPage';
import RootLayout from './layout/root-layout';
import RoomSelectPage from './pages/RoomSelectPage';
import WaitingRoomPage from "./pages/WaitingRoomPage";
import GamePage from "./pages/GamePage";
import GameStartPage from './pages/GameStartPage';
import FinishGamePage from './pages/FinishGamePage';
import MyPage from './pages/Mypage';
import ManagePage from './pages/ManagePage';


const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Main />
      },
      {
        path: 'rooms',
        element: <RoomSelectPage />
      },
      {
        path: 'waitingroom/:id',
        element: <WaitingRoomPage />
      },
      {
        path: 'gamestart/:id',
        element: <GameStartPage />
      },
      {
        path: 'gamePage/:id',
        element: <GamePage />
      },
      {
        path: 'finishgame/:id',
        element: <FinishGamePage />
      },
      {
        path: 'mypage',
        element: <MyPage />
      },
      {
        path: 'managepage',
        element: <ManagePage />
      }

    ]
  }
]);

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
