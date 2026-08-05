# 🛡️ Threat Intelligence Dashboard

A real-time cybersecurity threat intelligence dashboard that monitors and displays the latest CVE (Common Vulnerabilities and Exposures) data from global security databases.

**Built with:** Next.js 16 · React · TypeScript · Recharts · CIRCL CVE API

---

## ✨ Features

- **🔴 Live CVE Feed** — Automatically polls the CIRCL API every 60 seconds for the latest published vulnerabilities
- **🔍 Smart Search** — Filter threats by CVE ID, vendor name, or any keyword in real-time
- **📌 Watchlist** — Bookmark critical vulnerabilities to your personal watchlist (persisted in localStorage)
- **📊 Severity Chart** — Interactive donut chart showing the distribution of Critical, High, Medium, and Low severity threats
- **📈 Live Stats** — Dynamic stat cards that update automatically from live API data
- **🌙 Dark Mode UI** — Premium glassmorphism design with micro-animations and responsive layout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/omarr112434/threat-intel-dashboard.git

# Navigate to the project
cd threat-intel-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Recharts** | Data visualization (Pie/Donut charts) |
| **Lucide React** | Modern icon library |
| **CIRCL CVE API** | Live vulnerability data source |

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css       # Dark theme + glassmorphism styles
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Main dashboard page
└── components/
    ├── ThreatFeed.tsx    # Live CVE feed with search & bookmarks
    └── SeverityChart.tsx # Interactive severity donut chart
```

## 🔒 Security Note

This dashboard is a **read-only monitoring tool**. It fetches publicly available CVE data from the CIRCL (Computer Incident Response Center Luxembourg) API. No sensitive data is collected or transmitted.

## 👤 Author

**Omar Hany** — Computer Science Student (Cyber Security & Networks) at The British University in Egypt

- LinkedIn: [omar-hany-642aa7300](https://www.linkedin.com/in/omar-hany-642aa7300)
- GitHub: [omarr112434](https://github.com/omarr112434)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
