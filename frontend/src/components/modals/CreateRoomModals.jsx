import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from 'react-redux';
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from 'axios';

const CreateRoomModal = ({ closeModal }) => {
  const gamelevel = useSelector((state) => state.page.selectedDifficulty);
  const queryClient = useQueryClient();

   // gamelevel 값을 확인
   console.log("현재 선택된 난이도: ", gamelevel); // 여기에 추가

  // 유효성 검사 스키마
  const schema = yup.object().shape({
    roomName: yup.string().required("방 제목을 입력해주세요"),
    isPasswordEnabled: yup.boolean(),
    password: yup
      .string()
      .when("isPasswordEnabled", {
        is: true,
        then: (schema) => schema.required("비밀번호를 입력해주세요"),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  // 스키마 & 폼 연결
   const { register, handleSubmit, watch, formState: { errors, isValid }, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // 비밀번호 설정 체크박스 상태 감시
  const isPasswordEnabled = watch("isPasswordEnabled");

  // 체크박스가 해제될 때 비밀번호 필드 초기화
  useEffect(() => {
    if (!isPasswordEnabled) {
      setValue("password", ""); // 비밀번호 값 초기화
    }
  }, [isPasswordEnabled]);

  // 방 생성 Mutation
  const createRoomMutation = useMutation({

   mutationFn: async (data) => {
      const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기

      const payload = {
        roomname: data.roomName,
        gamelevel: gamelevel,
        isPasswordEnabled: data.isPasswordEnabled,
        password: data.isPasswordEnabled ? data.password : null,
      };

      return await axios.post('/rooms/create-room', payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Bearer 키워드 추가
          'Content-Type': 'application/json',
        },
      });
    },
    
      onSuccess: () => {
        // 방 목록 데이터를 무효화하여 최신 데이터를 가져옴
        queryClient.invalidateQueries(['rooms']);
        closeModal();
      },
      onError: (error) => {
        console.error('방 생성 오류:', error.response?.data || error.message);
      },
    }
  );

  // 제출 함수
  const onSubmit = (data) => {
    createRoomMutation.mutate(data);
  };

  return (
    <ModalBackground>
      <ModalContent>
        <CloseButton onClick={closeModal}>X</CloseButton>
        <Title>방 만들기</Title>
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <FormItem>
            <Label>방 제목</Label>
            <Input roomname="true" {...register("roomName")} placeholder="방 제목을 입력하세요" />
            {errors.roomName && <Error>{errors.roomName.message}</Error>}
          </FormItem>

          <FormItem>
            <CheckboxContainer>
              <Label>비밀번호 설정</Label>
              <Checkbox type="checkbox" {...register("isPasswordEnabled")} />
            </CheckboxContainer>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              {...register("password")}
              disabled={!isPasswordEnabled}
            />
            {errors.password && isPasswordEnabled && <Error>{errors.password.message}</Error>}
          </FormItem>

          <Button type="submit" disabled={!isValid} isValid={isValid}>방 만들기</Button>
        </FormContainer>
      </ModalContent>
    </ModalBackground>
  );
};

export default CreateRoomModal;

// Styled-components 정의
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: gray;
  padding: 30px;
  border-radius: 12px;
  width: 700px;
  max-width: 90%;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  margin-bottom: 10px;
  font-size: 20px;
  align-self: flex-end;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 16px;
`;

const Input = styled.input`
  font-family: 'Roboto', sans-serif;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: ${(props) => (props.roomname ? '40%' : '100%')};
  &:disabled {
    background-color: #e0e0e0;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

const Button = styled.button`
  background-color: ${(props) => (props.isValid ? 'rgb(0, 150, 136)' : 'rgba(0, 150, 136, 0.3)')};
  color: white;
  font-size: 16px;
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  cursor: ${(props) => (props.isValid ? 'pointer' : 'not-allowed')};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.isValid ? 'rgba(0, 150, 136, 0.8)' : 'rgba(0, 150, 136, 0.3)')};
  }
`;

const Error = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;
