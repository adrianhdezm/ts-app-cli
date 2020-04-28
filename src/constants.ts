import path from 'path';

export const CLI_ROOT_PATH = path.join(__dirname, '..');
export const TEMPLATES_PATH = path.join(CLI_ROOT_PATH, 'templates');
export const PKG_JSON_PATH = path.join(CLI_ROOT_PATH, 'package.json');

export const MANIFEST_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Template Manifest Schema',
  additionalProperties: false,
  required: ['name', 'files', 'scripts', 'dependencies'],
  properties: {
    name: {
      $id: '#/properties/name',
      type: 'string'
    },
    description: {
      $id: '#/properties/description',
      type: 'string'
    },
    basePath: {
      $id: '#/properties/basePath',
      type: 'string'
    },
    files: {
      $id: '#/properties/files',
      type: 'array',
      additionalItems: false,
      items: {
        $id: '#/properties/files/items',
        type: 'string'
      }
    },
    scripts: {
      $id: '#/properties/scripts',
      type: 'object',
      additionalProperties: { type: 'string' }
    },
    dependencies: {
      $id: '#/properties/dependencies',
      type: 'object',
      additionalProperties: false,
      required: ['prod', 'dev'],
      properties: {
        prod: {
          $id: '#/properties/dependencies/properties/prod',
          type: 'array',
          additionalItems: false,
          items: {
            $id: '#/properties/dependencies/properties/prod/items',
            type: 'string'
          }
        },
        dev: {
          $id: '#/properties/dependencies/properties/dev',
          type: 'array',
          additionalItems: false,
          items: {
            $id: '#/properties/dependencies/properties/dev/items',
            type: 'string'
          }
        }
      }
    }
  }
};
