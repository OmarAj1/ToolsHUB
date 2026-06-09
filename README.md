# Multi-Tool Web App

A comprehensive, all-in-one web-based utility toolkit designed to provide developers, students, content creators, gamers, sellers, and everyday users with a wide variety of essential tools. 

Built with modern web technologies focusing on client-side processing, this application ensures privacy by processing most data locally within your browser.

## 🚀 Features

The suite contains multiple toolkits, neatly categorized for ease of use:

### 💻 Developer Toolkit
- **JSON Formatter** - Format, minify, and clean up your JSON data.
- **JSON Validator** - Validate and find syntax errors in JSON strings.
- **Base64 Encoder/Decoder** - Quickly encode or decode Base64 strings.
- **URL Encoder/Decoder** - URL encode or decode text strings.
- **JWT Decoder** - Decode JSON Web Tokens (JWT) payload data securely.
- **Regex Tester** - Evaluate regular expressions against test text.
- **API Tester** - Send basic HTTP requests directly from the browser.
- **UUID Generator** - Generate both bulk V4 and V1 UUIDs instantly.
- **JSON to CSV & CSV to JSON Convertors** - Seamlessly transfer tabular and object data formats.

### 📝 Text Markup & Cleanup Toolkit
- **Word Counter** - Count total words, characters, sentences, and paragraphs.
- **Remove Duplicate Lines** - Find and completely remove all duplicate lines from text.
- **Find and Replace** - Mass find and regex-replace text queries.
- **Case Converter** - Convert between uppercase, lowercase, sentence case, and title case.
- **CSV Cleaner** - Strip empty rows and trim all cells.
- **Extract URLs & Emails** - Scrape and extract all valid email headers or HTTP links from block text.
- **Text Formatter & Whitespace Remover** - Remove redundant whitespaces and properly structure spacing.
- **Text Compare**, **Sort Lines**, **Reverse Lines**, and generic formatting.

### 📄 Comprehensive PDF Toolkit
Provides basic native and robust PDF manipulation interfaces:
- **Merge, Split, & Reorder PDF**
- **PDF to JPG/PNG & Image to PDF Convertors** 
- **PDF to Text / Metadata Viewer**
- **Watermark & Page Number injection**
- **Rotate & Delete Pages**
- *Additional robust suites listed natively covering OCR, Grayscale, Cropping, and advanced split controls.*

### 🎓 Student Toolkit
- **GPA Calculator** - Calculate standard Grade Point Averages.
- **Study Planner** - Organize subject timelines and schedule assignments.
- **Grade Calculator** - Track current and required weights.
- **Flashcard Maker** - Prepare flashcards securely.
- **Citation Generator** - Auto-template your research bibliographies.
- **Notes Formatter** - Organize dumped notes into structured formats.

### 🛒 Seller & Finance Toolkit
- **Profit Calculator** - Calculate final ROI, Margins, and net profit.
- **Return on Investment (ROI) Calculator** - Output projected ROIs.
- **Pricing & Margin Calculators**
- **Marketplace Fee Calculator** - Track selling platform deductions.
- **Break-Even, Discount, Sales Tax, and Product Cost tracking tools.**

### 🎮 Gaming Toolkit
- **eDPI Calculator** - Compare sensitivity inputs against pros.
- **K/D Ratio Calculator** - Analyze performance ratios in shooters.
- **Sensitivity Converter, XP Calculator, & Aspect Ratios.**

### 📸 Content Creator Toolkit
- **YouTube Title Checker, Hashtag Generator, Read Time Estimator,** and **Description Templates.**

---

## 🛠️ Technology Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router v6
- **PDF Tools:** pdf-lib, jspdf, tesseract.js
- **Language:** TypeScript 

## 📦 Local Installation

To run this application locally on your machine:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   *The server will start locally, generally hosted on port `5173` or `3000`.*

4. **Build for Production**
   ```bash
   npm run build
   ```
   *The optimized static application will be available in the `/dist` directory.*

## 🔒 Privacy First
Most tools within this application run completely client-side in your browser. Files like PDFs, images, text blocks, and strings are manipulated locally via javascript buffers and state mechanisms, ensuring that your private data acts completely offline unless specifically querying remote servers via the API testing tools.

## 🤝 Contributing
Contributions, bug reports, and feature requests are always welcome! Feel free to raise issues if you experience unexpected faults.
