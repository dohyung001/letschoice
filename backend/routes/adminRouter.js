const express = require('express'); 
const router = express.Router(); 
//const { verifyAdminToken } = require('../middlewares/authMiddleware'); // 관리자 인증 미들웨어
const Room = require('../models/room'); 
const User = require('../models/user'); 

// 관리자 전용 API 예시
router.get('/users',  async (req, res) => {
  console.log('전체 유저 전달');
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '사용자 목록을 가져오는 중 오류가 발생했습니다.' });
  }
});

router.get('/rooms',  async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: '방 목록을 가져오는 중 오류가 발생했습니다.' });
  }
});

router.delete('/rooms', async (req, res) => {
  const roomId = req.headers['room-id']; // 헤더에서 roomId 읽기
  console.log("삭제 요청 헤더 ID:", roomId);

  // 유효성 검사
  if (!roomId) {
    return res.status(400).json({ message: 'roomId가 제공되지 않았습니다.' });
  }

  try {
    const deletedRoom = await Room.findByIdAndDelete(roomId);
    if (!deletedRoom) {
      return res.status(404).json({ message: '삭제하려는 방을 찾을 수 없습니다.' });
    }

    console.log("삭제된 방:", deletedRoom);
    res.json({ message: '방이 삭제되었습니다.', deletedRoom });
  } catch (error) {
    console.error("방 삭제 중 오류:", error);
    res.status(500).json({ message: '방 삭제 중 오류가 발생했습니다.', error: error.message });
  }
});

module.exports = router;
