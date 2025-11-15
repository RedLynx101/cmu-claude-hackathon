import { useQuery } from "@tanstack/react-query";
import { ClubCard } from "@/components/club-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { Club } from "@shared/schema";

export default function Dashboard() {
  const { data: clubs, isLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }} data-testid="text-dashboard-title">
              Discover Collaboration
            </h1>
            <p className="mt-2 text-muted-foreground">
              Connect with student organizations and find partnership opportunities powered by AI
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button asChild variant="outline" data-testid="button-find-matches">
              <Link href="/matches">
                <Sparkles className="mr-2 h-4 w-4" />
                Find Matches
              </Link>
            </Button>
            <Button asChild data-testid="button-add-club">
              <Link href="/clubs/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your Club
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-clubs">
                  {isLoading ? "..." : clubs?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Active Clubs</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">AI-Powered</p>
                <p className="text-sm text-muted-foreground">Smart Matching</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">Unlimited</p>
                <p className="text-sm text-muted-foreground">Collaborations</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            All Student Organizations
          </h2>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : clubs && clubs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="grid-clubs">
              {clubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <Plus className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No clubs yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Be the first to add your student organization and start discovering collaboration opportunities!
              </p>
              <Button asChild data-testid="button-add-first-club">
                <Link href="/clubs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your Club
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
