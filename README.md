# Google Maps Review Scraper

![Project Banner](./assets/banner.png)

## 🔍 Overview

Google Maps Review Scraper is a full-stack web application that allows users to input a Google business URL, fetch reviews, analyze sentiment, and display them in an elegant, interactive dashboard.

## ✨ Features

- **URL Input**: Paste any Google business URL to scrape reviews
- **Review Scraping**: Scrapes 10+ reviews including name, rating, date, and text
- **CAPTCHA Handling**: Handling of Google CAPTCHA challenges during scraping
- **Sentiment Analysis**: Uses HuggingFace models to analyze review sentiment
- **Interactive Dashboard**: Beautiful UI with metrics and sentiment visualization
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Framer Motion

### Backend
- Node.js
- Express.js
- Python microservice (FastAPI)
- Selenium for scraping

### Data & Analysis
- PostgreSQL database
- Prisma ORM
- HuggingFace API for sentiment analysis

## 📋 Project Structure

```
project/
├── frontend/              # Next.js frontend application
│   ├── components/        # React components
│   ├── pages/             # Next.js pages
│   └── public/            # Static assets
├── backend/               # Node.js Express backend
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   └── app.js             # Express app setup
└── scraper/               # Python scraping microservice
    ├── scraper.py         # Selenium scraping logic
    └── main.py            # FastAPI service
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v15+)
- Python 3.12+
- PostgreSQL and Prisma

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/sujalkyal/google-maps-review-scraper.git
cd google-maps-review-scraper

# Install Node.js dependencies
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

### Python Scraper Setup
```bash
# Navigate to scraper directory
cd ../scraper

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your credentials
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start backend server
cd backend
npx nodemon server.js

# Start Python scraper (in a new terminal)
cd scraper
uvicorn main:app --reload --port 8001

# Start frontend (in a new terminal)
cd frontend
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/reviewsdb
PYTHON_SERVICE_URL=http://localhost:8001
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## 📝 Usage

1. Navigate to the web application
2. Paste a Google Maps business URL in the input field
   - Example: `https://g.co/kgs/Gw8WAAV`
3. Click "Scrape Reviews" button
4. Wait for the scraping process to complete
5. Explore the reviews and sentiment analysis in the dashboard

## ⚠️ Known Limitations

- **Google Places API**: Autocomplete search feature is currently commented out due to billing requirements. To enable:
  1. Obtain a Google Maps API key with Places API enabled
  2. Add the key to your .env.local file
  3. Uncomment the Places Autocomplete code in the frontend

- **Deployment**: The Python microservice has not been deployed due to memory constraints with the sentiment analysis model. The application currently runs fully in local development environment.

## 🔮 Future Improvements

- Add user authentication for saved searches
- Integrate export functionality (CSV, PDF)
- Add more visualizations for review analysis
- Deploy using specialized hosting for ML services

## 📄 License

MIT License

## 👥 Contributors

- Sujal Kyal - [GitHub Profile](https://github.com/sujalkyal)

---

Made with ❤️ by Sujal Kyal
