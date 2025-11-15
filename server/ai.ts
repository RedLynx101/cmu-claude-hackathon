// Using Replit's AI Integrations service for Anthropic API access
// This uses AI_INTEGRATIONS_ANTHROPIC_BASE_URL and AI_INTEGRATIONS_ANTHROPIC_API_KEY
import Anthropic from "@anthropic-ai/sdk";
import type { Club, Match } from "@shared/schema";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

export async function findMatches(sourceClub: Club, allClubs: Club[]): Promise<Match[]> {
  const otherClubs = allClubs.filter(c => c.id !== sourceClub.id);
  
  if (otherClubs.length === 0) {
    return [];
  }

  const prompt = `You are an AI collaboration advisor for Carnegie Mellon University student organizations.

Source Club: ${sourceClub.name}
Description: ${sourceClub.description}
Goals: ${sourceClub.goals.join(", ")}
What we offer: ${sourceClub.offerings.join(", ")}
What we need: ${sourceClub.needs.join(", ")}

Available clubs to match with:
${otherClubs.map((club, i) => `
${i + 1}. ${club.name}
   Description: ${club.description}
   Goals: ${club.goals.join(", ")}
   Offerings: ${club.offerings.join(", ")}
   Needs: ${club.needs.join(", ")}
`).join("\n")}

Analyze these clubs and identify the top 3 best collaboration matches for ${sourceClub.name}.

For each match, provide:
1. Match score (0-100) based on complementary strengths, aligned goals, and mutual benefits
2. Clear reasoning explaining why this is a good match
3. 3-5 specific collaboration ideas
4. A professional collaboration proposal (2-3 paragraphs)
5. A friendly outreach email message

Return your response as a JSON array with this exact structure:
[
  {
    "clubName": "Club Name",
    "matchScore": 85,
    "reasoning": "Detailed explanation of why this is a strong match...",
    "collaborationIdeas": [
      "Specific idea 1",
      "Specific idea 2",
      "Specific idea 3"
    ],
    "proposal": "Multi-paragraph professional proposal...",
    "outreachMessage": "Subject: Collaboration Opportunity Between [Club A] and [Club B]\\n\\nDear [Club B] Team,\\n\\nMessage body..."
  }
]

Return ONLY the JSON array, no other text.`;

  try {
    console.log(`Finding matches for ${sourceClub.name}...`);
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Claude API timeout after 5 seconds')), 5000)
    );
    
    const apiPromise = anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    
    const response = await Promise.race([apiPromise, timeoutPromise]) as Anthropic.Message;

    const content = response.content[0];
    if (content.type !== "text") {
      console.error("Unexpected response type from Claude:", content.type);
      throw new Error("Unexpected response type from Claude");
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Could not find JSON in Claude response:", content.text);
      throw new Error("Could not parse JSON from Claude response");
    }

    let matchesData: any[];
    try {
      matchesData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw text:", jsonMatch[0]);
      throw new Error("Invalid JSON format in Claude response");
    }

    if (!Array.isArray(matchesData)) {
      console.error("Response is not an array:", matchesData);
      throw new Error("Expected array of matches from Claude");
    }

    const matches: Match[] = [];
    for (const data of matchesData) {
      // Validate required fields
      if (!data.clubName || typeof data.matchScore !== 'number') {
        console.warn("Skipping invalid match data:", data);
        continue;
      }

      const matchedClub = otherClubs.find(c => 
        c.name.toLowerCase() === data.clubName.toLowerCase()
      );
      
      if (!matchedClub) {
        console.warn(`Club not found for: ${data.clubName}, skipping`);
        continue;
      }

      matches.push({
        club: matchedClub,
        matchScore: Math.min(100, Math.max(0, data.matchScore)),
        reasoning: data.reasoning || "Strong potential for collaboration based on complementary goals and resources.",
        collaborationIdeas: Array.isArray(data.collaborationIdeas) ? data.collaborationIdeas : [],
        proposal: data.proposal || "We believe our organizations could create significant value by working together.",
        outreachMessage: data.outreachMessage || "Hi! We'd love to explore collaboration opportunities between our clubs.",
      });
    }

    if (matches.length === 0) {
      console.warn("No valid matches from Claude, using heuristic fallback");
      return generateHeuristicMatches(sourceClub, otherClubs);
    }

    console.log(`Successfully generated ${matches.length} AI matches for ${sourceClub.name}`);
    return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  } catch (error) {
    console.error(`Error finding matches for ${sourceClub.name}, using heuristic fallback:`, error);
    return generateHeuristicMatches(sourceClub, otherClubs);
  }
}

