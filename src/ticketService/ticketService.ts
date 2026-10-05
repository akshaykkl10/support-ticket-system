import { randomUUID } from "node:crypto";
import { loadTickets, saveTicket } from "../ticketRepo/ticketRepo.js";
import { Ticket, TicketPriority, TicketStatus } from "../types/types.js";

export async function listTickets(): Promise<Ticket[]> {
    return await loadTickets()
}

export async function addTickets(title: string, description: string, priority: TicketPriority, status: TicketStatus, assignee: string): Promise<Ticket> {
    const tickets = await listTickets()
    const ticket: Ticket = {
        id: randomUUID(),
        title:title,
        description: description,
        priority: priority,
        status: status,
        assignee: assignee
    }
    tickets.push(ticket)
    await saveTicket(tickets)
    return ticket
}

export async function updateStatus(id: string, status:TicketStatus) {
    const ticket = await showTicketById(id)
    if(ticket) ticket.status = status
}

export async function updateAssignee(id: string, assignee:string) {
    const ticket = await showTicketById(id)
    if(ticket) ticket.assignee = assignee
    return
}

export async function showTicketById(id:string) {
    const tickets = await listTickets();
    const ticket = tickets.find(ticket => ticket.id == id)
    if(ticket){
        return ticket;
    }
}