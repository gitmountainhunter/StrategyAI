# SLB Strategy Agent

AI-powered Marketing Strategy Agent for Oil & Gas Chemistry (PCT)

## Features

- **Dashboard**: Executive overview with key metrics, strategic outcomes, and priorities
- **Chat Agent**: Natural language interface to query strategy, market intelligence, and get recommendations
- **Market Intelligence**: Real-time industry news, trends, and competitor insights
- **Analytics**: Interactive charts and visualizations for performance metrics
- **Strategy History**: Version control for strategy evolution tracking
- **Segment Views**: Deep dives into Onshore, Offshore, Midstream, Recovery, and Integrated Solutions
- **Reports**: Generate PDF, Excel, and PowerPoint reports with SLB branding

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with SLB corporate colors (#0014DC, #FFFFFF, #000000)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
cd app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   └── chat/          # Chat API endpoint
│   │   ├── analytics/         # Analytics page
│   │   ├── chat/              # Chat interface
│   │   ├── history/           # Strategy history
│   │   ├── intelligence/      # Market intelligence
│   │   ├── reports/           # Reports & export
│   │   └── segments/          # Segment detail pages
│   ├── components/            # React components
│   │   └── charts/            # Chart components
│   ├── data/                  # Strategy data
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
└── package.json
```

## SLB Branding

The application uses SLB corporate colors throughout:

- **Primary**: SLB Blue (#0014DC)
- **Secondary**: White (#FFFFFF)
- **Tertiary**: Black (#000000)

Typography uses Sans Light font family for a modern, professional look.

## Strategy Data

The application parses and displays information from the M&T Strategy and Execution Plan, including:

- **2030 Ambition**: $1055M revenue, +25% growth, >5.0% IBT
- **Market Segments**: Onshore, Offshore, Midstream, Recovery, Integrated Solutions
- **7 Strategic Outcomes**: Strategy in Action, Faster Innovation, Simpler Workflows, Customer Responsiveness, Sharper Portfolio, Digital at Core, Market-Led Growth
- **2026 Priorities**: 20 key action items across quarters

## API Integration

### Chat API

The `/api/chat` endpoint processes natural language queries about the strategy:

```typescript
POST /api/chat
{
  "message": "What's our 2030 ambition?",
  "history": []
}
```

### Market Intelligence

The market intelligence system tracks:
- Industry news (Oil & Gas Journal, JPT, World Oil)
- Competitor activities (Baker Hughes, Halliburton)
- Regulatory changes
- Technology trends

## Future Enhancements

- [ ] OpenAI/Anthropic API integration for advanced NLP
- [ ] Real-time web scraping with scheduled jobs
- [ ] Database persistence (PostgreSQL/SQLite)
- [ ] Authentication and role-based access
- [ ] PDF/PPTX generation with SLB templates
- [ ] Email alerts for market changes
- [ ] What-if scenario planning tools

## License

Proprietary - SLB Internal Use Only
