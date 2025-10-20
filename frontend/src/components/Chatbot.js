import React, { useState, useEffect, useRef } from "react";
import SlotPicker from "./SlotPicker";
import "./Chatbot.css";
import jsPDF from "jspdf";


const Chatbot = () => {
  const [step, setStep] = useState("main");
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  const [errors, setErrors] = useState({ email: "", mobile: "" });
  const [appointmentData, setAppointmentData] = useState({
    purpose: "",
    location: "",
    date: "",
    timeslot: "",
    firstName: "Pavan",
    lastName: "Kumar",
    email: "mvnpavankumar@gmail.com",
    mobile: "9999999999",
    reference: "",
  });
  
  const [myAppointments, setMyAppointments] = useState([
  {
    reference: "ABC123XYZ1",
    purpose: "Open An Account",
    location: "New York, NY",
    date: "2025-10-25",
    timeslot: "10:00 AM",
    name: "Pavan Kumar",
  },
  {
    reference: "DEF456XYZ2",
    purpose: "Apply Credit Card",
    location: "Los Angeles, CA",
    date: "2025-10-28",
    timeslot: "2:30 PM",
    name: "Pavan Kumar",
  },
 ]);

  const [availableSlots] = useState([
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "2:00 PM", "2:30 PM", "3:00 PM",
  ]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, step]);

  const addToHistory = (type, text) => {
    setChatHistory((prev) => [...prev, { type, text }]);
  };

  const handleFieldChange = (field, value) => {
    setAppointmentData({ ...appointmentData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateFields = () => {
    let newErrors = { email: "", mobile: "" };
    let valid = true;

    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(appointmentData.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(appointmentData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSelectSlot = (slot) => {
    setAppointmentData({ ...appointmentData, timeslot: slot });
  };

  const handleCancel = () => {
//    setAppointmentData({
//      purpose: "",
//      location: "",
//      date: "",
//      timeslot: "",
//      firstName: "",
//      lastName: "",
//      email: "",
//      mobile: "",
//      reference: "",
//    });
//    setChatHistory([]);
    setStep("main");
  };

  const handleConfirm = () => {
    if (!validateFields()) return;

    // generate reference ID (10-char alphanumeric)
    const refId = Math.random().toString(36).substring(2, 12).toUpperCase();
    setAppointmentData({ ...appointmentData, reference: refId });
    setStep("confirm");
  };

const handleDownloadReceipt = () => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Appointment Confirmation Receipt", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  const receiptLines = [
    "---------------------------------",
    `Reference No: ${appointmentData.reference}`,
    `Name: ${appointmentData.firstName} ${appointmentData.lastName}`,
    `Email: ${appointmentData.email}`,
    `Mobile: ${appointmentData.mobile}`,
    `Purpose: ${appointmentData.purpose}`,
    `Location: ${appointmentData.location}`,
    `Date: ${appointmentData.date}`,
    `Time: ${appointmentData.timeslot}`,
    "---------------------------------",
    "Thank you for booking with us!",
  ];

  let y = 35;
  receiptLines.forEach((line) => {
    doc.text(line, 20, y);
    y += 10;
  });

  doc.save(`Appointment_${appointmentData.reference}.pdf`);
};
  const detectIntent = (text) => {
  const lower = text.toLowerCase();

  // 1️⃣ Booking intent
  if (/book|schedule|create|set up/.test(lower)) {
    return { intent: "book_appointment" };
  }

  // 2️⃣ View my appointments
  if (/my appointments|show|view/.test(lower)) {
    return { intent: "view_appointments" };
  }

  // 3️⃣ Cancel
  if (/cancel|delete|remove/.test(lower)) {
    return { intent: "cancel_appointment" };
  }

  // 4️⃣ Modify or Reschedule
  if (/modify|reschedule|change|edit/.test(lower)) {
    return { intent: "modify_appointment" };
  }

  // 5️⃣ Add Notes
  if (/note|remark|comment/.test(lower)) {
    return { intent: "add_notes" };
  }

  // 6️⃣ Request Call Back
  if (/call back|contact me|reach out/.test(lower)) {
    return { intent: "request_callback" };
  }

  // 7️⃣ Greetings / Help
  if (/hi|hello|hey/.test(lower)) {
    return { intent: "greet" };
  }

  if (/help|assist|what can you do/.test(lower)) {
    return { intent: "help" };
  }

  // 8️⃣ Detect possible date/time phrases (for context, optional)
  const dateMatch = text.match(/\b\d{4}-\d{2}-\d{2}\b|\btoday\b|\btomorrow\b/);
  const timeMatch = text.match(/\b\d{1,2}(:\d{2})?\s?(am|pm)?\b/);

  return { intent: "unknown", date: dateMatch?.[0], time: timeMatch?.[0] };
};

	const handleUserMessage = () => {
  if (!userInput.trim()) return;

  const text = userInput.trim();
  addToHistory("user", text);
  setUserInput("");

  const { intent, date, time } = detectIntent(text);

  switch (intent) {
    case "book_appointment":
      addToHistory("bot", "Got it! Let’s create a new appointment.");
      setStep("create");
      break;

    case "view_appointments":
      addToHistory("bot", "Here are your upcoming appointments:");
      setStep("myAppointments");
      break;

    case "cancel_appointment":
      addToHistory("bot", "Sure — which appointment would you like to cancel?");
      setStep("myAppointments");
      break;

    case "modify_appointment":
      addToHistory("bot", "Alright, which appointment would you like to modify?");
      setStep("myAppointments");
      break;

    case "add_notes":
      addToHistory("bot", "Please tell me what note you’d like to add.");
      setStep("myAppointments");
      break;

    case "request_callback":
      addToHistory("bot", "Okay, I’ll request a callback for your latest appointment.");
      break;

    case "greet":
      addToHistory("bot", "Hi there 👋! How can I assist you today?");
      break;

    case "help":
      addToHistory("bot", "You can say things like:\n• Book an appointment\n• Show my appointments\n• Modify or cancel\n• Add notes\n• Request a callback");
      break;

    default:
      addToHistory("bot", "Hmm, I’m not sure I understood that. Try saying ‘book appointment’, ‘my appointments’, or ‘help’.");
      break;
  }

  // Optional context usage (log)
  if (date || time) {
    console.log("Detected context:", { date, time });
  }
};


  return (
    <div className="chatbot-container">
      <div className="chat-window">
        <div className="chatbot-header">AI Appointment Assistant</div>

        <div className="chat-body">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`msg ${msg.type}`}>
              {msg.text}
            </div>
          ))}

          {/* === Step 1: Main Menu === */}
          {step === "main" && (
            <div className="msg bot">
              Hi 👋, how can I assist you today?
              <div className="options">
                <button onClick={() => setStep("create")}>Create Appointment</button>
                <button onClick={() => setStep("myAppointments")}>My Appointments</button>
                <button onClick={() => alert("Appointment Help (Coming Soon)")}>Appointment Help</button>
                <button onClick={() => alert("Ask me anything (Coming Soon)")}>Ask Any</button>
              </div>
            </div>
          )}

          {/* === Step 2: Create Appointment === */}
          {step === "create" && (
            <div className="form-step">
              <label>Purpose of Visit:</label>
              <select
                value={appointmentData.purpose}
                onChange={(e) => handleFieldChange("purpose", e.target.value)}
              >
                <option value="">-- Select Purpose --</option>
                <option>Open An Account</option>
                <option>Apply Credit Card</option>
                <option>Manage spending And saving</option>
                <option>Build credit and reduce debt</option>
                <option>Death of a loved one</option>
                <option>Save For Retirement</option>
              </select>

              <label>Preferred Location:</label>
              <input
                list="locations"
                value={appointmentData.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                placeholder="Type or choose location"
              />
              <datalist id="locations">
                <option>New York, NY</option>
                <option>Los Angeles, CA</option>
                <option>San Francisco, CA</option>
                <option>Chicago, IL</option>
                <option>Dallas, TX</option>
                <option>Atlanta, GA</option>
                <option>Boston, MA</option>
                <option>Miami, FL</option>
                <option>Seattle, WA</option>
                <option>Denver, CO</option>
              </datalist>

              <label>Preferred Date:</label>
              <input
                type="date"
                value={appointmentData.date}
                onChange={(e) => handleFieldChange("date", e.target.value)}
              />

              <div className="options">
                <button
                  disabled={
                    !appointmentData.purpose ||
                    !appointmentData.location ||
                    !appointmentData.date
                  }
                  onClick={() => setStep("viewSlots")}
                >
                  View Timeslots
                </button>
                <button onClick={() => setStep("main")}>Main Menu</button>
              </div>
            </div>
          )}

          {/* === Step 3: View Timeslots === */}
          {step === "viewSlots" && (
            <div className="form-step">
              <div className="summary-box">
                <p><b>Purpose:</b> {appointmentData.purpose}</p>
                <p><b>Location:</b> {appointmentData.location}</p>
                <p><b>Date:</b> {appointmentData.date}</p>
              </div>

              <label>Select an available timeslot:</label>
              <SlotPicker
                slots={availableSlots}
                selectedSlot={appointmentData.timeslot}
                onSelectSlot={handleSelectSlot}
              />

              <div className="options">
                <button
                  disabled={!appointmentData.timeslot}
                  onClick={() => setStep("review")}
                >
                  Review Details
                </button>
                <button onClick={() => setStep("create")}>Previous</button>
                <button onClick={handleCancel}>Cancel Booking</button>
              </div>
            </div>
          )}

          {/* === Step 4: Review Details === */}
          {step === "review" && (
            <div className="form-step">
              <div className="summary-box">
                <h4>Review Your Appointment</h4>
                <p><b>Purpose:</b> {appointmentData.purpose}</p>
                <p><b>Location:</b> {appointmentData.location}</p>
                <p><b>Date:</b> {appointmentData.date}</p>
                <p><b>Time:</b> {appointmentData.timeslot}</p>
              </div>

              <label>First Name:</label>
              <input
                type="text"
                placeholder="Enter First Name"
                value={appointmentData.firstName}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
              />

              <label>Last Name:</label>
              <input
                type="text"
                placeholder="Enter Last Name"
                value={appointmentData.lastName}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
              />

              <label>Email Address:</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={appointmentData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}

              <label>Mobile Number:</label>
              <input
                type="tel"
                placeholder="Enter 10-digit Mobile No."
                value={appointmentData.mobile}
                onChange={(e) => handleFieldChange("mobile", e.target.value)}
              />
              {errors.mobile && <p className="error-text">{errors.mobile}</p>}

              <div className="options">
                <button
                  disabled={
                    !appointmentData.firstName ||
                    !appointmentData.lastName ||
                    !appointmentData.email ||
                    !appointmentData.mobile
                  }
                  onClick={handleConfirm}
                >
                  Confirm Appointment
                </button>
                <button onClick={handleCancel}>Cancel Booking</button>
              </div>
            </div>
          )}

          {/* === Step 5: Confirmation === */}
          {step === "confirm" && (
            <div className="msg bot">
              ✅ <b>Appointment confirmed!</b>
              <br />
              <b>Reference No:</b> {appointmentData.reference}
              <br />
              <b>Purpose:</b> {appointmentData.purpose}
              <br />
              <b>Location:</b> {appointmentData.location}
              <br />
              <b>Date:</b> {appointmentData.date}
              <br />
              <b>Time:</b> {appointmentData.timeslot}
              <br />
              <b>Name:</b> {appointmentData.firstName} {appointmentData.lastName}
              <br />
              <b>Email:</b> {appointmentData.email}
              <br />
              <b>Mobile:</b> {appointmentData.mobile}

              <div className="options">
                <button onClick={handleDownloadReceipt}>Download Receipt</button>
                <button onClick={() => setStep("main")}>Main Menu</button>
                <button onClick={() => setStep("myAppointments")}>
                  My Appointments
                </button>
                <button onClick={() => alert("Appointment Help (Coming Soon)")}>
                  Appointment Help
                </button>
                <button onClick={() => alert("Ask Any (Coming Soon)")}>Ask Any</button>
              </div>
            </div>
          )}
		{/* === Step 1.2: My Appointments === */}
		 {/* === Step: My Appointments === */}
{step === "myAppointments" && (
  <div className="form-step">
    <h4>My Appointments</h4>
    {myAppointments.map((appt, index) => (
      <div key={index} className="summary-box">
        <p><b>Reference No:</b> {appt.reference}</p>
        <p><b>Purpose:</b> {appt.purpose}</p>
        <p><b>Location:</b> {appt.location}</p>
        <p><b>Date:</b> {appt.date}</p>
        <p><b>Time:</b> {appt.timeslot}</p>
        <p><b>Name:</b> {appt.name}</p>

        <div className="options">
          <button onClick={() => alert(`Modify Appointment: ${appt.reference}`)}>
            Modify Appointment
          </button>
          <button onClick={() => alert(`Cancel Appointment: ${appt.reference}`)}>
            Cancel Appointment
          </button>
          <button onClick={() => alert(`Add Notes to: ${appt.reference}`)}>
            Add Notes
          </button>
          <button onClick={() => alert(`Request Call Back: ${appt.reference}`)}>
            Request Call Back
          </button>
		  <button onClick={() => alert(`Book Followup: ${appt.reference}`)}>
            Book Followup
          </button>
		  <button onClick={() => alert(`Help: ${appt.reference}`)}>
            Help
          </button>
        </div>
      </div>
    ))}
    <div className="options">
      <button onClick={() => setStep("main")}>Back to Main Menu</button>
    </div>
  </div>
)}
          <div ref={chatEndRef}></div>
		  <div className="chat-input">
			  <input
				type="text"
				placeholder="Type your message here..."
				value={userInput}
				onChange={(e) => setUserInput(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && handleUserMessage()}
			  />
			  <button onClick={handleUserMessage}>Send</button>
			</div>

        </div>
      </div>
    </div>
  );
};

export default Chatbot;
