import {Realm} from '@realm/react';


export class ProfileTest {
  static schema = {
    name: 'Profile',
    properties: {
      _id: 'objectId',
      name: 'string',
      age: 'int',
      email: 'string',
    },
    primaryKey: '_id',  // Primary key for the Profile model
  };
}