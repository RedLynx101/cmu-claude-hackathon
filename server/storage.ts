import { type Club, type InsertClub } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllClubs(): Promise<Club[]>;
  getClub(id: string): Promise<Club | undefined>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: string, club: InsertClub): Promise<Club | undefined>;
  deleteClub(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private clubs: Map<string, Club>;

  constructor() {
    this.clubs = new Map();
    this.seedData();
  }

  private seedData() {
    const seedClubs: InsertClub[] = [
      {
        name: "Heinz AI Club",
        description: "Exploring artificial intelligence applications in policy, business, and social impact. We bridge the gap between technical AI capabilities and real-world public policy challenges.",
        goals: [
          "Educate Heinz students on AI applications in policy and governance",
          "Build AI solutions for social impact projects",
          "Connect students with AI industry leaders and policymakers",
          "Host workshops on machine learning for policy analysis"
        ],
        offerings: [
          "AI workshops and tutorials",
          "Policy analysis tools",
          "Industry connections",
          "Technical mentorship",
          "Event hosting expertise"
        ],
        needs: [
          "Technical infrastructure support",
          "Marketing and outreach",
          "Collaboration with engineering clubs",
          "Funding for guest speakers"
        ],
        categories: ["Technology", "Academic", "Professional Development"],
        icon: "Sparkles"
      },
      {
        name: "CMU AI Club",
        description: "The premier artificial intelligence organization at Carnegie Mellon, bringing together students passionate about machine learning, deep learning, and AI research.",
        goals: [
          "Advance AI research and education on campus",
          "Host hackathons and competitions",
          "Facilitate collaboration between AI researchers",
          "Organize technical talks and workshops"
        ],
        offerings: [
          "Technical expertise in ML/AI",
          "Research connections",
          "Hackathon organization",
          "Computing resources",
          "Workshop facilitation"
        ],
        needs: [
          "Real-world problem statements",
          "Industry partnerships",
          "Event venues",
          "Cross-disciplinary collaboration"
        ],
        categories: ["Technology", "Academic", "Innovation"],
        icon: "Code"
      },
      {
        name: "Heinz Admin",
        description: "Supporting the administrative and operational needs of Heinz College student organizations. We help clubs navigate logistics, funding, and event planning.",
        goals: [
          "Streamline club operations at Heinz College",
          "Provide administrative resources and guidance",
          "Foster collaboration between Heinz organizations",
          "Improve student engagement"
        ],
        offerings: [
          "Event planning support",
          "Funding guidance",
          "Administrative resources",
          "Venue coordination",
          "Student organization training"
        ],
        needs: [
          "Technology solutions for event management",
          "Communication tools",
          "Student feedback systems",
          "Collaboration platforms"
        ],
        categories: ["Professional Development", "Community"],
        icon: "Briefcase"
      },
      {
        name: "SEE (Student Engagement & Events)",
        description: "Heinz College's premier event organization bringing students together through social, professional, and educational programming.",
        goals: [
          "Create memorable experiences for Heinz students",
          "Build community through diverse events",
          "Support professional development",
          "Enhance student life at Heinz"
        ],
        offerings: [
          "Large-scale event organization",
          "Social programming",
          "Professional networking events",
          "Budget management",
          "Vendor relationships"
        ],
        needs: [
          "Event promotion support",
          "Technical setup assistance",
          "Co-hosting partners",
          "Creative content for marketing"
        ],
        categories: ["Social Impact", "Community", "Professional Development"],
        icon: "Users"
      },
      {
        name: "Scotty Ventures",
        description: "CMU's entrepreneurship club fostering innovation and startup culture. We support student founders through mentorship, resources, and community.",
        goals: [
          "Support student entrepreneurs at CMU",
          "Connect founders with mentors and investors",
          "Host pitch competitions and demo days",
          "Build a thriving startup ecosystem"
        ],
        offerings: [
          "Entrepreneurship mentorship",
          "Pitch practice sessions",
          "Investor connections",
          "Business development support",
          "Demo day organization"
        ],
        needs: [
          "Technical co-founders",
          "Product development help",
          "Marketing expertise",
          "Design resources"
        ],
        categories: ["Business", "Innovation", "Professional Development"],
        icon: "Rocket"
      },
      {
        name: "CMU Blockchain Group",
        description: "Exploring blockchain technology, cryptocurrency, and decentralized systems. We educate, research, and build the future of Web3 at CMU.",
        goals: [
          "Educate students on blockchain technology",
          "Build decentralized applications",
          "Connect with Web3 industry leaders",
          "Research blockchain applications"
        ],
        offerings: [
          "Blockchain development expertise",
          "Smart contract development",
          "Web3 workshops",
          "Cryptocurrency education",
          "Industry connections"
        ],
        needs: [
          "Real-world use case partners",
          "Legal and policy guidance",
          "Marketing support",
          "Event venues"
        ],
        categories: ["Technology", "Innovation", "Academic"],
        icon: "GraduationCap"
      },
      {
        name: "Tartan Esports",
        description: "CMU's competitive gaming organization bringing together gamers of all skill levels. We compete, host tournaments, and build community through gaming.",
        goals: [
          "Represent CMU in collegiate esports competitions",
          "Host gaming tournaments and events",
          "Build an inclusive gaming community",
          "Provide gaming facilities and resources"
        ],
        offerings: [
          "Tournament organization",
          "Gaming equipment and space",
          "Streaming infrastructure",
          "Event production",
          "Community building"
        ],
        needs: [
          "Sponsorship and funding",
          "Marketing and social media",
          "Graphic design",
          "Event promotion"
        ],
        categories: ["Sports", "Community", "Cultural"],
        icon: "Gamepad2"
      },
      {
        name: "CMU Design League",
        description: "The central hub for design thinking and creative innovation at Carnegie Mellon. We bring together designers, artists, and creative thinkers.",
        goals: [
          "Promote design thinking across disciplines",
          "Host design workshops and critiques",
          "Connect students with design industry",
          "Showcase student design work"
        ],
        offerings: [
          "UX/UI design expertise",
          "Graphic design services",
          "Design thinking workshops",
          "Portfolio reviews",
          "Industry connections"
        ],
        needs: [
          "Client projects for practice",
          "Exhibition spaces",
          "Printing and production budget",
          "Cross-disciplinary collaboration"
        ],
        categories: ["Arts", "Professional Development", "Innovation"],
        icon: "Palette"
      },
      {
        name: "AB Tech",
        description: "Activities Board Technical Committee providing professional audio, lighting, and video production for campus events since 1982.",
        goals: [
          "Support campus events with technical production",
          "Train students in professional A/V skills",
          "Maintain state-of-the-art equipment",
          "Provide high-quality event experiences"
        ],
        offerings: [
          "Professional audio equipment",
          "Lighting design and setup",
          "Video production",
          "Technical crew training",
          "Event support services"
        ],
        needs: [
          "Event bookings",
          "Equipment funding",
          "Storage space",
          "Collaboration with event organizers"
        ],
        categories: ["Technology", "Arts", "Community"],
        icon: "Music"
      },
      {
        name: "CMU Data Science Club",
        description: "Empowering students to harness the power of data through analytics, visualization, and machine learning applications across industries.",
        goals: [
          "Build practical data science skills",
          "Work on real-world data projects",
          "Connect students with data science careers",
          "Host Kaggle competitions and workshops"
        ],
        offerings: [
          "Data analysis expertise",
          "Statistical modeling",
          "Data visualization",
          "Python/R workshops",
          "Industry project connections"
        ],
        needs: [
          "Dataset access",
          "Computing resources",
          "Industry partnerships",
          "Project opportunities"
        ],
        categories: ["Technology", "Academic", "Professional Development"],
        icon: "Target"
      },
      {
        name: "CMU Robotics Club",
        description: "Building autonomous systems and robots since 1982. We compete in competitions, work on research projects, and make really cool robots.",
        goals: [
          "Design and build innovative robots",
          "Compete in robotics competitions",
          "Provide hands-on robotics education",
          "Collaborate on research projects"
        ],
        offerings: [
          "Robotics engineering expertise",
          "Manufacturing capabilities",
          "Competition experience",
          "Hardware prototyping",
          "Technical workshops"
        ],
        needs: [
          "Funding for parts and materials",
          "Workshop space",
          "Collaboration on AI integration",
          "Sponsorships"
        ],
        categories: ["Technology", "Innovation", "Academic"],
        icon: "Trophy"
      },
      {
        name: "CMU Sustainable Earth",
        description: "Addressing climate change and environmental challenges through student action, education, and campus sustainability initiatives.",
        goals: [
          "Promote sustainability on campus",
          "Educate on environmental issues",
          "Implement green initiatives",
          "Connect with environmental organizations"
        ],
        offerings: [
          "Sustainability consulting",
          "Environmental education",
          "Green event planning",
          "Community partnerships",
          "Campaign organization"
        ],
        needs: [
          "Data analysis for impact measurement",
          "Technology for sustainability tracking",
          "Marketing for campaigns",
          "Funding for initiatives"
        ],
        categories: ["Social Impact", "Academic", "Community"],
        icon: "Lightbulb"
      }
    ];

    seedClubs.forEach(clubData => {
      const id = randomUUID();
      const club: Club = { ...clubData, id };
      this.clubs.set(id, club);
    });
  }

  async getAllClubs(): Promise<Club[]> {
    return Array.from(this.clubs.values());
  }

  async getClub(id: string): Promise<Club | undefined> {
    return this.clubs.get(id);
  }

  async createClub(insertClub: InsertClub): Promise<Club> {
    const id = randomUUID();
    const club: Club = { ...insertClub, id };
    this.clubs.set(id, club);
    return club;
  }

  async updateClub(id: string, insertClub: InsertClub): Promise<Club | undefined> {
    const existing = this.clubs.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: Club = { ...insertClub, id };
    this.clubs.set(id, updated);
    return updated;
  }

  async deleteClub(id: string): Promise<boolean> {
    return this.clubs.delete(id);
  }
}

export const storage = new MemStorage();
