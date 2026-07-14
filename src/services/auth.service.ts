import axiosInstance from '../api/axios';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>('/auth/register', data);
  return response.data;
};
