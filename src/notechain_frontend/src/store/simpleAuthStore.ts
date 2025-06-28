import { create } from "zustand";
import { Actor, HttpAgent, AnonymousIdentity } from "@dfinity/agent";
import type { _SERVICE as NoteCanisterService } from "../../../../src/declarations/note_canister/note_canister.did.d.ts";

// Hardcoded canister IDs - no environment variable issues
const CANISTER_ID_NOTE_CANISTER = "bd3sg-teaaa-aaaaa-qaaba-cai";
const HOST = "http://127.0.0.1:4943";

// IDL Factory - defined directly to avoid import issues
const idlFactory = ({ IDL }: any) => {
  const Note = IDL.Record({
    id: IDL.Nat64,
    title: IDL.Text,
    content: IDL.Text,
    owner: IDL.Principal,
    created_at: IDL.Nat64,
  });
  const Result = IDL.Variant({ Ok: IDL.Nat64, Err: IDL.Text });
  return IDL.Service({
    create_note: IDL.Func([IDL.Text, IDL.Text], [Result], []),
    get_note_by_id: IDL.Func([IDL.Nat64], [IDL.Opt(Note)], ["query"]),
    get_notes: IDL.Func([], [IDL.Vec(Note)], ["query"]),
  });
};

interface AuthState {
  isAuthenticated: boolean;
  userType: "guest" | "anonymous" | null;
  principal: string | null;
  noteCanisterActor: any | null;
  login: () => void;
  loginAsGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  userType: null,
  principal: null,
  noteCanisterActor: null,

  login: () => {
    // Simple anonymous login for demo purposes
    try {
      const identity = new AnonymousIdentity();
      const agent = new HttpAgent({
        identity,
        host: HOST,
      });

      // In development, disable certificate verification
      if (HOST.includes("localhost") || HOST.includes("127.0.0.1")) {
        agent.fetchRootKey();
      }

      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: CANISTER_ID_NOTE_CANISTER,
      });

      const principal = identity.getPrincipal().toText();

      set({
        isAuthenticated: true,
        userType: "anonymous",
        principal,
        noteCanisterActor: actor,
      });

      console.log("✅ Authentication successful!", {
        principal,
        userType: "anonymous",
      });
    } catch (error) {
      console.error("❌ Authentication failed:", error);
    }
  },

  loginAsGuest: () => {
    // Guest mode - no blockchain interaction
    set({
      isAuthenticated: true,
      userType: "guest",
      principal: "guest-user",
      noteCanisterActor: null, // No actor for guest mode
    });
    console.log("✅ Guest login successful!");
  },

  logout: () => {
    set({
      isAuthenticated: false,
      userType: null,
      principal: null,
      noteCanisterActor: null,
    });
    console.log("✅ Logout successful!");
  },
}));
