import { config, list } from '@keystone-6/core';
import {
  // Scalar types
  checkbox,
  integer,
  json,
  float,
  password,
  select,
  text,
  timestamp,

  // Relationship type
  relationship,

  // Virtual type
  virtual,

  // File types
  file,
  image,
} from '@keystone-6/core/fields';

// Complex types
import { document } from '@keystone-6/fields-document';
import { cloudinaryImage } from '@keystone-6/cloudinary';


export const permissionFields = {
  canManageProducts: checkbox({
    defaultValue: false,
    label: 'User can Update and delete any product',
  }),
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: 'User can query other users',
  }),
  canManageUsers: checkbox({
    defaultValue: false,
    label: 'User can Edit other users',
  }),
  canManageRoles: checkbox({
    defaultValue: false,
    label: 'User can CRUD roles',
  }),
  canManageCart: checkbox({
    defaultValue: false,
    label: 'User can see and manage cart and cart items',
  }),
  canManageOrders: checkbox({
    defaultValue: false,
    label: 'User can see and manage orders',
  }),
};

export type Permission = keyof typeof permissionFields;

export const permissionsList: Permission[] = Object.keys(
  permissionFields
) as Permission[];