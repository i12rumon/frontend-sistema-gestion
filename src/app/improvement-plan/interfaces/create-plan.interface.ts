export interface ImprovementPlan {
  name: string
  user_id: number
  description: string
  create_date: string
  actions: Action[]
}

export interface Action {
  id: string;
  name: string
  origin: string
  accua_recommendations: string
  criterios: string[]
  description: string
  scope: string
  objectives: string
  priority: string
  start_date: string
  end_date: string
  indicators: Indicator[]
}

export interface Indicator {
  name: string
  start_value: string
  objective_value: string
}
