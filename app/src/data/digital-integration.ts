export const digitalIntegrationData = {
  lastUpdated: "2024-11-20T00:00:00Z",
  overallHealth: 76,
  totalInitiatives: 42,
  segmentsTransformed: 5,
  projectedEfficiency: 34,
  investmentPriority: 82,

  segments: {
    offshore: {
      id: "offshore",
      name: "Offshore",
      digitalScore: 78,
      maturity: {
        dataAnalytics: 75,
        iotIntegration: 90,
        automation: 65,
        aiMl: 55,
        cloud: 80,
        skills: 70,
        customerInterface: 75,
        predictiveMaint: 85
      },
      initiatives: [
        {
          id: "off-001",
          name: "Remote Asset Monitoring",
          status: "active",
          progress: 85,
          startDate: "2024-01-15",
          endDate: "2024-12-31",
          phase: "acceleration",
          description: "Deploy IoT sensors and real-time monitoring for offshore platforms",
          impact: {
            efficiency: 25,
            costSavings: 2.5,
            safety: 40
          },
          technologies: ["IoT Sensors", "Edge Computing", "Real-time Analytics"],
          team: "Offshore Digital Team",
          budget: 5.2
        },
        {
          id: "off-002",
          name: "Digital Twin Implementation",
          status: "active",
          progress: 65,
          startDate: "2024-03-01",
          endDate: "2025-06-30",
          phase: "acceleration",
          description: "Create digital replicas of offshore assets for predictive maintenance",
          impact: {
            efficiency: 30,
            costSavings: 4.2,
            safety: 35
          },
          technologies: ["Digital Twin", "AI/ML", "Cloud Platform"],
          team: "Offshore Digital Team",
          budget: 8.5
        },
        {
          id: "off-003",
          name: "Predictive Maintenance System",
          status: "planned",
          progress: 20,
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          phase: "optimization",
          description: "AI-powered predictive maintenance to reduce unplanned downtime",
          impact: {
            efficiency: 35,
            costSavings: 6.8,
            safety: 50
          },
          technologies: ["AI/ML", "Predictive Analytics", "IoT"],
          team: "Offshore Digital Team",
          budget: 6.5
        }
      ],
      technologies: [
        { name: "IoT Sensors", status: "full", adoptionDate: "2023-06-01" },
        { name: "Cloud Analytics", status: "full", adoptionDate: "2023-08-15" },
        { name: "Digital Twin", status: "partial", adoptionDate: "2024-03-01" },
        { name: "AI/ML Models", status: "partial", adoptionDate: "2024-01-15" },
        { name: "Mobile Apps", status: "full", adoptionDate: "2023-10-01" },
        { name: "Automation", status: "partial", adoptionDate: "2024-02-01" },
        { name: "AR/VR", status: "planned", adoptionDate: null },
        { name: "Blockchain", status: "none", adoptionDate: null }
      ],
      roi: 210,
      keyMetrics: {
        efficiencyGain: 28,
        downtimeReduction: 35,
        safetyImprovement: 45,
        costReduction: 22
      }
    },

    onshore: {
      id: "onshore",
      name: "Onshore",
      digitalScore: 92,
      maturity: {
        dataAnalytics: 95,
        iotIntegration: 95,
        automation: 90,
        aiMl: 85,
        cloud: 95,
        skills: 90,
        customerInterface: 95,
        predictiveMaint: 88
      },
      initiatives: [
        {
          id: "on-001",
          name: "Smart Well IoT Deployment",
          status: "completed",
          progress: 100,
          startDate: "2023-06-01",
          endDate: "2024-09-30",
          phase: "foundation",
          description: "Deploy comprehensive IoT sensor network across onshore wells",
          impact: {
            efficiency: 40,
            costSavings: 8.5,
            safety: 30
          },
          technologies: ["IoT Sensors", "Edge Computing", "Cloud Platform"],
          team: "Onshore Digital Team",
          budget: 12.5
        },
        {
          id: "on-002",
          name: "AI Production Optimization",
          status: "active",
          progress: 75,
          startDate: "2024-02-01",
          endDate: "2025-03-31",
          phase: "acceleration",
          description: "Machine learning models for optimizing production parameters",
          impact: {
            efficiency: 45,
            costSavings: 12.3,
            safety: 25
          },
          technologies: ["AI/ML", "Real-time Analytics", "Cloud Platform"],
          team: "Onshore Digital Team",
          budget: 15.8
        },
        {
          id: "on-003",
          name: "Automated Chemical Injection",
          status: "active",
          progress: 88,
          startDate: "2024-01-15",
          endDate: "2024-12-31",
          phase: "acceleration",
          description: "Fully automated chemical treatment delivery system",
          impact: {
            efficiency: 50,
            costSavings: 10.2,
            safety: 35
          },
          technologies: ["Automation", "IoT", "AI/ML"],
          team: "Onshore Digital Team",
          budget: 9.8
        }
      ],
      technologies: [
        { name: "IoT Sensors", status: "full", adoptionDate: "2023-06-01" },
        { name: "Cloud Analytics", status: "full", adoptionDate: "2023-07-15" },
        { name: "Digital Twin", status: "partial", adoptionDate: "2024-05-01" },
        { name: "AI/ML Models", status: "full", adoptionDate: "2024-02-01" },
        { name: "Mobile Apps", status: "full", adoptionDate: "2023-09-01" },
        { name: "Automation", status: "full", adoptionDate: "2024-01-15" },
        { name: "AR/VR", status: "partial", adoptionDate: "2024-06-01" },
        { name: "Blockchain", status: "none", adoptionDate: null }
      ],
      roi: 285,
      keyMetrics: {
        efficiencyGain: 42,
        downtimeReduction: 52,
        safetyImprovement: 38,
        costReduction: 35
      }
    },

    midstream: {
      id: "midstream",
      name: "Midstream",
      digitalScore: 65,
      maturity: {
        dataAnalytics: 68,
        iotIntegration: 75,
        automation: 55,
        aiMl: 48,
        cloud: 65,
        skills: 70,
        customerInterface: 58,
        predictiveMaint: 62
      },
      initiatives: [
        {
          id: "mid-001",
          name: "Flow Sensor Network",
          status: "active",
          progress: 60,
          startDate: "2024-04-01",
          endDate: "2025-03-31",
          phase: "foundation",
          description: "Deploy flow monitoring sensors across pipeline network",
          impact: {
            efficiency: 28,
            costSavings: 3.8,
            safety: 45
          },
          technologies: ["IoT Sensors", "Real-time Monitoring"],
          team: "Midstream Digital Team",
          budget: 7.2
        },
        {
          id: "mid-002",
          name: "Pipeline Analytics Platform",
          status: "active",
          progress: 45,
          startDate: "2024-06-01",
          endDate: "2025-09-30",
          phase: "acceleration",
          description: "Advanced analytics for pipeline efficiency and leak detection",
          impact: {
            efficiency: 32,
            costSavings: 5.5,
            safety: 55
          },
          technologies: ["Cloud Analytics", "AI/ML", "Predictive Analytics"],
          team: "Midstream Digital Team",
          budget: 10.5
        }
      ],
      technologies: [
        { name: "IoT Sensors", status: "partial", adoptionDate: "2024-04-01" },
        { name: "Cloud Analytics", status: "partial", adoptionDate: "2024-06-01" },
        { name: "Digital Twin", status: "planned", adoptionDate: null },
        { name: "AI/ML Models", status: "planned", adoptionDate: null },
        { name: "Mobile Apps", status: "full", adoptionDate: "2023-11-01" },
        { name: "Automation", status: "partial", adoptionDate: "2024-05-01" },
        { name: "AR/VR", status: "none", adoptionDate: null },
        { name: "Blockchain", status: "planned", adoptionDate: null }
      ],
      roi: 150,
      keyMetrics: {
        efficiencyGain: 24,
        downtimeReduction: 28,
        safetyImprovement: 42,
        costReduction: 18
      }
    },

    recovery: {
      id: "recovery",
      name: "Recovery",
      digitalScore: 71,
      maturity: {
        dataAnalytics: 78,
        iotIntegration: 72,
        automation: 65,
        aiMl: 70,
        cloud: 75,
        skills: 68,
        customerInterface: 72,
        predictiveMaint: 75
      },
      initiatives: [
        {
          id: "rec-001",
          name: "Digital EOR Modeling",
          status: "active",
          progress: 72,
          startDate: "2023-09-01",
          endDate: "2024-12-31",
          phase: "acceleration",
          description: "Advanced digital modeling for enhanced oil recovery",
          impact: {
            efficiency: 38,
            costSavings: 7.2,
            safety: 20
          },
          technologies: ["Digital Twin", "AI/ML", "Cloud Computing"],
          team: "Recovery Digital Team",
          budget: 11.5
        },
        {
          id: "rec-002",
          name: "Smart Reservoir Management",
          status: "active",
          progress: 55,
          startDate: "2024-05-01",
          endDate: "2025-12-31",
          phase: "acceleration",
          description: "AI-driven reservoir optimization and production forecasting",
          impact: {
            efficiency: 42,
            costSavings: 9.8,
            safety: 25
          },
          technologies: ["AI/ML", "Predictive Analytics", "IoT"],
          team: "Recovery Digital Team",
          budget: 14.2
        }
      ],
      technologies: [
        { name: "IoT Sensors", status: "full", adoptionDate: "2023-09-01" },
        { name: "Cloud Analytics", status: "partial", adoptionDate: "2024-01-01" },
        { name: "Digital Twin", status: "partial", adoptionDate: "2023-09-01" },
        { name: "AI/ML Models", status: "partial", adoptionDate: "2024-05-01" },
        { name: "Mobile Apps", status: "partial", adoptionDate: "2024-02-01" },
        { name: "Automation", status: "planned", adoptionDate: null },
        { name: "AR/VR", status: "planned", adoptionDate: null },
        { name: "Blockchain", status: "none", adoptionDate: null }
      ],
      roi: 180,
      keyMetrics: {
        efficiencyGain: 32,
        downtimeReduction: 38,
        safetyImprovement: 35,
        costReduction: 28
      }
    },

    integratedSolutions: {
      id: "integratedSolutions",
      name: "Integrated Solutions",
      digitalScore: 88,
      maturity: {
        dataAnalytics: 92,
        iotIntegration: 85,
        automation: 90,
        aiMl: 82,
        cloud: 95,
        skills: 88,
        customerInterface: 92,
        predictiveMaint: 80
      },
      initiatives: [
        {
          id: "int-001",
          name: "Unified Digital Platform",
          status: "active",
          progress: 78,
          startDate: "2023-07-01",
          endDate: "2025-12-31",
          phase: "acceleration",
          description: "Integrated platform connecting all market segments",
          impact: {
            efficiency: 55,
            costSavings: 18.5,
            safety: 40
          },
          technologies: ["Cloud Platform", "APIs", "Data Lake", "AI/ML"],
          team: "Integrated Solutions Team",
          budget: 28.5
        },
        {
          id: "int-002",
          name: "Cross-Segment Data Integration",
          status: "active",
          progress: 82,
          startDate: "2023-10-01",
          endDate: "2025-03-31",
          phase: "acceleration",
          description: "Unified data architecture across all business segments",
          impact: {
            efficiency: 48,
            costSavings: 15.2,
            safety: 30
          },
          technologies: ["Data Lake", "ETL", "Cloud Platform"],
          team: "Integrated Solutions Team",
          budget: 22.8
        },
        {
          id: "int-003",
          name: "AI Insights Engine",
          status: "active",
          progress: 68,
          startDate: "2024-03-01",
          endDate: "2025-09-30",
          phase: "acceleration",
          description: "Centralized AI/ML platform for cross-segment insights",
          impact: {
            efficiency: 50,
            costSavings: 20.5,
            safety: 35
          },
          technologies: ["AI/ML", "Cloud Platform", "Real-time Analytics"],
          team: "Integrated Solutions Team",
          budget: 25.5
        }
      ],
      technologies: [
        { name: "IoT Sensors", status: "full", adoptionDate: "2023-07-01" },
        { name: "Cloud Analytics", status: "full", adoptionDate: "2023-07-01" },
        { name: "Digital Twin", status: "partial", adoptionDate: "2024-01-01" },
        { name: "AI/ML Models", status: "full", adoptionDate: "2024-03-01" },
        { name: "Mobile Apps", status: "full", adoptionDate: "2023-08-01" },
        { name: "Automation", status: "full", adoptionDate: "2024-01-01" },
        { name: "AR/VR", status: "partial", adoptionDate: "2024-04-01" },
        { name: "Blockchain", status: "planned", adoptionDate: null }
      ],
      roi: 245,
      keyMetrics: {
        efficiencyGain: 46,
        downtimeReduction: 48,
        safetyImprovement: 52,
        costReduction: 38
      }
    }
  },

  synergies: [
    { from: "offshore", to: "onshore", strength: 85, type: "data", description: "Shared sensor data platform and analytics infrastructure" },
    { from: "offshore", to: "integratedSolutions", strength: 92, type: "platform", description: "Offshore data feeds into unified platform" },
    { from: "onshore", to: "integratedSolutions", strength: 95, type: "platform", description: "Onshore operations fully integrated with central platform" },
    { from: "onshore", to: "midstream", strength: 71, type: "process", description: "Production data shared for pipeline optimization" },
    { from: "onshore", to: "recovery", strength: 88, type: "technology", description: "Shared AI/ML models and optimization techniques" },
    { from: "midstream", to: "integratedSolutions", strength: 82, type: "data", description: "Pipeline flow data integration" },
    { from: "midstream", to: "recovery", strength: 58, type: "data", description: "Limited data sharing for recovery planning" },
    { from: "recovery", to: "integratedSolutions", strength: 91, type: "platform", description: "EOR data and models integrated centrally" },
    { from: "recovery", to: "offshore", strength: 78, type: "technology", description: "Shared predictive maintenance technologies" },
    { from: "offshore", to: "midstream", strength: 62, type: "process", description: "Offshore production impacts pipeline operations" }
  ],

  roadmap: {
    phases: [
      {
        name: "Foundation",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        status: "in-progress",
        focus: ["Data Infrastructure", "IoT Deployment", "Training Programs"],
        initiatives: ["off-001", "on-001", "mid-001", "int-001", "int-002"],
        completionPercentage: 75
      },
      {
        name: "Acceleration",
        startDate: "2024-07-01",
        endDate: "2025-12-31",
        status: "in-progress",
        focus: ["AI/ML Integration", "Automation Rollout", "Cross-Segment Sync"],
        initiatives: ["off-002", "on-002", "on-003", "mid-002", "rec-001", "rec-002", "int-003"],
        completionPercentage: 55
      },
      {
        name: "Optimization",
        startDate: "2025-06-01",
        endDate: "2027-12-31",
        status: "planned",
        focus: ["Full Automation", "Predictive Systems", "Industry 4.0 Ready"],
        initiatives: ["off-003"],
        completionPercentage: 15
      }
    ],
    milestones: [
      { id: "m1", name: "IoT Infrastructure Complete", date: "2024-09-30", status: "completed", segment: "onshore" },
      { id: "m2", name: "Unified Platform Launch", date: "2024-12-31", status: "on-track", segment: "integratedSolutions" },
      { id: "m3", name: "AI Models Deployed", date: "2025-03-31", status: "on-track", segment: "onshore" },
      { id: "m4", name: "Digital Twin Operational", date: "2025-06-30", status: "planned", segment: "offshore" },
      { id: "m5", name: "Full Automation Achieved", date: "2026-12-31", status: "planned", segment: "all" }
    ]
  },

  technologyStack: {
    layers: {
      presentation: {
        name: "Presentation Layer",
        technologies: ["Dashboard Portal", "Mobile Apps", "Customer Portal", "AR/VR Interface", "Report Engine"],
        status: "deployed"
      },
      intelligence: {
        name: "Intelligence Layer",
        technologies: ["AI/ML Engine", "Predictive Analytics", "Digital Twin"],
        status: "in-development"
      },
      integration: {
        name: "Integration Layer",
        technologies: ["Offshore APIs", "Onshore APIs", "Midstream APIs", "Recovery APIs", "Integrated Solution APIs"],
        status: "deployed"
      },
      data: {
        name: "Data Layer",
        technologies: ["Data Lake", "Real-time Stream", "Historical Archive"],
        status: "deployed"
      },
      edge: {
        name: "Edge/IoT Layer",
        technologies: ["Sensors", "Controllers", "Gateways", "Edge Compute"],
        status: "deployed"
      }
    }
  },

  impactMetrics: {
    totalEfficiencyImprovement: 34,
    totalDowntimeReduction: 45,
    safetyIncidentReduction: 62,
    customerSatisfactionIncrease: 28,
    annualValueCreated: 125.5,
    totalInvestment: 180.2,
    overallROI: 215
  },

  valueBreakdown: {
    costSavings: {
      total: 68.5,
      automation: 22.5,
      predictiveMaint: 18.8,
      processOptimization: 15.2,
      resourceEfficiency: 12.0
    },
    revenueGrowth: {
      total: 42.2,
      newServices: 18.5,
      marketShare: 12.8,
      uptime: 6.5,
      customerRetention: 4.4
    },
    riskReduction: {
      total: 14.8,
      safety: 8.2,
      compliance: 4.2,
      environmental: 2.4
    }
  }
};
