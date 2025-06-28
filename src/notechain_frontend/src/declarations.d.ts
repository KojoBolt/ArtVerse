// This is a placeholder for Candid-generated types.
// Run `dfx generate note_canister` to create the actual type files.
// You might need to adjust tsconfig.json paths if dfx outputs them elsewhere.

// Based on the Rust canister structure:
// src/note_canister/src/lib.rs

// Candid Principal
type Principal = { toText: () => string }; // Simplified Principal type

// Note structure from Rust
interface CanisterNote {
  id: bigint; // u64
  owner: Principal;
  title: string;
  content: string;
  created_at: bigint; // u64 (timestamp)
}

// Define the service interface for the note_canister
// This should match the public methods in your Rust canister
export interface _SERVICE {
  create_note: (
    title: string,
    content: string
  ) => Promise<{ Ok: bigint } | { Err: string }>;
  get_notes: () => Promise<Array<CanisterNote>>;
  get_note_by_id: (id: bigint) => Promise<[CanisterNote] | []>; // Option<Note> is Vec<Note> of 0 or 1 element
  // greet: (name: string) => Promise<string>; // If you keep the greet function
}

// This part simulates the module structure dfx generate creates
// to allow `import { idlFactory } from 'declarations/note_canister'`
declare module "declarations/note_canister" {
  // This is a placeholder for the actual IDL factory.
  // dfx generate will create a more complex object.
  export const idlFactory: any;
  export const canisterId: string;
  // You might also need to declare createActor if you import it directly
  // export const createActor: (canisterId: string, options?: any) => ActorSubclass<_SERVICE>;
}

// Environment variables placeholder
declare module "declarations/internet_identity" {
  export const idlFactory: any;
  export const canisterId: string;
}
