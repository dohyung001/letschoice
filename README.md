[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/_GmLK7qi)

## 실행방법1
- 백엔드에서 ```npm start``` => 프론트엔드에서 ```npm start```
## 실행방법2
- 프론트엔드에서 ```npm run build``` => 백엔드에서 ```npm start``` => localhost:3002

## 실행방법3
- 전체 루트 파일에서 npm start 한 번
### 파일구조
```
📦backend
 ├ 📂models
 │  └ 📜user.js: Mongoose User 모델
 │  └ 📜room.js: Mongoose Room 모델
 │  └ 📜score.js: Mongoose Score 모델
 ├ 📂modules
 │  ├ 📜socketHandler.js: WebSocket 처리
 ├ 📂routes
 │  └ 📜auth.js: 인증 및 회원 관리 라우터
 │  └ 📜roomRouter.js: 방 생성 관리 라우터
 │  └ 📜scoreRouter.js: 점수 저장 및 계산 라우터
 │  └ 📜gamelevel1.js: 난이도 하 게임화면 관리 라우터
 ├ 📜.env: 환경 변수 파일
 ├ 📜.gitignore: Git에서 무시할 파일 정의
 ├ 📜package.json: Node.js 프로젝트 설정
 ├ 📜package-lock.json: 패키지 잠금 파일
 ├ 📜README.md: 프로젝트 설명
 └ 📜server.js: Express 서버의 진입점, 메인 파일
📦frontend  
 ├ 📂public  
 │  ├ 📜cute-cat.png : 앱 아이콘   
 │  └ 📜index.html : 기본 HTML 템플릿  
 ├ 📂src  
 │  ├ 📂assets  
 │  │  ├ 📂fonts : 폰트 파일  
 │  │  ├ 📂icons : 아이콘 파일  
 │  │  └ 📂imgs : 이미지 파일  
 │  ├ 📂components  
 │  │  ├ 📂backgrounds : 배경 관련 컴포넌트  
 │  │  ├ 📂bars : 바 관련 컴포넌트  
 │  │  ├ 📂buttons : 버튼 컴포넌트  
 │  │  └ 📂modals : 모달 컴포넌트  
 │  ├ 📂layout  
 │  │  └ 📜root-layout.jsx : 기본 레이아웃 컴포넌트  
 │  ├ 📂pages  
 │  │  └ 📜MainPage.jsx : 메인 페이지 컴포넌트  
 │  ├ 📜App.js : 메인 컴포넌트  
 │  ├ 📜App.css : 앱 전역 스타일  
 │  ├ 📜index.js : 리액트 렌더링  
 │  └ 📜index.css 
 ├ 📜.gitignore 
 ├ 📜package-lock.json 
 └📜package.json  
   