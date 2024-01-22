import type MigrationManager from '../migratorManager';
import migrateProps from './prop';
import migratePropSyncs from './propSync';
import migrateModels from './model';
import migrateModelSyncs from './modelSync';
import migrateRefs from './ref';
import migrateWatchers from './watch';
import migrateEmitters from './emit';

export default (migrationManager: MigrationManager) => {
  migrateProps(migrationManager);
  migratePropSyncs(migrationManager);
  migrateModels(migrationManager);
  migrateModelSyncs(migrationManager);
  migrateRefs(migrationManager);
  migrateWatchers(migrationManager);
  migrateEmitters(migrationManager);
};

export const supportedDecorators = [
  'Prop',
  'PropSync',
  'Ref',
  'Model',
  'ModelSync',
  'Watch',
  'Emit',
]; // Class Property decorators
