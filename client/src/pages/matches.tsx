import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Copy, Check, AlertCircle } from "lucide-react";
import type { Club, Match } from "@shared/schema";
import * as LucideIcons from "lucide-react";

export default function Matches() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const clubIdFromUrl = params.get("clubId");

  const [selectedClubId, setSelectedClubId] = useState<string>(clubIdFromUrl || "");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: clubs } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const matchMutation = useMutation({
    mutationFn: (clubId: string) => apiRequest("POST", "/api/matches", { clubId }),
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to find matches. Please try again.",
        variant: "destructive",
      });
    },
  });

  const matches = matchMutation.data as Match[] | undefined;

  const handleFindMatches = () => {
    if (selectedClubId) {
      matchMutation.mutate(selectedClubId);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied!", description: "Text copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedClub = clubs?.find(c => c.id === selectedClubId);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Find Collaboration Matches
          </h1>
          <p className="text-muted-foreground">
            Use AI to discover complementary clubs and generate collaboration proposals
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Select Your Club
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <Select value={selectedClubId} onValueChange={setSelectedClubId}>
                <SelectTrigger className="w-full md:w-96" data-testid="select-club">
                  <SelectValue placeholder="Choose a club..." />
                </SelectTrigger>
                <SelectContent>
                  {clubs?.map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleFindMatches}
                disabled={!selectedClubId || matchMutation.isPending}
                data-testid="button-find-matches"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {matchMutation.isPending ? "Finding Matches..." : "Find Matches"}
              </Button>
            </div>

            {selectedClub && (
              <div className="p-4 rounded-md bg-muted">
                <p className="text-sm font-medium mb-1">Selected Club:</p>
                <p className="text-sm text-muted-foreground">{selectedClub.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {matchMutation.isPending && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-md bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <p className="text-sm font-medium">AI is analyzing club compatibility...</p>
            </div>
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {matches && matches.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-md bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Found {matches.length} potential collaboration matches!</p>
                <p className="text-xs text-muted-foreground">Sorted by compatibility score</p>
              </div>
            </div>

            {matches.map((match, index) => {
              const IconComponent = (LucideIcons as any)[match.club.icon] || LucideIcons.Users;
              const scoreColor = match.matchScore >= 80 ? "text-green-600" : match.matchScore >= 60 ? "text-yellow-600" : "text-gray-600";
              
              return (
                <Card key={match.club.id} className="overflow-hidden" data-testid={`card-match-${index}`}>
                  <CardHeader className="gap-0 space-y-0">
                    <div className="flex items-start gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ${scoreColor}`}>
                          <span className="text-2xl font-bold" data-testid={`text-score-${index}`}>
                            {match.matchScore}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Match</p>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }} data-testid={`text-match-name-${index}`}>
                                {match.club.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{match.club.description}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {match.club.categories.map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="reasoning">
                        <AccordionTrigger data-testid={`accordion-reasoning-${index}`}>
                          Why This Match?
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground" data-testid={`text-reasoning-${index}`}>
                            {match.reasoning}
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="ideas">
                        <AccordionTrigger data-testid={`accordion-ideas-${index}`}>
                          Collaboration Ideas ({match.collaborationIdeas.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {match.collaborationIdeas.map((idea, ideaIndex) => (
                              <li key={ideaIndex} className="flex items-start gap-2" data-testid={`item-idea-${index}-${ideaIndex}`}>
                                <span className="text-primary mt-1">•</span>
                                <span className="text-sm">{idea}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="proposal">
                        <AccordionTrigger data-testid={`accordion-proposal-${index}`}>
                          Collaboration Proposal
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <div className="rounded-md bg-muted p-4">
                              <p className="whitespace-pre-wrap text-sm" data-testid={`text-proposal-${index}`}>
                                {match.proposal}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(match.proposal, `proposal-${index}`)}
                              data-testid={`button-copy-proposal-${index}`}
                            >
                              {copiedId === `proposal-${index}` ? (
                                <Check className="mr-2 h-4 w-4" />
                              ) : (
                                <Copy className="mr-2 h-4 w-4" />
                              )}
                              {copiedId === `proposal-${index}` ? "Copied!" : "Copy Proposal"}
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="outreach">
                        <AccordionTrigger data-testid={`accordion-outreach-${index}`}>
                          Outreach Message Template
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <div className="rounded-md bg-muted p-4">
                              <p className="whitespace-pre-wrap text-sm" data-testid={`text-outreach-${index}`}>
                                {match.outreachMessage}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(match.outreachMessage, `outreach-${index}`)}
                              data-testid={`button-copy-outreach-${index}`}
                            >
                              {copiedId === `outreach-${index}` ? (
                                <Check className="mr-2 h-4 w-4" />
                              ) : (
                                <Copy className="mr-2 h-4 w-4" />
                              )}
                              {copiedId === `outreach-${index}` ? "Copied!" : "Copy Message"}
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {matchMutation.isError && (
          <Card className="border-destructive">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium">Failed to find matches</p>
                <p className="text-sm text-muted-foreground">Please try again or select a different club.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!matchMutation.isPending && !matches && !matchMutation.isError && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to discover collaborations?</h3>
            <p className="text-muted-foreground max-w-md">
              Select your club above and let our AI find the perfect partnership opportunities for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
