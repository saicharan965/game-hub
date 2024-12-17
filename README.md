# Nx Workspace Setup for Game Hub

This guide outlines the steps to set up and manage the Game Hub application using Nx microfrontend architecture. Follow the commands below to create and configure the workspace.

## Setup Steps

### 1. Create a New Nx Workspace

Initialize a new Nx workspace named `Game-hub` with the `apps` preset:

```bash
npx create-nx-workspace@latest Game-hub --preset=apps
```

### 2. Add Angular Support

Integrate Angular into the Nx workspace by running:

```bash
npx nx add @nx/angular
```

### 3. Generate Applications and Libraries

#### 3.1 Create the Shell Application

Generate the host shell application for the Game Hub:

```bash
nx g @nx/angular:host apps/shells/game-hub-shell --prefix=Game-hub --dryRun
```

> Use the `--dryRun` flag to preview the changes. Remove this flag to apply them.

#### 3.2 Create a Remote Application

Add a remote microfrontend (e.g., Snake Master game) to the workspace:

```bash
nx g @nx/angular:remote apps/games/snake-master --prefix=Game-hub --host=game-hub-shell --dryRun
```

#### 3.3 Create a Shared Domain Logic Library

Generate a library for shared domain logic:

```bash
nx g @nx/angular:lib libs/shared/domain-logic --dryRun
```

#### 3.4 Create a Feature Library

Develop a feature-specific library for the Snake Master game:

```bash
nx g @nx/angular:lib libs/games/snake_master/feature-snake-master --dryRun
```

### 4. Serve the Applications

Run the shell and its associated remote application simultaneously:

```bash
nx serve game-hub-shell --devRemotes=snake_master
```

## Additional Notes

- **Dry Run Mode**: The `--dryRun` flag previews changes without applying them. Remove the flag when ready to implement changes.
- **Nx Documentation**: For advanced configurations and details, visit the [Nx documentation](https://nx.dev).
- **Microfrontend Architecture**: This setup leverages Nx’s module federation for efficient communication between the shell and remote applications.

Enjoy building your Game Hub!

