// client/lib/api.ts
import axios from 'axios';

// Get the base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create a new axios instance. This instance does not have the token yet.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// --- Define the interfaces for our data ---
export interface ChatRoom {
  _id: string;
  title: string;
  userId: string;
  documentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatRoomId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  updatedAt: string;
}

// --- Define our API functions ---
// Each function now accepts the token as an argument.

// Function to get all chat rooms for the current user
export const getChatRooms = async (token: string): Promise<ChatRoom[]> => {
  const response = await apiClient.get('/chatrooms', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Function to upload a PDF file
export const uploadPdf = async (token: string, file: File): Promise<{ documentId: string }> => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await apiClient.post('/upload/pdf', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Function to get all messages for a specific chat room
export const getMessages = async (token: string, chatRoomId: string): Promise<Message[]> => {
  const response = await apiClient.get(`/chatrooms/${chatRoomId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Function to post a new message to a chat room
export const postMessage = async (token: string, chatRoomId: string, message: string): Promise<Message> => {
  const response = await apiClient.post(`/chatrooms/${chatRoomId}/messages`, { message }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};