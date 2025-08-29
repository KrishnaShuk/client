# Intelligent PDF Assistant & Podcast Generator

![Next.js](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

An intelligent document interaction platform that allows users to upload PDFs, engage in a conversational Q&A with the content, and automatically generate a high-quality audio podcast summarizing the document's key points.

### Live Demo

https://github.com/user-attachments/assets/58766cf4-48b6-4990-a8f5-5ead5297b7e7


## About The Project

Tired of sifting through dense, multi-page documents? This project was built to solve that problem. It's a full-stack, intelligent document assistant designed to make information accessible and engaging. Users can securely upload documents and, instead of reading, ask questions to receive context-aware answers through a dynamic chat interface.

The standout feature is the ability to transform any document into a shareable, single-speaker audio summary. The application orchestrates a multi-step, asynchronous job that generates a script with Google's Gemini, converts it to speech with Google Cloud TTS, and stores the final podcast in the cloud for on-demand listening.

## Key Features

-   **Interactive Chat with PDFs:** Utilizes a Retrieval-Augmented Generation (RAG) architecture to provide accurate, context-aware answers from user-uploaded documents.
-   **Asynchronous Podcast Generation:** A multi-step background job that summarizes document content, converts it to a lifelike monologue using Google Cloud TTS, and stores the final MP3 in Cloudflare R2.
-   **Secure, Multi-Tenant User Authentication:** Leverages Clerk for robust user management, ensuring each user's documents and chat histories are private and secure.
-   **Real-time UI:** The frontend provides instant feedback for long-running tasks like PDF processing and podcast generation by polling the backend for status updates.
-   **Modern, Responsive Interface:** A sleek, Claude-inspired UI built with Next.js, Tailwind CSS, and Framer Motion for a smooth user experience.

## Tech Stack

This project uses a modern, service-oriented architecture.

-   **Frontend:**
    -   Framework: **Next.js (App Router)**
    -   Language: **TypeScript**
    -   Styling: **Tailwind CSS**
    -   UI Components: **shadcn/ui**
    -   State Management: **Zustand**
    -   Animation: **Framer Motion**

-   **Backend:**
    -   Runtime: **Node.js**
    -   Framework: **Express.js**
    -   Asynchronous Jobs: **BullMQ**

-   **AI & Data:**
    -   LLM: **Google Gemini**
    -   Speech Synthesis: **Google Cloud Text-to-Speech**
    -   Orchestration: **LangChain.js**
    -   Vector Database: **Qdrant**
    -   Primary Database: **MongoDB (Atlas)**
    -   Job Queue: **Redis (Upstash)**

-   **Infrastructure & Authentication:**
    -   Frontend Hosting: **Vercel**
    -   Backend Hosting: **Railway (API & Worker)**
    -   Object Storage: **Cloudflare R2**
    -   Authentication: **Clerk**

## System Architecture

The application is deployed using a hybrid strategy to handle both serverless frontend rendering and long-running backend processes.

1.  **Frontend (Vercel):** The Next.js client is deployed on Vercel for optimal performance and scalability.
2.  **Backend API (Railway):** The Express.js server runs as a `web` service on Railway, handling all incoming API requests.
3.  **Job Queue (Redis):** When a heavy task is requested (like PDF processing or podcast generation), the API adds a job to a BullMQ queue on Upstash Redis.
4.  **Backend Worker (Railway):** A separate `worker` service on Railway continuously listens to the Redis queue, processing jobs asynchronously without blocking the API.
5.  **Cloud Services:** The worker interacts with various cloud services (Qdrant, Google AI, R2) to complete its tasks and updates the primary MongoDB database with the results.

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

-   Node.js (v20.x or higher recommended)
-   `npm`
-   Git
-   Access to all the cloud services listed in the Tech Stack.

### Installation & Setup

1.  **Clone the repositories:**
    ```sh
    git clone https://github.com/<your_username>/client.git
    git clone https://github.com/<your_username>/server.git
    ```

2.  **Setup the Backend (`server`):**
    ```sh
    cd server
    npm install
    ```
    -   Create a `.env` file in the `server` root and populate it with your credentials. See `.env.example` for the required variables.
    -   Place your Google Cloud TTS credentials in a `gcloud-credentials.json` file in the `server` root.

3.  **Setup the Frontend (`client`):**
    ```sh
    cd ../client
    npm install
    ```
    -   Create a `.env.local` file in the `client` root and populate it with your Clerk and backend API credentials.

### Running the Application

1.  **Run the Backend Worker:**
    ```sh
    # In the /server directory
    node worker.js
    ```
2.  **Run the Backend Server:**
    ```sh
    # In a new terminal, in the /server directory
    node index.js
    ```
3.  **Run the Frontend:**
    ```sh
    # In a new terminal, in the /client directory
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.
