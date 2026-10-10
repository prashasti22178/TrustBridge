import type { Applicant } from '../types/underwriter';

export const SEED_APPLICANTS: Applicant[] = [
  // 1. RAVI KUMAR (Fruit Stall - Balanced Benchmark)
  {
    id: 'TB-2026-0142',
    name: 'Ravi Kumar',
    businessType: 'Fruit Stall',
    location: 'Malleshwaram, Bengaluru, KA',
    stallTenureMonths: 18,
    weeklyRevenue: 7500,
    requestedAmount: 10000,
    repaymentWeeks: 12,
    trustScore: 78,
    confidenceTier: 'Medium-High Confidence',
    riskTier: 'Low-Moderate Risk',
    riskTrajectory: 'STABLE',
    behavioralConsistencyIndex: 88,
    documentTrustScore: 95,
    anomalyScore: 5,
    suggestedLendingMin: 8000,
    suggestedLendingMax: 12000,
    pillars: {
      ability: 82,
      willingness: 85,
      stability: 65,
    },
    signals: [
      {
        name: 'Weekly Business Turnover',
        rawMetric: '₹7,500 / week',
        pillar: 'Ability (40%)',
        contribution: 33,
        status: 'VERIFIED',
        insight: 'Generates 9.0x coverage over requested weekly installment (₹833).'
      },
      {
        name: 'Stall Rent Payments',
        rawMetric: '95% On-Time',
        pillar: 'Willingness (35%)',
        contribution: 15,
        status: 'VERIFIED',
        insight: '12 consecutive monthly receipts verified from stall landlord S. Muniyappa.'
      },
      {
        name: 'Supplier Repayment History',
        rawMetric: '90% Timely',
        pillar: 'Willingness (35%)',
        contribution: 9,
        status: 'VERIFIED',
        insight: 'APMC wholesale fruit mandi accounts cleared every Tuesday without default.'
      },
      {
        name: 'Utility & Mobile Recharges',
        rawMetric: '85% Regular',
        pillar: 'Willingness (35%)',
        contribution: 6,
        status: 'VERIFIED',
        insight: 'Continuous commercial meter electricity payments + business phone prepaid recharges.'
      },
      {
        name: 'Community Chit Participation',
        rawMetric: 'Active Member',
        pillar: 'Stability (25%)',
        contribution: 5,
        status: 'VERIFIED',
        insight: 'Active verified contributor in Sri Lakshmi Market SHG savings pool.'
      },
      {
        name: 'Business Continuity (Tenure)',
        rawMetric: '18 Months',
        pillar: 'Stability (25%)',
        contribution: 10,
        status: 'VERIFIED',
        insight: 'Continuous physical retail presence at 8th Main street intersection.'
      }
    ],
    proofDocuments: [
      {
        id: 'doc-1',
        name: 'Stall Rent Receipts (12 Months)',
        category: 'Rent',
        status: 'VERIFIED',
        issuedBy: 'Landlord S. Muniyappa',
        verifiedAt: '02 Oct 2026, 14:30',
        summary: '12 consecutive rent slips showing ₹2,500/mo paid on-time before the 5th of each month.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-2',
        name: 'UPI QR Daily Settlement Log',
        category: 'Utility',
        status: 'VERIFIED',
        issuedBy: 'NPCI / PhonePe Merchant QR',
        verifiedAt: '02 Oct 2026, 14:50',
        summary: 'Daily QR transaction records averaging ₹1,070/day across 180 consecutive operating days.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-3',
        name: 'Wholesale Mandi Credit Slip',
        category: 'Supplier',
        status: 'VERIFIED',
        issuedBy: 'Kalpataru Wholesale Fruit Mandi, Yard 4',
        verifiedAt: '02 Oct 2026, 15:10',
        summary: 'Weekly inventory procurement receipts averaging ₹5,000 settled punctually without default.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-4',
        name: 'Commercial Utility & SIM Log',
        category: 'Utility',
        status: 'VERIFIED',
        issuedBy: 'BESCOM + Jio Commercial',
        verifiedAt: '02 Oct 2026, 16:00',
        summary: 'Consistent 6-month digital transaction receipts with zero service disconnects.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-5',
        name: 'Business Stall Geo-Photo',
        category: 'Business Photo',
        status: 'VERIFIED',
        issuedBy: 'Field Verification Agent (TrustBridge Hub)',
        verifiedAt: '01 Oct 2026, 11:20',
        summary: 'Geo-tagged photograph of physical fruit stall cart at Malleshwaram 8th Main.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      }
    ],
    behaviorTimeline: [
      { month: 'Apr 2026', income: 7200, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 95 },
      { month: 'May 2026', income: 7800, rent: 'ON_TIME', supplier: '2 Days Grace', utility: 'ON_TIME', consistencyPct: 89 },
      { month: 'Jun 2026', income: 6900, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 92 },
      { month: 'Jul 2026', income: 7400, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 96 },
      { month: 'Aug 2026', income: 7600, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 94 },
      { month: 'Sep 2026', income: 7500, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 95 }
    ],
    riskAlerts: [
      {
        date: '28 Sep 2026',
        severity: 'LOW',
        signal: 'Seasonal Wholesale Fluctuation',
        change: 'Wholesale fruit mandi procurement prices rose 12% following rainfall',
        impact: 'Buffer adequate; weekly turnover comfortably covers ₹833 debt service.'
      }
    ],
    featureAttributions: [
      { feature: 'Gross Weekly Turnover', contribution: 12.8, direction: 'POSITIVE', rawMetric: '₹7,500 / week', category: 'Ability' },
      { feature: 'Stall Rent Consistency', contribution: 14.2, direction: 'POSITIVE', rawMetric: '95% On-Time', category: 'Willingness' },
      { feature: 'Wholesale Supplier Repayment', contribution: 9.5, direction: 'POSITIVE', rawMetric: '90% Timely', category: 'Willingness' },
      { feature: 'Business Tenure Longevity', contribution: 6.3, direction: 'POSITIVE', rawMetric: '18 Months', category: 'Stability' },
      { feature: 'Community SHG Membership', contribution: 5.0, direction: 'POSITIVE', rawMetric: 'Active Contributor', category: 'Social Collateral' },
      { feature: 'Tenure under 24m Cap', contribution: -4.5, direction: 'NEGATIVE', rawMetric: '18 of 24 months benchmark', category: 'Stability' }
    ],
    counterfactualPaths: [
      {
        leverName: 'Wholesale Supplier Timeliness',
        currentValue: '90%',
        targetValue: '96%',
        projectedScore: 81,
        projectedScoreDelta: 3,
        confidence: 'High',
        actionItem: 'Clear fruit vendor accounts directly on Tuesday mornings.'
      },
      {
        leverName: 'Tenure Progression to 24 Months',
        currentValue: '18 Months',
        targetValue: '24 Months',
        projectedScore: 84,
        projectedScoreDelta: 6,
        confidence: 'High',
        actionItem: 'Continue operation at current Malleshwaram spot through March 2027.'
      }
    ],
    verificationRatio: '5/5 Verified',
    status: 'PENDING_REVIEW',
    appliedDate: '03 Oct 2026',
    aiExplanation: {
      summary: 'Ravi Kumar displays exemplary willingness discipline (95% rent promptness, 90% mandi supplier credit honoring). Weekly sales of ₹7,500 provide 9.0x debt-service coverage over the requested ₹833 weekly installment. 18 months continuous stall presence establishes resilient micro-retail activity.',
      strengths: [
        'Consistent 90%+ punctuality across both stall rent and wholesale fruit supplier obligations',
        'Weekly business revenue of ₹7,500 comfortably covers weekly loan installment (₹833) by 9.0x',
        'Physical tenure of 18 continuous months at same Malleshwaram corner'
      ],
      riskFactors: [
        'Informal seasonal fruit price volatility during monsoon months',
        'Stall tenure under 24 months (capped at 18/24 for stability), though offset by strong willingness'
      ],
      underwritingRecommendation: 'Recommend sanctioning ₹10,000 starter working capital loan with weekly repayment schedule over 12 weeks. High recovery probability backed by verified cashflow.'
    }
  },

  // 2. MEENA DEVI (Tailoring - High Trust Benchmark)
  {
    id: 'TB-2026-0143',
    name: 'Meena Devi',
    businessType: 'Tailoring & Alterations Kiosk',
    location: 'Bapu Bazaar, Jaipur, RJ',
    stallTenureMonths: 28,
    weeklyRevenue: 9200,
    requestedAmount: 15000,
    repaymentWeeks: 12,
    trustScore: 84,
    confidenceTier: 'High Confidence',
    riskTier: 'Low Risk',
    riskTrajectory: 'IMPROVING',
    behavioralConsistencyIndex: 94,
    documentTrustScore: 98,
    anomalyScore: 3,
    suggestedLendingMin: 14000,
    suggestedLendingMax: 18000,
    pillars: {
      ability: 88,
      willingness: 89,
      stability: 74,
    },
    signals: [
      {
        name: 'Weekly Business Turnover',
        rawMetric: '₹9,200 / week',
        pillar: 'Ability (40%)',
        contribution: 35,
        status: 'VERIFIED',
        insight: 'Consistent UPI QR transaction volume from repeat tailoring customers.'
      },
      {
        name: 'Stall Rent Payments',
        rawMetric: '98% On-Time',
        pillar: 'Willingness (35%)',
        contribution: 17,
        status: 'VERIFIED',
        insight: '24 months uninterrupted rental clearance record with municipal trust.'
      },
      {
        name: 'Supplier Repayment History',
        rawMetric: '94% Timely',
        pillar: 'Willingness (35%)',
        contribution: 10,
        status: 'VERIFIED',
        insight: 'Textile and thread wholesale suppliers in Johari Bazaar confirm prompt clearance.'
      },
      {
        name: 'Utility & Mobile Recharges',
        rawMetric: '92% Regular',
        pillar: 'Willingness (35%)',
        contribution: 7,
        status: 'VERIFIED',
        insight: 'Single-phase commercial electricity bills verified with Jaipur Vidyut Vitran.'
      },
      {
        name: 'Community Chit Participation',
        rawMetric: 'SHG Treasurer',
        pillar: 'Stability (25%)',
        contribution: 5,
        status: 'VERIFIED',
        insight: 'Treasurer of Mahila Vikas Self-Help Group with 4 years active standing.'
      },
      {
        name: 'Business Continuity (Tenure)',
        rawMetric: '28 Months',
        pillar: 'Stability (25%)',
        contribution: 10,
        status: 'VERIFIED',
        insight: 'Exceeds 24-month maximum stability benchmark at Bapu Bazaar kiosk.'
      }
    ],
    proofDocuments: [
      {
        id: 'doc-201',
        name: 'Municipal Stall Allotment & Rent Slips',
        category: 'Rent',
        status: 'VERIFIED',
        issuedBy: 'Jaipur Municipal Corporation',
        verifiedAt: '01 Oct 2026, 17:00',
        summary: '28-month municipal kiosk lease agreement with current stamp receipt.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-202',
        name: 'Wholesale Fabric Invoice',
        category: 'Supplier',
        status: 'VERIFIED',
        issuedBy: 'Bapu Bazaar Cloth Merchants Guild',
        verifiedAt: '01 Oct 2026, 17:20',
        summary: 'Invoices for raw sewing materials and zipper supplies totaling ₹18,000 paid.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-203',
        name: 'Electricity Board Bill',
        category: 'Utility',
        status: 'VERIFIED',
        issuedBy: 'JVVNL Jaipur',
        verifiedAt: '01 Oct 2026, 18:00',
        summary: 'Timely payments for industrial sewing machine electricity connection.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-204',
        name: 'Kiosk Storefront Verification Photo',
        category: 'Business Photo',
        status: 'VERIFIED',
        issuedBy: 'TrustBridge Field Officer',
        verifiedAt: '30 Sep 2026, 12:40',
        summary: 'Verified 2 active sewing workstations with commercial footfall.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      }
    ],
    behaviorTimeline: [
      { month: 'Apr 2026', income: 8900, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 98 },
      { month: 'May 2026', income: 9100, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 97 },
      { month: 'Jun 2026', income: 9400, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 99 },
      { month: 'Jul 2026', income: 9000, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 96 },
      { month: 'Aug 2026', income: 9300, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 98 },
      { month: 'Sep 2026', income: 9200, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 99 }
    ],
    riskAlerts: [],
    featureAttributions: [
      { feature: 'Continuous Tenure Longevity', contribution: 18.0, direction: 'POSITIVE', rawMetric: '28 Months (>24m cap)', category: 'Stability' },
      { feature: 'Stall Rent Punctuality', contribution: 16.5, direction: 'POSITIVE', rawMetric: '98% On-Time', category: 'Willingness' },
      { feature: 'Weekly Turnover Coverage', contribution: 15.2, direction: 'POSITIVE', rawMetric: '₹9,200 / week', category: 'Ability' },
      { feature: 'Fabric Supplier Settlements', contribution: 12.0, direction: 'POSITIVE', rawMetric: '94% Timely', category: 'Willingness' },
      { feature: 'SHG Treasurer Social Standing', contribution: 5.0, direction: 'POSITIVE', rawMetric: 'Executive Officer', category: 'Social Collateral' }
    ],
    counterfactualPaths: [
      {
        leverName: 'Digital UPI Settlement Ratio',
        currentValue: '75%',
        targetValue: '90%',
        projectedScore: 87,
        projectedScoreDelta: 3,
        confidence: 'High',
        actionItem: 'Encourage walk-in alteration clients to settle via merchant QR.'
      }
    ],
    verificationRatio: '4/4 Verified',
    status: 'APPROVED',
    appliedDate: '01 Oct 2026',
    aiExplanation: {
      summary: 'Meena Devi presents an exemplary low-risk alternative credit profile. 28 months established tenure, 98% rent timeliness, and SHG leadership signal prime repayment willingness. High turnover comfortably absorbs the ₹15,000 capital expansion.',
      strengths: [
        'Tenure of 28 months comfortably surpasses stability benchmark',
        'Zero rent delinquency over 2 years of municipal kiosk operations',
        'Proven community leadership as SHG treasurer'
      ],
      riskFactors: [
        'Slightly higher requested loan amount (₹15,000) than starter baseline'
      ],
      underwritingRecommendation: 'Approved for ₹15,000 loan at prime micro-interest rate with 12-week repayment.'
    }
  },

  // 3. ARJUN SINGH (Mobile Repair - Review Required)
  {
    id: 'TB-2026-0144',
    name: 'Arjun Singh',
    businessType: 'Mobile Repair Kiosk',
    location: 'Budhwar Peth, Pune, MH',
    stallTenureMonths: 8,
    weeklyRevenue: 5200,
    requestedAmount: 8000,
    repaymentWeeks: 8,
    trustScore: 62,
    confidenceTier: 'Review Required',
    riskTier: 'Moderate Risk',
    riskTrajectory: 'STABLE',
    behavioralConsistencyIndex: 71,
    documentTrustScore: 74,
    anomalyScore: 28,
    suggestedLendingMin: 4000,
    suggestedLendingMax: 6000,
    pillars: {
      ability: 66,
      willingness: 72,
      stability: 44,
    },
    signals: [
      {
        name: 'Weekly Business Turnover',
        rawMetric: '₹5,200 / week',
        pillar: 'Ability (40%)',
        contribution: 26,
        status: 'DOCUMENTED',
        insight: 'Moderate turnover; weekly installment (₹1,000) represents 19% of gross revenue.'
      },
      {
        name: 'Stall Rent Payments',
        rawMetric: '80% On-Time',
        pillar: 'Willingness (35%)',
        contribution: 12,
        status: 'DOCUMENTED',
        insight: 'Minor delays noted in 2 out of past 6 landlord rent collections.'
      },
      {
        name: 'Supplier Repayment History',
        rawMetric: '75% Timely',
        pillar: 'Willingness (35%)',
        contribution: 7,
        status: 'DOCUMENTED',
        insight: 'Mobile spare screen component suppliers in electronics market report occasional delay.'
      },
      {
        name: 'Utility & Mobile Recharges',
        rawMetric: '70% Regular',
        pillar: 'Willingness (35%)',
        contribution: 5,
        status: 'VERIFIED',
        insight: 'Mobile internet recharges are active; shop lighting bill is shared.'
      },
      {
        name: 'Community Chit Participation',
        rawMetric: 'Non-Participant',
        pillar: 'Stability (25%)',
        contribution: 0,
        status: 'SELF_REPORTED',
        insight: 'No current participation in verified community savings pool.'
      },
      {
        name: 'Business Continuity (Tenure)',
        rawMetric: '8 Months',
        pillar: 'Stability (25%)',
        contribution: 4,
        status: 'VERIFIED',
        insight: 'Newer enterprise: 8 months operational history at current kiosk.'
      }
    ],
    proofDocuments: [
      {
        id: 'doc-301',
        name: 'Sub-lease Stall Rent Receipts',
        category: 'Rent',
        status: 'PENDING',
        issuedBy: 'Sub-landlord K. Shinde',
        summary: 'Only 3 months of handwritten rent receipts submitted; 3 earlier months pending landlord verification.',
        ocrExtracted: true,
        dateConsistencyPass: false,
        amountConsistencyPass: true,
        duplicateCheckPass: true,
        anomalyFlags: ['Missing 3 months consecutive rent vouchers']
      },
      {
        id: 'doc-302',
        name: 'UPI QR Merchant Daily Log',
        category: 'Utility',
        status: 'VERIFIED',
        issuedBy: 'NPCI / Google Pay for Business',
        verifiedAt: '03 Oct 2026, 09:45',
        summary: 'Daily UPI transaction records verified averaging ₹740/day across 90 operating days.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-303',
        name: 'Spare Parts Wholesale Invoice Slip',
        category: 'Supplier',
        status: 'PENDING',
        issuedBy: 'Shree Mobile Wholesale Hub',
        summary: 'Awaiting supplier confirmation stamp for component wholesale credit clearance.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-304',
        name: 'Repair Kiosk Photograph',
        category: 'Business Photo',
        status: 'VERIFIED',
        issuedBy: 'TrustBridge Field Officer',
        verifiedAt: '02 Oct 2026, 14:00',
        summary: 'Physical verification confirmed active smartphone repair tooling and counter.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      }
    ],
    behaviorTimeline: [
      { month: 'Apr 2026', income: 4800, rent: 'ON_TIME', supplier: '5 Days Late', utility: 'ON_TIME', consistencyPct: 72 },
      { month: 'May 2026', income: 5100, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 80 },
      { month: 'Jun 2026', income: 4900, rent: '4 Days Late', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 74 },
      { month: 'Jul 2026', income: 5300, rent: 'ON_TIME', supplier: '3 Days Late', utility: 'ON_TIME', consistencyPct: 76 },
      { month: 'Aug 2026', income: 5000, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 82 },
      { month: 'Sep 2026', income: 5200, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 80 }
    ],
    riskAlerts: [
      {
        date: '15 Sep 2026',
        severity: 'MEDIUM',
        signal: 'Tenure Exposure Flag',
        change: 'Operational tenure at 8 months is below the 12-month resilience cap',
        impact: 'Recommend smaller initial tranche (₹5,000) rather than requested ₹8,000.'
      }
    ],
    featureAttributions: [
      { feature: 'Gross Weekly Sales', contribution: 6.4, direction: 'POSITIVE', rawMetric: '₹5,200 / week', category: 'Ability' },
      { feature: 'Stall Rent Payment', contribution: 2.0, direction: 'POSITIVE', rawMetric: '80% On-Time', category: 'Willingness' },
      { feature: 'Short Business Tenure', contribution: -8.3, direction: 'NEGATIVE', rawMetric: '8 Months (vs 24m)', category: 'Stability' },
      { feature: 'Component Supplier Lags', contribution: -4.5, direction: 'NEGATIVE', rawMetric: '75% Timely', category: 'Willingness' },
      { feature: 'No Social Collateral (SHG)', contribution: -4.0, direction: 'NEGATIVE', rawMetric: 'Non-Participant', category: 'Social Collateral' }
    ],
    counterfactualPaths: [
      {
        leverName: 'Supplier Repayment Improvement',
        currentValue: '75%',
        targetValue: '90%',
        projectedScore: 68,
        projectedScoreDelta: 6,
        confidence: 'High',
        actionItem: 'Clear electronics spare part invoices within 7 days of delivery.'
      },
      {
        leverName: 'Tenure to 12 Months',
        currentValue: '8 Months',
        targetValue: '12 Months',
        projectedScore: 71,
        projectedScoreDelta: 9,
        confidence: 'High',
        actionItem: 'Maintain continuous presence through January 2027.'
      },
      {
        leverName: 'Enroll in Local Merchant SHG',
        currentValue: 'Non-Participant',
        targetValue: 'Active Contributor',
        projectedScore: 67,
        projectedScoreDelta: 5,
        confidence: 'Medium',
        actionItem: 'Join Pune Electronics Market mutual aid savings pool.'
      }
    ],
    verificationRatio: '2/4 Verified',
    status: 'NEEDS_INFO',
    appliedDate: '03 Oct 2026',
    aiExplanation: {
      summary: 'Arjun Singh presents a developing micro-enterprise profile (8 months tenure, score 62/100). Repayment ability is reasonable (₹5,200/wk turnover), but supplier credit timeliness (75%) and incomplete rent receipts require underwriter caution.',
      strengths: [
        'Active physical kiosk in high-traffic Pune electronics market',
        'Sufficient weekly gross turnover to service an ₹8,000 loan if expenses are controlled'
      ],
      riskFactors: [
        'Stall tenure under 12 months flags early business survival vulnerability',
        '2 missing rent receipts and unverified wholesale spare parts invoice',
        'Absence of community SHG social collateral anchor'
      ],
      underwritingRecommendation: 'Recommend requesting 3 months of additional supplier invoices and landlord confirmation slips before issuing loan sanction.'
    }
  },

  // 4. PRIYA SHARMA (Chai Stall - Stellar Behavioral Consistency)
  {
    id: 'TB-2026-0145',
    name: 'Priya Sharma',
    businessType: 'Chai & Snacks Kiosk',
    location: 'Sarafa Bazaar, Indore, MP',
    stallTenureMonths: 32,
    weeklyRevenue: 8800,
    requestedAmount: 12000,
    repaymentWeeks: 12,
    trustScore: 86,
    confidenceTier: 'High Confidence',
    riskTier: 'Low Risk',
    riskTrajectory: 'IMPROVING',
    behavioralConsistencyIndex: 96,
    documentTrustScore: 99,
    anomalyScore: 2,
    suggestedLendingMin: 12000,
    suggestedLendingMax: 16000,
    pillars: {
      ability: 85,
      willingness: 92,
      stability: 79,
    },
    signals: [
      {
        name: 'Weekly Business Turnover',
        rawMetric: '₹8,800 / week',
        pillar: 'Ability (40%)',
        contribution: 34,
        status: 'VERIFIED',
        insight: 'Consistent daily UPI micro-settlements (average 110 transactions/day).'
      },
      {
        name: 'Stall Rent Payments',
        rawMetric: '99% On-Time',
        pillar: 'Willingness (35%)',
        contribution: 17,
        status: 'VERIFIED',
        insight: '30 months documented on-time rent payment slips with market committee.'
      },
      {
        name: 'Supplier Repayment History',
        rawMetric: '96% Timely',
        pillar: 'Willingness (35%)',
        contribution: 10,
        status: 'VERIFIED',
        insight: 'Daily milk and tea powder supplier accounts settled each evening.'
      },
      {
        name: 'Utility & Mobile Recharges',
        rawMetric: '94% Regular',
        pillar: 'Willingness (35%)',
        contribution: 7,
        status: 'VERIFIED',
        insight: 'Commercial cylinder gas and electricity payments verified monthly.'
      },
      {
        name: 'Community Chit Participation',
        rawMetric: 'Active Member',
        pillar: 'Stability (25%)',
        contribution: 5,
        status: 'VERIFIED',
        insight: 'Active verified member of Indore Sarafa Mahila Bachat Gat.'
      },
      {
        name: 'Business Continuity (Tenure)',
        rawMetric: '32 Months',
        pillar: 'Stability (25%)',
        contribution: 10,
        status: 'VERIFIED',
        insight: 'Continuous operation across 32 months at prime night market pitch.'
      }
    ],
    proofDocuments: [
      {
        id: 'doc-401',
        name: 'Market Committee Kiosk License',
        category: 'Rent',
        status: 'VERIFIED',
        issuedBy: 'Sarafa Night Market Association',
        verifiedAt: '02 Oct 2026, 12:00',
        summary: '32-month continuous municipal vending permission slip.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-402',
        name: 'Dairy Supplier Daily Ledger',
        category: 'Supplier',
        status: 'VERIFIED',
        issuedBy: 'Sanchi Milk Dairy Distributor',
        verifiedAt: '02 Oct 2026, 12:30',
        summary: 'Daily milk procurement settled each evening with zero balance carried over.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-403',
        name: 'Merchant UPI Settlement Stream',
        category: 'Utility',
        status: 'VERIFIED',
        issuedBy: 'Paytm for Business Gateway',
        verifiedAt: '02 Oct 2026, 13:00',
        summary: 'High transaction frequency: 180 consecutive operating days logged.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-404',
        name: 'Commercial LPG Cylinder Slips',
        category: 'Utility',
        status: 'VERIFIED',
        issuedBy: 'Indane Commercial Gas Agency',
        verifiedAt: '02 Oct 2026, 13:15',
        summary: 'Regular commercial 19kg cylinder bookings verified every 18 days.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-405',
        name: 'Kiosk Geo-Verification Photo',
        category: 'Business Photo',
        status: 'VERIFIED',
        issuedBy: 'TrustBridge Field Hub Indore',
        verifiedAt: '01 Oct 2026, 16:45',
        summary: 'Photo confirmed bustling evening tea stall operations.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      }
    ],
    behaviorTimeline: [
      { month: 'Apr 2026', income: 8500, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 98 },
      { month: 'May 2026', income: 8700, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 99 },
      { month: 'Jun 2026', income: 8600, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 97 },
      { month: 'Jul 2026', income: 8900, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 99 },
      { month: 'Aug 2026', income: 9100, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 100 },
      { month: 'Sep 2026', income: 8800, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 98 }
    ],
    riskAlerts: [],
    featureAttributions: [
      { feature: 'Stellar Payment Consistency', contribution: 18.2, direction: 'POSITIVE', rawMetric: '99% Rent & 96% Supplier', category: 'Willingness' },
      { feature: 'Long Operational Presence', contribution: 18.0, direction: 'POSITIVE', rawMetric: '32 Months (>24m cap)', category: 'Stability' },
      { feature: 'High Daily UPI Frequency', contribution: 14.0, direction: 'POSITIVE', rawMetric: '110 QR pulses/day', category: 'Ability' },
      { feature: 'Community SHG Membership', contribution: 5.0, direction: 'POSITIVE', rawMetric: 'Verified Active', category: 'Social Collateral' }
    ],
    counterfactualPaths: [
      {
        leverName: 'Working Capital Expansion',
        currentValue: '₹12,000',
        targetValue: '₹16,000',
        projectedScore: 88,
        projectedScoreDelta: 2,
        confidence: 'High',
        actionItem: 'Cashflow comfortably supports 33% higher working capital facility.'
      }
    ],
    verificationRatio: '5/5 Verified',
    status: 'APPROVED',
    appliedDate: '02 Oct 2026',
    aiExplanation: {
      summary: 'Priya Sharma demonstrates stellar behavioral consistency (96/100 index). Daily milk dairy settlements are 96% prompt and rent is 99% on-time across 32 continuous months of operation.',
      strengths: [
        'Top-decile payment consistency index (96/100) across 6-month historical timeline',
        'Over 32 continuous months of operating tenure at prime Sarafa market location',
        'Daily micro-turnover pulses via merchant QR provide continuous liquidity validation'
      ],
      riskFactors: [
        'Seasonal raw milk commodity inflation during festival months'
      ],
      underwritingRecommendation: 'Approved for ₹12,000 starter loan with fast-track digital disbursement.'
    }
  },

  // 5. SURESH PATEL (Kirana General Store - Deteriorating Risk 78 -> 74 -> 69)
  {
    id: 'TB-2026-0146',
    name: 'Suresh Patel',
    businessType: 'Kirana General Store',
    location: 'Maninagar, Ahmedabad, GJ',
    stallTenureMonths: 22,
    weeklyRevenue: 11000,
    requestedAmount: 25000,
    repaymentWeeks: 16,
    trustScore: 69,
    confidenceTier: 'Review Required',
    riskTier: 'High Risk - Deteriorating',
    riskTrajectory: 'DETERIORATING',
    behavioralConsistencyIndex: 64,
    documentTrustScore: 82,
    anomalyScore: 32,
    suggestedLendingMin: 6000,
    suggestedLendingMax: 10000,
    pillars: {
      ability: 92,
      willingness: 72,
      stability: 60,
    },
    signals: [
      {
        name: 'Weekly Business Turnover',
        rawMetric: '₹11,000 / week',
        pillar: 'Ability (40%)',
        contribution: 37,
        status: 'VERIFIED',
        insight: 'High turnover across daily grocery provisions, though variance increased 38%.'
      },
      {
        name: 'Stall Rent Payments',
        rawMetric: '78% On-Time',
        pillar: 'Willingness (35%)',
        contribution: 11,
        status: 'DOCUMENTED',
        insight: 'Late payments detected in August and September (previously 92% on-time).'
      },
      {
        name: 'Supplier Repayment History',
        rawMetric: '68% Timely',
        pillar: 'Willingness (35%)',
        contribution: 6,
        status: 'DOCUMENTED',
        insight: 'FMCG distributor credit settlements declined sharply from 90% down to 68%.'
      },
      {
        name: 'Utility & Mobile Recharges',
        rawMetric: '72% Regular',
        pillar: 'Willingness (35%)',
        contribution: 5,
        status: 'VERIFIED',
        insight: 'Single late electricity bill notice recorded with Torrent Power in August.'
      },
      {
        name: 'Community Chit Participation',
        rawMetric: 'Active Member (Delayed)',
        pillar: 'Stability (25%)',
        contribution: 3,
        status: 'VERIFIED',
        insight: 'Member of Maninagar Vyapar Mandal chit; missed August contribution round.'
      },
      {
        name: 'Business Continuity (Tenure)',
        rawMetric: '22 Months',
        pillar: 'Stability (25%)',
        contribution: 9,
        status: 'VERIFIED',
        insight: 'Physical storefront operation established for 22 months.'
      }
    ],
    proofDocuments: [
      {
        id: 'doc-501',
        name: 'Shop Rental Agreement & Notices',
        category: 'Rent',
        status: 'NEEDS_REVIEW',
        issuedBy: 'Premises Owner P. Shah',
        summary: 'Landlord logged 2 rental delays with 10-day grace period notes in August/September.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true,
        anomalyFlags: ['Late rent payment notes on August and September receipts']
      },
      {
        id: 'doc-502',
        name: 'FMCG Distributor Outstanding Ledger',
        category: 'Supplier',
        status: 'NEEDS_REVIEW',
        issuedBy: 'Gujarat Consumer Goods Distributors',
        summary: 'Outstanding vendor balance of ₹14,200 past due for 28 days.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true,
        anomalyFlags: ['Overdue supplier balance exceeding weekly net margin']
      },
      {
        id: 'doc-503',
        name: 'Torrent Power Commercial Bill',
        category: 'Utility',
        status: 'VERIFIED',
        issuedBy: 'Torrent Power Ahmedabad',
        summary: 'Commercial electricity bill cleared with late fee penalty in August.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-504',
        name: 'Kirana Storefront Photograph',
        category: 'Business Photo',
        status: 'VERIFIED',
        issuedBy: 'Field Officer Ahmedabad',
        verifiedAt: '03 Oct 2026, 11:30',
        summary: 'Physical grocery shop verified with packed inventory shelves.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      }
    ],
    behaviorTimeline: [
      { month: 'Apr 2026', income: 12500, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 92 },
      { month: 'May 2026', income: 12000, rent: 'ON_TIME', supplier: '3 Days Late', utility: 'ON_TIME', consistencyPct: 84 },
      { month: 'Jun 2026', income: 11800, rent: 'ON_TIME', supplier: '6 Days Late', utility: 'ON_TIME', consistencyPct: 76 },
      { month: 'Jul 2026', income: 10500, rent: '5 Days Late', supplier: '8 Days Late', utility: 'ON_TIME', consistencyPct: 66 },
      { month: 'Aug 2026', income: 10200, rent: '9 Days Late', supplier: '12 Days Late', utility: 'ON_TIME', consistencyPct: 58 },
      { month: 'Sep 2026', income: 11000, rent: 'ON_TIME', supplier: '14 Days Late', utility: 'ON_TIME', consistencyPct: 55 }
    ],
    riskAlerts: [
      {
        date: '02 Oct 2026',
        severity: 'CRITICAL',
        signal: 'Supplier Repayment Deterioration',
        change: 'Wholesale FMCG supplier credit timeliness collapsed from 90% down to 68%',
        impact: 'Signals acute liquidity drag; supplier lines may freeze.'
      },
      {
        date: '25 Sep 2026',
        severity: 'HIGH',
        signal: 'Cashflow Volatility Surge',
        change: 'Monthly gross sales variance jumped 38% over preceding quarter',
        impact: 'Impairs predictable loan service coverage.'
      },
      {
        date: '10 Sep 2026',
        severity: 'HIGH',
        signal: 'Consecutive Late Rent Clearance',
        change: 'Landlord rent was cleared 9 and 5 days late in August & July',
        impact: 'Decreases Willingness component score from 84 to 72.'
      }
    ],
    featureAttributions: [
      { feature: 'Gross Weekly Sales', contribution: 16.8, direction: 'POSITIVE', rawMetric: '₹11,000 / week', category: 'Ability' },
      { feature: 'Store Tenure Continuity', contribution: 9.1, direction: 'POSITIVE', rawMetric: '22 Months', category: 'Stability' },
      { feature: 'Declining Supplier Repayments', contribution: -12.4, direction: 'NEGATIVE', rawMetric: '68% Timely (collapsed)', category: 'Willingness' },
      { feature: 'Late Rent Irregularity', contribution: -8.6, direction: 'NEGATIVE', rawMetric: '78% Timely', category: 'Willingness' },
      { feature: 'Chit Contribution Miss', contribution: -3.0, direction: 'NEGATIVE', rawMetric: 'Late in August', category: 'Social Collateral' }
    ],
    counterfactualPaths: [
      {
        leverName: 'Settle Overdue Supplier Arrears',
        currentValue: '68%',
        targetValue: '88%',
        projectedScore: 76,
        projectedScoreDelta: 7,
        confidence: 'High',
        actionItem: 'Clear ₹14,200 past-due FMCG distributor balance to normalize willingness.'
      },
      {
        leverName: 'Regularize Stall Rent Payments',
        currentValue: '78%',
        targetValue: '95%',
        projectedScore: 75,
        projectedScoreDelta: 6,
        confidence: 'High',
        actionItem: 'Ensure landlord payment on the 1st of October and November.'
      }
    ],
    verificationRatio: '3/5 Verified',
    status: 'PAUSED',
    appliedDate: '04 Oct 2026',
    aiExplanation: {
      summary: 'EARLY WARNING: Suresh Patel exhibits a deteriorating credit trajectory. Trust Score has declined from 78 to 74 to 69 over 90 days. While gross turnover remains high (₹11,000/wk), supplier settlement timeliness collapsed to 68% and late rent payments occurred in consecutive months.',
      strengths: [
        'Established physical grocery storefront with 22 months tenure in Maninagar',
        'Gross turnover of ₹11,000/week indicates solid customer footfall'
      ],
      riskFactors: [
        'DETERIORATING RISK: Supplier repayment collapsed from 90% to 68%',
        'Outstanding distributor balance of ₹14,200 past due for 28 days',
        'Consecutive late landlord rent clearance in July and August'
      ],
      underwritingRecommendation: 'Recommend PAUSING application processing. Require clearance receipt of outstanding distributor invoice before re-evaluating for a capped ₹8,000 facility.'
    }
  },

  // 6. RAJESH VERMA (Leather Stall - Document Verification Issues)
  {
    id: 'TB-2026-0147',
    name: 'Rajesh Verma',
    businessType: 'Leather Footwear Stall',
    location: 'Sadar Bazaar, Agra, UP',
    stallTenureMonths: 14,
    weeklyRevenue: 6400,
    requestedAmount: 15000,
    repaymentWeeks: 12,
    trustScore: 67,
    confidenceTier: 'Review Required',
    riskTier: 'Moderate Risk - Doc Issues',
    riskTrajectory: 'STABLE',
    behavioralConsistencyIndex: 73,
    documentTrustScore: 58,
    anomalyScore: 62,
    suggestedLendingMin: 5000,
    suggestedLendingMax: 8000,
    pillars: {
      ability: 70,
      willingness: 74,
      stability: 58,
    },
    signals: [
      {
        name: 'Weekly Business Turnover',
        rawMetric: '₹6,400 / week',
        pillar: 'Ability (40%)',
        contribution: 28,
        status: 'DOCUMENTED',
        insight: 'Adequate turnover for footwear repairs and sales; seasonal spikes during wedding season.'
      },
      {
        name: 'Stall Rent Payments',
        rawMetric: '82% On-Time',
        pillar: 'Willingness (35%)',
        contribution: 13,
        status: 'DOCUMENTED',
        insight: 'Handwritten sub-lease receipts with date discrepancy noted.'
      },
      {
        name: 'Supplier Repayment History',
        rawMetric: '78% Timely',
        pillar: 'Willingness (35%)',
        contribution: 8,
        status: 'DOCUMENTED',
        insight: 'Leather raw material vendor invoices flagged for duplicate invoice number.'
      },
      {
        name: 'Utility & Mobile Recharges',
        rawMetric: '76% Regular',
        pillar: 'Willingness (35%)',
        contribution: 6,
        status: 'VERIFIED',
        insight: 'Telecom business recharge log active.'
      },
      {
        name: 'Community Chit Participation',
        rawMetric: 'Non-Participant',
        pillar: 'Stability (25%)',
        contribution: 0,
        status: 'SELF_REPORTED',
        insight: 'No community savings group affiliation reported.'
      },
      {
        name: 'Business Continuity (Tenure)',
        rawMetric: '14 Months',
        pillar: 'Stability (25%)',
        contribution: 6,
        status: 'VERIFIED',
        insight: '14 months operational history at current Sadar Bazaar kiosk.'
      }
    ],
    proofDocuments: [
      {
        id: 'doc-601',
        name: 'Sub-lease Stall Agreement Slip',
        category: 'Rent',
        status: 'NEEDS_REVIEW',
        issuedBy: 'Sub-lessor B. Lal',
        summary: 'Agreement date states March 2025, but municipal tax receipt on premises is dated July 2025.',
        ocrExtracted: true,
        dateConsistencyPass: false,
        amountConsistencyPass: true,
        duplicateCheckPass: true,
        anomalyFlags: ['Document date precedes municipal landlord ledger by 4 months']
      },
      {
        id: 'doc-602',
        name: 'Raw Leather Supplier Invoice #INV-4091',
        category: 'Supplier',
        status: 'NEEDS_REVIEW',
        issuedBy: 'Agra Tanners Guild Wholesale',
        summary: 'Duplicate reference: Invoice #INV-4091 appears with identical amount on another applicant record.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: false,
        anomalyFlags: ['Duplicate invoice number detected across another applicant record']
      },
      {
        id: 'doc-603',
        name: 'Kiosk Geo-Tagged Photograph',
        category: 'Business Photo',
        status: 'NEEDS_REVIEW',
        issuedBy: 'Field Officer Agra',
        summary: 'GPS EXIF coordinate recorded 420m away from registered Sadar Bazaar market pitch.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true,
        anomalyFlags: ['Geo-coordinate mismatch: 420m offset from declared market pitch']
      }
    ],
    behaviorTimeline: [
      { month: 'Apr 2026', income: 6100, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 82 },
      { month: 'May 2026', income: 6300, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 84 },
      { month: 'Jun 2026', income: 6500, rent: 'ON_TIME', supplier: '3 Days Late', utility: 'ON_TIME', consistencyPct: 78 },
      { month: 'Jul 2026', income: 6200, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 80 },
      { month: 'Aug 2026', income: 6400, rent: 'ON_TIME', supplier: 'ON_TIME', utility: 'ON_TIME', consistencyPct: 82 },
      { month: 'Sep 2026', income: 6400, rent: 'ON_TIME', supplier: '4 Days Late', utility: 'ON_TIME', consistencyPct: 79 }
    ],
    riskAlerts: [
      {
        date: '03 Oct 2026',
        severity: 'HIGH',
        signal: 'Document Anomaly Screening Trigger',
        change: 'Invoice #INV-4091 matched identical invoice number in database',
        impact: 'Prototype anomaly screening flagged duplicate document recycling risk.'
      },
      {
        date: '01 Oct 2026',
        severity: 'MEDIUM',
        signal: 'Geo-Verification Discrepancy',
        change: 'Uploaded photograph GPS coordinates 420 meters from market boundary',
        impact: 'Field agent physical re-visit recommended before underwriting sign-off.'
      }
    ],
    featureAttributions: [
      { feature: 'Gross Weekly Sales', contribution: 8.0, direction: 'POSITIVE', rawMetric: '₹6,400 / week', category: 'Ability' },
      { feature: 'Stall Rent Timeliness', contribution: 4.2, direction: 'POSITIVE', rawMetric: '82% On-Time', category: 'Willingness' },
      { feature: 'Document Verification Flags', contribution: -14.0, direction: 'NEGATIVE', rawMetric: 'Duplicate invoice & GPS mismatch', category: 'Verification' },
      { feature: 'No Community Collateral', contribution: -4.0, direction: 'NEGATIVE', rawMetric: 'Non-Participant', category: 'Social Collateral' }
    ],
    counterfactualPaths: [
      {
        leverName: 'Submit Genuine Original Supplier Invoice',
        currentValue: 'Duplicate #INV-4091',
        targetValue: 'Verified APMC/Tanner Bill',
        projectedScore: 74,
        projectedScoreDelta: 7,
        confidence: 'High',
        actionItem: 'Provide verified stamped vendor invoice directly from primary leather supplier.'
      },
      {
        leverName: 'Physical Geo-Photo Re-Verification',
        currentValue: 'Discrepant (+420m)',
        targetValue: 'Pitch-Exact Geo-Tag',
        projectedScore: 71,
        projectedScoreDelta: 4,
        confidence: 'High',
        actionItem: 'Allow TrustBridge field officer to capture in-situ kiosk photograph.'
      }
    ],
    verificationRatio: '2/5 Verified',
    status: 'NEEDS_INFO',
    appliedDate: '03 Oct 2026',
    aiExplanation: {
      summary: 'Rajesh Verma exhibits reasonable cashflow (₹6,400/wk), but the application is flagged by prototype document anomaly screening: duplicate supplier invoice #INV-4091 detected and kiosk geo-coordinates deviate by 420m from declared pitch.',
      strengths: [
        '14 months continuous footwear stall business in Sadar Bazaar',
        'Moderate cashflow sufficient to service a capped starter loan'
      ],
      riskFactors: [
        'CRITICAL VERIFICATION FLAG: Duplicate supplier invoice #INV-4091',
        'Sub-lease agreement date precedes municipal registration',
        'Geo-tag discrepancy on kiosk verification photo'
      ],
      underwritingRecommendation: 'More Information Required: Mandate physical field inspection and authentic vendor invoice submission prior to credit sanction.'
    }
  },

  // 7. VIKRAM JOSHI (Electronics - High Revenue, Poor Repayment Consistency)
  {
    id: 'TB-2026-0148',
    name: 'Vikram Joshi',
    businessType: 'Electronics Accessories',
    location: 'Abids Market, Hyderabad, TS',
    stallTenureMonths: 14,
    weeklyRevenue: 18500,
    requestedAmount: 30000,
    repaymentWeeks: 16,
    trustScore: 77,
    confidenceTier: 'Medium-High Confidence',
    riskTier: 'Moderate Risk - High Rev / Low Willingness',
    riskTrajectory: 'STABLE',
    behavioralConsistencyIndex: 68,
    documentTrustScore: 86,
    anomalyScore: 24,
    suggestedLendingMin: 12000,
    suggestedLendingMax: 18000,
    pillars: {
      ability: 100,
      willingness: 66,
      stability: 58,
    },
    signals: [
      {
        name: 'Weekly Business Turnover',
        rawMetric: '₹18,500 / week',
        pillar: 'Ability (40%)',
        contribution: 40,
        status: 'VERIFIED',
        insight: 'Exceptional gross revenue; 18.5x debt-service coverage over baseline installment.'
      },
      {
        name: 'Stall Rent Payments',
        rawMetric: '71% On-Time',
        pillar: 'Willingness (35%)',
        contribution: 10,
        status: 'DOCUMENTED',
        insight: 'Recurring grace period delays despite substantial bank account cashflow.'
      },
      {
        name: 'Supplier Repayment History',
        rawMetric: '62% Timely',
        pillar: 'Willingness (35%)',
        contribution: 7,
        status: 'DOCUMENTED',
        insight: 'Accessory distributors in Gujarati Gali report habitual 7-10 day payment delays.'
      },
      {
        name: 'Utility & Mobile Recharges',
        rawMetric: '65% Regular',
        pillar: 'Willingness (35%)',
        contribution: 5,
        status: 'VERIFIED',
        insight: 'Commercial fiber internet bill paid irregularly in lumps.'
      },
      {
        name: 'Community Chit Participation',
        rawMetric: 'Non-Participant',
        pillar: 'Stability (25%)',
        contribution: 0,
        status: 'SELF_REPORTED',
        insight: 'No community mutual-aid savings group affiliation.'
      },
      {
        name: 'Business Continuity (Tenure)',
        rawMetric: '14 Months',
        pillar: 'Stability (25%)',
        contribution: 6,
        status: 'VERIFIED',
        insight: '14 months continuous presence at Abids street intersection.'
      }
    ],
    proofDocuments: [
      {
        id: 'doc-701',
        name: 'Current Bank Statement (6 Months)',
        category: 'Utility',
        status: 'VERIFIED',
        issuedBy: 'HDFC Bank Commercial Branch',
        verifiedAt: '03 Oct 2026, 17:00',
        summary: 'Average daily credit turnover of ₹2,640 verified from UPI and POS terminal transactions.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-702',
        name: 'Electronics Wholesaler Invoices',
        category: 'Supplier',
        status: 'VERIFIED',
        issuedBy: 'Hyderabad Mobile Accessories Syndicate',
        verifiedAt: '03 Oct 2026, 17:30',
        summary: 'Invoices show high volume but recurring 8-10 day payment lag notes from distributor.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-703',
        name: 'Commercial Shop Lease Agreement',
        category: 'Rent',
        status: 'VERIFIED',
        issuedBy: 'Commercial Premises Owner M. Reddy',
        verifiedAt: '03 Oct 2026, 17:45',
        summary: 'Valid commercial lease agreement for 14 months at Abids corner.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      },
      {
        id: 'doc-704',
        name: 'Storefront Verification Photo',
        category: 'Business Photo',
        status: 'VERIFIED',
        issuedBy: 'Field Officer Hyderabad Hub',
        verifiedAt: '02 Oct 2026, 15:30',
        summary: 'High customer footfall store verified with active glass display counters.',
        ocrExtracted: true,
        dateConsistencyPass: true,
        amountConsistencyPass: true,
        duplicateCheckPass: true
      }
    ],
    behaviorTimeline: [
      { month: 'Apr 2026', income: 17200, rent: '4 Days Late', supplier: '7 Days Late', utility: 'ON_TIME', consistencyPct: 68 },
      { month: 'May 2026', income: 18400, rent: 'ON_TIME', supplier: '10 Days Late', utility: 'ON_TIME', consistencyPct: 71 },
      { month: 'Jun 2026', income: 19100, rent: '6 Days Late', supplier: '8 Days Late', utility: 'ON_TIME', consistencyPct: 66 },
      { month: 'Jul 2026', income: 17900, rent: 'ON_TIME', supplier: '6 Days Late', utility: 'ON_TIME', consistencyPct: 72 },
      { month: 'Aug 2026', income: 18800, rent: '5 Days Late', supplier: '9 Days Late', utility: 'ON_TIME', consistencyPct: 67 },
      { month: 'Sep 2026', income: 18500, rent: 'ON_TIME', supplier: '8 Days Late', utility: 'ON_TIME', consistencyPct: 70 }
    ],
    riskAlerts: [
      {
        date: '29 Sep 2026',
        severity: 'MEDIUM',
        signal: 'Cashflow Timing Indiscipline',
        change: 'Supplier settlement delays average 8.2 days despite healthy bank balance',
        impact: 'Borrower prioritizes inventory hoarding over obligation punctuality.'
      }
    ],
    featureAttributions: [
      { feature: 'Outstanding Gross Revenue', contribution: 20.0, direction: 'POSITIVE', rawMetric: '₹18,500 / week (100 Ability)', category: 'Ability' },
      { feature: 'Established Commercial Presence', contribution: 6.0, direction: 'POSITIVE', rawMetric: '14 Months', category: 'Stability' },
      { feature: 'Habitual Supplier Settlement Lags', contribution: -14.2, direction: 'NEGATIVE', rawMetric: '62% Timely (Recurring Lag)', category: 'Willingness' },
      { feature: 'Stall Rent Punctuality Delays', contribution: -9.5, direction: 'NEGATIVE', rawMetric: '71% Timely', category: 'Willingness' },
      { feature: 'Absence of Social Collateral', contribution: -4.0, direction: 'NEGATIVE', rawMetric: 'Non-Participant', category: 'Social Collateral' }
    ],
    counterfactualPaths: [
      {
        leverName: 'Automate Supplier Settlements (Auto-Debit)',
        currentValue: '62%',
        targetValue: '90%',
        projectedScore: 86,
        projectedScoreDelta: 9,
        confidence: 'High',
        actionItem: 'Set up standing auto-debit for weekly vendor accounts.'
      },
      {
        leverName: 'Regularize Stall Rent Clearance',
        currentValue: '71%',
        targetValue: '95%',
        projectedScore: 84,
        projectedScoreDelta: 7,
        confidence: 'High',
        actionItem: 'Pay rent on the 1st of each month via UPI auto-mandate.'
      }
    ],
    verificationRatio: '4/5 Verified',
    status: 'PENDING_REVIEW',
    appliedDate: '04 Oct 2026',
    aiExplanation: {
      summary: 'Vikram Joshi represents a high-revenue, low-willingness archetype. Weekly gross revenue of ₹18,500 places Ability at maximum (100/100), but recurring supplier delays (62% punctuality) and rent lags (71%) cap the composite score at 77.',
      strengths: [
        'Highest weekly gross turnover in the cohort (₹18,500/week)',
        'Extensive high-margin electronics accessories customer base in Abids'
      ],
      riskFactors: [
        'WILLINGNESS FRICTION: Habitual 7-10 day payment delay on wholesale bills',
        'Stall rent timeliness of 71% indicates cashflow timing indiscipline',
        'Requested ₹30,000 should be structured with auto-debit to guarantee timely recovery'
      ],
      underwritingRecommendation: 'Recommend capped sanction of ₹15,000 structured with mandatory weekly NACH/auto-debit from current account.'
    }
  }
];
