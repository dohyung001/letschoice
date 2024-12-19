const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const User = require('../models/user');
const router = express.Router();
require('dotenv').config(); // .env 파일 로드

router.use(cookieParser());

// 사용자 조회 함수
const getUserFromDB = async (id) => {
  return await User.findOne({ id });
};

// 사용자 저장 함수
const saveUserToDB = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

// 중복 ID 체크 API
router.get('/check-duplicate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id });
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking duplicate ID:', error);
    res.status(500).json({ error: '중복 체크 오류가 발생했습니다.' });
  }
});

// 로그인 처리
router.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await getUserFromDB(id);

    if (user && await bcrypt.compare(password, user.password)) {
       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // 일반 사용자 계정인 경우
      res.json({ token, user: {
        id: user.id,
        username: user.username,
        role: user.id === 'admin12345' ? 'admin' : 'user',
      },
     }); // JSON으로 토큰 응답
    }
     else {
      res.status(401).json({ message: '로그인에 실패했습니다. 다시 시도하세요.' });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "로그인 중 오류가 발생했습니다." });
  }
});


// 회원가입 처리
router.post('/register', async (req, res) => {
  console.log("Received data:", req.body); // 클라이언트에서 전송된 데이터 로그
  try {
    const { username, id, password, birthday } = req.body;
    const existingUser = await getUserFromDB(id);

    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 ID입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword); // 해시된 비밀번호 확인

    const savedUser = await saveUserToDB({ username, id, password: hashedPassword, birthday });
    console.log("User saved to DB:", savedUser); // MongoDB에 저장된 결과 확인

    res.status(201).json({ message: '회원가입이 성공적으로 완료되었습니다.' });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "회원가입 중 오류가 발생했습니다." });
  }
});
  

// 홈 페이지 렌더링
router.get('/home', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '토큰이 없습니다. 로그인하세요.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 환경 변수로 설정한 JWT_SECRET 사용
    res.render('home', { user: decoded });
  } catch (error) {
    console.error("Error verifying token:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: '토큰이 만료되었습니다. 다시 로그인하세요.' });
    } else {
      return res.status(403).send('토큰 검증 오류가 발생했습니다.');
    }
  }
});

// 로그아웃 처리
router.get('/logout', (req, res) => {
  return res.redirect('/login');
});

module.exports = router;
