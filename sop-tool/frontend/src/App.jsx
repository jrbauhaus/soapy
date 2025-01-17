import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  // Existing state and functions
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  // New state for SOP form
  const [worksheetType, setWorksheetType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [roles, setRoles] = useState("");
  const [steps, setSteps] = useState([""]);
  const [logo, setLogo] = useState(null);

  // Fetch backend test
  const fetchBackend = async () => {
    try {
      const response = await fetch("http://localhost:3001/");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const text = await response.text();
      setMessage(text);
    } catch (error) {
      console.error("Failed to fetch from backend:", error);
      setMessage("Failed to connect to backend.");
    }
  };

  // Add new step to the SOP
  const handleAddStep = () => setSteps([...steps, ""]);
  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  // Generate SOP and send to backend
  const handleGenerate = async () => {
    const formData = new FormData();
    formData.append("worksheetType", worksheetType);
    formData.append("purpose", purpose);
    formData.append("roles", roles);
    formData.append("steps", JSON.stringify(steps));
    if (logo) formData.append("logo", logo);

    try {
      const response = await fetch("http://localhost:3001/generate", {
        method: "POST",
        body: formData,
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sop.md";
      link.click();
    } catch (error) {
      console.error("Error generating SOP:", error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + SOP Tool</h1>
      <div className="card">
        {/* Existing counter functionality */}
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Edit <code>src/App.jsx</code> and save to test HMR</p>

        {/* Test Backend */}
        <button onClick={fetchBackend}>Test Backend</button>
        <p>{message}</p>

        {/* SOP Input Form */}
        <form>
          <h2>Create SOP</h2>
          <label>
            SOP Type:
            <select value={worksheetType} onChange={(e) => setWorksheetType(e.target.value)}>
              <option value="">Select</option>
              <option value="onboarding">Onboarding</option>
              <option value="training">Training</option>
              <option value="documentation">Documentation</option>
            </select>
          </label>
          <br />

          <label>
            Purpose:
            <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </label>
          <br />

          <label>
            Roles:
            <input type="text" value={roles} onChange={(e) => setRoles(e.target.value)} />
          </label>
          <br />

          <label>
            Steps:
            {steps.map((step, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={`Step ${index + 1}`}
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={handleAddStep}>
              Add Step
            </button>
          </label>
          <br />

          <label>
            Upload Logo:
            <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
          </label>
          <br />

          <button type="button" onClick={handleGenerate}>
            Generate SOP
          </button>
        </form>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
