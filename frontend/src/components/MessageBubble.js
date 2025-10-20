import React from "react";

export default function MessageBubble({ from, message }) {
  const style = {
    margin: "5px 0",
    textAlign: from === "bot" ? "left" : "right",
    background: from === "bot" ? "#f1f1f1" : "#cfe9ff",
    padding: "8px 12px",
    borderRadius: "10px",
    display: "inline-block",
    maxWidth: "80%"
  };

  return (
    <div style={{ textAlign: from === "bot" ? "left" : "right" }}>
      <span style={style}>{message}</span>
    </div>
  );
}
