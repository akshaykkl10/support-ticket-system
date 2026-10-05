import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../src/app.js";
import { Server } from "node:http";
import { Ticket } from "../src/types/types.js";
import { writeFileSync } from "node:fs";
import { setTimeout } from "node:timers/promises";
import { error } from "node:console";


const TICKET_FILE = "tickets.json"

let baseUrl: string;

let httpServer: Server;

beforeAll(async() => {
    await new Promise<void>((resolve) => {
        httpServer = app.listen(0, () => {
            const address = httpServer.address();
            if(address == null || typeof address == "string"){
                throw new Error("Could not determine the server address");
            }
            baseUrl = `http://localhost:${address.port}`;
            resolve();
        });
    });
});
afterAll(async() => {
    // await rm(TICKET_FILE,{force:true})
    await new Promise<void>((resolve, reject) => {
        httpServer.close((error) => {
            if(error){
                reject(error);
                return;
            }
            resolve();
        });
    });
});



describe("Ticket API", ()=>{
    beforeEach(async() => {
        writeFileSync(TICKET_FILE, JSON.stringify([{
            "id": "12e0c8c5-e15d-4436-a597-97722e4e5e65",
            "title": "whatsapp",
            "description": "skip problem",
            "priority": "low",
            "status": "open",
            "assignee": "ak"
        },]),"utf-8")
        await setTimeout(50)
    });
    
    it("Tests the loading of ticket api", async() => {
        const response = await fetch(`${baseUrl}/tickets`)
        expect(response.headers.get('content-type')).toBe("application/json; charset=utf-8")
        expect(response.status).toBe(200)
        const body = await response.json()
        expect(Array.isArray(body)).toBe(true)
    })
    
    it("adds tickets through post method", async() => {
        const response = await fetch(`${baseUrl}/tickets`, {
            headers:{
                "content-type":"application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            })
        });
        const ticket = await response.json();
        expect(ticket).toEqual(
            expect.objectContaining({
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            })
        );
        
    });
    it("handles unknown route", async() => {
        const response = await fetch(`${baseUrl}/unknown`)
        expect(await response.json()).toStrictEqual({
            error: "Page not found"
        })
    })

    it("adds catches the invalid json input in post add tickets", async() => {
        const response = await fetch(`${baseUrl}/tickets`, {
            headers:{
                "content-type":"application/json"
            },
            method: "POST",
            body: `{
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            `
        });
        expect(await response.json()).toEqual({
            error: "Invalid Json"
        });

    });

});

describe("Ticket Controllers", () => {
    it("shows tickets with custom status", async () => {
        const response = await fetch(`${baseUrl}/tickets`, {
            headers:{
                "content-type":"application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            })
        });
        const ticket: Ticket = await response.json();
        expect(ticket).toEqual(
            expect.objectContaining({
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            })
        );
        const filteredResponse = await fetch(`${baseUrl}/tickets/?id=${ticket.id}`);
        expect(await filteredResponse.json()).toStrictEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: ticket.id
                })
            ])
        );
    });
    it("updates a ticket", async() => {
        const response = await fetch(`${baseUrl}/tickets`, {
            headers:{
                "content-type":"application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            })
        });
        const ticket: Ticket = await response.json();
        const updateResponse = await fetch(`${baseUrl}/tickets/${ticket.id}`,{
            headers:{
                "content-type":"application/json"
            },
            method: "PATCH",
            body: JSON.stringify({
                "status": "closed"
            })
        });
        expect(await updateResponse.json()).toStrictEqual({
            id:ticket.id,
            title: ticket.title,
            description: ticket.description,
            status: "closed",
            priority: ticket.priority,
            assignee: ticket.assignee
        })

    })
    it("shows tickets with open status", async () => {
        const response = await fetch(`${baseUrl}/tickets`, {
            headers:{
                "content-type":"application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            })
        });
        const ticket: Ticket = await response.json();
        expect(ticket).toEqual(
            expect.objectContaining({
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            })
        );
        const openResponse = await fetch(`${baseUrl}/tickets/?status=open`);
        expect(await openResponse.json()).toStrictEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "status":"open"
                })
            ])
        );
    });
    it("shows tickets with closed status", async () => {
        const response = await fetch(`${baseUrl}/tickets`, {
            headers:{
                "content-type":"application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            })
        });
        const ticket: Ticket = await response.json();
        expect(ticket).toEqual(
            expect.objectContaining({
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            })
        );
        const updateResponse = await fetch(`${baseUrl}/tickets/${ticket.id}`,{
            headers:{
                "content-type":"application/json"
            },
            method: "PATCH",
            body: JSON.stringify({
                "status": "closed"
            })
        });
        
        const closedResponse = await fetch(`${baseUrl}/tickets/?status=closed`);

        expect(await closedResponse.json()).toStrictEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "status":"closed"
                })
            ])
        );
    });
    it("deletes a ticket with given id", async() => {
        const response = await fetch(`${baseUrl}/tickets`, {
            headers:{
                "content-type":"application/json"
            },
            method: "POST",
            body: JSON.stringify({
                "title" : "whatsapp",
                "description": "skip problem",
                "priority": "low",
                "assignee": "ak"
            })
        });
        const ticket = await response.json()
        const idResponse1 = await fetch(`${baseUrl}/tickets/?id=${ticket.id}`)
        expect(await idResponse1.json()).toStrictEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: ticket.id
                })
            ])
        )
        const delResponse2 = await fetch(`${baseUrl}/tickets/${ticket.id}`,{
            method:"DELETE"
        })
        const idResponse2 = await fetch(`${baseUrl}/tickets/?id=${ticket.id}`)
        expect(await idResponse2.json()).toStrictEqual({
            error: "Ticket not found"
        })
    })
});