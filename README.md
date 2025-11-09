# 🏠 SafeNest – Smart Student Safety Management System

**SafeNest** is an intelligent **IoT-powered student safety management system** designed to ensure real-time monitoring, emergency detection, and secure communication between students, parents, and school authorities.  
This project integrates embedded hardware, cloud computing, and mobile/web interfaces to create a reliable and proactive safety ecosystem.

---

## 📘 Table of Contents
- [About the Project](#-about-the-project)
- [System Overview](#-system-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Hardware Components](#-hardware-components)
- [Software Components](#-software-components)
- [Installation & Setup](#️-installation--setup)
- [Firebase Configuration](#-firebase-configuration)
- [Web Dashboard Setup](#-web-dashboard-setup)
- [Project Objectives](#-project-objectives)
- [Future Enhancements](#-future-enhancements)
- [Contributors](#-contributors)
- [License](#-license)
- [Connect](#-connect)

---

## 💡 About the Project

The **SafeNest System** addresses the increasing need for student safety through real-time IoT-based monitoring.  
By combining sensor data, cloud integration, and intelligent alert mechanisms, SafeNest ensures that parents and institutions are instantly informed about any potential safety issues — such as abnormal heart rate, sudden falls, or unsafe locations.

---

## 🔍 System Overview

The project operates in three layers:

1. **Hardware Layer (IoT)** – Collects real-time data using sensors connected to the ESP32 microcontroller.  
2. **Cloud Layer (Firebase)** – Manages authentication, storage, and alert communication via Firebase Realtime Database.  
3. **Application Layer (Web/Mobile)** – Displays safety data, alerts, and analytics for guardians and administrators.

---

## 🚀 Key Features

- **Real-Time Monitoring** – Continuous tracking of heart rate, motion, and location.  
- **Emergency Alerts** – Automatic alert notifications for critical events (fall detection, high/low heart rate, unsafe zones).  
- **Cloud Integration** – Syncs data securely with Firebase for 24/7 access.  
- **Interactive Dashboard** – Displays live sensor data, alerts, and location mapping.  
- **Secure Communication** – End-to-end authentication using Firebase Auth.  
- **Cross-Platform Accessibility** – Works with both mobile and desktop environments.

---

## 🧩 Architecture

[ Sensors ]
↓
[ ESP32 Controller ]
↓ (Wi-Fi)
[ Firebase Realtime Database ]
↓
[ Web / Mobile Dashboard ]

yaml
Copy code

Each student device transmits data such as heart rate, accelerometer values, and GPS coordinates to the Firebase cloud.  
The dashboard visualizes these readings and generates alerts when safety thresholds are exceeded.

---

## ⚙️ Tech Stack

| Layer | Technologies Used |
|-------|--------------------|
| **Hardware** | ESP32, MAX30102, ADXL345, GPS Module, Buzzer, OLED Display |
| **IoT Framework** | Arduino IDE, C++ |
| **Cloud & Backend** | Firebase Authentication & Realtime Database |
| **Frontend** | HTML, CSS, JavaScript, Firebase SDK |
| **Communication** | Wi-Fi, HTTP/MQTT (optional) |

---

## 🔧 Hardware Components

| Component | Function |
|------------|-----------|
| **ESP32** | Central microcontroller managing sensors and connectivity |
| **MAX30102** | Measures heart rate and SpO₂ |
| **ADXL345** | Detects motion and fall events |
| **GPS Module** | Tracks real-time location |
| **Buzzer / Vibration Motor** | Provides audible alerts |
| **OLED Display** | Displays sensor and alert status |

---

## 💻 Software Components

- **Arduino IDE** – Firmware development and serial monitoring  
- **Firebase Realtime Database** – Stores telemetry and alerts  
- **Firebase Authentication** – Ensures secure user access  
- **Web Dashboard** – Displays real-time safety information using Firebase SDK v9  

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/SafeNest.git
cd SafeNest
2️⃣ Configure Firmware
Open firmware/SafeNest.ino in Arduino IDE.

Install required libraries (from lib_deps.txt):

Firebase-ESP-Client by Mobizt

SparkFun MAX3010x Pulse and Proximity Sensor Library

TinyGPSPlus by Mikal Hart

Adafruit Unified Sensor + ADXL345

Edit Wi-Fi and Firebase credentials at the top of the sketch.

Connect your ESP32 board → Upload the firmware.

☁️ Firebase Configuration
Go to Firebase Console → Create a new project.

Enable:

Realtime Database

Authentication (Email/Password)

Copy:

Web API Key

Database URL

Paste these values into:

SafeNest.ino

web/main.js

Apply sample Firebase rules from:

pgsql
Copy code
firebase/database.rules.json
🌐 Web Dashboard Setup
Open the web/ folder.

Replace your Firebase configuration inside main.js.

Start a local server:

bash
Copy code
npx serve web
or open directly using VS Code Live Server.

View real-time data, alerts, and student safety visualization.

🎯 Project Objectives
Enhance student safety using IoT-driven continuous monitoring.

Enable parents and schools to take preventive safety actions.

Create a reliable and scalable safety network for educational institutions.

🔮 Future Enhancements
AI-driven anomaly detection for behavioral insights.

SMS/Voice call integration for critical alerts.

Multi-student management for school-wide deployment.

Advanced dashboard analytics and heatmaps.

Integration with existing school management systems (LMS/SIS).

👩‍💻 Contributors
Name	Role
Venura	Embedded Systems & IoT Integration
Heyli	Web Dashboard Development
Lochana	Firebase Cloud Configuration
Risini	UI/UX Design & Mobile App Prototype
Hansani	Documentation & Research

📜 License
This project is licensed under the MIT License.
You may freely use, modify, and distribute this code for educational or research purposes with appropriate credit.

🌐 Connect
📧 Contact: [your-email@example.com]
🔗 LinkedIn: https://linkedin.com/in/your-profile
💻 GitHub: https://github.com/<your-username>/SafeNest

Empowering a safer tomorrow through intelligent IoT-driven protection.

yaml
Copy code

---

Would you like me to include **badges** (build status, license, tech stack icons) and a **setup image/dia
