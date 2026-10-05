import { readFile, writeFile } from "node:fs/promises";
import type { Ticket } from "../types/types.js";

const TASK_FILE = "tickets.json"



export async function loadTickets():Promise<Ticket[]> {
    try {
        const data = await readFile(TASK_FILE, "utf-8")
        const tickets: unknown = JSON.parse(data)
        if(!Array.isArray(tickets)) throw new Error("Tickets must be an array.")
        return tickets as Ticket[]
    } catch (error: unknown) {
        if (isFileNotFoundError(error)) return []
        throw error
    }
}

export async function saveTicket(tickets: Ticket[]): Promise<void> {
    await writeFile(TASK_FILE, JSON.stringify(tickets, null, 2), "utf-8")
}

function isFileNotFoundError(error: unknown): boolean {
    return error instanceof Error && "code" in error && error.code == "ENOENT"
}