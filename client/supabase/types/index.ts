import { Tables, TablesInsert, TablesUpdate } from './generated';

export type Profile = Tables<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

export type Hub = Tables<'hubs'>;
export type HubInsert = TablesInsert<'hubs'>;
export type HubUpdate = TablesUpdate<'hubs'>;

export type Family = Tables<'families'>;
export type FamilyInsert = TablesInsert<'families'>;
export type FamilyUpdate = TablesUpdate<'families'>;
