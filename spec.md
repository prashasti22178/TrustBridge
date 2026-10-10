C
============================================================
3. CORE USER JOURNEY
============================================================

BORROWER

Landing Page
      ↓
Understand TrustBridge
      ↓
Explore Ravi Kumar case
      ↓
Start Assessment
      ↓
Enter business signals
      ↓
Trust Score calculated
      ↓
See WHY score changed
      ↓
Upload / provide verification proofs
      ↓
Give explicit consent
      ↓
Submit application
      ↓
Application enters Underwriter Queue


UNDERWRITER

Login / Dashboard
      ↓
Pending Applications
      ↓
Select Applicant
      ↓
Open Applicant Dossier
      ↓
Review Trust Score
      ↓
Review 3 Pillars
      ↓
Review 6 Signals
      ↓
Review verification proofs
      ↓
Read AI-generated explanation
      ↓
Human decision
      ↓
Approve / Request More Information / Pause


============================================================
4. TECHNOLOGY STACK
============================================================

FRONTEND

React 18
Vite
Tailwind CSS
Lucide React
Framer Motion

BACKEND

Python
FastAPI
Pydantic

DATABASE

Supabase PostgreSQL

SECURITY

Supabase Row Level Security

AI

Google Gemini 2.5 Flash

STORAGE

Supabase Storage

DEPLOYMENT

Frontend → Vercel
Backend → Render

Use environment variables for ALL secrets.

NEVER expose:
- Supabase service-role key
- Gemini secret API key
- Backend credentials

inside frontend source code.

============================================================
5. REPOSITORY STRUCTURE
============================================================

Create:

trustbridge/

├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ScoreGauge.jsx
│   │   │   ├── PillarCard.jsx
│   │   │   ├── SignalCard.jsx
│   │   │   ├── RaviCaseStudy.jsx
│   │   │   ├── ApplicantTable.jsx
│   │   │   ├── DossierModal.jsx
│   │   │   ├── ProofViewer.jsx
│   │   │   ├── ConsentModal.jsx
│   │   │   ├── DecisionModal.jsx
│   │   │   └── LoadingState.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Apply.jsx
│   │   │   ├── Underwriter.jsx
│   │   │   └── Fairness.jsx
│   │   │
│   │   ├── lib/
│   │   │   ├── supabaseClient.js
│   │   │   └── api.js
│   │   │
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── tailwind.config.js
│
├── server/
│   ├── app/
│   │   ├── main.py
│   │   ├── engine.py
│   │   ├── gemini_service.py
│   │   ├── models.py
│   │   ├── database.py
│   │   └── routes/
│   │       ├── scoring.py
│   │       ├── borrowers.py
│   │       └── underwriter.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── database/
│   └── schema.sql
│
├── README.md
├── PRD.md
└── ARCHITECTURE.md


============================================================
6. VISUAL DESIGN
============================================================

Create a premium modern FinTech interface.

Do NOT make it look like a generic college project.

DESIGN LANGUAGE:

Dark premium dashboard
Glassmorphism
Soft borders
Large typography
Subtle gradients
Radial gauges
Data visualization
Micro animations
High contrast
Accessible UI

COLORS:

Slate 900:
#0f172a

Slate 800:
#1e293b

Emerald:
#10b981

Indigo:
#6366f1

Amber:
#f59e0b

White:
#f8fafc

Use Emerald for positive trust signals.

Use Amber for:
- attention
- incomplete verification
- moderate signals

Use Indigo for:
- interaction
- navigation
- CTAs

Do not overuse gradients.

Do not use excessive animations.

============================================================
7. NAVIGATION
============================================================

Navbar:

TRUSTBRIDGE logo

Links:

Home
How It Works
Apply
Underwriter
Fairness

Primary CTA:

"Check My Trust Score"

On mobile:

Hamburger menu.

============================================================
8. HOME PAGE /
============================================================

Hero:

Eyebrow:

