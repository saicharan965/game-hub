import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'snake_master',
  exposes: {
    './Module': 'apps/games/snake_master/src/app/remote-entry/entry.module.ts',
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
