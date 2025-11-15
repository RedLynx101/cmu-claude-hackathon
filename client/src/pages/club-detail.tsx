import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Sparkles } from "lucide-react";
import type { Club } from "@shared/schema";
import * as LucideIcons from "lucide-react";

export default function ClubDetail() {
  const { id } = useParams();
  const { data: club, isLoading } = useQuery<Club>({
    queryKey: ["/api/clubs", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Club not found</h2>
          <p className="text-muted-foreground mb-6">The club you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = (LucideIcons as any)[club.icon] || LucideIcons.Users;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild data-testid="button-back">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              {club.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild data-testid="button-edit">
              <Link href={`/clubs/${club.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button asChild data-testid="button-find-matches">
              <Link href={`/matches?clubId=${club.id}`}>
                <Sparkles className="mr-2 h-4 w-4" />
                Find Matches
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <IconComponent className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }} data-testid="text-club-name">
              {club.name}
            </h1>
            <p className="text-lg text-muted-foreground" data-testid="text-club-description">
              {club.description}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Goals
              </h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {club.goals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{goal}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                What We Offer
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {club.offerings.map((offering) => (
                  <Badge key={offering} variant="secondary" data-testid={`badge-offering-${offering}`}>
                    {offering}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                What We Need
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {club.needs.map((need) => (
                  <Badge key={need} variant="outline" data-testid={`badge-need-${need}`}>
                    {need}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardHeader>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Ready to Collaborate?
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Use our AI-powered matching system to find complementary clubs and generate collaboration proposals.
              </p>
              <Button asChild className="w-full" data-testid="button-start-matching">
                <Link href={`/matches?clubId=${club.id}`}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Find Perfect Matches
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
