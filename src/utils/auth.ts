
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';

const USERS_KEY = 'users';
const AUTH_TOKEN_KEY = 'authToken';

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const register = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
  if (password.length < 6) {
    return { success: false, message: 'Пароль должен содержать минимум 6 символов' };
  }

  const users = getUsers();
  const existingUser = users.find(user => user.email === email);
  
  if (existingUser) {
    return { success: false, message: 'Пользователь с таким email уже существует' };
  }

  const passwordHash = await hashPassword(password);
  const newUser: User = { email, passwordHash };
  
  users.push(newUser);
  saveUsers(users);
  
  return { success: true, message: 'Регистрация успешна' };
};

export const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, message: 'Неверные учетные данные' };
  }

  const isValidPassword = await comparePassword(password, user.passwordHash);
  
  if (!isValidPassword) {
    return { success: false, message: 'Неверные учетные данные' };
  }

  const token = uuidv4();
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  
  return { success: true, message: 'Успешный вход' };
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};
