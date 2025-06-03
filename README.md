#  DigitDash – The 30-Second Multiplication Mayhem 🔢

**DigitDash** is a lightning-fast, browser-based math game where you multiply your way through a frenzy of two-digit numbers. The twist? You only have **30 seconds** to rack up the highest score possible.

> Think fast. Tap faster. Multiply like a beast.

---

##  Game Features

- [TODO] 2-digit multiplication challenges
- [TODO]️ 30-second dash per game round
- [TODO] Answer as many as you can—no breaks!
- [TODO] Smart scoring with exponential time penalties
- [TODO] Guest mode with random ID
- [TODO]Optional login (Google or Email/Password) to save scores
- [TODO] Score auto-saves to leaderboard when logged in

---

##  Tech Stack

| Layer       | Tech                        |
|-------------|-----------------------------|
| Frontend    | React.js, JavaScript, Tailwind CSS |
| Auth        | Firebase Authentication     |
| Backend     | FastAPI (Python)            |
| Database    | PostgreSQL / Firebase Firestore |
| Hosting     | Vercel (Frontend), Render or AWS (Backend) |

---

## ️ Setup Instructions

- [TODO] setup git+vite+react+typescript
- [TODO] Add start game mechanics and timer 
- [TODO] Show Multiplication questions and option and track selected answer
- [TODO] Score board and endgame , play again button
- [TODO] Scoring logic implementation complexity
- [TODO] Authentication, firebase, google login and guest user with random id (convert guest to real user after login)
- [TODO] Save score per user in firestore and Fetch & display leaderboard from Firestore
- [TODO] Setup backend folder with FastAPI app
- [TODO] Add /save-score, /leaderboard, /auth endpoints
- [TODO] Postgress
- [TODO] Secure with JWT or Firebase UID
- [TODO] Show users past score with dates


###  Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
###  Backend (FASTAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Auth Flow
- Guest users get a random ID like user_87349821
- Users can sign up with Google or email/password
- Logged-in users’ scores are saved and ranked
- Guest scores are kept locally unless they sign in

## Created By
Ashish Kumar

Axeishkr@gmail.com