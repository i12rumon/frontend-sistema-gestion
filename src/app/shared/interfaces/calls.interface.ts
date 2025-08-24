export interface Calls {
  Calls_for_proposals: CallForProposal[]
}

export interface CallForProposal {
  description: string
  end_date: string
  id: number
  start_date: string
  status: string
  title: string
}