ALTERNATIVE CREDIT FOR THE CREDIT-INVISIBLE

Headline:

"Your credit history may be missing.
Your trust isn't."

Supporting copy:

"TrustBridge turns everyday financial discipline into
explainable credit signals — helping micro-entrepreneurs
demonstrate reliability beyond traditional bureau history."

Buttons:

[Check My Trust Score]

[See How It Works]

Hero visual:

Large animated Trust Score card.

Example:

TRUST SCORE

78
/100

Established Trust Signals

Show small signal indicators around it.

------------------------------------------------------------

LIVE STATISTICS

Display:

40Cr+
Potentially credit-invisible citizens

₹5K–₹25K
Target micro-loan range

6
Everyday signals

3
Explainable scoring pillars

Use animated counters.

------------------------------------------------------------

RAVI KUMAR CASE STUDY

Create a visually interactive before/after comparison.

Applicant:

Ravi Kumar

Business:

Fruit Stall

Location:

Bengaluru

Business continuity:

18 months

Requested:

₹10,000

Traditional view:

"Insufficient credit history"

TrustBridge view:

"Trust Score — 78 / 100"

Show:

Traditional Credit
       ↓
No bureau history
       ↓
Limited assessment

TrustBridge
       ↓
Business turnover
       ↓
Rent payments
       ↓
Utility behavior
       ↓
Supplier repayment
       ↓
Community participation
       ↓
Business continuity
       ↓
78 / 100

Make this section one of the strongest visual elements
of the landing page.

============================================================
9. THREE PILLARS
============================================================

Create a large interactive section.

PILLAR 1

ABILITY TO REPAY

Weight:
40%

Measures:
Cashflow coverage.

Description:

Can the business generate enough income to support
the requested repayment?

------------------------------------------------------------

PILLAR 2

WILLINGNESS TO REPAY

Weight:
35%

Measures:

Payment discipline across:
- Rent
- Utilities
- Supplier obligations

------------------------------------------------------------

PILLAR 3

STABILITY OF ACTIVITY

Weight:
25%

Measures:

- Business continuity
- Operational longevity
- Location consistency

Show weight visually.

40% + 35% + 25% = 100%

============================================================
10. SIX EVERYDAY SIGNALS
============================================================

Display six cards.

1. WEEKLY BUSINESS TURNOVER

Stable sales tracked over time through QR/UPI
or recorded sales.

2. STALL RENT PAYMENTS

Monthly rent payment consistency.

3. UTILITY & MOBILE RECHARGES

Punctual payment/recharge behavior.

4. SUPPLIER REPAYMENT HISTORY

Repayment discipline with wholesale suppliers.

5. COMMUNITY CHIT / SHG PARTICIPATION

Community financial responsibility.

6. BUSINESS CONTINUITY

How long the business has remained operational.

Clicking a signal should open an explanation.

Each explanation must answer:

WHAT IS IT?

WHY DOES IT MATTER?

HOW DOES IT AFFECT THE SCORE?

============================================================
11. BORROWER APPLICATION /apply
============================================================

Build a highly polished multi-step assessment interface.

STEP 1

Basic business information:

Full Name
Business Type
Location
Requested Loan Amount

Loan range:

₹5,000–₹25,000

------------------------------------------------------------

STEP 2

Financial signals.

Inputs:

Business / Stall Tenure
Weekly Business Turnover
Rent Timeliness
Supplier Repayment
Utility Consistency
Community / SHG participation

Use beautiful sliders and numeric values.

Do not use confusing forms.

Show the score updating LIVE.

============================================================
12. TRUST SCORE ENGINE
============================================================

Implement the actual scoring logic in the backend.

Formula:

Trust Score =
(0.40 × Ability)
+
(0.35 × Willingness)
+
(0.25 × Stability)

Ability Score:

min(
100,
(Weekly Revenue / Weekly Loan Installment) × 20
)

Willingness:

(0.5 × Rent Score)
+
(0.3 × Supplier Score)
+
(0.2 × Utility Score)

