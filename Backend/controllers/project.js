const{User, NewProject: Project, Ticket, Comment} = require('../model/user');

const getProject = async (req, res, next) =>{
    try {
        const projects = await Project.find().populate('createdby').populate('team');
        res.json(projects);
      } catch (err) {
        next(err);
      }
}

const createProject = async (req, res, next) =>{
    try{
        const { title, description, createdby, team } = req.body;
        const project = new Project({ title, description, createdby, team });
        await project.save();
        res.status(201).json(project); 
        }catch(err){
        next(err)
    }
}

const updateProject = async (req, res, next)=>{
    try {
      const project = await Project.findByIdAndUpdate(req.params.projectId, req.body, { new: true });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(project);
    } catch (err) {
      next(err);
    }
};

const findProjectById = async (req, res, next)=>{
    try{
        const project = await Project.findById(req.params.projectId).populate('createdby').populate('team');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
          }
          res.json(project);
        } catch (err) {
          next(err);
        }
    
};

const deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    // Find the project and populate its ticket array with comments
    const project = await Project.findById(projectId).populate({
      path: 'ticket',
      populate: {
        path: 'comments',
        model: 'Comment'
      }
    });

    // Delete all comments associated with the tickets of the project
    const commentIds = project.ticket.reduce((ids, ticket) => {
      ids.push(...ticket.comments.map(comments => comments._id));
      return ids;
    }, []);
    await Comment.deleteMany({ _id: { $in: commentIds } });

    // Delete all tickets associated with the project
    await Ticket.deleteMany({ _id: { $in: project.ticket } });

    // Delete the project itself
    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
}

const getTicketsByProject = async (req, res, next)=>{
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const tickets = project.ticket;
    res.json(tickets);
  } catch (err) {
    next(err);
  }
}

const createTicket = async (req, res, next) =>{
  try{
    const { title, author, description, status, type, priority, assignedDevs } = req.body;
    const ticket = new Ticket({ title, author, description, status, type, priority, assignedDevs });
    await ticket.save();
    Project.findByIdAndUpdate(req.params.projectId, { $push: { ticket: ticket } }, { new: true })
    .then(result => {
      if (!result) {
        return res.status(404).json({
          message: 'Project not found'
        });
      }
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
    }catch(err){
    next(err)
}}

const updateTicket = async (req, res, next) =>{
 
  const updatedTicket = await Project.findOneAndUpdate(
    {
      _id: req.params.projectId,
      'ticket._id': req.params.ticketId
    },
    {
      $set: {
        'ticket.$.title': req.body.title,
        'ticket.$.description': req.body.description,
        'ticket.$.status': req.body.status,
        'ticket.$.type': req.body.type,
        'ticket.$.priority': req.body.priority,
        'ticket.$.assignedDevs': req.body.assignedDevs,
      }
    },
    { new: true, omitUndefined: true, runValidators: true }
  );
  
  if (!updatedTicket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  
  return res.status(201).json({
    success: true,
    message: "Ticket updated successfully",
  })
}


const deleteTicket = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const ticketId = req.params.ticketId;
    const ticket = await Ticket.findById(ticketId)
    await Comment.deleteMany({ _id: { $in: ticket.comments } })
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { ticket: { _id: ticketId } } },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await Ticket.deleteOne({ _id: ticketId })
    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    next(err);
  }
}
  
const getCommentsByTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    const comments = ticket.comments;
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

const createComment = async (req, res, next) => {
  try {
    const { author, description } = req.body;
    const comment = new Comment({ author, description });

    // Save the comment
    await comment.save();

    // Find the ticket and add the comment to its comments array
    const ticket = await Ticket.findByIdAndUpdate(req.params.ticketId, { $push: { comments: comment } }, { new: true });
    if (!ticket) {
      return res.status(404).json({
        message: 'Ticket not found'
      });
    }

    // Find the project and add the comment to its comments array
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.ticket.forEach(t => {
      if (t._id.equals(ticket._id)) {
        t.comments.push(comment);
      }
    });
    
    await project.save();

    // Return the updated ticket
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};


const deleteComment = async (req, res, next) => {
  try {
    
    const ticketId = req.params.ticketId;
    const commentId = req.params.commentId;

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    await Project.updateOne(
      { _id: req.params.projectId },
      { $pull: { 'ticket.$[t].comments': { _id: commentId } } },
      { arrayFilters: [{ 't._id': ticketId }] }
    );
    await Comment.deleteOne({ _id: commentId })
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    next(err);
  }
}
  
  
  
  
  
  module.exports = {getProject, createProject, findProjectById, updateProject, deleteProject, getTicketsByProject, createTicket, updateTicket, deleteTicket, getCommentsByTicket, createComment, deleteComment};