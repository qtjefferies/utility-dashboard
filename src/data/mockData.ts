// Color palette for dynamic categories across all charts
export const categoryColorPalette = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#a855f7", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#06b6d4", // cyan
  "#8b5cf6", // violet
  "#f97316", // orange
  "#14b8a6", // teal
  "#6366f1"  // indigo
];

export const homeData = {
  "athlete": {
    "firstName": "Marcus",
    "fullName": "Marcus Thompson",
    "sport": "Football",
    "year": "Sophomore",
    "initials": "MT"
  },
  "kpis": {
    "totalEarned": 47230,
    "taxVault": 13224,
    "available": 33406,
    "taxRate": 0.28,
    "earnedMoM": 0.12
  },
  "links": {
    "viewBreakdown": "/cash-flow",
    "viewAllActivity": "/cash-flow"
  },
  "recentActivity": [
    { "id": "act_001", "type": "income", "label": "Conference Collective Monthly", "date": "Mar 1", "amount": 1000 },
    { "id": "act_002", "type": "income", "label": "Local Auto Deal Payment #2", "date": "Mar 8", "amount": 800 },
    { "id": "act_003", "type": "expense", "label": "Business Cards", "date": "Mar 10", "amount": -85 },
    { "id": "act_004", "type": "tax_transfer", "label": "Tax Vault Auto-Transfer", "date": "Mar 11", "amount": -280 },
    { "id": "act_005", "type": "income", "label": "Social Media Partnership", "date": "Mar 12", "amount": 500 }
  ],
  "upcoming": [
    { "id": "up_001", "label": "Social Post #3 Due", "date": "Mar 15" },
    { "id": "up_002", "label": "Collective Payment", "date": "Apr 1" },
    { "id": "up_003", "label": "Q2 Tax Payment", "date": "Jun 15" }
  ],
  "compliance": {
    "dealsReported": 3,
    "status": "action_required",
    "items": [
      {
        "id": "comp_001",
        "title": "Q1 NIL Report Due",
        "description": "Submit quarterly NIL earnings report to compliance office",
        "dueDate": "2025-03-20",
        "status": "overdue",
        "priority": "high",
        "category": "reporting"
      },
      {
        "id": "comp_002",
        "title": "Auto Dealership Contract",
        "description": "Upload signed contract for review",
        "dueDate": "2025-03-25",
        "status": "pending",
        "priority": "high",
        "category": "contracts"
      },
      {
        "id": "comp_003",
        "title": "NIL Education Module",
        "description": "Complete annual compliance training",
        "dueDate": "2025-04-01",
        "status": "pending",
        "priority": "medium",
        "category": "education"
      },
      {
        "id": "comp_004",
        "title": "Financial Disclosure",
        "description": "Update financial disclosure form",
        "dueDate": "2025-03-18",
        "status": "overdue",
        "priority": "high",
        "category": "disclosure"
      },
      {
        "id": "comp_005",
        "title": "Social Media Post Approval",
        "description": "Get pre-approval for upcoming brand posts",
        "dueDate": "2025-03-28",
        "status": "completed",
        "priority": "medium",
        "category": "approval"
      }
    ]
  },
  "aiInsight": {
    "message": "You're on track to hit $65K by year-end. Based on your current pace, consider setting up quarterly tax payments to avoid a large year-end bill.",
    "ctaLabel": "Learn more about quarterly payments",
    "ctaHref": "/taxes/quarterly-payments"
  },
  "quickActions": [
    { "label": "Add a deal", "href": "/deals/new", "variant": "primary" },
    { "label": "Log an expense", "href": "/expenses/new", "variant": "secondary" },
    { "label": "Message my CPA", "href": "/messages/cpa", "variant": "secondary" }
  ]
};