Stability:

min(
100,
(Months at Stall / 24) × 100
)

IMPORTANT:

Keep scoring logic deterministic.

Never randomly generate scores.

Every score must be reproducible from the input signals.

------------------------------------------------------------

IMPORTANT IMPLEMENTATION NOTE:

The UI currently contains several direct behavioral inputs,
while the backend formula also references Weekly Loan Installment.

Therefore:

DO NOT silently invent the installment.

Derive it from:

Requested Loan Amount
+
configured repayment period

OR explicitly ask the user for the repayment period.

Use a clearly documented default repayment period if necessary.

Display the calculation transparently.

============================================================
13. SCORE EXPLANATION
============================================================

The score screen must show:

             TRUST SCORE

                 78
                /100

Animated radial gauge.

Then:

ABILITY TO REPAY          82
████████████████░░░

WILLINGNESS TO REPAY      85
█████████████████░

STABILITY                  65
████████████░░░░░

------------------------------------------------------------

WHAT HELPED

✓ Consistent supplier repayment
✓ Strong rent payment behavior
✓ 18 months business continuity

------------------------------------------------------------

WHAT NEEDS ATTENTION

⚠ Activity stability can improve
⚠ More transaction history would strengthen verification

These explanations must be generated from actual
input values.

Never hardcode explanations for dynamic applicants.

============================================================
14. SUBMIT FOR VERIFICATION
============================================================

Button:

"Submit for Verification"

Open consent modal.

Show:

What data is collected
Why it is collected
How it affects assessment
How it will be used

Checkbox:

"I understand and consent to the use of my
provided information for this assessment."

Submission is impossible without consent.

After submission:

Save applicant to Supabase.

Save trust score.

Save application.

Save timestamps.

Return:

Application ID

Example:

TB-2026-XXXX

Show:

"Application submitted successfully."

============================================================
15. UNDERWRITER DASHBOARD
============================================================

Route:

/underwriter

Create a professional lender cockpit.

Sidebar:

Dashboard
Applications
Verification
Decisions
Fairness
Settings

------------------------------------------------------------

TOP METRICS

Active Applications
Pending Review
Average Trust Score
Verification Required

------------------------------------------------------------

APPLICATION TABLE

Columns:

Applicant
Business
Trust Score
Requested Amount
Review Status
Verification
Updated
Action

Example:

Ravi Kumar
Fruit Stall
78
₹10,000
Pending Review
3/4 Verified

Meena Devi
Tailoring
84
₹15,000
Pending Review
4/4 Verified

Arjun Singh
Mobile Repair
62
₹8,000
Needs Information
2/4 Verified

These are seed/demo records only.

The production table must read from Supabase.

============================================================
16. APPLICANT DOSSIER
============================================================

Click applicant.

Open large responsive dossier.

HEADER:

Ravi Kumar
Fruit Stall
Bengaluru

Trust Score:

78 / 100

------------------------------------------------------------

PILLAR BREAKDOWN

Ability              82
Willingness          85
Stability            65

------------------------------------------------------------

SIGNAL BREAKDOWN

Weekly Turnover
Rent Payments
Supplier Repayment
Utility Behavior
Community Participation
Business Continuity

For every signal show:

Value
Contribution
Verification status

------------------------------------------------------------

PROOF DOCUMENTS

Display thumbnails/cards:

Rent Receipt
Supplier Receipt
Utility Bill
Business Photograph
Sales Record

Statuses:

VERIFIED
PENDING
NEEDS REVIEW

============================================================
17. GEMINI AI NARRATIVE
============================================================

Integrate Gemini through the BACKEND.

Never call Gemini directly from the frontend with
a secret API key.

Endpoint:

POST /api/v1/explain

Send only the required applicant assessment data.

Prompt Gemini to generate:

1. Applicant summary
2. Strongest positive signals
3. Signals requiring attention
4. Verification gaps
5. Neutral underwriting explanation

