import { initReactQueryAuth } from 'react-query-auth';
import { getUserProfile, loginWithEmailAndPassword, registerWithEmailAndPassword } from './api';

interface User {
  id: string;
  name: string;
}

interface Error {
  message: string;
}

export const storage = {
    getToken: () => JSON.parse(window.localStorage.getItem("token")!),
    setToken: (token: any) =>
      window.localStorage.setItem("token", JSON.stringify(token)),
    clearToken: () => window.localStorage.removeItem("token")
};
  
export async function handleUserResponse(data: any) {
    const { jwt, user } = data;
    storage.setToken(jwt);
    return user;
}
  
async function loadUser() {
    let user = null;

    if (storage.getToken()) {
        const data = await getUserProfile();
        user = data;
    }
    return user;
}

async function loginFn(data: string) {
    const response = await loginWithEmailAndPassword(data);
    const user = await handleUserResponse(response);
    return user;
}
 
async function registerFn(data: string) {
    const response = await registerWithEmailAndPassword(data);
    const user = await handleUserResponse(response);
    return user;
}
  
async function logoutFn() {
    await storage.clearToken();
}
  
const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn,
};

//export const { AuthProvider, useAuth } = initReactQueryAuth<
//  User,
//  Error,
//  LoginCredentials,
//  RegisterCredentials
//>(authConfig);

const { AuthProvider, useAuth } = initReactQueryAuth<User, Error>(authConfig);

export { AuthProvider, useAuth };