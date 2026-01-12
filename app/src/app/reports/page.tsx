'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Presentation,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const reportTypes = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'High-level overview of strategy status, key metrics, and highlights',
    icon: FileText,
    format: 'PDF',
    sections: ['Ambition', 'Outcomes', 'Priorities', 'Alerts'],
  },
  {
    id: 'strategy-document',
    name: 'Strategy Document',
    description: 'Comprehensive Word document with detailed strategy articulation',
    icon: FileText,
    format: 'DOCX',
    sections: ['Vision', 'Markets', 'Outcomes', 'Execution', 'Roadmap'],
  },
  {
    id: 'strategy-presentation',
    name: 'Strategy Presentation',
    description: 'PowerPoint presentation with charts and key insights',
    icon: Presentation,
    format: 'PPTX',
    sections: ['Overview', 'Charts', 'Recommendations', 'Next Steps'],
  },
  {
    id: 'market-analysis',
    name: 'Market Analysis',
    description: 'Comprehensive market intelligence with trends and competitor analysis',
    icon: BarChart3,
    format: 'PDF',
    sections: ['Segments', 'Competitors', 'Trends', 'Opportunities'],
  },
  {
    id: 'kpi-dashboard',
    name: 'KPI Dashboard',
    description: 'Detailed KPI performance metrics with historical trends',
    icon: PieChart,
    format: 'Excel',
    sections: ['All KPIs', 'Trends', 'Targets', 'Variances'],
  },
  {
    id: 'data-export',
    name: 'Data Export',
    description: 'Raw data export for further analysis',
    icon: FileSpreadsheet,
    format: 'CSV/JSON',
    sections: ['All Data'],
  },
];

