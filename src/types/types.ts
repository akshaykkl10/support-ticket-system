export type TicketStatus = "open" | "closed"
export type TicketPriority = "low" | "medium" | "high"
export interface Ticket {
    id: string
    title: string
    description: string
    priority: TicketPriority
    status: TicketStatus
    assignee: string
}