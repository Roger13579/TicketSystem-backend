import * as commonDefinitions from './common';
import {
  CreateGroupSuccess,
  CustomCreateGroupObj,
  CustomJoinGroupObj,
  CustomUpdateGroupObj,
} from './group';
import { productDefinition, productCustomDefinition } from './product';
import { UploadFileSuccess } from './upload';
import { commentDefinitions, commentCustomDefinitions } from './comment';

export const definitions = {
  ...commonDefinitions,
  CreateGroupSuccess,
  UploadFileSuccess,
  ...productDefinition,
  ...commentDefinitions,
};

export const customDefinitions = {
  ...productCustomDefinition,
  CustomCreateGroupObj,
  CustomUpdateGroupObj,
  CustomJoinGroupObj,
  ...commentCustomDefinitions,
};
