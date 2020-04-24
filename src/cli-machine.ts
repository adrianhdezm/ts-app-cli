import { Machine, assign, EventData } from 'xstate';
import { Step, CLIContext, CLIStateSchema, CLIEvent } from './types';

export const cliMachineTemplate = (steps: Step[]) => {
  return Machine<CLIContext, CLIStateSchema, CLIEvent>({
    id: 'CLI',
    initial: 'idle',
    context: {
      completed: [],
      error: undefined
    },
    states: {
      idle: {
        on: { START: steps[0].name }
      },
      ...steps.reduce<Record<string, object>>((stepStates, step, index) => {
        stepStates[step.name] = {
          initial: 'active',
          states: {
            active: {
              invoke: {
                src: step.name,
                onError: {
                  target: '#CLI.error',
                  actions: assign({ error: (context, event: EventData) => event.data })
                },
                onDone: {
                  target: `#CLI.${step.name}.completed`,
                  actions: assign({
                    completed: (context: CLIContext) => [...context.completed, step.name]
                  })
                }
              }
            },
            completed: { type: 'final' }
          },
          onDone: steps.length - 1 === index ? 'completed' : steps[index + 1].name
        };
        return stepStates;
      }, {}),
      completed: { type: 'final' },
      error: { type: 'final' }
    }
  });
};
