export type ProcessStep = {
  titleKey: string;
  descKey: string;
  icon: string;
  number: number;
};

export const processSteps: ProcessStep[] = [
  {
    titleKey: "step_initial_title",
    descKey: "step_initial_desc",
    icon: "/icon/mainicons1/transparent101.png",
    number: 1,
  },
  {
    titleKey: "step_strategy_title",
    descKey: "step_strategy_desc",
    icon: "/icon/mainicons1/stragies&planning1.png",
    number: 2,
  },
  {
    titleKey: "step_execution_title",
    descKey: "step_execution_desc",
    icon: "/icon/mainicons1/execution10.png",
    number: 3,
  },
  {
    titleKey: "step_analysis_title",
    descKey: "step_analysis_desc",
    icon: "/icon/update/reporting3.png",
    number: 4,
  },
];

export type ProcessPhase = {
  phaseKey: string;
  detailsKey: string;
};

export const processPhases: ProcessPhase[] = [
  { phaseKey: "discoveryConsultation", detailsKey: "discoveryDetails" },
  { phaseKey: "strategyDevelopment", detailsKey: "strategyDetails" },
  { phaseKey: "implementationExecution", detailsKey: "implementationDetails" },
  { phaseKey: "analysisOptimization", detailsKey: "analysisDetails" },
];

export type ProcessFeature = {
  icon: string;
  titleKey: string;
  descKey: string;
};

export const processFeatures: ProcessFeature[] = [
  {
    icon: "/icon/mainicons1/stragies&planning1.png",
    titleKey: "strategicFoundation",
    descKey: "strategicFoundationDesc",
  },
  {
    icon: "/icon/mainicons1/datadrive1.png",
    titleKey: "continuousMonitoring",
    descKey: "continuousMonitoringDesc",
  },
  {
    icon: "/icon/mainicons1/transparent10.png",
    titleKey: "measurableResults",
    descKey: "measurableResultsDesc",
  },
  {
    icon: "/icon/mainicons1/transparent101.png",
    titleKey: "transparentCommunication",
    descKey: "transparentCommunicationDesc",
  },
];