export const dealsData = {
  "athlete": homeData.athlete,
  "summary": {
    "totalDeals": 12,
    "activeDeals": 8,
    "pendingDeals": 2,
    "completedDeals": 2
  },
  "deals": [
    {
      "id": "deal_001",
      "status": "active",
      "dealName": "Local Auto Dealership Social Posts",
      "source": "Brand Direct",
      "amount": 2400,
      "amountType": "one-time",
      "nextAction": "Post #3 due Mar 15"
    },
    {
      "id": "deal_002",
      "status": "active",
      "dealName": "Conference Collective Monthly",
      "source": "Collective",
      "amount": 1000,
      "amountType": "monthly",
      "nextAction": null
    },
    {
      "id": "deal_003",
      "status": "pending",
      "dealName": "Apparel Brand Campaign",
      "source": "Brand Direct",
      "amount": 5000,
      "amountType": "one-time",
      "nextAction": "Contract review"
    },
    {
      "id": "deal_004",
      "status": "active",
      "dealName": "Local Restaurant Appearances",
      "source": "Brand Direct",
      "amount": 1200,
      "amountType": "one-time",
      "nextAction": "Next visit Mar 20"
    }
  ]
};

export const taxesData = {
  "athlete": homeData.athlete,
  "taxVault": {
    "currentAmount": 13224,
    "goalAmount": 20000,
    "progressPercentage": 65,
    "projectedTotal": 20000,
    "onTrackMessage": "On track for $20K total by Dec 31"
  },
  "strategy": {
    "currentRate": 0.28,
    "minRate": 0.20,
    "maxRate": 0.35,
    "options": [
      {
        "id": "conservative",
        "label": "Conservative (32%)",
        "rate": 0.32,
        "description": "Maximum tax protection"
      },
      {
        "id": "recommended",
        "label": "Recommended (28%)",
        "rate": 0.28,
        "description": "AI suggested for your situation",
        "isRecommended": true
      },
      {
        "id": "aggressive",
        "label": "Aggressive (22%)",
        "rate": 0.22,
        "description": "More available cash now"
      }
    ],
    "explanation": {
      "perThousand": 280,
      "projectedBillRange": "$18,500–$21,000",
      "currentSavings": "$20,448 (on track)"
    }
  },
  "quarterlyPayments": [
    {
      "id": "q1_2025",
      "quarter": "Q1 2025",
      "amount": 4500,
      "dueDate": "Mar 1",
      "status": "paid"
    },
    {
      "id": "q2_2025",
      "quarter": "Q2 2025",
      "amount": 5200,
      "dueDate": "Jun 15",
      "status": "due"
    },
    {
      "id": "q3_2025",
      "quarter": "Q3 2025",
      "amount": 5500,
      "dueDate": "Sep 15",
      "status": "estimated"
    },
    {
      "id": "q4_2025",
      "quarter": "Q4 2025",
      "amount": 5300,
      "dueDate": "Dec 15",
      "status": "estimated"
    }
  ]
};

export const peopleData = {
  "athlete": homeData.athlete,
  "people": [
    {
      "id": "person_001",
      "name": "Sarah Thompson",
      "roles": ["Family"],
      "email": "sarah.thompson@email.com",
      "phone": "(555) 123-4567",
      "accessLevel": "admin",
      "initials": "ST",
      "photoUrl": "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      "id": "person_002",
      "name": "Mike Reynolds",
      "roles": ["Agent"],
      "email": "mike@sportsagency.com",
      "phone": "(555) 234-5678",
      "accessLevel": "admin",
      "initials": "MR",
      "photoUrl": "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      "id": "person_003",
      "name": "Coach Williams",
      "roles": ["Coach"],
      "email": "williams@university.edu",
      "phone": "(555) 345-6789",
      "accessLevel": "read-only",
      "initials": "CW",
      "photoUrl": "https://randomuser.me/api/portraits/men/52.jpg"
    },
    {
      "id": "person_004",
      "name": "Jennifer Martinez",
      "roles": ["Accountant"],
      "email": "jmartinez@taxfirm.com",
      "phone": "(555) 456-7890",
      "accessLevel": "read-only",
      "initials": "JM",
      "photoUrl": "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      "id": "person_005",
      "name": "David Chen",
      "roles": ["Deal Rep"],
      "email": "dchen@marketing.com",
      "phone": "(555) 567-8901",
      "accessLevel": "read-only",
      "initials": "DC",
      "photoUrl": "https://randomuser.me/api/portraits/men/85.jpg"
    },
    {
      "id": "person_006",
      "name": "Lisa Johnson",
      "roles": ["Other"],
      "email": "lisa.j@email.com",
      "phone": "(555) 678-9012",
      "accessLevel": "read-only",
      "initials": "LJ",
      "photoUrl": "https://randomuser.me/api/portraits/women/90.jpg"
    }
  ]
};

