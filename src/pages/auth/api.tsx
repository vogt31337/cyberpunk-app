import { storage } from "./auth";
import apiClient from "../../http-common";

interface AuthResponse {
  user: User;
  jwt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export async function handleApiResponse(response: any) {
  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}

export async function getUserProfile() {
//   return await fetch(`${API_URL}/auth/me`, {
//     headers: {
//       Authorization: storage.getToken()
//     }
//   }).then(handleApiResponse);
    return await apiClient.get('/auth/me', {
        headers: {
            Authorization: storage.getToken()
        }
    }).then(handleApiResponse)
}

export async function loginWithEmailAndPassword(data: string): Promise<AuthResponse> {
//   return window
//     .fetch(`${API_URL}/auth/login`, {
//       method: "POST",
//       body: JSON.stringify(data)
//     })
//     .then(handleApiResponse);
    return new Promise((data) =>{
        apiClient.post('/auth/login', {
            data
        }).then(handleApiResponse)
    });
}

export async function registerWithEmailAndPassword(data: string): Promise<AuthResponse> {
//   return window
//     .fetch(`${API_URL}/auth/register`, {
//       method: "POST",
//       body: JSON.stringify(data)
//     })
//     .then(handleApiResponse);
    return new Promise((data) => {
        apiClient.post('/auth/register', {
            data
        }).then(handleApiResponse)
    });
}
