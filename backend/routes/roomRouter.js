const express = require('express');
const router = express.Router();
const Room = require('../models/room'); 

// 최대 방 개수 설정
const MAX_ROOMS = 20;

// 방 생성 API
router.post('/create-room', async (req, res) => {
    const { roomname, isPasswordEnabled, password, gamelevel } = req.body;
    if (!roomname || !gamelevel) {
        return res.status(400).send({ message: '방 이름과 난이도는 필수입니다.' });
    }

    try {

        // 현재 방 개수 확인
        const roomCount = await Room.countDocuments();
        if (roomCount >= MAX_ROOMS) {
            return res.status(400).send({ message: `최대 ${MAX_ROOMS}개의 방만 생성할 수 있습니다.` });
        }
        
        // 중복된 방 이름 확인
        const existingRoom = await Room.findOne({ roomname });
        if (existingRoom) {
            return res.status(400).send({ message: '이미 존재하는 방 이름입니다. 다른 이름을 사용하세요.' });
        }

        // 방 생성
        const newRoom = new Room({
            roomname,
            isPasswordProtected: isPasswordEnabled,
            password: password || null,
            gamelevel,
            player1: null,
            player2: null,
        });
        const savedRoom = await newRoom.save(); // MongoDB에 저장

        res.status(200).send({
            message: '방이 성공적으로 생성되었습니다.',
            room: savedRoom,
            roomId: savedRoom._id,
        }); // 방 ID 반환
    } catch (error) {
        console.error('방 생성 중 오류:', error);

        // MongoDB 중복 키 오류 처리
        if (error.code === 11000) {
            return res.status(400).send({ message: '중복된 방 이름입니다. 다른 이름을 사용하세요.' });
        }

        // 기타 오류 처리
        res.status(500).send({ message: '방 생성에 실패했습니다.', error: error.message });
    }
});

// 방 목록 요청 API
router.get('/getRooms', async (req, res) => {
    try {
        // MongoDB에서 방 목록 가져오기
        const rooms = await Room.find();
        const roomList = rooms.map((room) => ({
          id: room._id,
          name: room.roomname,
          gamelevel: room.gamelevel,
          participants: room.currentPlayers,
          isPasswordProtected: room.isPasswordProtected,
          password : room.password
        }));
        res.json(roomList);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({
            success: false,
            message: '방 목록을 불러오는데 실패했습니다.',
        });
    }
});


module.exports = router;