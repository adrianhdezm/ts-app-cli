export interface ProgramArgs {
  help: boolean;
  name: string;
  version: boolean;
  template: string;
}

export type StepAction = () => Promise<void>;

export interface Step {
  name: string;
  messages: {
    active: string;
    completed: string;
    error: string;
  };
  action: StepAction;
}

export interface StepStateSchema {
  states: {
    active: {};
    completed: {};
  };
}
export interface CLIStateSchema {
  states: Record<string, {} | StepStateSchema>;
}

export interface CLIContext {
  completed: string[];
  error?: string;
}

export type CLIEvent = { type: 'START' };
