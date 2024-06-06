import * as commonDefinitions from './common';
import { productDefinition, productCustomDefinition } from './product';
import { groupDefinition, groupCustomDefinition } from './group';
import { UploadFileSuccess } from './upload';
import { commentDefinitions, commentCustomDefinitions } from './comment';
import { orderDefinition, orderCustomDefinition } from './order';
import { cartDefinitions, cartCustomDefinitions } from './cart';
import { tagCustomDefinitions, tagDefinitions } from './tag';
import { ticketCustomDefinition, ticketDefinition } from './ticket';
import { userDefinition } from './user';

export const definitions = {
  ...commonDefinitions,
  UploadFileSuccess,
  ...productDefinition,
  ...groupDefinition,
  ...commentDefinitions,
  ...cartDefinitions,
  ...tagDefinitions,
  ...orderDefinition,
  ...ticketDefinition,
  ...userDefinition,
};

export const customDefinitions = {
  ...productCustomDefinition,
  ...commentCustomDefinitions,
  ...groupCustomDefinition,
  ...cartCustomDefinitions,
  ...tagCustomDefinitions,
  ...orderCustomDefinition,
  ...ticketCustomDefinition,
};
