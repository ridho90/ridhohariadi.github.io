/**
 * Portfolio AI Assistant — Cloudflare Worker (Service Worker format)
 * 
 * Answers questions about Ridho Kusumo Hariadi's background
 * using verified profile data + Google Gemini API.
 *
 * Environment variables (secrets):
 *   GEMINI_API_KEY - Your Google Gemini API key
 */

// Embedded verified profile data
const PROFILE_DATA = {
  name: "Ridho Kusumo Hariadi",
  location: "Auckland, New Zealand",
  headline: "Care-driven. Hospitality-tested. AI-augmented.",
  tagline: "I'm an Auckland-based healthcare and hospitality professional combining person-centered care, high-volume service operations, and AI-powered workflows to deliver safer, faster, and more human-centered outcomes.",
  summary: "With hands-on experience across healthcare support, mental health environments, cruise hospitality, restaurant operations, and AI-enabled productivity, I bring a rare cross-sector perspective: empathy from healthcare, discipline from hospitality, and adaptability from technology.",
  education: [
    { credential: "NZ Certificate in Health and Wellbeing Level 4", institution: "Crown Institute of Studies", year: "2025-2026" },
    { credential: "Bachelor of Law (LLB)", institution: "Universitas Brawijaya", year: "2009-2013" }
  ],
  certifications: [
    "IELTS General 6.0 (March 2025)",
    "HACCP Food Safety",
    "AIDA F&B Advanced Training - Top Class Trainee",
    "NZ Full Class 1 Driver Licence"
  ],
  skills: {
    healthcare: ["Person-Centered Care", "Cultural Safety", "Electronic health documentation", "Support for daily living activities", "Observation, escalation, and safe communication", "Diversional therapy and music engagement", "200+ clinical hours at CHT Beachhaven"],
    hospitality: ["F&B Head Steward - AIDA Cruises", "High-volume dining service (150-300 guests per shift)", "Guest satisfaction score 90/100", "Marine X Change POS system", "Team coordination under pressure", "International cruise environment (3 years)"],
    ai_and_tech: ["Claude Code - rapid prototyping", "NotebookLM - knowledge synthesis", "VS Code - code editing", "Tailscale - secure device access", "macOS automation - daily productivity"],
    analytical: ["Technical analysis (crypto and stocks)", "Portfolio management and risk control", "Pattern recognition and decisions"],
    mental_health: ["Psycho-social support", "De-escalation and crisis support", "Family caregiver coaching", "Experience at RSJ Lawang, Indonesia"]
  },
  experience: [
    { role: "Trainee Healthcare Assistant", organization: "CHT Beachhaven", location: "Auckland, New Zealand", highlights: ["200+ clinical hours in residential aged care", "Person-centered care and resident wellbeing", "Electronic health documentation", "Mobility support and safe manual handling", "Diversional therapy through music"] },
    { role: "Mental Health Support", organization: "RSJ Lawang", location: "Indonesia", highlights: ["Supported individuals with chronic schizophrenia", "Psycho-social support and de-escalation", "Family caregiver coaching", "Calm interpersonal communication"] },
    { role: "F&B Head Steward", organization: "AIDA Cruises", location: "International", highlights: ["Managed dining service for 150-300 guests per shift", "Promoted from Assistant to Head Steward", "Consistent guest satisfaction rating 90/100", "Marine X Change POS system", "HACCP food safety", "Coordinated international team"] },
    { role: "Restaurant Manager", organization: "Warunk Laseman", highlights: ["Led restaurant operations", "Coordinated service teams", "Customer experience management"] },
    { role: "Casual Waiter", organization: "Ascent Premier Hotel", highlights: ["Guest-facing hotel service", "Adaptability and service consistency"] }
  ],
  contact: { email: "ridho90@gmail.com" }
};

const SYSTEM_PROMPT = "You are a professional portfolio assistant for " + PROFILE_DATA.name + ", a healthcare, hospitality, and AI-augmented professional based in " + PROFILE_DATA.location + ". " +
  "Answer questions about his background, skills, experience, and qualifications. " +
  "CRITICAL RULES: 1. ONLY answer based on the verified profile data below. " +
  "2. If asked something NOT in the data, say: 'I do not have that information. Please contact Ridho directly at " + PROFILE_DATA.contact.email + ".' " +
  "3. Do NOT make up any information. 4. Be concise, 2-4 sentences max. " +
  "5. Use he/him pronouns.\n\nVERIFIED DATA:\n" + JSON.stringify(PROFILE_DATA, null, 2);

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  // Only accept POST
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Please provide a question." }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Get Gemini API key from environment variable
    const apiKey = GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI assistant is not configured properly." }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Call Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=" + apiKey,


      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: SYSTEM_PROMPT + "\n\nQuestion: " + question.trim() }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300,
            topP: 0.8
          }
        })
      }
    );

    const data = await response.json();

    // Extract answer text
    let answer = "Sorry, I could not generate a response.";
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
      answer = data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      answer = "Error: " + data.error.message;
    }

    return new Response(JSON.stringify({ answer: answer }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