IMPORTANT:

Gemini must NOT make the final lending decision.

Gemini provides an explanation.

Human underwriter makes the decision.

Never fabricate documents or evidence.

============================================================
18. UNDERWRITER ACTIONS
============================================================

Three primary actions:

[OFFER STARTER LOAN]

[REQUEST MORE RECEIPTS]

[PAUSE APPLICATION]

Each opens confirmation modal.

Example:

Offer Starter Loan

Amount:
₹10,000

Confirm?

[Cancel]
[Confirm Decision]

Save action to Supabase.

Store:

application_id
underwriter_id
decision
amount
notes
timestamp

Create an audit trail.

============================================================
19. FAIRNESS & PRIVACY
============================================================

Route:

/fairness

Create a beautiful transparency page.

Sections:

CONSENT FIRST

Users explicitly consent before assessment.

------------------------------------------------------------

RIGHT TO EXPLANATION

Users can understand which signals affected
their Trust Score.

------------------------------------------------------------

RIGHT TO DISPUTE

Users can challenge incorrect information.

------------------------------------------------------------

DATA MINIMIZATION

Only necessary information should be collected.

------------------------------------------------------------

NO DEMOGRAPHIC SCORING

Do NOT collect or use:

Caste
Religion
Gender
Social media behavior

for Trust Score calculation.

------------------------------------------------------------

HUMAN OVERSIGHT

AI supports explanation.

AI does not replace the underwriter.

------------------------------------------------------------

IMPORTANT:

Do NOT claim mathematically guaranteed "zero bias".

Instead communicate:

"TrustBridge is designed to minimize inappropriate
demographic influence through data minimization,
signal transparency, auditability and human oversight."

============================================================
20. FASTAPI ENDPOINTS
============================================================

Implement:

POST
/api/v1/score/calculate

Returns:

composite_score
ability_score
willingness_score
stability_score
what_helped
what_needs_attention
confidence_tier


POST
/api/v1/borrowers/apply

Stores:

borrower
signals
assessment
loan application
proof metadata


GET
/api/v1/underwriter/queue

Returns pending applicants.


GET
/api/v1/underwriter/applicant/{id}

Returns complete dossier.


POST
/api/v1/underwriter/decision

Records:

APPROVED
MORE_INFO_REQUESTED
PAUSED


POST
/api/v1/explain

Generates Gemini narrative.

============================================================
21. SUPABASE DATABASE
============================================================

Create proper relational tables.

borrowers

id
full_name
business_type
location
stall_tenure_months
weekly_income
created_at


trust_scores

id
borrower_id
composite_score
ability_score
willingness_score
stability_score
confidence_tier
what_helped
what_needs_attention
created_at


loan_applications

id
borrower_id
requested_amount
status
sanctioned_amount
underwriter_notes
updated_at


Also create appropriate tables for:

signals
verification_documents
underwriter_actions
consents

Use foreign keys.

Use timestamps.

Use appropriate indexes.

Implement Row Level Security.

============================================================
22. RAVI KUMAR SEED DATA
============================================================

Create Ravi Kumar as the benchmark/demo applicant.

Name:
Ravi Kumar

Business:
Fruit Stall

Location:
Bengaluru

Business tenure:
18 months

Weekly income:
₹7,500

Requested loan:
₹10,000

Benchmark Trust Score:

78

Example pillar values:

Ability:
82

Willingness:
85

Stability:
65

Confidence:

Medium-High Confidence

Positive explanation:

On-time supplier and rent payments.

18 months stable operation at the same stall.

Attention:

Slightly lower activity stability;
additional transaction history would strengthen verification.

This benchmark applicant should power the Home Page case study
and also appear in the Underwriter dashboard.

============================================================
23. API / DATABASE ERROR HANDLING
============================================================

Never let API failure break the UI.

Show:

Loading
Error
Retry
Empty state

If backend is unavailable during development:

Provide a clearly isolated mock development mode.

