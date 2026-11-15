export interface CustomerEvaluationMetric {
  id: string;
  name: string;
  score: number; // 0 - 100
  weight: number;
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  analysis: string;
}

export interface CustomerEvaluation {
  customerId: string;
  evaluatedAt: string;
  lastCallId?: string;
  overallHealthScore: number; // 0 - 100
  purchasePropensityScore: number; // 0 - 100
  churnRiskScore: number; // 0 - 100
  urgencyLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  budgetReadiness: 'Budget Approved' | 'Evaluating Alternatives' | 'Price Sensitive' | 'Under Review';
  satisfactionRating: number; // 1 - 5 stars
  needsAssessment: {
    coreNeeds: string[];
    technicalBlockers: string[];
    unmetExpectations: string[];
  };
  metrics: CustomerEvaluationMetric[];
  behavioralSignals: {
    sentimentTrend: 'Improving' | 'Stable' | 'Declining';
    engagementFrequency: 'Frequent' | 'Regular' | 'Infrequent' | 'At Risk';
    competitorMentioned?: string;
    decisionTimeline: string;
  };
  recommendedNextActions: string[];
  aiExecutiveSummary: string;
}

export interface Customer {
  id: string;
  phone: string;
  name: string;
  company: string;
  email: string;
  needs: string[];
  purchaseWillingness: number; // 0 - 100
  effortTier: 'T1' | 'T2' | 'T3'; // T1: High priority, T3: Low priority
  tags: string[];
  totalCalls: number;
  lastCallDate: string;
  notes: string;
  evaluation?: CustomerEvaluation;
}

export interface Staff {
  id: string;
  name: string;
  extension: string;
  department: string;
  avatar: string;
  status: 'available' | 'on_call' | 'wrap_up' | 'offline';
  avgScore: number;
  totalCallsHandled: number;
  avgHandleTimeSec: number;
  strengths: string[];
  coachingPoints: string[];
  tags: string[];
}

export interface DiarizedWord {
  word: string;
  start: number; // in seconds
  end: number;
  confidence: number;
}

export interface DiarizedTurn {
  speaker: 'Staff' | 'Customer';
  startTime: number;
  endTime: number;
  text: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  words?: DiarizedWord[];
}

export interface StaffEvaluationCriteriaScore {
  criterionId: string;
  name: string;
  score: number; // 1-100
  weight: number;
  feedback: string;
}

export interface CallAnalysis {
  brief: string;
  keyPoints: string[];
  detectedSentiment: 'Very Positive' | 'Positive' | 'Neutral' | 'Skeptical' | 'Frustrated';
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  customerNeedsIdentified: string[];
  customerPurchaseWillingness: number; // 0 - 100
  customerEffortTier: 'T1' | 'T2' | 'T3';
  staffPerformanceScores: StaffEvaluationCriteriaScore[];
  overallStaffScore: number;
  coachingNotes: string;
  extractedTags: {
    customerTags: string[];
    staffTags: string[];
  };
}

export interface FollowUpTask {
  id: string;
  callId: string;
  customerId: string;
  customerName: string;
  assignedStaffId: string;
  staffName: string;
  title: string;
  description: string;
  dueTime: string; // ISO date-time
  deadline: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
}

export interface CallRecord {
  id: string;
  direction: 'inbound' | 'outbound';
  startTime: string;
  endTime: string;
  durationSec: number;
  staffId: string;
  customerId: string;
  customerPhone: string;
  customerName: string;
  status: 'ringing' | 'in_progress' | 'completed' | 'analyzing';
  audioUrl?: string;
  diarizedTurns: DiarizedTurn[];
  analysis?: CallAnalysis;
  tasksCreated: FollowUpTask[];
}

export interface AdminRubric {
  id: string;
  name: string;
  category: 'Staff Performance' | 'Customer Intent' | 'Urgency Rules';
  weight: number;
  description: string;
  targetExpectation: string;
}

export interface AdminTagRule {
  tag: string;
  category: 'Customer' | 'Staff';
  conditionSummary: string;
  color: string;
}
