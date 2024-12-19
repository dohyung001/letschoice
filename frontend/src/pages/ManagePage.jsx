import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { useQuery,useQueryClient } from '@tanstack/react-query';

const ManagePage = () => {
  const [users, setUsers] = useState([]); // 전체 회원 목록
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 회원

  const [roomUsers, setRoomUsers] = useState([]); // 특정 방에 있는 사용자 목록
  const queryClient = useQueryClient();

  const fetchRooms = async() =>  {
    try{
      const response = await axios.get('/adminRouter/rooms');
      return response.data;
    }catch(e){
      console.log(e);
    }
  }

  //방 받아오기
  const {data:rooms, isLoading} = useQuery({
    queryKey:['rooms'],
    queryFn: fetchRooms
  })
  console.log(rooms);

  // 전체 회원 목록 가져오기
  useEffect(() => {
    const fetchUsers =  async() =>  {
      try{
        const response = await axios.get('/adminRouter/users');

        setUsers(response.data);
      }catch(e){
        console.log(e);
      }
    }
    fetchUsers();
  }, []);


 /*
  // 활성화된 방 목록 가져오기
  useEffect(() => {
    axios.get('/api/rooms') // API 경로는 실제 경로에 맞게 수정
      .then(response => setRooms(response.data))
      .catch(err => console.error(err));
  }, []);

  // 특정 방의 사용자 목록 가져오기
  const handleRoomClick = (roomId) => {
    axios.get(`/api/rooms/${roomId}/users`) // API 경로는 실제 경로에 맞게 수정
      .then(response => setRoomUsers(response.data))
      .catch(err => console.error(err));
  };*/

  // 특정 방 삭제


  const handleDeleteRoom = async (roomId) => {
    try {
      console.log('삭제할 방 ID:', roomId);
      const response = await axios.delete('/adminRouter/rooms', {
        headers: {
          'room-id': roomId, // 헤더에 roomId 추가
        },
      });
      queryClient.invalidateQueries(['rooms']);
      console.log('삭제 응답:', response.data);
      alert('방이 삭제되었습니다.');
    } catch (e) {
      console.error('방 삭제 중 오류:', e.response ? e.response.data : e.message);
      alert('방 삭제 중 오류가 발생했습니다.');
    }
  };

  // 검색 필터링된 회원 목록
  const filteredUsers = users.filter(user =>
    user?.id.toLowerCase().includes(searchTerm.toLowerCase())
  ); 

  const hanldeClick = (user)=>{
    setSelectedUser(user);

  }
  return (
    <Background>
      <PageContainer>

        <MainSection>
          <SearchBar>
            <input
              type="text"
              placeholder="회원ID 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          <UserList>
             {filteredUsers.map((user,idx) => (
              <UserItem key={user.id} onClick={() => hanldeClick(user)}>
                {idx}.{user.id}
              </UserItem>
            ))} 
          </UserList>
          {selectedUser && (
            <UserInfo>
              <h3>회원 정보</h3>
              <p>이름: {selectedUser.username }</p>
              <p>생년월일: {selectedUser.birthday}</p>
              <p>아이디: {selectedUser.id}</p>
            </UserInfo>
          )}
        </MainSection>

        <MainSection>
          <RoomList>
            <h3>활성화된 방 목록</h3>
              {!isLoading && rooms.map(room => (
              <RoomItem key={room._id}>
                <RoomButton >
                  <p>방 제목: {room.roomname} / 난이도: {room.gamelevel} / 현재 참가자 수: {room.currentPlayers}</p>
                </RoomButton>
                <DeleteButton onClick={()=>handleDeleteRoom(room._id)}>
                  삭제
                </DeleteButton>
              </RoomItem>
            ))} 
          </RoomList>
          {roomUsers.length > 0 && (
            <RoomUsers>
              <h3>참여 중인 사용자</h3>
              <ul>
                {roomUsers.map(user => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            </RoomUsers>
          )}
        </MainSection>

      </PageContainer>
    </Background>
  );
};

export default ManagePage;

// Styled-components 정의
const Background = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 130px);
`;

const PageContainer = styled.div`
  width: 90vw;
  min-width: 1400px;
  display: flex;
  gap: 40px;
  height: 90%;
  padding: 20px;
  background-color: #2e2e2e;
  border-radius: 10px;
`;

const MainSection = styled.section`
  flex: 0.5;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
`;

const SearchBar = styled.div`
  margin-bottom: 10px;
  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
  }
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  max-height: 300px;
`;

const UserItem = styled.li`
  padding: 10px;
  background-color: #3e3e3e;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: #575757;
  }
`;

const UserInfo = styled.div`
  margin-top: 20px;
  background-color: #3e3e3e;
  padding: 20px;
  border-radius: 5px;
`;

const RoomList = styled.ul`
  overflow-y: auto;
  height: 1200px;
  h3 {
    margin-bottom: 10px;
  }
`;

const RoomItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3e3e3e;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
`;

const RoomButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
`;

const RoomUsers = styled.div`
  margin-top: 20px;
  background-color: #3e3e3e;
  padding: 20px;
  border-radius: 5px;
`;
