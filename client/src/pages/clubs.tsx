import { useQuery } from "@tanstack/react-query";
import { ClubCard } from "@/components/club-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import type { Club } from "@shared/schema";

export default function Clubs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: clubs, isLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const allCategories = Array.from(
    new Set(clubs?.flatMap((club) => club.categories) || [])
  );

  const filteredClubs = clubs?.filter((club) => {
    const matchesSearch =
      searchQuery === "" ||
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || club.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              All Student Clubs
            </h1>
            <p className="mt-2 text-muted-foreground">
              Browse and discover CMU student organizations
            </p>
          </div>
          <Button asChild data-testid="button-add-club">
            <Link href="/clubs/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Your Club
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>

          {allCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer hover-elevate"
                onClick={() => setSelectedCategory(null)}
                data-testid="badge-category-all"
              >
                All
              </Badge>
              {allCategories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover-elevate"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`badge-category-${category}`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </div>

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
        ) : filteredClubs && filteredClubs.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground" data-testid="text-results-count">
              Showing {filteredClubs.length} {filteredClubs.length === 1 ? "club" : "clubs"}
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="grid-clubs">
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No clubs found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery || selectedCategory
                ? "Try adjusting your search or filters."
                : "Be the first to add a club!"}
            </p>
            {!searchQuery && !selectedCategory && (
              <Button asChild data-testid="button-add-first-club">
                <Link href="/clubs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your Club
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
