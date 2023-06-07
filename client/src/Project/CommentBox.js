import React, { useState } from "react";
import axios from "axios";
import { getUser } from "../Utils/Common";
import 'bootstrap/dist/css/bootstrap.min.css';

const CommentBox = ({ projectId, ticketId, fetchComments  }) => {
  const [commentText, setCommentText] = useState("");

  const author = getUser(); // Assuming getUser() returns the author object

  const handleSubmit = (e) => {
    e.preventDefault();

    const commentData = {
      author: author._id,
      description: commentText,
    };

    axios
      .post(
        `http://localhost:9999/projects/${projectId}/tickets/${ticketId}/comments`,
        commentData
      )
      .then((response) => {
        console.log(response);
        // Perform any additional actions after successful comment creation
        fetchComments();
      })
      .catch((error) => {
        console.log(error);
        // Handle any errors that occur during the comment creation
      });

    setCommentText(""); // Clear the comment text field after submission
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  return (
    <div className="comment-box">
  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <textarea
        className="form-control"
        value={commentText}
        onChange={handleCommentChange}
        placeholder="Enter your comment..."
      ></textarea>
    </div>
    <button type="submit" className="btn btn-primary">Post Comment</button>
  </form>
</div>

  );
};

export default CommentBox;
