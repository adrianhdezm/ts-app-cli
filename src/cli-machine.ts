import { assign, createMachine } from 'xstate';

import {
  bootstrapProject,
  copyTemplateFiles,
  generatePackageJSONfile,
  initializeGitRepository,
  installPackageDependencies,
  validateProjectName,
  validateProjectPath,
  validateTemplate
} from './services';
import { CliMachineContext, CliMachineEvent, ValidationErrorEvent } from './types';

export const cliMachine = createMachine<CliMachineContext, CliMachineEvent>(
  {
    id: 'CLI',
    initial: 'idle',
    context: {
      name: '',
      template: '',
      path: '',
      error: null,
      currentStepMessage: null,
      completedStepMessages: []
    },
    states: {
      idle: {
        on: {
          START: 'executing',
          SHOW_HELP: 'help',
          SHOW_VERSION: 'version'
        }
      },
      help: {
        type: 'final'
      },
      version: {
        type: 'final'
      },
      executing: {
        initial: 'validateProjectName',
        states: {
          validateProjectName: {
            entry: assign<CliMachineContext>({
              currentStepMessage: (context) => `Checking the project name: "${context.name}"`
            }),
            invoke: {
              src: 'validateProjectName',
              onDone: {
                actions: assign<CliMachineContext>({
                  completedStepMessages: (context) => [
                    ...context.completedStepMessages,
                    `Project name: "${context.name}" is valid`
                  ]
                }),
                target: 'validateTemplate'
              },
              onError: {
                actions: assign<CliMachineContext, ValidationErrorEvent>({
                  error: (_, event) => event.data
                }),
                target: 'failed'
              }
            }
          },
          validateTemplate: {
            entry: assign<CliMachineContext>({
              currentStepMessage: (context) => `Checking the template: "${context.template}"`
            }),
            invoke: {
              src: 'validateTemplate',
              onDone: {
                actions: assign<CliMachineContext>({
                  completedStepMessages: (context) => [
                    ...context.completedStepMessages,
                    `Template: "${context.template}" is valid`
                  ]
                }),
                target: 'validateProjectPath'
              },
              onError: {
                actions: assign<CliMachineContext, ValidationErrorEvent>({
                  error: (_, event) => event.data
                }),
                target: 'failed'
              }
            }
          },
          validateProjectPath: {
            entry: assign<CliMachineContext>({
              currentStepMessage: (context) => `Checking the project path: "${context.path}"`
            }),
            invoke: {
              src: 'validateProjectPath',
              onDone: {
                actions: assign<CliMachineContext>({
                  completedStepMessages: (context) => [
                    ...context.completedStepMessages,
                    `Project path: "${context.path}" is valid`
                  ]
                }),
                target: 'bootstrapProject'
              },
              onError: {
                actions: assign<CliMachineContext, ValidationErrorEvent>({
                  error: (_, event) => event.data
                }),
                target: 'failed'
              }
            }
          },
          bootstrapProject: {
            entry: assign<CliMachineContext>({
              currentStepMessage: (context) => `Creating a new project in "${context.path}"`
            }),
            invoke: {
              src: 'bootstrapProject',
              onDone: {
                actions: assign<CliMachineContext>({
                  completedStepMessages: (context) => [
                    ...context.completedStepMessages,
                    `The project was initialized in "${context.path}"`
                  ]
                }),
                target: 'generatePackageJSONfile'
              },
              onError: {
                actions: assign<CliMachineContext, ValidationErrorEvent>({
                  error: (_, event) => event.data
                }),
                target: 'failed'
              }
            }
          },
          generatePackageJSONfile: {
            entry: assign<CliMachineContext>({
              currentStepMessage: (context) => `Generating the package.json for "${context.template}" template`
            }),
            invoke: {
              src: 'generatePackageJSONfile',
              onDone: {
                actions: assign<CliMachineContext>({
                  completedStepMessages: (context) => [
                    ...context.completedStepMessages,
                    `The package.json for "${context.template}" template was generated`
                  ]
                }),
                target: 'copyTemplateFiles'
              },
              onError: {
                actions: assign<CliMachineContext, ValidationErrorEvent>({
                  error: (_, event) => event.data
                }),
                target: 'failed'
              }
            }
          },
          copyTemplateFiles: {
            entry: assign<CliMachineContext>({
              currentStepMessage: (context) => `Copying files from template "${context.template}" to "${context.path}"`
            }),
            invoke: {
              src: 'copyTemplateFiles',
              onDone: {
                actions: assign<CliMachineContext>({
                  completedStepMessages: (context) => [
                    ...context.completedStepMessages,
                    `The files from "${context.template}" template were copied to "${context.path}"`
                  ]
                }),
                target: 'installPackageDependencies'
              },
              onError: {
                actions: assign<CliMachineContext, ValidationErrorEvent>({
                  error: (_, event) => event.data
                }),
                target: 'failed'
              }
            }
          },
          installPackageDependencies: {
            entry: assign<CliMachineContext>({
              currentStepMessage: (context) => `Installing packages for "${context.template}" template`
            }),
            invoke: {
              src: 'installPackageDependencies',
              onDone: {
                actions: assign<CliMachineContext>({
                  completedStepMessages: (context) => [
                    ...context.completedStepMessages,
                    `The "${context.template}" template packages were installed`
                  ]
                }),
                target: 'initializeGitRepository'
              },
              onError: {
                actions: assign<CliMachineContext, ValidationErrorEvent>({
                  error: (_, event) => event.data
                }),
                target: 'failed'
              }
            }
          },
          initializeGitRepository: {
            entry: assign<CliMachineContext>({
              currentStepMessage: (context) => `Initializing a git repository in "${context.path}"`
            }),
            invoke: {
              src: 'initializeGitRepository',
              onDone: {
                actions: assign<CliMachineContext>({
                  completedStepMessages: (context) => [
                    ...context.completedStepMessages,
                    `The git repository in "${context.path}" was initialized`
                  ]
                }),
                target: 'completed'
              },
              onError: {
                actions: assign<CliMachineContext, ValidationErrorEvent>({
                  error: (_, event) => event.data
                }),
                target: 'failed'
              }
            }
          },
          completed: {
            entry: assign<CliMachineContext>({
              currentStepMessage: null
            }),
            type: 'final'
          },
          failed: { type: 'final' }
        },
        onDone: [{ target: 'error', cond: 'hasError' }, { target: 'success' }]
      },
      error: {
        type: 'final'
      },
      success: {
        type: 'final'
      }
    }
  },
  {
    guards: {
      hasError: ({ error }) => error !== null
    },
    services: {
      validateProjectName: ({ name }) => validateProjectName(name),
      validateTemplate: ({ template }) => validateTemplate(template),
      validateProjectPath: ({ path }) => validateProjectPath(path),
      bootstrapProject: ({ path }) => bootstrapProject(path),
      generatePackageJSONfile: ({ name, template, path }) => generatePackageJSONfile(name, template, path),
      copyTemplateFiles: ({ template, path }) => copyTemplateFiles(template, path),
      installPackageDependencies: ({ template, path }) => installPackageDependencies(template, path),
      initializeGitRepository: ({ path }) => initializeGitRepository(path)
    }
  }
);
