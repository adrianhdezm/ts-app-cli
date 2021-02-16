export interface ProgramArgs {
  help: boolean;
  name: string;
  version: boolean;
  template: string;
}

export interface CliMachineContext {
  name: string;
  template: string;
  path: string;
  error: Error | null;
  currentStepMessage: string | null;
  completedStepMessages: string[];
}

export type CliMachineEvent = { type: 'START' } | { type: 'SHOW_HELP' } | { type: 'SHOW_VERSION' };
export interface ValidationErrorEvent {
  type: string;
  data: Error;
}
