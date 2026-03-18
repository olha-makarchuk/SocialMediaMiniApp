import { useRef, useCallback } from "react";
import { Box, Typography } from "@mui/material";

function InfiniteScroll({ fetchMore, hasMore, isLoading }) {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, fetchMore],
  );

  return (
    <Box
      sx={{
        width: "100%",
        py: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div ref={lastElementRef} style={{ height: "10px", width: "100%" }} />

      {!hasMore && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Це всі пости на сьогодні 😉
        </Typography>
      )}
    </Box>
  );
}

export default InfiniteScroll;
