import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { addCommentAsync } from "../../features/comments/commentsApi";
import { useAuth } from "../../hooks/useAuth";

function ReplyForm({postId, parentId, onSuccess }) {
  const [text, setText] = useState("");
  const {user} = useAuth();

  const dispatch = useDispatch();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    dispatch(addCommentAsync({ 
      content: text, 
      parentId: parentId,
      postId: postId,
      authorId: user.id,
    }));

    setText("");
    if (onSuccess) onSuccess();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        width: "100%", 
        mt: 1,
        mb: 2,
      }}
    >
      <TextField
        id="reply-text"
        label="Напишіть відповідь..."
        multiline
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ 
          width: "100%",
          maxWidth: "50ch",
          backgroundColor: "white" 
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", maxWidth: "50ch", mt: 1 }}>
        <Button 
          type="submit" 
          variant="contained" 
          size="small"
          disabled={!text.trim()}
        >
          Відправити
        </Button>
      </Box>
    </Box>
  );
}

export default ReplyForm;