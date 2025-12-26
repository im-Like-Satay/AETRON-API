const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

const getData = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/energy/status")
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const aiCore = async () => {
  try {
    const data = await getData();

    const prompt = `Role: Kamu adalah AETRON, AI Pengendali Kota.
    Data Kota Saat Ini:
    - Load: ${data.total_load} MW
    - Battery: ${data.battery_level}%


    TUGAS: Analisa data di atas.
    * Jika Battery < 20%, status = CRITICAL.
    * Jika Battery > 80%, status = SAFE.

    Output WAJIB JSON:
    {
    "status": "SAFE/CRITICAL",
    "action": "Jelaskan tindakanmu dalam 1 kalimat pendek",
    "recommendation": "Saran buat admin"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    console.log(response.text);
  }
     catch (error) {
      console.error("Error in AI processing:", error);
    }
};

module.exports = aiCore
