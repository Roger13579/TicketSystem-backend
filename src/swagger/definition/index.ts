import * as commonDefinitions from './common';
import {
  CreateGroupSuccess,
  CustomCreateGroupObj,
  CustomJoinGroupObj,
  CustomUpdateGroupObj,
} from './group/group';
import { CustomCreateOrderObj } from './order/custom';
import { productDefinition, productCustomDefinition } from './product';
import { groupDefinition, groupCustomDefinition } from './group';
import { UploadFileSuccess } from './upload';
import { commentDefinitions, commentCustomDefinitions } from './comment';

import { cartDefinitions, cartCustomDefinitions } from './cart';

export const definitions = {
  ...commonDefinitions,
  CreateGroupSuccess,
  UploadFileSuccess,
  ...productDefinition,
  ...groupDefinition,
  ...commentDefinitions,
  ...cartDefinitions,
};

export const customDefinitions = {
  ...productCustomDefinition,
  CustomCreateGroupObj,
  CustomCreateOrderObj,
  CustomUpdateGroupObj,
  CustomJoinGroupObj,
  ...commentCustomDefinitions,
  ...groupCustomDefinition,
  ...cartCustomDefinitions,
};
