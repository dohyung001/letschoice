import React from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios';
import { toggleMode } from '../../../redux/authSlice';
import { useDispatch } from 'react-redux';

const SignupForm = () => {
  const dispatch = useDispatch();

  //유효성 검사 스키마
  const schema = yup.object().shape({
    username: yup
      .string()
      .min(2, "2자 이상 입력해주세요")
      .max(4, "4자 이하로 입력해주세요")
      .required("이름을 입력해주세요"),
    id: yup
      .string()
      .min(6, "6자 이상 입력해주세요")
      .max(16, "16자 이하로 입력해주세요")
      .required("아이디를 입력해주세요"),
    password: yup
      .string()
      .min(6, "6자 이상 입력해주세요")
      .max(16, "16자 이하로 입력해주세요")
      .required("비밀번호를 입력해주세요"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.')
      .required("입력해주세요"),
    birthdate: yup
      .string()
      .required("입력해주세요"),
  });

  //useForm: 스키마 & 폼 연결
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched"
  });

  //제출함수
  const handleSignup = async (data) => {
    try {
      const response = await axios.post('/register', {
        username: data.username,
        id: data.id,
        password: data.password,
        birthday: data.birthdate
      })
      console.log('회원가입 성공', response);
      dispatch(toggleMode());

    } catch (error) {
      console.log('회원가입 실패:', error);
      alert('회원가입에 실패했습니다.')
    } finally {
      console.log('실행은됨');
    }
  };


  return (
    <Form onSubmit={handleSubmit(handleSignup)}>
      <h1>회원가입</h1>
      <div>
        <Label>이름</Label>
        <Input
          type="text"
          {...register('username')}
          placeholder="이름을 입력해주세요"
        />
        {errors.username && <Error>{errors.username.message}</Error>}
      </div>
      <div>
        <Label>아이디</Label>
        <Input
          type="text"
          {...register('id')}
          placeholder="아이디를 입력해주세요"
        />
        {errors.id && <Error>{errors.id.message}</Error>}
      </div>
      <div>
        <Label>비밀번호</Label>
        <Input
          type="password"
          {...register('password')}
          placeholder="비밀번호를 입력해주세요"
        />
        {errors.password && <Error>{errors.password.message}</Error>}
      </div>
      <div>
        <Label>비밀번호 확인</Label>
        <Input
          type="password"
          {...register('confirmPassword')}
          placeholder="비밀번호를 다시 입력해주세요"
        />
        {errors.confirmPassword && <Error>{errors.confirmPassword.message}</Error>}
      </div>
      <div>
        <Label>생년월일</Label>
        <Input
          type="date"
          {...register('birthdate')}
        />
        {errors.birthdate && <Error>{errors.birthdate.message}</Error>}
      </div>
      <Button isValid={isValid} type="submit" disabled={!isValid}>회원가입</Button>
    </Form>
  );
}

export default SignupForm;

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
  background-color: ${(props) => props.isValid ? 'rgb(0, 150, 136)' : 'rgba(0, 150, 136, 0.2)'};
  cursor: ${(props) => props.isValid ? 'pointer' : 'not-allowed'};
  
  &:hover {
    background-color: ${(props) => props.isValid ? 'rgba(0, 150, 136, 0.8)' : 'rgba(0, 150, 136, 0.2)'};
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
