import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { execSync } from 'child_process';

// Function to get canister IDs
function getCanisterIds() {
  try {
    const localCanisters = JSON.parse(execSync('dfx canister id --json', { encoding: 'utf-8', stdio: 'pipe' }));
    return Object.entries(localCanisters).reduce((acc, [name, ids]) => {
      acc[`process.env.CANISTER_ID_${name.toUpperCase()}`] = JSON.stringify((ids as any).local);
      return acc;
    }, {});
  } catch (e) {
    console.warn('Failed to get canister IDs for local development:', e);
    return {}; // Fallback for environments where dfx is not available or canisters are not deployed
  }
}

const canisterIds = getCanisterIds();

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'src', 'notechain_frontend'),
  build: {
    outDir: path.resolve(__dirname, 'dist', 'notechain_frontend'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src', 'notechain_frontend', 'src'),
      'declarations': path.resolve(__dirname, '.dfx', 'local', 'canisters'), // Adjust if canisters are deployed to a different network
    },
  },
  define: {
    // Pass canister IDs to the frontend
    ...canisterIds,
    'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK || 'local'),
    // Add other environment variables if needed
  },
  server: {
    port: 3000, // Vite dev server port
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943', // Default port for local dfx replica
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Ensure /api prefix is maintained if needed by ICP agent
      },
    },
  },
});
