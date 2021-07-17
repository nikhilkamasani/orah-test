import { RolllStateType } from "./roll"

export interface Filter {
  first_name: SortType
  last_name: SortType
  search: string,
  roll: RollType
}

export type SortType = "ASC" | "DESC" | null
export type RollType = RolllStateType | null
