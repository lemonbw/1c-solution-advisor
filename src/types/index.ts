export interface Config1C {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  targetCompanies: string[];
  businessTasks: string[];
  keyFeatures: string[];
  limitations: string[];
  requiredFeatures?: string[];
  conflictsWith?: string[];
  complementsWith?: string[];
  kZRelevant: boolean;
  notes: string;
}

export interface Question {
  id: string;
  block: string;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options?: QuestionOption[];
  required: boolean;
  showIf?: (answers: Record<string, any>) => boolean;
  skipable?: boolean;
}

export interface QuestionOption {
  value: string;
  label: string;
  triggers?: string[];
}

export interface Answer {
  questionId: string;
  value: string | string[];
  textValue?: string;
}

export interface Rule {
  id: string;
  description: string;
  condition: (answers: Record<string, any>) => boolean;
  effect: RuleEffect;
}

export interface RuleEffect {
  addScore?: Record<string, number>;
  require?: Record<string, string[]>;
  forbid?: Record<string, string[]>;
  bonus?: Record<string, number>;
  penalty?: Record<string, number>;
}

export interface ConfigScore {
  configId: string;
  score: number;
  reasons: string[];
  penalties: string[];
  missingRequirements: string[];
  confidence: number;
}

export interface RecommendationResult {
  primary: ConfigScore[];
  additional: ConfigScore[];
  alternatives: ConfigScore[];
  explanation: string;
  needsCombination: boolean;
  combinationReason?: string;
  insufficientData: boolean;
  dataGaps: string[];
  toClarify: string[];
}
