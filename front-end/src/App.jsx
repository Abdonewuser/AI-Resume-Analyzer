import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);



  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("jd", jd);
    formData.append("resume", file);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    // console.log("Extracted Text:", data.text);
    // console.log("Analysis:", data.analysis);
    const cleaned = data.analysis.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    setAnalysis(parsed);
    setLoading(false);
  };
  return (
    <div className="container">
      <input
        style={{ display: "none" }}
        ref={fileRef}
        type="file" onChange={(e) => setFile(e.target.files[0])} />

      <textarea
        placeholder="Paste Job Description here..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      ></textarea>

      <div

        className="drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFile(e.dataTransfer.files[0]);
        }}
        onClick={() => fileRef.current.click()}
      >
        {file ? `Selected: ${file.name}` : "Drop Resume PDF Here"}
      </div>
      {loading && <div className="loading-bar"><div className="loading-fill" /></div>}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Compatibility"}
      </button>

      {analysis && (
        <div className="analysis-container">
          <h2>ATS Compatibility: {analysis.score}%</h2>
          <h3>Matched Keywords</h3>
          <ul>
            {analysis.matchedKeywords.map((kw) => <li key={kw}>{kw}</li>)}
          </ul>

          <h3>Missing Keywords</h3>
          <ul>
            {analysis.missingKeywords.map((kw) => <li key={kw}>{kw}</li>)}
          </ul>

          <h3>Suggestions</h3>
          <ul>
            {analysis.suggestions.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;