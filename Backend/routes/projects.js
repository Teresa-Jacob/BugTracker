const express = require('express');
const router = express.Router();


const {getProject, createProject,findProjectById, updateProject, deleteProject, getTicketsByProject, createTicket, updateTicket, deleteTicket, getCommentsByTicket, createComment, deleteComment}  = require("../controllers/project");

router.get("/", getProject);

router.post("/", createProject);

router.get("/:projectId", findProjectById)

router.put("/:projectId", updateProject)

router.delete("/:projectId", deleteProject)

router.get("/:projectId/tickets", getTicketsByProject)

router.post("/:projectId/tickets", createTicket)

router.put("/:projectId/tickets/:ticketId", updateTicket)

router.delete("/:projectId/tickets/:ticketId", deleteTicket)

router.get("/:projectId/tickets/:ticketId/comments", getCommentsByTicket)

router.post("/:projectId/tickets/:ticketId/comments", createComment)

router.delete("/:projectId/tickets/:ticketId/comments/:commentId", deleteComment)

module.exports = router;