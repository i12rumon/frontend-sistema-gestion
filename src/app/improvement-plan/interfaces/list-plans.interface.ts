import { Action } from "./create-plan.interface"

export interface Plans {
  plans: Plan[]
}
export interface Plan {
  id: number;
  name: string;
  academic_year: string;
  degree_id: number;
  user_id: number;
  status: string;
  description: string;
  create_date: string;
  actions: Action[];
}