function generateHeuristicMatches(sourceClub: Club, otherClubs: Club[]): Match[] {
  console.log(`Using heuristic matching for ${sourceClub.name} with ${otherClubs.length} other clubs`);
  
  const scored = otherClubs.map(club => {
    let score = 0;
    
    const sourceCategories = new Set(sourceClub.categories);
    const targetCategories = new Set(club.categories);
    const categoryOverlap = sourceClub.categories.filter(c => targetCategories.has(c)).length;
    score += categoryOverlap * 15;
    
    const sourceNeedsSet = new Set(sourceClub.needs.map(n => n.toLowerCase()));
    const targetOfferingsSet = new Set(club.offerings.map(o => o.toLowerCase()));
    const needsMatch = sourceClub.needs.filter(need => 
      Array.from(targetOfferingsSet).some(offering => 
        offering.includes(need.toLowerCase()) || need.toLowerCase().includes(offering)
      )
    ).length;
    score += needsMatch * 20;
    
    const sourceOfferingsSet = new Set(sourceClub.offerings.map(o => o.toLowerCase()));
    const targetNeedsSet = new Set(club.needs.map(n => n.toLowerCase()));
    const offeringsMatch = club.needs.filter(need => 
      Array.from(sourceOfferingsSet).some(offering => 
        offering.includes(need.toLowerCase()) || need.toLowerCase().includes(offering)
      )
    ).length;
    score += offeringsMatch * 20;
    
    score += Math.random() * 15;
    
    return { club, score: Math.min(100, Math.max(40, score)) };
  });
  
  const topMatches = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  
  return topMatches.map(({ club, score }) => ({
    club,
    matchScore: Math.round(score),
    reasoning: `${sourceClub.name} and ${club.name} share ${sourceClub.categories.filter(c => club.categories.includes(c)).join(", ")} interests. ${sourceClub.name}'s strengths in ${sourceClub.offerings.slice(0, 2).join(" and ")} could complement ${club.name}'s needs, while ${club.name} offers valuable ${club.offerings.slice(0, 2).join(" and ")} that aligns with ${sourceClub.name}'s goals.`,
    collaborationIdeas: [
      `Co-host a joint workshop combining ${sourceClub.name}'s ${sourceClub.offerings[0] || "expertise"} with ${club.name}'s ${club.offerings[0] || "resources"}`,
      `Create a collaborative project addressing shared goals in ${sourceClub.categories[0] || "your field"}`,
      `Organize a panel discussion featuring members from both organizations`,
    ],
    proposal: `Dear ${club.name} Team,\n\nWe at ${sourceClub.name} believe our organizations have significant potential for collaboration. Our shared focus on ${sourceClub.categories[0] || "innovation"} and complementary strengths create an excellent foundation for partnership.\n\n${sourceClub.name} brings ${sourceClub.offerings.slice(0, 2).join(", ")}, while ${club.name} offers ${club.offerings.slice(0, 2).join(", ")}. Together, we could create impactful programming that serves the CMU community.\n\nWe'd love to explore specific collaboration opportunities. Would you be open to a meeting to discuss potential joint initiatives?\n\nBest regards,\n${sourceClub.name}`,
    outreachMessage: `Subject: Collaboration Opportunity Between ${sourceClub.name} and ${club.name}\n\nHi ${club.name} Team,\n\nI'm reaching out from ${sourceClub.name} because we see great potential for collaboration between our clubs. We've been impressed by your work in ${club.categories[0] || "the community"} and think our organizations could create something special together.\n\nWould you be interested in meeting to explore partnership opportunities? We have some ideas about joint events and projects that could benefit both our members.\n\nLooking forward to hearing from you!\n\nBest,\n${sourceClub.name}`,
  }));
}
