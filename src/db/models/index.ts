import { Sequelize } from 'sequelize-typescript';

import User from './user';
import Session from './session';

const path = require('path');
const config = require(path.join(__dirname, '../../../sequelize.json'))[ process.env.NODE_ENV || 'dev' ];
export const sequelize = new Sequelize({
    ...config,
    modelPaths: [ path.join(__dirname, './*.model.ts') ]
});
sequelize.addModels([ User, Session ]);

export { User, Session };