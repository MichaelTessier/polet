import { Tables, TablesInsert, TablesUpdate } from "./generated";

export type Profile = Tables<"profiles">;
export type ProfileInsert = TablesInsert<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;