export const cashFlowData = {
  "athlete": homeData.athlete,
  "summary": {
    "totalIncome": 47230,
    "totalExpenses": 3840,
    "netCashFlow": 43390,
    "taxesSaved": 13224
  },
  "monthlyTrend": [
    { "month": "Jan", "income": 12500, "expenses": 850, "net": 11650 },
    { "month": "Feb", "income": 15200, "expenses": 1240, "net": 13960 },
    { "month": "Mar", "income": 19530, "expenses": 1750, "net": 17780 }
  ],
  "incomeBySource": [
    { "name": "Collectives", "value": 18000, "color": "#10b981" },
    { "name": "Brand Deals", "value": 20230, "color": "#3b82f6" },
    { "name": "Social Media", "value": 5000, "color": "#8b5cf6" },
    { "name": "Appearance Fees", "value": 2500, "color": "#f59e0b" },
    { "name": "Merchandise", "value": 1000, "color": "#ef4444" }
  ],
  "expensesByCategory": [
    { "name": "Business", "value": 1840, "color": "#3b82f6" },
    { "name": "Travel", "value": 1200, "color": "#a855f7" },
    { "name": "Equipment", "value": 800, "color": "#10b981" }
  ],
  "allTransactions": [
    // January transactions
    { "id": "tx_jan_001", "type": "income", "category": "Collective", "description": "January Collective Payment", "date": "2025-01-01", "month": "Jan", "amount": 1000 },
    { "id": "tx_jan_002", "type": "income", "category": "Brand Deal", "description": "Local Restaurant Deal", "date": "2025-01-05", "month": "Jan", "amount": 3500 },
    { "id": "tx_jan_003", "type": "income", "category": "Brand Deal", "description": "Auto Dealership Post 1", "date": "2025-01-10", "month": "Jan", "amount": 800 },
    { "id": "tx_jan_004", "type": "income", "category": "Collective", "description": "Conference Collective", "date": "2025-01-15", "month": "Jan", "amount": 5000 },
    { "id": "tx_jan_005", "type": "income", "category": "Social Media", "description": "Instagram Sponsored Post", "date": "2025-01-20", "month": "Jan", "amount": 1200 },
    { "id": "tx_jan_006", "type": "income", "category": "Brand Deal", "description": "Apparel Brand", "date": "2025-01-25", "month": "Jan", "amount": 1000 },
    { "id": "tx_jan_007", "type": "expense", "category": "Business", "description": "Website Domain", "date": "2025-01-08", "month": "Jan", "amount": -120 },
    { "id": "tx_jan_008", "type": "expense", "category": "Business", "description": "Logo Design", "date": "2025-01-12", "month": "Jan", "amount": -350 },
    { "id": "tx_jan_009", "type": "expense", "category": "Travel", "description": "Gas for Appearance", "date": "2025-01-18", "month": "Jan", "amount": -60 },
    { "id": "tx_jan_010", "type": "expense", "category": "Equipment", "description": "Camera Tripod", "date": "2025-01-22", "month": "Jan", "amount": -220 },

    // February transactions
    { "id": "tx_feb_001", "type": "income", "category": "Collective", "description": "February Collective Payment", "date": "2025-02-01", "month": "Feb", "amount": 1000 },
    { "id": "tx_feb_002", "type": "income", "category": "Brand Deal", "description": "Auto Dealership Post 2", "date": "2025-02-05", "month": "Feb", "amount": 800 },
    { "id": "tx_feb_003", "type": "income", "category": "Collective", "description": "NIL Collective Bonus", "date": "2025-02-08", "month": "Feb", "amount": 6000 },
    { "id": "tx_feb_004", "type": "income", "category": "Brand Deal", "description": "Energy Drink Partnership", "date": "2025-02-12", "month": "Feb", "amount": 4200 },
    { "id": "tx_feb_005", "type": "income", "category": "Social Media", "description": "TikTok Sponsored Content", "date": "2025-02-15", "month": "Feb", "amount": 1800 },
    { "id": "tx_feb_006", "type": "income", "category": "Brand Deal", "description": "Local Gym Partnership", "date": "2025-02-20", "month": "Feb", "amount": 1400 },
    { "id": "tx_feb_007", "type": "expense", "category": "Business", "description": "Business Cards", "date": "2025-02-06", "month": "Feb", "amount": -85 },
    { "id": "tx_feb_008", "type": "expense", "category": "Business", "description": "Accounting Software", "date": "2025-02-10", "month": "Feb", "amount": -180 },
    { "id": "tx_feb_009", "type": "expense", "category": "Travel", "description": "Hotel for Event", "date": "2025-02-14", "month": "Feb", "amount": -420 },
    { "id": "tx_feb_010", "type": "expense", "category": "Travel", "description": "Uber to Appearance", "date": "2025-02-18", "month": "Feb", "amount": -45 },
    { "id": "tx_feb_011", "type": "expense", "category": "Equipment", "description": "Lighting Kit", "date": "2025-02-22", "month": "Feb", "amount": -340 },
    { "id": "tx_feb_012", "type": "expense", "category": "Business", "description": "Social Media Manager", "date": "2025-02-28", "month": "Feb", "amount": -510 },

    // March transactions
    { "id": "tx_mar_001", "type": "income", "category": "Collective", "description": "March Collective Payment", "date": "2025-03-01", "month": "Mar", "amount": 1000 },
    { "id": "tx_mar_002", "type": "income", "category": "Brand Deal", "description": "Auto Dealership Post 3", "date": "2025-03-08", "month": "Mar", "amount": 800 },
    { "id": "tx_mar_003", "type": "income", "category": "Collective", "description": "Conference Collective Q1", "date": "2025-03-05", "month": "Mar", "amount": 5000 },
    { "id": "tx_mar_004", "type": "income", "category": "Brand Deal", "description": "Clothing Brand Campaign", "date": "2025-03-10", "month": "Mar", "amount": 7200 },
    { "id": "tx_mar_005", "type": "income", "category": "Social Media", "description": "YouTube Sponsorship", "date": "2025-03-12", "month": "Mar", "amount": 2000 },
    { "id": "tx_mar_006", "type": "income", "category": "Brand Deal", "description": "Tech Company Partnership", "date": "2025-03-15", "month": "Mar", "amount": 2530 },
    { "id": "tx_mar_007", "type": "income", "category": "Brand Deal", "description": "Restaurant Appearance", "date": "2025-03-18", "month": "Mar", "amount": 1000 },
    { "id": "tx_mar_008", "type": "expense", "category": "Business", "description": "Website Maintenance", "date": "2025-03-03", "month": "Mar", "amount": -95 },
    { "id": "tx_mar_009", "type": "expense", "category": "Business", "description": "Photo Editing Software", "date": "2025-03-07", "month": "Mar", "amount": -240 },
    { "id": "tx_mar_010", "type": "expense", "category": "Travel", "description": "Airport Parking", "date": "2025-03-11", "month": "Mar", "amount": -45 },
    { "id": "tx_mar_011", "type": "expense", "category": "Travel", "description": "Flight for Appearance", "date": "2025-03-13", "month": "Mar", "amount": -380 },
    { "id": "tx_mar_012", "type": "expense", "category": "Equipment", "description": "Ring Light", "date": "2025-03-16", "month": "Mar", "amount": -120 },
    { "id": "tx_mar_013", "type": "expense", "category": "Business", "description": "Marketing Consultation", "date": "2025-03-20", "month": "Mar", "amount": -870 },

    // Additional income sources
    { "id": "tx_jan_011", "type": "income", "category": "Appearance Fees", "description": "Local Business Event", "date": "2025-01-28", "month": "Jan", "amount": 800 },
    { "id": "tx_feb_013", "type": "income", "category": "Appearance Fees", "description": "Youth Camp Speaker", "date": "2025-02-25", "month": "Feb", "amount": 900 },
    { "id": "tx_mar_014", "type": "income", "category": "Appearance Fees", "description": "Charity Gala Appearance", "date": "2025-03-22", "month": "Mar", "amount": 800 },
    { "id": "tx_jan_012", "type": "income", "category": "Merchandise", "description": "Apparel Sales Q1", "date": "2025-01-30", "month": "Jan", "amount": 300 },
    { "id": "tx_feb_014", "type": "income", "category": "Merchandise", "description": "Online Store Sales", "date": "2025-02-28", "month": "Feb", "amount": 400 },
    { "id": "tx_mar_015", "type": "income", "category": "Merchandise", "description": "Event Booth Sales", "date": "2025-03-25", "month": "Mar", "amount": 300 }
  ]
};
