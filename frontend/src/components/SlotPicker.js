import React from "react";
import "./Chatbot.css";

const SlotPicker = ({ slots, selectedSlot, onSelectSlot }) => {
  return (
    <div className="slot-grid">
      {slots.map((slot, i) => (
        <div
          key={i}
          className={`slot-item ${selectedSlot === slot ? "selected" : ""}`}
          onClick={() => onSelectSlot(slot)}
        >
          {slot}
        </div>
      ))}
    </div>
  );
};

export default SlotPicker;
