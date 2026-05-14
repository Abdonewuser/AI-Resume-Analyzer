import express from "express";
import cors from "cors";
import multer from "multer";
import fs, { cp } from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai'

const app = express();
/* This enables Cross-Origin Resource Sharing (CORS) for the Express app, allowing requests from different origins.
This is necessary when your frontend and backend are running on different ports or domains.
*/
app.use(cors());
app.use(express.json());
dotenv.config();

const upload = multer({ dest: "uploads" });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


app.post("/upload", upload.single("resume"), async (req, res) => {

    try {
        /* The file path is provided by the multer middleware after the file is uploaded.
         It is stored in the "uploads" directory as specified in the multer configuration.*/
        const filePath = req.file.path;
        // console.log("Here is the jd:", req.body.jd);

        const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
        const pdfDoc = await pdfjsLib.getDocument({ data: dataBuffer }).promise;

        let fullText = "";
        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(" ");
            fullText += pageText + "\n";
        }

        fs.unlinkSync(filePath); // cleanup temp file

        const prompt = `
            You are an ATS (Applicant Tracking System) expert.

            Here is the resume:
            ${fullText}

            Here is the job description:
            ${req.body.jd}

            Analyze the resume against the job description and return a JSON object with:
            - score: a number from 0 to 100
            - matchedKeywords: array of keywords found in both
            - missingKeywords: array of important keywords missing from resume
            - suggestions: array of short improvement tips
            `;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ message: "Analysis complete!", text: fullText, analysis: responseText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to extract text" });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});