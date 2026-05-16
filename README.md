# Roots

**AWS Bedrock Hackathon — Spring 2026**

AI-powered financial literacy and future planning for young adults. Roots turns survey inputs into a Personalized Finance Analysis (PFA), behavioral financial personality profiles, and compound-interest projections across multiple time horizons.

**Team:** Anthony Lai, Noah Nguyen, Zubair Sabry, Connor Thibault

---

## What Roots Does

- **Personalized Finance Analysis (PFA)** — Structured profile from income, spending habits, and behavioral survey inputs
- **Compound interest projections** — 1 week, 1 month, 1 year, 10 years, and retirement (age 65), before vs. after habit changes
- **Financial personality classification** — Archetypes such as Frugal Builder, Balanced Planner, High Spender
- **Projected Earnings Report (PER)** — Quantifies long-term cost of current habits and impact of behavior changes

Roots does **not** connect to bank accounts, execute transactions, or provide legally binding financial advice.

---

## Architecture

```
User → Frontend (survey) → Backend API → AWS Bedrock → Structured output → Dashboard / charts
```

| Layer      | Stack                          |
| ---------- | ------------------------------ |
| Frontend   | React, Next.js                 |
| Backend    | Node.js, Express               |
| AI         | AWS Bedrock                    |
| Storage    | DynamoDB (optional, prototype) |

---

## Project Structure

```
Roots/
├── frontend/     # Next.js app — survey, dashboard, visualizations
├── backend/      # Express API — prompts, Bedrock, projections
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- AWS credentials with Bedrock access

### Backend

```bash
cd backend
npm install
cp .env.example .env   # add AWS region, credentials, model ID
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set API URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), complete the onboarding survey, and view your PFA and projections.

---

## Demo Goals

- [ ] Onboarding survey and behavioral inputs
- [ ] PFA generation via Bedrock
- [ ] Financial personality classification
- [ ] Multi-horizon compound interest charts
- [ ] PER and habit-change comparison

---

## Security & Responsible AI

Outputs are educational only. User inputs are sanitized before model calls. No real financial execution or enterprise compliance scope for this prototype.

---

## References

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- Behavioral finance research; compound interest modeling

---

## Acknowledgements

Thanks to the AWS Bedrock Hackathon organizers and the Roots team for building this platform.
