require('dotenv').config(); // 반드시 최상단에 위치
console.log("MongoDB URL:", process.env.MONGODB_URL); // 환경 변수 출력
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http'); // http 모듈 추가
const { Server } = require('socket.io'); // socket.io 추가
const app = express();
const server = http.createServer(app); // http 서버 생성
const io = new Server(server); // socket.io 서버 초기화
const authRoutes = require('./routes/auth'); // 라우터 파일 가져오기
const gameLevel1 = require('./routes/gameLevel1');
const roomRoutes = require('./routes/roomRouter');
const scoreRoutes = require('./routes/scoreRouter');
const gameLevel3 = require('./routes/gameLevel3');
const adminRouter = require('./routes/adminRouter');
const download = require('./routes/Download');

// MongoDB 연결 설정
mongoose.connect(process.env.MONGODB_URL, {
  serverSelectionTimeoutMS: 30000 // 10초 동안 연결 시도
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// CORS 설정 (포트 3000에서 온 요청 허용)
app.use(cors({ origin: 'https://team08.kwweb.duckdns.org', credentials: true }));//여기는 안 바꿔도되고
//배포 시에 프론트 api 링크를 다 바꿔야됨 localhost로하면 안되고 https로 다 해야됨!!

// body-parser 설정 (express 내장)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON 요청 파싱

// 인증 미들웨어 정의
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>" 형식에서 토큰 추출

  if (!token) return res.status(401).json({ message: '토큰이 없습니다. 로그인하세요.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    req.user = user;
    next();
  });
};

// /MainPage 경로에 인증 미들웨어 추가
app.get('/MainPage', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// 라우터 설정
app.use('/', authRoutes); // '/' 경로로 authRoutes를 설정
app.use('/', roomRoutes); // roomRoutes 추가, /api 경로에서 사용
app.use('/gameLevel1', gameLevel1); 
app.use('/rooms', roomRoutes);
app.use('/scores', scoreRoutes);
app.use('/gameLevel3', gameLevel3);
app.use('/adminRouter', adminRouter);
app.use('/download', download);


// 소켓 객체를 라우터에 전달
app.use((req, res, next) => {
  req.io = io;
  next();
});

// React 정적 파일 제공
app.use(express.static(path.join(__dirname, '../frontend/build')));

// 모든 기타 경로에 대해 React의 index.html 제공
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// 서버 실행
const PORT = 20880;
server.listen(PORT, '0.0.0.0', () => { // server 객체로 변경
  console.log(`Server is running on port ${PORT}`);
});

// Socket.IO 핸들러 초기화
const socketHandler = require('./modules/socketHandler');
socketHandler(server); // 서버 객체 전달
