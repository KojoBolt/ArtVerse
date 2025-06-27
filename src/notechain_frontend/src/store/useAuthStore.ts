import { create } from "zustand";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, ActorSubclass, Identity } from "@dfinity/agent";
// Import the generated service type
import type { _SERVICE as NoteCanisterService } from "../../../../src/declarations/note_canister/note_canister.did.d.ts";

// Determine canister ID and host based on environment
const CANISTER_ID_NOTE_CANISTER =
  process.env.CANISTER_ID_NOTE_CANISTER ||
  process.env.NOTE_CANISTER_CANISTER_ID;

const HOST =
  process.env.DFX_NETWORK === "ic"
    ? `https://${CANISTER_ID_NOTE_CANISTER}.icp0.io` // Production (ic network)
    : "http://127.0.0.1:4943"; // Local development

interface AuthState {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: string | null;
  authClient: AuthClient | null;
  noteCanisterActor: ActorSubclass<NoteCanisterService> | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
  createActor: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  identity: null,
  principal: null,
  authClient: null,
  noteCanisterActor: null,

  initAuth: async () => {
    const authClient = await AuthClient.create();
    set({ authClient });
    const isAuthenticated = await authClient.isAuthenticated();

    if (isAuthenticated) {
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal().toText();
      set({ isAuthenticated: true, identity, principal });
      get().createActor(); // Create actor after identity is confirmed
    }
  },

  login: async () => {
    const { authClient } = get();
    if (!authClient) {
      console.error("AuthClient not initialized");
      // Potentially initialize it here or throw an error
      await get().initAuth(); // try to initialize again
      if (!get().authClient) return; // if still not initialized, exit
    }

    await new Promise<void>((resolve, reject) => {
      get().authClient!.login({
        identityProvider:
          process.env.DFX_NETWORK === "ic"
            ? "https://identity.ic0.app"
            : `http://127.0.0.1:4943?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`, // Adjust for local II canister if needed
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
        onSuccess: async () => {
          const identity = get().authClient!.getIdentity();
          const principal = identity.getPrincipal().toText();
          set({ isAuthenticated: true, identity, principal });
          get().createActor();
          resolve();
        },
        onError: (err) => {
          console.error("Login failed:", err);
          reject(err);
        },
      });
    });
  },

  logout: async () => {
    const { authClient } = get();
    if (authClient) {
      await authClient.logout();
      set({
        isAuthenticated: false,
        identity: null,
        principal: null,
        noteCanisterActor: null,
      });
    }
  },

  // Helper to create an actor with the current identity
  createActor: () => {
    const { identity } = get();
    if (!identity || !CANISTER_ID_NOTE_CANISTER) {
      console.warn("Cannot create actor: identity or canister ID missing.");
      set({ noteCanisterActor: null }); // Clear actor if identity is lost
      return;
    }

    // Dynamically import the service definition (declarations)
    // This relies on Vite's capability to handle dynamic imports and dfx generating the files.
    import(`declarations/note_canister`)
      .then(async (module) => {
        if (!module || !module.idlFactory) {
          console.error(
            "Failed to load idlFactory from declarations/note_canister"
          );
          return;
        }
        const { HttpAgent } = await import("@dfinity/agent");
        const actor = Actor.createActor<NoteCanisterService>(
          module.idlFactory,
          {
            agent: new HttpAgent({
              identity,
              host: HOST,
            }),
            canisterId: CANISTER_ID_NOTE_CANISTER,
          }
        );
        set({ noteCanisterActor: actor });
      })
      .catch((err) => {
        console.error("Error creating actor:", err);
        set({ noteCanisterActor: null });
      });
  },
}));

// Initialize auth state when the store is first imported/used
useAuthStore.getState().initAuth();
