import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Mock data
const services = ["Create Appointment", "Reschedule Appointment", "Cancel Appointment"];
const purposes = ["Account Opening", "Loan Consultation", "Credit Card", "Investment Advice"];
const locations = ["MG Road Branch", "Indiranagar Branch", "Koramangala Branch", "Whitefield Branch"];

app.post("/chat", (req, res) => {
  const { step, data } = req.body;

  if (step === "init") {
    return res.json({ message: "Hi! Which service would you like to do? (create, reschedule, cancel)" });
  }

  if (data.service === "create" && step === "service_selected") {
    return res.json({ message: "Please fill in your appointment details below 👇", step: "create_init" });
  }

  if (step === "create_submit") {
    console.log("✅ Appointment form received:", data);
    return res.json({
      message: `✅ Appointment booked!\nPurpose: ${data.purpose}\nLocation: ${data.location}\nDate: ${data.date}`,
    });
  }

  res.json({ message: "I'm not sure I understood that." });
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));
