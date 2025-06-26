# NoteChain - Decentralized Note-Taking DApp

NoteChain is a decentralized note-taking application built on the Internet Computer Protocol (ICP). It allows users to create, store, and share short text notes securely on-chain, leveraging ICP's strengths like Internet Identity for authentication and on-chain storage for data permanence and privacy.

This project was developed as a prototype, focusing on core functionality and a polished user interface within a limited timeframe (e.g., for a hackathon).

## Features

- **Secure Authentication**: Uses Internet Identity for seamless and secure user login.
- **On-Chain Note Storage**: Notes (title and content) are stored directly on the ICP blockchain in a Rust-based canister.
- **Create & View Notes**: Authenticated users can create new notes and view their existing notes.
- **Note Sharing**: Notes can be shared via unique, ICP-hosted links (e.g., `https://<canister-id>.icp0.io/note/<note-id>`).
- **Privacy & Permanence**: Aims to solve the problem of data privacy and loss associated with centralized note-taking apps.
- **Responsive UI**: A clean, dark-themed interface styled with Tailwind CSS.
- **Efficient State Management**: Uses Zustand for frontend state management in React.

## Tech Stack

- **Backend**: Rust
  - Smart Contract / Canister Logic
  - `ic-cdk` for Internet Computer development
- **Frontend**: React (with TypeScript)
  - `vite` for frontend tooling
  - Tailwind CSS for styling
  - Zustand for state management
  - `@dfinity/auth-client` for Internet Identity integration
  - `react-router-dom` for routing
- **Deployment**: `dfx` (DFINITY Canister SDK)

## Project Structure

```
NoteChain/
├── .dfx/                     # DFINITY local canister execution environment
├── dist/                     # Frontend build output
├── node_modules/             # Frontend dependencies
├── src/
│   ├── note_canister/        # Backend Rust canister
│   │   ├── src/lib.rs        # Canister implementation
│   │   ├── Cargo.toml
│   │   └── note_canister.did # Candid interface (auto-generated)
│   └── notechain_frontend/   # Frontend React application
│       ├── src/              # Main frontend source code
│       │   ├── components/   # React components
│       │   ├── store/        # Zustand stores (auth, notes)
│       │   ├── App.tsx       # Main App component with routing
│       │   ├── main.tsx      # React entry point
│       │   └── index.css     # Tailwind global styles
│       ├── index.html        # Main HTML file for React app
│       └── ...
├── dfx.json                  # DFINITY project configuration
├── package.json              # Frontend npm package configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [DFINITY Canister SDK (`dfx`)](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (version specified in `dfx.json`, e.g., 0.15.1 or as per your setup)
- [Rust](https://www.rust-lang.org/tools/install) and `cargo`

### Installation & Local Development

1.  **Clone the repository (if applicable) or ensure you are in the project root `NoteChain/`.**

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Start the local DFINITY replica:**
    Open a new terminal window/tab in the `NoteChain/` directory and run:
    ```bash
    dfx start --background --clean
    ```
    This starts a local, clean instance of the Internet Computer execution environment.

4.  **Deploy the canisters:**
    In another terminal window/tab in the `NoteChain/` directory, run:
    ```bash
    dfx deploy
    ```
    This command will:
    - Compile the Rust backend canister (`note_canister`).
    - Generate Candid interfaces.
    - Deploy `note_canister` to the local replica.
    - Build the React frontend application (`notechain_frontend`).
    - Deploy the frontend assets to the local replica.
    It will output the canister IDs and URLs.

5.  **Access the DApp:**
    Open the URL for the `notechain_frontend` canister in your browser. It will typically be something like:
    `http://<notechain_frontend_canister_id>.localhost:8000`
    (The port might vary based on your `dfx.json` configuration, default is 8000 if not specified otherwise or if 8000 is taken).

### Frontend Development Server (Optional, for hot reloading)

After the initial `dfx deploy` (which makes canister IDs available), you can run the Vite development server for a better frontend development experience with hot reloading:

1.  Ensure `dfx` replica is running (from step 3 above).
2.  Ensure canisters have been deployed at least once (step 4).
3.  Run the Vite dev server:
    ```bash
    npm run dev
    ```
    This will typically start the frontend on `http://localhost:3000` (or another port if 3000 is busy). API requests will be proxied to the `dfx` replica based on `vite.config.ts`.

### Running Backend Tests

To run the Rust unit tests for the backend canister:
```bash
cd src/note_canister
cargo test
```
Or from the project root:
```bash
cargo test --manifest-path src/note_canister/Cargo.toml
```
Note: Some tests requiring specific IC environment features like distinct caller identities might be limited in the `cargo test` environment and are better tested via end-to-end deployment.

## Deployment to ICP Mainnet

1.  **Ensure you have an identity with cycles:**
    ```bash
    dfx identity whoami
    dfx identity get-wallet --network ic
    ```
    If you need to create a new identity or top up cycles, refer to DFINITY documentation.

2.  **Deploy to the IC:**
    ```bash
    dfx deploy --network ic
    ```
    This will create and deploy your canisters on the mainnet. You will need cycles in your wallet canister for this.

## Storage and Cycle Costs

- NoteChain is designed to be cycle-efficient for storage by limiting note sizes (title + content < 1KB).
- Storage on ICP costs approximately 5 SDR per GB per year.
- Users do not pay gas fees directly; cycle costs are covered by the canister (developer/owner).

## Hackathon Goals Checklist

- [x] Showcase ICP’s on-chain storage (Notes stored in Rust canister).
- [x] Showcase Internet Identity (Integrated via `@dfinity/auth-client`).
- [x] Showcase low-cost transactions (Reverse gas model, small data per note).
- [x] Deliver a simple, functional prototype.
- [x] Deliver a sleek UI (Dark theme with Tailwind CSS).
- [x] Highlight privacy (Data on-chain, user-owned via Principal).
- [x] Highlight ease of use (Simple note creation and viewing).
- [x] Highlight shareability (Public links to notes).

## Further Development Ideas

- Rich text editing for notes.
- Note organization (folders, tags).
- Encrypted notes for enhanced privacy (e.g., using user-derived keys).
- Full-text search within user's notes.
- UI for managing canister cycles.
- More comprehensive automated testing (frontend unit/integration tests, backend integration tests with PocketIC).
```
