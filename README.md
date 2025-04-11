# HackMol-6.0
## Civic-Shield 
🚨 *AI-Driven Emergency Response System with Blockchain Assurance* 🛡️  

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://frontend.topishukla.xyz)  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Empowering citizens with tamper-proof emergency reporting and real-time accountability.**  

---

## 🌟 Features  
### **For Citizens**  
- 📱 **Multi-Channel Filing**: Web forms, SMS (via Twilio), or voice notes  
- 🧠 **AI-Guided Reporting**: GPT-4 suggests critical details (e.g., "License plate number?")  
- 🗺️ **Live Officer Tracking**: Real-time GPS pins and ETA predictions  
- 🔗 **Blockchain Receipts**: Verify FIR integrity via MetaMask/Explorer  
- 📲 **OTP Authentication**: Twilio-powered SMS verification  

### **For Law Enforcement**  
- 🚨 **AI-Priority Dashboard**: LangChainJS-processed urgency scoring  
- 📍 **Smart Dispatch**: Route optimization with traffic data  
- 📄 **Auto-FIR Drafts**: GPT-4 generates preliminary reports  
- ⏱️ **SLA Monitoring**: Escalates delayed cases via NodeCron  

### **For Admins**  
- 📊 **Real-Time Analytics**: Grafana dashboards with Prometheus metrics  
- 🔐 **Evidence Chain**: IPFS (Pinata) ↔ Blockchain cross-verification  
- 🚨 **Alert System**: Automated notifications for SLA breaches  

---

## 🛠 Tech Stack  
| Category       | Technologies                                                                                   |
|----------------|------------------------------------------------------------------------------------------------|
| **Frontend**   | TypeScript, React, Shadcn, Tailwind, react-hook-form, Zod, JWT                                |
| **Backend**    | Node.js, Express, MongoDB, Twilio, Cloudinary, NodeCron, Zod                                  |
| **Blockchain** | Ethers.js, Hardhat, Solidity, MetaMask, Pinata (IPFS), Alchemy                                |
| **AI**         | LangChainJS, GPT-4                                                                            |
| **DevOps**     | Docker, Prometheus, Grafana, Loki, NginX                                                      |
| **Cloud**      | MongoDB Atlas, Cloudinary, AWS EC2, Vercel                                                    |
| **App**      | Flutter, Dart|

---

## 📜 Problem Statement  
Modern emergency systems suffer from:  
1. **FIR Tampering**: 1 in 3 complaints altered (UNODC 2023)  
2. **Slow Response**: Avg. 4.7h resolution for non-critical cases  
3. **Opaque Processes**: 67% citizens can’t track case status  
4. **Evidence Loss**: 22% of cases lack proper documentation  

---

## 💡 Solution Architecture  
```plaintext
           ┌─────────────┐       ┌─────────────┐
           │   Citizen   │       │   Law       │
           │ (React App) │◄─────►│ Enforcement │
           └──────┬──────┘ SMS   └──────┬──────┘
                   │ Twilio              │
         ┌─────────▼───────┐    ┌────────▼────────┐
         │  AI Orchestrator│    │ Blockchain     │
         │ (LangChainJS +  │    │ (Ethereum SC)  │
         │   GPT-4)       │    └───────┬─────────┘
         └───────┬─────────┘           │
                 │                    ▼
           ┌─────▼────────────────────┐
           │     Backend Core         │
           │ Node.js │ MongoDB       │
           │ Cloudinary │ NodeCron    │
           └─────┬────────────────────┘
                 │
           ┌─────▼─────┐       ┌──────────────┐
           │ Twilio    │       │ Monitoring   │
           │ SMS/OTP   │       │ (Prometheus/ │
           └───────────┘       │  Grafana)    │
                               └──────────────┘

```
