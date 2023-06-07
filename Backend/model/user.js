
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
        email: {type: String, required: true, unique:true},
		confirmed: {type: Boolean, default: false},
		uniquecode: {type: Number, default: 0}

    }
)

const CommentSchema = new mongoose.Schema(
    {
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserSchema',
            required: true
          },
        description:{type: String, required: true}  

    },
    {
        timestamps: true,
    }

)

const TicketSchema = new mongoose.Schema(
    {
        title:{ type: String, required: true, unique: false },
        author:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'UserSchema'
              },
        description: { type: String, required: true },  
        status: {type: String, required:true},
        type: {type: String, required:true},
        priority: {type: String, required:true},
        assignedDevs: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'UserSchema'}] ,
        comments: [CommentSchema],        

    },
    {
        timestamps: true,
    }
)

const NewProjectSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        createdby:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserSchema'
          },
        team: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserSchema' 
          }]  ,
        ticket: [TicketSchema]
    }
)


const User = mongoose.model('UserSchema', UserSchema)
const NewProject = mongoose.model('NewProjectSchema', NewProjectSchema)
const Ticket = mongoose.model('TicketSchema', TicketSchema)
const Comment = mongoose.model('CommentSchema', CommentSchema)

module.exports = {User, NewProject, Ticket, Comment}