import React from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //유효성 검사 스키마
  const schema = yup.object().shape({
    id: yup
      .string()
      .min(6, "6자 이상 입력해주세요")
      .max(16, "16자 이하로 입력해주세요")
      .required("아이디를 입력해주세요"),
    password: yup.
      string().
      min(6, "6자 이상 입력해주세요").
      max(16, "16자 이하로 입력해주세요").
      required("비밀번호를 입력해주세요"),
  });
  //유효성 검사 폼 연결
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched"
  });

  //로그인 함수
  const handleLogin = async (data) => {
    try {
      const response = await axios.post('/login', {
        id: data.id,
        password: data.password,
        role: data.role,
      });
      console.log('로그인 성공:', response.data.user.id);
      console.log(response);
      

      sessionStorage.setItem('accessToken', response.data.token);
      sessionStorage.setItem('userId', response.data.user.id);
      dispatch(login([response.data.user.id,response.data.user.username]));
      closeModal();
      if(response.data.user.role == 'admin') navigate('/managepage');
    } catch (error) {
      console.log('로그인 실패:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleLogin)}>
      <h1>로그인</h1>
      <div>
        <Label>아이디</Label>
        <Input type="text" {...register('id')} />
        {errors.id && <Error>{errors.id.message}</Error>}
      </div>
      <div>
        <Label>비밀번호</Label>
        <Input type="password" {...register('password')} />
        {errors.password && <Error>{errors.password.message}</Error>}
      </div>
      <Button isValid={isValid} type="submit" disabled={!isValid}>로그인</Button>
    </Form>
  );
}

export default LoginForm;

// Styled-components 정의
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  color: black;
  width: 110px;
  height: 30px;
  border-radius: 10px;
  border: none;
  background-color: ${(props) => props.isValid ? 'rgb(0, 150, 136)' : 'rgba(0, 150, 136, 0.3)'};
  cursor: ${(props) => props.isValid ? 'pointer' : 'not-allowed'};
  &:hover {
    background-color: ${(props) => props.isValid ? 'rgba(0, 150, 136, 0.8)' : 'rgba(0, 150, 136, 0.3)'};
  }
`;

const Input = styled.input`
  font-family: 'Arial', sans-serif;
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Error = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;