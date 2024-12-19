const { Server } = require("socket.io");
const Room = require("../models/room");
const Score = require("../models/score");
const mongoose = require('mongoose');

const socketHandler = (server) => {
    const io = new Server(server);
    const userSockets = {}; // 소켓 ID와 사용자 정보 매핑 객체
    const roomStates = {}; // 각 방의 게임 상태 저장 객체
    const roundStates = {
        roomId: {
            rounds: {
                1: { winner: 'userId1', times: { userId1: 10, userId2: 12 } },
                2: { winner: 'userId2', times: { userId1: 15, userId2: 11 } },
            },
            results: {
                userId1: 1, // userId1의 총 승리 횟수
                userId2: 1  // userId2의 총 승리 횟수
            },
        },
    };


    //joinRoom 함수 정의
    const joinRoom = async (roomId, userId) => {
        try {
          // roomId 검증 및 변환
          if (!mongoose.Types.ObjectId.isValid(roomId)) {
            throw new Error('유효하지 않은 roomId입니다.');
          }
      
          const room = await Room.findById(new mongoose.Types.ObjectId(roomId));
          if (!room) {
            throw new Error('방을 찾을 수 없습니다.');
          }
      
          // 방에 남은 자리가 있는지 확인
          if (room.currentPlayers >= 2) {
            throw new Error('방이 가득 찼습니다.');
          }
      
          // MongoDB에서 사용자 데이터 가져오기
          const User = require('../models/user'); // User 모델 임포트
          const user = await User.findOne({ id: userId }); // username으로 사용자 조회
      
          if (!user) {
            throw new Error('사용자를 찾을 수 없습니다.');
          }
      
          // 플레이어 추가
          if (!room.player1) {
            room.player1 = user.id; // user.id로 저장
          } else if (!room.player2) {
            room.player2 = user.id; // user.id로 저장
          }
      
          // 현재 플레이어 수 증가
          room.currentPlayers = (room.currentPlayers || 0) + 1;
          await room.save();
      
          console.log(`방 업데이트: ${room.roomname}, 현재 인원: ${room.currentPlayers}`);
          return { room, userId: user.id }; // user.id 반환
        } catch (error) {
          console.error('방 입장 중 오류:', error);
          throw error;
        }
      };
      
    io.on("connection", (socket) => {
        console.log("클라이언트 연결됨. socket ID:", socket.id);

        // 방 입장
        socket.on("joinRoom", async ({ roomId, userId }, callback) => {
            console.log("joinRoom 요청 수신:", { roomId, userId });
            try {
                const { room, user } = await joinRoom(roomId, userId); // userId 포함

                socket.join(roomId); // 소켓 방 참여
                userSockets[socket.id] = { roomId, userId }; // userId 저장

                const remainingSlots = 2 - room.currentPlayers; // 남은 자리 수 계산

                // 새로운 사용자 입장 알림
                socket.to(roomId).emit('userConnected', {
                    userId, // MongoDB에서 가져온 id
                    remainingSlots,
                });

                // 현재 방에 있는 사용자들에게 전체 사용자 목록을 업데이트해줌
                const currentPlayers = [room.player1, room.player2].filter(player => player);
                io.to(roomId).emit('updateRoomPlayers', {
                    players: currentPlayers,
                });

                // 클라이언트에게 응답
                callback({
                    success: true,
                    room: {
                        roomId: room.id, // MongoDB의 _id 또는 다른 ID
                        roomname: room.roomname,
                        gamelevel: room.gamelevel,
                        currentPlayers: room.currentPlayers,
                    },
                    remainingSlots,
                });

                console.log(`사용자 ID: ${userId})이 방 ${roomId}에 입장했습니다. 남은 자리: ${remainingSlots}`);
            } catch (error) {
                console.error("방 입장 중 오류 발생:", error);
                callback({ success: false, message: "방 입장에 실패했습니다." });
            }
        });


        // 플레이어 Ready 상태 설정
        socket.on("setReady", async ({ roomId, userId }, callback) => {
            try {
                // 방 상태 확인
                if (!roomStates[roomId]) {
                    const room = await Room.findById(roomId);
                    if (!room) return callback({ success: false, message: "방을 찾을 수 없습니다." });

                    // 방 상태 초기화
                    roomStates[roomId] = {
                        readyCount: 0,
                        players: [
                            { name: room.player1, ready: false },
                            { name: room.player2, ready: false }
                        ],
                        gamelevel: room.gamelevel,
                    };
                }

                const roomState = roomStates[roomId];
                const player = roomState.players.find((p) => p.name === userId);

                if (!player) {
                    return callback({ success: false, message: "플레이어를 찾을 수 없습니다." });
                }

                if (player.ready) {
                    return callback({ success: false, message: "이미 준비 완료 상태입니다." });
                }

                // 플레이어 Ready 상태 설정
                player.ready = true;
                roomState.readyCount += 1;

                // 모든 플레이어가 Ready 상태인 경우 게임 시작
                if (roomState.readyCount === 2) {
                    console.log('게임 시작')
                    io.to(roomId).emit("startGame", {
                        message: "게임 시작!",
                        gamelevel: roomState.gamelevel,
                    });
                }

                // 클라이언트에게 Ready 상태 업데이트 알림
                io.to(roomId).emit("updateReadyState", {
                    players: roomState.players,
                    readyCount: roomState.readyCount,
                });

                callback({ success: true, message: `${userId}님이 준비되었습니다.` });
            } catch (error) {
                console.error("Ready 상태 설정 중 오류 발생:", error);
                callback({ success: false, message: "Ready 상태 설정에 실패했습니다." });
            }
        });


        socket.on("endRound", async ({ roomId, timeElapsed, userId, round }, callback) => {
            try {
                console.log(`[DEBUG] endRound 이벤트 수신: roomId=${roomId}, userId=${userId}, round=${round}, timeElapsed=${timeElapsed}`);
        
                // 방 상태 초기화 (메모리)
                if (!roundStates[roomId]) {
                    roundStates[roomId] = { rounds: {}, results: {} };
                }
        
                const roomState = roundStates[roomId];
        
                // 라운드 데이터 초기화
                if (!roomState.rounds[round]) {
                    roomState.rounds[round] = { times: {} };
                }
        
                const currentRoundData = roomState.rounds[round];
        
                // 사용자 소요 시간 저장 (메모리)
                currentRoundData.times[userId] = timeElapsed;
                console.log(`[DEBUG] 라운드 ${round} 저장된 데이터:`, currentRoundData);
        
                // 두 플레이어 점수 제출 여부 확인
                const playerIds = Object.keys(currentRoundData.times);
                if (playerIds.length === 2) {
                    console.log(`[DEBUG] 라운드 ${round} 종료: 모든 플레이어 제출 완료.`);
        
                    // 승자 결정
                    const [player1, player2] = playerIds;
                    const player1Time = currentRoundData.times[player1];
                    const player2Time = currentRoundData.times[player2];
                    const roundWinner = player1Time < player2Time ? player1 : player2;
        
                    currentRoundData.winner = roundWinner;
        
                    // 승리 기록 업데이트 (메모리)
                    if (!roomState.results[roundWinner]) {
                        roomState.results[roundWinner] = 0;
                    }
                    roomState.results[roundWinner]++;
        
                    console.log(`[DEBUG] 라운드 ${round} 승자: ${roundWinner}`);
                    console.log(`[DEBUG] 현재 승리 기록:`, roomState.results);
        
                    // DB 상태 업데이트 (매 라운드마다 새 문서 생성)
                    const room = await Room.findById(roomId);
                    if (!room) {
                        console.error(`Room with ID ${roomId} not found.`);
                        io.to(roomId).emit("error", { message: "방을 찾을 수 없습니다." });
                        return;
                    }
        
                    // 라운드별로 새 점수 문서 생성
                    const newScore = new Score({
                        roomname: room.roomname,
                        gamelevel: room.gamelevel,
                        player1: room.player1,
                        player2: room.player2,
                        score1: player1Time,
                        score2: player2Time,
                        winner: roundWinner,
                        round: round,
                    });
        
                    await newScore.save();
                    console.log(`[DB] Round ${round} score saved for room ${room.roomname}.`);
        
                    // 최종 승자 결정
                    if (round === 3) {
                        console.log(`[DEBUG] 게임 종료: 최종 점수 전송.`);
        
                        const sortedResults = Object.entries(roomState.results).sort(([, a], [, b]) => b - a);
                        const gameWinner = sortedResults[0][1] > sortedResults[1][1] ? sortedResults[0][0] : "draw";
                        const gameLoser = sortedResults[1] ? sortedResults[1][0] : null; // 패자 결정
        
                        io.to(roomId).emit("endGame", {
                            message: "게임 종료!",
                            results: roomState.results,
                            winner: gameWinner,
                            loser: gameLoser, // 추가
                        });
        
                        console.log(`[DEBUG] 최종 승자: ${gameWinner}, 최종 패자: ${gameLoser}`);
                    } else {
                        // 다음 라운드로 이동
                        io.to(roomId).emit("nextRound", {
                            message: "다음 라운드로 이동합니다.",
                            winner: roundWinner,
                            round: round + 1,
                            playerTimes: currentRoundData.times,
                        });
                    }
                } else {
                    console.log(`[DEBUG] 플레이어 ${userId}의 점수가 제출되었습니다. 다른 플레이어 대기 중.`);
                    io.to(roomId).emit("waitingForOpponent", {
                        message: "다른 플레이어의 제출을 기다리고 있습니다.",
                    });
                }
        
                callback({ success: true, message: "라운드 데이터 저장 완료" });
            } catch (error) {
                console.error("[ERROR] endRound 처리 중 오류:", error.message);
                callback({ success: false, message: error.message });
            }
        });
        


        //연결 해제 처리
        socket.on("disconnect", async () => {
            const userInfo = userSockets[socket.id];
            if (userInfo) {
                const { roomId, userId } = userInfo;

                try {
                    // 방 정보 가져오기 및 업데이트
                    const room = await Room.findById(roomId);
                    if (room) {
                        if (room.player1 === userId) {
                            room.player1 = null;
                        } else if (room.player2 === userId) {
                            room.player2 = null;
                        }

                        // 현재 플레이어 수 감소
                        room.currentPlayers = Math.max(0, room.currentPlayers - 1); // 최소 0 유지

                        // 참가자가 0명이 되면 player1, player2 모두 비워줌
                        if (room.currentPlayers === 0) {
                            room.player1 = null;
                            room.player2 = null;
                        }

                        await room.save();

                        // 모든 플레이어의 준비 상태를 false로 초기화
                        if (roomStates[roomId]) {
                            roomStates[roomId].players.forEach(player => player.ready = false);
                            roomStates[roomId].readyCount = 0;
                        }

                        // 남은 자리 정보 전송
                        io.to(roomId).emit('userDisconnected', {
                            userId,
                            remainingSlots: 2 - room.currentPlayers,
                            readyStates: { player1: false, player2: false }, // 준비 상태 초기화 전송
                        });

                        console.log(`사용자 ${userId}이 방 ${roomId}에서 나갔습니다. 남은 자리: ${2 - room.currentPlayers}`);
                    }
                } catch (error) {
                    console.error('Disconnect 처리 중 오류:', error);
                }

                delete userSockets[socket.id];
            }
        });


    });
};

module.exports = socketHandler;
