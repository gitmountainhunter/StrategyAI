import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const REPORTS_DIR = path.join(DATA_DIR, 'reports');

// Read JSON file
async function readJsonFile(filename: string) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Ensure reports directory exists
async function ensureReportsDir() {
  try {
    await fs.access(REPORTS_DIR);
  } catch {
    await fs.mkdir(REPORTS_DIR, { recursive: true });
  }
}

// Generate executive summary report
async function generateExecutiveSummary() {
  const outcomes = await readJsonFile('strategic-outcomes.json');
  const revenue = await readJsonFile('revenue-targets.json');
  const priorities = await readJsonFile('priorities.json');

  return {
    title: 'Executive Summary Report',
    generatedAt: new Date().toISOString(),
    sections: {
      ambition: {
        title: '2030 Ambition',
        data: revenue?.targets?.[0] || {
          target_amount: 1055,
          actual_amount: 785,
          progress_percentage: 74.4
        }
      },
      outcomes: {
        title: 'Strategic Outcomes',
        data: outcomes?.outcomes || [],
        summary: {
          total: outcomes?.outcomes?.length || 0,
          onTrack: outcomes?.outcomes?.filter((o: any) => o.status === 'on-track').length || 0,
          atRisk: outcomes?.outcomes?.filter((o: any) => o.status === 'at-risk').length || 0
        }
      },
      priorities: {
        title: '2026 Priorities',
        data: priorities?.priorities || [],
        summary: {
          total: priorities?.priorities?.length || 0,
          completed: priorities?.priorities?.filter((p: any) => p.status === 'completed').length || 0,
          inProgress: priorities?.priorities?.filter((p: any) => p.status === 'in-progress').length || 0
        }
      }
    }
  };
}

// Generate KPI dashboard data
async function generateKPIDashboard() {
  const outcomes = await readJsonFile('strategic-outcomes.json');
  const revenue = await readJsonFile('revenue-targets.json');
  const priorities = await readJsonFile('priorities.json');

  const kpiData = [];

  // Revenue KPI
  if (revenue?.targets?.[0]) {
    kpiData.push({
      category: 'Revenue',
      kpi: '2030 Revenue Target',
      current: revenue.targets[0].actual_amount,
      target: revenue.targets[0].target_amount,
      unit: '$M',
      progress: revenue.targets[0].progress_percentage,
      status: revenue.targets[0].progress_percentage >= 70 ? 'on-track' : 'at-risk'
    });
  }

  // Outcome KPIs
  if (outcomes?.outcomes) {
    outcomes.outcomes.forEach((o: any) => {
      kpiData.push({
        category: 'Strategic Outcome',
        kpi: o.name,
        current: o.progress_percentage,
        target: 100,
        unit: '%',
        progress: o.progress_percentage,
        status: o.status
      });
    });
  }

  // Priority KPIs
  if (priorities?.priorities) {
    priorities.priorities.forEach((p: any) => {
      kpiData.push({
        category: 'Priority',
        kpi: p.name,
        current: p.completion_percentage,
        target: 100,
        unit: '%',
        progress: p.completion_percentage,
        status: p.status
      });
    });
  }

  return {
    title: 'KPI Dashboard Export',
    generatedAt: new Date().toISOString(),
    data: kpiData
  };
}

// Generate data export
async function generateDataExport() {
  const outcomes = await readJsonFile('strategic-outcomes.json');
  const revenue = await readJsonFile('revenue-targets.json');
  const priorities = await readJsonFile('priorities.json');

  return {
    title: 'Data Export',
    generatedAt: new Date().toISOString(),
    outcomes: outcomes?.outcomes || [],
    revenue: revenue?.targets || [],
    priorities: priorities?.priorities || []
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reportType = searchParams.get('type');
  const format = searchParams.get('format') || 'json';

  try {
    let reportData;
    let filename;

    switch (reportType) {
      case 'executive-summary':
        reportData = await generateExecutiveSummary();
        filename = 'executive-summary';
        break;
      case 'kpi-dashboard':
        reportData = await generateKPIDashboard();
        filename = 'kpi-dashboard';
        break;
      case 'data-export':
        reportData = await generateDataExport();
        filename = 'data-export';
        break;
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    // Return JSON for client-side processing
    return NextResponse.json({
      ...reportData,
      filename,
      format
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

// Save generated report
export async function POST(request: NextRequest) {
  try {
    await ensureReportsDir();

    const body = await request.json();
    const { filename, data, format } = body;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFilename = `${filename}-${timestamp}.${format}`;
    const filePath = path.join(REPORTS_DIR, fullFilename);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      filename: fullFilename,
      path: filePath
    });
  } catch (error) {
    console.error('Error saving report:', error);
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }
}
