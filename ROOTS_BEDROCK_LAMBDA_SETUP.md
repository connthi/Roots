# Roots — AWS Bedrock + S3 Pipeline Setup

## Prerequisites

- **Node.js 18+**
- **AWS Account** with Bedrock access
- **S3 Bucket** created in your AWS account

---

## Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

This installs:
- `@aws-sdk/client-bedrock-runtime` — Bedrock API calls
- `@aws-sdk/client-s3` — S3 file uploads
- `uuid` — Unique user IDs
- `express`, `cors`, `dotenv` — API server

### 2. Configure environment

Copy the example and fill in your AWS credentials:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=4000

# AWS Bedrock
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0

# AWS S3
S3_BUCKET_NAME=<your-bucket-name>

# Set to true to test without AWS credentials (returns mock data)
DRY_RUN=false
```

### 3. Required IAM Permissions

Your AWS IAM user needs:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["bedrock:InvokeModel", "bedrock:Converse"],
      "Resource": "arn:aws:bedrock:*::foundation-model/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::<your-bucket-name>/*"
    }
  ]
}
```

### 4. Start the server

```bash
npm run dev
```

Server runs at `http://localhost:4000`. Test with:

```bash
curl http://localhost:4000/health
```

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

### `GET /health`
Health check. Returns `{ "status": "ok" }`.

### `POST /api/quiz/score`
Score the 20-question personality quiz. Body: `{ "answers": [0, 1, 2, ...] }`.

### `POST /api/analyze`
Full pipeline — accepts survey data + quiz results, uploads CSV to S3, calls Bedrock, returns financial profile.

**Request body:**
```json
{
  "age": 22,
  "annual_income": 45000,
  "monthly_rent": 1200,
  "monthly_food": 400,
  "monthly_transport": 150,
  "monthly_entertainment": 200,
  "monthly_subscriptions": 60,
  "monthly_savings": 300,
  "debt_total": 12000,
  "debt_monthly_payment": 250,
  "impulse_buy_frequency": "sometimes",
  "budget_tracking": "app",
  "financial_goal": "Save for emergency fund",
  "risk_tolerance": "moderate",
  "personality_code": "VSFA",
  "archetype_name": "The Quant"
}
```

**Response:**
```json
{
  "user_id": "usr_abc12345",
  "profile": {
    "personality_summary": "...",
    "spending_analysis": { ... },
    "savings_score": 62,
    "financial_health_grade": "B",
    "recommendations": [ ... ],
    "projections": { ... },
    "habit_changes": [ ... ]
  },
  "s3": {
    "csv": "user_profiles/usr_abc12345_1716000000.csv",
    "result": "results/usr_abc12345_1716000000.json"
  }
}
```

---

## Pipeline Architecture

```
User → Frontend Survey → POST /api/analyze → CSV to S3 → Bedrock AI → Result to S3 → JSON Response → Dashboard
```

### S3 Bucket Structure

```
your-bucket/
├── user_profiles/     # CSV files with raw survey input
│   └── usr_abc12345_1716000000.csv
└── results/           # JSON files with Bedrock output
    └── usr_abc12345_1716000000.json
```

---

## Testing Without AWS (Dry Run)

Set `DRY_RUN=true` in `backend/.env` to return mock data without calling Bedrock or S3. Useful for frontend development and testing the full flow.

---

## CSV Schema (Placeholder)

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | string | Generated per session |
| `timestamp` | ISO 8601 | Submission time |
| `age` | number | User age |
| `annual_income` | number | Yearly income |
| `monthly_rent` | number | Housing cost |
| `monthly_food` | number | Food spending |
| `monthly_transport` | number | Transportation |
| `monthly_entertainment` | number | Entertainment |
| `monthly_subscriptions` | number | Recurring subscriptions |
| `monthly_savings` | number | Monthly savings amount |
| `debt_total` | number | Total outstanding debt |
| `debt_monthly_payment` | number | Monthly debt payments |
| `impulse_buy_frequency` | enum | often/sometimes/rarely/never |
| `budget_tracking` | enum | app/spreadsheet/mental/none |
| `financial_goal` | string | Primary financial goal |
| `risk_tolerance` | enum | conservative/moderate/aggressive |
| `personality_code` | string | 4-letter archetype code |
| `archetype_name` | string | Archetype display name |

> These fields are placeholders. Update `backend/src/services/csvHelper.js` when the final user portfolio schema is decided.
