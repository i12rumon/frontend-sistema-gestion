export interface FinancingRequestUser {
  id: number;
  user_id: number;
  user: string | null;
  plan_id: number;
  plan_title: string | null;
  action_id: number;
  action: string | null;
  call_for_proposals_id: number;
  call_for_proposals: string | null;
  details_financing: string | null;
  estimated_date: string;
  solicited_amount: number | null;
  status: string;
}

export interface FinancingRequestUserResponse {
  requests: FinancingRequestUser[];
  Message?: string;
}
