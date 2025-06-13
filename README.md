# Zoom Clone

A Zoom-like video conferencing application built with **React**, **TypeScript**, and **Vite**, designed for seamless and efficient virtual collaboration.

## Features

Our Zoom Clone offers a comprehensive suite of features to enhance your meeting experience:

* **User Authentication:** Secure access to your meetings and data.
* **Meetings Board:** A centralized hub for managing, scheduling, and joining meetings.
* **Group Video Streaming:** High-quality, real-time video conferencing for multiple participants.
* **Screen Sharing:** Share your desktop or specific applications for presentations and collaborative work.
* **In-Meeting Messaging:** Communicate with participants via text chat during active meetings.
* **Customizable Video Streaming Settings:** Adjust video quality and other settings to optimize your experience.

### Currently Under Development

I am actively expanding the functionality of the app with the following features:

* **Join Meetings via Shared Links:** Effortlessly join meetings with a simple click on a shared URL.
* **Meeting Recording:** Capture and save your meetings for future reference and review.

### Soon to be Added
* **AI-Powered Collaboration:** Integration with [Ollama](https://ollama.com/) will provide intelligent assistance during meetings, generating talking points and suggestions to foster more productive discussions.

---

## Tech Stack

Our application is built with a robust and entirely open-source tech stack:

* **Frontend:** React, TypeScript, Vite
* **Backend:** Go, gRPC, LiveKit
* **Database & Auth:** Supabase

## Preview

[Zoom Clone Preview](https://drive.google.com/file/d/1QpqDB71BLFDp9R2P4LTai2ccnsrDzMex/view?usp=sharing)

---

## Getting Started

To get a local copy up and running, follow these simple steps:

1. **Clone the repository:**
  ```bash
  git clone [repository-url]
  ```
  (Replace `[repository-url]` with the actual URL of your repository)

2. **Install dependencies:**
  ```bash
  npm install
  ```

3. **Run the development server:**
  ```bash
  npm run dev
  ```

4. **Backend setup (Go):**
  - Clone the backend repository (if separate).
  - Run database migrations:
    ```bash
    go run ./cmd/migrate
    ```
  - Start the backend server:
    ```bash
    go run ./cmd/server
    ```
  - Start the gRPC-Web proxy:
    ```bash
    grpcwebproxy --backend_addr=localhost:50051 --allowed_origins=http://localhost:5173 --allowed_headers=authorization,x-user-agent,x-grpc-web,content-type --run_http_server=true --server_http_debug_port=8080 --run_tls_server=false
    ```
  
**Note:**
* This function/class/module is part of an entirely open source project.
* All technologies and dependencies used in this project are open source.

Now you can access the app at [http://localhost:5173](http://localhost:5173) and begin developing!