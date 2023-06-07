import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { getUser } from "../Utils/Common";
import CommentBox from "./CommentBox";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../ProjectStyle/Comments.css'

const Comments = ({ projectId, ticketId }) => {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const currentUser = getUser(); // Assuming getUser() returns the current user object

  const fetchUsers = useCallback((authorIds) => {
    axios
      .get("http://localhost:9999/users")
      .then((response) => {
        const userMap = new Map(response.data.map((user) => [user._id, user.username]));
        const users = authorIds.map((authorId) => ({
          _id: authorId,
          username: userMap.get(authorId) || ""
        }));
        setUsers(users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fetchComments = useCallback(() => {
    axios
      .get(`http://localhost:9999/projects/${projectId}/tickets/${ticketId}/comments`)
      .then((response) => {
        setComments(response.data);
        fetchUsers(response.data.map((comment) => comment.author));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [projectId, ticketId, fetchUsers]);

  const deleteComment = (commentId) => {
    axios
      .delete(`http://localhost:9999/projects/${projectId}/tickets/${ticketId}/comments/${commentId}`)
      .then((response) => {
        // Refresh comments after successful deletion
        fetchComments();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div>
  <h3>Comments</h3>
  {comments.map((comment, index) => (
    <div key={index} className="comment-item">
      <div className="d-flex justify-content-between align-items-center">
        <p className="fw-bold mb-0">Author: {users.find((user) => user._id === comment.author)?.username || "Unknown"}</p>
        {currentUser._id === comment.author && (
          <CloseIcon onClick={() => deleteComment(comment._id)} />
        )}
      </div>
      <p>Comment: {comment.description}</p>
      <p>{formatTimestamp(comment.createdAt)}</p>
    </div>
  ))}
  <div>
    <CommentBox projectId={projectId} ticketId={ticketId} fetchComments={fetchComments} />
  </div>
</div>

  );
};

export default Comments;
