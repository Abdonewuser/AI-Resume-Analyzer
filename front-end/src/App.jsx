// import { useState, useRef } from "react";
// import "./App.css";

// function App() {
//   const [file, setFile] = useState(null);
//   const [jd, setJd] = useState("");
//   const [analysis, setAnalysis] = useState(null)
//   const [loading, setLoading] = useState(false);
//   const fileRef = useRef(null);



//   const handleUpload = async () => {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("jd", jd);
//     formData.append("resume", file);

//     const response = await fetch("http://localhost:5000/upload", {
//       method: "POST",
//       body: formData,
//     });
//     const data = await response.json();
//     // console.log("Extracted Text:", data.text);
//     // console.log("Analysis:", data.analysis);
//     const cleaned = data.analysis.replace(/```json/g, "").replace(/```/g, "").trim();
//     const parsed = JSON.parse(cleaned);
//     setAnalysis(parsed);
//     setLoading(false);
//   };
//   return (
//     <div className="container">
//       <input
//         style={{ display: "none" }}
//         ref={fileRef}
//         type="file" onChange={(e) => setFile(e.target.files[0])} />

//       <textarea
//         placeholder="Paste Job Description here..."
//         value={jd}
//         onChange={(e) => setJd(e.target.value)}
//       ></textarea>

//       <div

//         className="drop-zone"
//         onDragOver={(e) => e.preventDefault()}
//         onDrop={(e) => {
//           e.preventDefault();
//           setFile(e.dataTransfer.files[0]);
//         }}
//         onClick={() => fileRef.current.click()}
//       >
//         {file ? `Selected: ${file.name}` : "Drop Resume PDF Here"}
//       </div>
//       {loading && <div className="loading-bar"><div className="loading-fill" /></div>}

//       <button onClick={handleUpload} disabled={loading}>
//         {loading ? "Analyzing..." : "Analyze Compatibility"}
//       </button>

//       {analysis && (
//         <div className="analysis-container">
//           <h2>ATS Compatibility: {analysis.score}%</h2>
//           <h3>Matched Keywords</h3>
//           <ul>
//             {analysis.matchedKeywords.map((kw) => <li key={kw}>{kw}</li>)}
//           </ul>

//           <h3>Missing Keywords</h3>
//           <ul>
//             {analysis.missingKeywords.map((kw) => <li key={kw}>{kw}</li>)}
//           </ul>

//           <h3>Suggestions</h3>
//           <ul>
//             {analysis.suggestions.map((s) => <li key={s}>{s}</li>)}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("jd", jd);
    formData.append("resume", file);

    const response = await fetch("https://hirelens-pobx.onrender.com/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    const cleaned = data.analysis.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    setAnalysis(parsed);
    setLoading(false);
  };

  return (
    <>
      {/* ── Header ── */}
      <header className="site-header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">HireLens</span>
          </div>
          {/* <nav className="header-nav">
            <a href="#">How it works</a>
            <a href="#">Features</a>
            <a href="#" className="nav-cta">Try Free</a>
          </nav> */}
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-badge">AI-Powered Resume Analysis</div>
        <h1 className="hero-title">Beat the ATS.<br />Land the Interview.</h1>
        <p className="hero-sub">
          Paste a job description, upload your resume, and get an instant
          compatibility score with actionable suggestions.
        </p>
      </section>

      {/* ── Main Tool ── */}
      <main className="container">
        <input
          style={{ display: "none" }}
          ref={fileRef}
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <textarea
          placeholder="Paste the job description here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />

        <div
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}
        >
          {file ? `✓  ${file.name}` : "Drop your resume PDF here or click to browse"}
        </div>

        {loading && (
          <div className="loading-bar">
            <div className="loading-fill" />
          </div>
        )}

        <button onClick={handleUpload} disabled={loading || !file || !jd}>
          {loading ? "Waking up server, please wait..." : "Analyze Compatibility"}
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
              {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-brand-row">   {/* 👈 add this wrapper */}
              <span className="logo-icon">⬡</span>
              <span className="logo-text">HireLens</span>
            </div>
            <p className="footer-tagline">AI-powered resume analysis for job seekers.</p>
          </div>
          {/* <div className="footer-links">
            <div className="footer-col">
              <p className="footer-col-title">Product</p>
              <a href="#">How it works</a>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
            </div>
            <div className="footer-col">
              <p className="footer-col-title">Legal</p>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
            </div>
          </div> */}
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HireLens. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;