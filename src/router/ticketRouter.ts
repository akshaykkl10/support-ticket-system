import { Router } from "express";
import { addTicket, deleteTicket, showTickets, updateTicket } from "../controller/ticketController.js";
import { addTickets } from "../ticketService/ticketService.js";

const ticketRouter = Router();

ticketRouter.get("/", showTickets)

ticketRouter.post("/", addTicket)
ticketRouter.patch("/:id", updateTicket)

ticketRouter.delete("/:id", deleteTicket)


export default ticketRouter;