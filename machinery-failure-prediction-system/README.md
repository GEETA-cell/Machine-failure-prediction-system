# Machinery Failure Prediction System

Simple full-stack starter project for machinery failure prediction.

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- ML model: intentionally left as an integration point; add your trained Python model later.
- No Spring Boot, Maven, or Java backend.

## 1. Database
Create a PostgreSQL database named `machinery_db`, then run:

```sql
\i database/schema.sql
```

Or execute the SQL in pgAdmin.

## 2. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Backend runs on `http://localhost:5000`.

## 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## 4. Model integration
The backend already has `POST /api/predictions` for storing prediction requests/results. Replace the placeholder logic in `backend/controllers/predictionController.js` with a call to your trained model service, or connect a Python FastAPI model later.

Expected model input can contain values such as:
- temperature
- vibration
- pressure
- rotational_speed
- torque
- tool_wear

The system is designed so the model can be integrated without changing the database or frontend contract.
