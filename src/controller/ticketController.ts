import { Request, Response } from "express";
import { addTickets, listTickets, showTicketById } from "../ticketService/ticketService.js";
import type { Ticket, TicketPriority, TicketStatus } from "../types/types.js";
import { saveTicket } from "../ticketRepo/ticketRepo.js";

const validPriorities: TicketPriority[] = ["low", "medium", "high"];

export async function showTickets(req: Request, res: Response): Promise<void> {
    const queries = req.query
    let tickets = await listTickets()
    if("id" in queries && queries["id"] != undefined){
        tickets = tickets.filter(ticket => ticket.id == queries["id"])
    }
    if("status" in queries && queries["status"] != undefined){
        tickets = tickets.filter(ticket => ticket.status == queries["status"])
    }
    if (tickets.length == 0){
        res.status(404).json({error: "Ticket not found"})
        return
    }
    res.status(200).json(tickets)
}

export async function addTicket(req: Request, res: Response) {
    const {title, description, priority, assignee} = req.body
    
    if( typeof title == "string" && 
        typeof description == "string" &&
        validPriorities.includes(priority as TicketPriority) &&
        typeof assignee == "string"
    ) {
        const ticket = await addTickets(title, description, priority as TicketPriority, "open", assignee)
        res.status(201).json(ticket)
    }
}


export async function updateTicket(req: Request, res: Response): Promise<void> {
    const {id}  = req.params
    const body = req.body
    const tickets = await listTickets()
    const idTicket = await showTicketById(id as string)
    if(!idTicket){
        res.status(404).json({error: "Ticket not found"}) 
        return
    }
    if(!("status" in body) && !("assignee" in body)) {
        res.status(404).send("No data to update")
        return
    }
    if("status" in body && body["status"] != undefined){
        if(body["status"] == "open" || body["status"] == "closed")
        tickets.map(ticket => {
            if(ticket.id == id){
                ticket.status = body["status"]
            }
            return ticket
        });
    }

    if("assignee" in body && body["assignee"] != undefined){
        tickets.map(ticket => {
            if(ticket.id == id){
                ticket.assignee = body["assignee"]
            }
            return ticket
        });
    }
    await saveTicket(tickets)
    res.status(201).json(await showTicketById(id as string))
}

export async function deleteTicket(req: Request, res: Response): Promise<void> {
    const {id} = req.params
    const tasks = await listTickets()
    const task = tasks.find(task => task.id == id)
    if(!task) res.status(404).json({error: "Task not found."})
    const filteredTasks = tasks.filter(task => task.id !== id)
    saveTicket(filteredTasks)
    res.status(204).end()

}
