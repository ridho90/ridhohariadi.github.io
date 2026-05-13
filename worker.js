/**
 * Portfolio AI Assistant — Cloudflare Worker
 * 
 * Answers questions about Ridho Kusumo Hariadi's background
 * using verified profile data + Google Gemini API.
 *
 * Environment variables (secrets):
 *   GEMINI_API_KEY - Your Google Gemini API key
 *
 * Deploy:
 *   wrangler deploy worker.js
 *   wrangler secret put GEMINI_API_KEY
 */

// Embedded verified profile data
const PROFILE_DATA = {
  name: "Ridho Kusumo Hariadi",
  location: "Auckland, New Zealand",
  headline: "Care-driven. Hospitality-tested. AI-augmented.",
  tagline: "I'm an Auckland-based healthcare and hospitality professional combining person-centered care, high-volume service operations, and AI-powered workflows to deliver safer, faster, and more human-centered outcomes.",
  summary: "With hands-on experience across healthcare support, mental health environments, cruise hospitality, restaurant operations, and AI-enabled productivity, I bring a rare cross-sector perspective: empathy from healthcare, discipline from hospitality, and adaptability from technology.",
  education: [
    { credential: "NZ Certificate in Health and Wellbeing Level 4", institution: "Crown Institute of Studies", year: "2025–2026" },
    { credential: "Bachelor of Law (LLB)", institution: "Universitas Brawijaya", year: "2009–2013" }
  ],
  certifications: [
    "IELTS General 6.0 (March 2025)",
    "HACCP Food Safety",
    "AIDA F&B Advanced Training — Top Class Trainee",
    "NZ Full Class 1 Driver Licence"
  ],
  skills: {
    healthcare: ["Person-Centered Care", "Cultural Safety", "Electronic health documentation", "Support for daily living activities", "Observation, escalation, and safe communication", "Diversional therapy & music engagement (guitar & vocals)", "200+ clinical hours at CHT Beachhaven"],
    hospitality: ["F&B Head Steward — AIDA Cruises", "High-volume dining service (150–300 guests per shift)", "Guest satisfaction score 90/100", "Marine X Change POS system", "Team coordination under pressure", "International cruise environment (3 years)"],
    ai_and_tech: ["Claude Code — rapid prototyping & code assistance", "NotebookLM — knowledge synthesis & research", "VS Code — code editing & workflow", "Tailscale — secure device access", "macOS automation — daily productivity"],
    analytical: ["Technical analysis (crypto & stock markets)", "Portfolio management & risk control (Binance)", "Pattern recognition & structured decision-making"],
    mental_health: ["Psycho-social support for chronic conditions", "De-escalation & crisis support", "Family caregiver coaching", "Experience at RSJ Lawang, Indonesia"]
  },
  experience: [
    { role: "Trainee Healthcare Assistant", organization: "CHT Beachhaven", location: "Auckland, New Zealand", highlights: ["200+ clinical hours in residential aged care", "Person-centered care and resident wellbeing", "Electronic health documentation", "Mobility support and safe manual handling", "Diversional therapy through music (guitar & vocals)"] },
    { role: "Mental Health Support", organization: "RSJ Lawang", location: "Indonesia", highlights: ["Supported individuals with chronic schizophrenia", "Psycho-social support and de-escalation", "Family caregiver coaching", "Calm interpersonal communication in sensitive environments"] },
    { role: "F&B Head Steward", organization: "AIDA Cruises", location: "International", highlights: ["Managed dining service for 150–300 guests per shift", "Promoted from Assistant to Head Steward", "Consistent guest satisfaction rating of 90/100", "Marine X Change POS system", "HACCP food safety standards", "Coordinated international team"] },
    { role: "Restaurant Manager", organization: "Warunk Laseman", highlights: ["Led restaurant operations", "Coordinated service teams", "Customer experience management", "Daily workflow quality"] },
    { role: "Casual Waiter", organization: "Ascent Premier Hotel", highlights: ["Guest-facing hotel service", "Adaptability and service consistency", "Professional presentation"] }
  ],
  ai_workflow: {
    description: "How I use AI agents to learn faster, document better, and automate repetitive workflows.",
    steps: ["Capture: Save lecture notes, training materials, and research into NotebookLM", "Synthesize: Generate summaries, study guides, and practice questions", "Prototype: Use Claude Code to build simple tools (flashcards, trackers, document templates)", "Automate: macOS shortcuts for scheduling, reminders, and file organization"]
  },
  contact: { email: "ridho90@gmail.com", linkedin: "https://linkedin.com/in/ridho-hariadi" }
};

// System prompt — tells Gemini to only answer from verified data
const SYSTEM_PROMPT = `You are a professional portfolio assistant for ${PROFILE_DATA.name}, a healthcare, hospitality, and AI-augmented professional based in ${PROFILE_DATA.location}.

Your purpose is to answer questions about ${PROFILE_DATA.name}'s background, skills, experience, and qualifications.

CRITICAL RULES:
1. ONLY answer based on the verified profile data provided below.
2. If asked something NOT in the profile data, say: "I don't have that information in my verified sources. Please contact Ridho directly at ${PROFILE_DATA.contact.email} for more details."
3. Do NOT make up or fabricate any information.
4. Be concise, professional, and helpful.
5. Keep responses brief — 2-4 sentences max unless asked for details.
6. Use "he/him" pronouns when referring to ${PROFILE_DATA.name}.

VERIFIED PROFILE DATA (JSON):
${JSON.stringify(PROFILE_DATA, null, 2)}`;

export default {
  async fetch(request, env) {
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

      // Get Gemini API key from environment secret
      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "AI assistant is not configured properly." }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // Call Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${SYSTEM_PROMPT}\n\nQuestion: ${question.trim()}` }]
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
      let answer = "Sorry, I couldn't generate a response.";
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        answer = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        answer = `Error: ${data.error.message}`;
      }

      return new Response(JSON.stringify({ answer }), {
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
};