const recentReports = [
  {
    id: '1',
    name: 'Q1 2026 Executive Summary',
    type: 'executive-summary',
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    format: 'PDF',
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'Market Analysis - Production Chemistry',
    type: 'market-analysis',
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    format: 'PDF',
    size: '5.1 MB',
  },
  {
    id: '3',
    name: 'KPI Dashboard Export',
    type: 'kpi-dashboard',
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    format: 'Excel',
    size: '1.8 MB',
  },
];

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedAt: Date;
  format: string;
  size: string;
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);

  // Load generated reports from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('generated-reports');
    if (saved) {
      const parsed = JSON.parse(saved);
      setGeneratedReports(parsed.map((r: any) => ({
        ...r,
        generatedAt: new Date(r.generatedAt)
      })));
    }
  }, []);

  const saveReportToHistory = (report: GeneratedReport) => {
    const updated = [report, ...generatedReports].slice(0, 10);
    setGeneratedReports(updated);
    localStorage.setItem('generated-reports', JSON.stringify(updated));
  };

  const generatePDF = async (data: any, reportType: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(0, 20, 220); // SLB Blue
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(data.title, 14, 20);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Generated date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date(data.generatedAt).toLocaleString()}`, 14, 40);

    let yPos = 50;

    if (reportType === 'executive-summary') {
      // Ambition Section
      doc.setFontSize(14);
      doc.text('2030 Revenue Target', 14, yPos);
      yPos += 8;
      doc.setFontSize(10);
      const revenueData = data.sections.ambition.data;
      doc.text(`Target: $${revenueData.target_amount}M`, 14, yPos);
      yPos += 6;
      doc.text(`Actual: $${revenueData.actual_amount}M`, 14, yPos);
      yPos += 6;
      doc.text(`Progress: ${revenueData.progress_percentage.toFixed(1)}%`, 14, yPos);
      yPos += 15;

      // Outcomes Summary
      doc.setFontSize(14);
      doc.text('Strategic Outcomes', 14, yPos);
      yPos += 8;
      doc.setFontSize(10);
      const outcomesSummary = data.sections.outcomes.summary;
      doc.text(`Total: ${outcomesSummary.total}`, 14, yPos);
      yPos += 6;
      doc.text(`On Track: ${outcomesSummary.onTrack}`, 14, yPos);
      yPos += 6;
      doc.text(`At Risk: ${outcomesSummary.atRisk}`, 14, yPos);
      yPos += 15;

      // Outcomes List
      data.sections.outcomes.data.forEach((outcome: any) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`• ${outcome.name}: ${outcome.progress_percentage}% (${outcome.status})`, 14, yPos);
        yPos += 6;
      });

      yPos += 10;

      // Priorities Summary
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.text('2026 Priorities', 14, yPos);
      yPos += 8;
      doc.setFontSize(10);
      const prioritiesSummary = data.sections.priorities.summary;
      doc.text(`Total: ${prioritiesSummary.total}`, 14, yPos);
      yPos += 6;
      doc.text(`Completed: ${prioritiesSummary.completed}`, 14, yPos);
      yPos += 6;
      doc.text(`In Progress: ${prioritiesSummary.inProgress}`, 14, yPos);
    } else if (reportType === 'kpi-dashboard') {
      doc.setFontSize(14);
      doc.text('KPI Performance Metrics', 14, yPos);
      yPos += 10;
      doc.setFontSize(9);

      data.data.forEach((kpi: any) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${kpi.kpi}`, 14, yPos);
        yPos += 5;
        doc.text(`  Current: ${kpi.current}${kpi.unit} | Target: ${kpi.target}${kpi.unit} | Status: ${kpi.status}`, 14, yPos);
        yPos += 8;
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(`Page ${i} of ${pageCount} | PCT Strategy Dashboard`, pageWidth / 2, 290, { align: 'center' });
    }

    return doc;
  };

  const generateExcel = (data: any, reportType: string) => {
    const wb = XLSX.utils.book_new();

    if (reportType === 'kpi-dashboard') {
      const wsData = [
        ['Category', 'KPI', 'Current', 'Target', 'Unit', 'Progress %', 'Status'],
        ...data.data.map((kpi: any) => [
          kpi.category,
          kpi.kpi,
          kpi.current,
          kpi.target,
          kpi.unit,
          kpi.progress,
          kpi.status
        ])
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'KPIs');
    } else if (reportType === 'data-export') {
      // Outcomes sheet
      if (data.outcomes?.length > 0) {
        const outcomesData = [
          ['ID', 'Name', 'Progress %', 'Status', 'Last Updated', 'Notes'],
          ...data.outcomes.map((o: any) => [o.id, o.name, o.progress_percentage, o.status, o.last_updated, o.notes || ''])
        ];
        const wsOutcomes = XLSX.utils.aoa_to_sheet(outcomesData);
        XLSX.utils.book_append_sheet(wb, wsOutcomes, 'Outcomes');
      }

      // Revenue sheet
      if (data.revenue?.length > 0) {
        const revenueData = [
          ['ID', 'Target Year', 'Target Amount', 'Actual Amount', 'Progress %', 'Last Updated'],
          ...data.revenue.map((r: any) => [r.id, r.target_year, r.target_amount, r.actual_amount, r.progress_percentage, r.last_updated])
        ];
        const wsRevenue = XLSX.utils.aoa_to_sheet(revenueData);
        XLSX.utils.book_append_sheet(wb, wsRevenue, 'Revenue');
      }

      // Priorities sheet
      if (data.priorities?.length > 0) {
        const prioritiesData = [
          ['ID', 'Name', 'Completion %', 'Status', 'Due Date', 'Last Updated'],
          ...data.priorities.map((p: any) => [p.id, p.name, p.completion_percentage, p.status, p.due_date, p.last_updated])
        ];
        const wsPriorities = XLSX.utils.aoa_to_sheet(prioritiesData);
        XLSX.utils.book_append_sheet(wb, wsPriorities, 'Priorities');
      }
    }

    return wb;
  };

  const handleGenerateReport = async (reportId: string) => {
    setGenerating(true);
    setSelectedReport(reportId);

    try {
      const report = reportTypes.find(r => r.id === reportId);
      if (!report) throw new Error('Report type not found');

      let blob: Blob;
      let filename: string;
      let size: string;

      // Handle PowerPoint and Word generation differently
      if (reportId === 'strategy-presentation') {
        const response = await fetch('/api/reports/powerpoint');
        if (!response.ok) throw new Error('Failed to generate PowerPoint');

        blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        filename = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : `SLB-PCT-Strategy-${Date.now()}.pptx`;
        size = `${(blob.size / 1024 / 1024).toFixed(2)} MB`;
      } else if (reportId === 'strategy-document') {
        const response = await fetch('/api/reports/word');
        if (!response.ok) throw new Error('Failed to generate Word document');

        blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        filename = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : `SLB-PCT-Strategy-Document-${Date.now()}.docx`;
        size = `${(blob.size / 1024 / 1024).toFixed(2)} MB`;
      } else {
        // Fetch data from API for other report types
        const response = await fetch(`/api/reports?type=${reportId}`);
        if (!response.ok) throw new Error('Failed to fetch report data');

        const data = await response.json();

        if (report.format === 'PDF') {
          const doc = await generatePDF(data, reportId);
          blob = doc.output('blob');
          filename = `${data.filename}-${Date.now()}.pdf`;
          size = `${(blob.size / 1024).toFixed(1)} KB`;
        } else if (report.format === 'Excel' || reportId === 'data-export') {
          const wb = generateExcel(data, reportId);
          const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          filename = `${data.filename}-${Date.now()}.xlsx`;
          size = `${(blob.size / 1024).toFixed(1)} KB`;
        } else {
          // JSON export
          blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          filename = `${data.filename}-${Date.now()}.json`;
          size = `${(blob.size / 1024).toFixed(1)} KB`;
        }
      }

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Save to history
      saveReportToHistory({
        id: Date.now().toString(),
        name: report.name,
        type: reportId,
        generatedAt: new Date(),
        format: report.format,
        size
      });

    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }

    setGenerating(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-slb-black">Reports & Export</h1>
        <p className="text-sm font-light text-gray-500 mt-1">
          Generate reports and export data in various formats
        </p>
      </div>

      {/* Report Types */}
      <div>
        <h2 className="text-lg font-light text-slb-black mb-4">Generate Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className="card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleGenerateReport(report.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-slb-blue/10 rounded-lg flex items-center justify-center">
                  <report.icon className="w-5 h-5 text-slb-blue" />
                </div>
                <span className="px-2 py-0.5 text-xs font-light bg-gray-100 text-gray-600 rounded">
                  {report.format}
                </span>
              </div>

              <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
              <p className="text-xs font-light text-gray-500 mt-1">
                {report.description}
              </p>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-light text-gray-400">Includes:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {report.sections.map((section) => (
                    <span
                      key={section}
                      className="px-1.5 py-0.5 text-xs font-light bg-gray-50 text-gray-600 rounded"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>

              {generating && selectedReport === report.id ? (
                <div className="mt-3 flex items-center justify-center py-2">
                  <div className="w-4 h-4 border-2 border-slb-blue border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2 text-xs font-light text-slb-blue">
                    Generating...
                  </span>
                </div>
              ) : (
                <button className="mt-3 w-full btn-secondary text-sm flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Generate</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <h2 className="text-lg font-light text-slb-black mb-4">Recent Reports</h2>
        {generatedReports.length > 0 ? (
          <div className="space-y-3">
            {generatedReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-light text-gray-900">{report.name}</p>
                    <div className="flex items-center space-x-3 mt-0.5">
                      <span className="text-xs font-light text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(report.generatedAt)}
                      </span>
                      <span className="text-xs font-light text-gray-500">
                        {report.format}
                      </span>
                      <span className="text-xs font-light text-gray-500">
                        {report.size}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleGenerateReport(report.type)}
                  className="btn-secondary text-xs flex items-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-light text-gray-500">
              No reports generated yet
            </p>
            <p className="mt-1 text-xs font-light text-gray-400">
              Generate a report above to see it here
            </p>
          </div>
        )}
      </div>

      {/* Scheduled Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-light text-slb-black">Scheduled Reports</h2>
          <button className="text-sm font-light text-slb-blue hover:underline">
            Configure
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-light text-gray-500">
            No scheduled reports configured
          </p>
          <button className="mt-3 text-sm font-light text-slb-blue hover:underline">
            Set up automated reports
          </button>
        </div>
      </div>
    </div>
  );
}
