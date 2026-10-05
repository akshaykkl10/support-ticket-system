import { describe, expect, it, vi } from "vitest";
import { saveTicket, loadTickets,  } from "../src/ticketRepo/ticketRepo.js";
import { addTickets, listTickets } from "../src/ticketService/ticketService.js";

vi.mock("../src/ticketRepo/ticketRepo.js", () => {
    return{
        saveTicket: vi.fn(),
        loadTickets: vi.fn()
    }
})

describe("Services, Ticket system", () => {
    vi.mocked(loadTickets).mockResolvedValue([{
        id: "1",
        title: "Test Ticket", 
        description: "skip problem",
        priority: "low",
        status: "open",
        assignee: "ak" 
    }])
    vi.mocked(saveTicket).mockResolvedValue()
    it("lists all tickets", async() => {
        const tickets = await listTickets()
        expect(tickets).toStrictEqual([{
            id: "1",
            title: "Test Ticket", 
            description: "skip problem",
            priority: "low",
            status: "open",
            assignee: "ak"  
        }])
    })
    it("Saves tickets", async () => {
        const ticket = await addTickets("title", "description", "low", "closed", "ask")
        expect(ticket).toMatchObject({
                title:"title",
                description: "description",
                priority: "low",
                status: "closed",
                assignee: "ask"
        })
    })
    it("updates")
})