Do NOT silently pretend a failed API request succeeded.

============================================================
24. SECURITY
============================================================

Use:

Environment variables.

Frontend:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_API_BASE_URL

Backend:

SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY

Never commit .env.

Generate:

.env.example

============================================================
25. ACCESSIBILITY
============================================================

Support:

Keyboard navigation
Visible focus states
ARIA labels
Readable contrast
Responsive typography
Accessible dialogs
Accessible sliders

Do not rely on color alone to communicate status.

============================================================
26. RESPONSIVENESS
============================================================

Desktop:
Full dashboard.

Tablet:
Condensed layout.

Mobile:
Stack cards.

Underwriter table should become:

Scrollable table
OR
responsive applicant cards.

Never create accidental horizontal overflow.

============================================================
27. ANIMATIONS
============================================================

Use Framer Motion.

Animate:

Trust Score gauge
Score changes
Cards entering viewport
Modal opening
Progress bars
Statistics

Keep animation subtle and professional.

No distracting animations.

============================================================
28. DEMO EXPERIENCE
============================================================

The first-time experience should be impressive enough
for a hackathon / college major project demonstration.

Demo flow:

Open Home
↓
See Ravi's problem
↓
Click "See How It Works"
↓
Explore 3 pillars
↓
Click "Check My Trust Score"
↓
Change business tenure
↓
Change rent consistency
↓
Watch score change
↓
See WHY it changed
↓
Submit assessment
↓
Open Underwriter
↓
Open Ravi dossier
↓
Review evidence
↓
Read AI explanation
↓
Take human decision

The entire demo should feel connected.

============================================================
29. CODE QUALITY
============================================================

Use:

Reusable components
Clean separation of concerns
Meaningful names
Comments only where useful
No duplicated logic
No giant 1000-line components
No hardcoded secrets
No unnecessary dependencies

Keep scoring logic in backend.

Keep API calls in a dedicated frontend service layer.

Keep Supabase configuration separate.

============================================================
30. WHAT NOT TO DO
============================================================

DO NOT:

- Build only a landing page
- Fake backend functionality without labeling it
- Hardcode all applicant data
- Generate random Trust Scores
- Put Gemini API key in frontend
- Automatically approve loans based solely on score
- Claim zero bias as a mathematical guarantee
- Use caste/religion/gender in scoring
- Invent verification documents
- Use fake API success responses
- Leave TODO placeholders
- Create broken buttons
- Create routes that don't work
- Ignore mobile responsiveness

============================================================
31. DEVELOPMENT ORDER
============================================================

Build in this order:

PHASE 1
Project setup + routing + design system

PHASE 2
Supabase database + schema

PHASE 3
FastAPI + scoring engine

PHASE 4
Home page

PHASE 5
Borrower assessment

PHASE 6
Supabase submission

PHASE 7
Underwriter cockpit

PHASE 8
Applicant dossier

PHASE 9
Gemini explanation

PHASE 10
Fairness & Privacy

PHASE 11
Responsive polish

PHASE 12
Error/loading states

PHASE 13
Testing

============================================================
32. FINAL REQUIREMENT
============================================================

Do not stop after generating the architecture.

Actually implement the application.

After implementation, verify:

✓ npm install works
✓ frontend starts
✓ backend starts
✓ routes work
✓ scoring endpoint works
✓ Supabase connection works
✓ application submission works
✓ underwriter queue works
✓ dossier opens
✓ decision saves
✓ Gemini explanation works when configured
✓ mobile layout works

If an external API key is missing, make the system clearly
report that configuration is required instead of pretending
the API succeeded.

Finally provide:

1. Complete folder structure
2. All required source files
3. package.json
4. requirements.txt
5. Supabase SQL
6. .env.example
7. README
8. Setup commands
9. Run commands
10. Deployment instructions

Build TrustBridge as a cohesive product, not as disconnected pages.

The final experience should communicate one central idea:

"No credit history does not mean no trust."