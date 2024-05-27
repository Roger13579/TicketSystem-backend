import { customTag } from './general';

const propName = {
  name: '標籤名稱',
};

export const CustomTagNameQuery = {
  example: '好棒的標籤',
};

export const CustomCreateTagObj = {
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      description: propName.name,
      example: customTag.$name,
    },
  },
};
