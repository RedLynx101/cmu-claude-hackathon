import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users } from "lucide-react";
import type { Club } from "@shared/schema";
import * as LucideIcons from "lucide-react";

interface ClubCardProps {
  club: Club;
}

export function ClubCard({ club }: ClubCardProps) {
  const IconComponent = (LucideIcons as any)[club.icon] || LucideIcons.Users;

  return (
    <Card className="hover-elevate h-full flex flex-col" data-testid={`card-club-${club.id}`}>
      <CardHeader className="gap-2 space-y-0 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-primary/10">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-wrap gap-1">
            {club.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        </div>
        <h3 className="text-xl font-semibold leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {club.name}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {club.description}
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-medium text-foreground mb-1">Offers</p>
            <div className="flex flex-wrap gap-1">
              {club.offerings.slice(0, 3).map((offering) => (
                <Badge key={offering} variant="outline" className="text-xs">
                  {offering}
                </Badge>
              ))}
              {club.offerings.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{club.offerings.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-foreground mb-1">Needs</p>
            <div className="flex flex-wrap gap-1">
              {club.needs.slice(0, 3).map((need) => (
                <Badge key={need} variant="outline" className="text-xs">
                  {need}
                </Badge>
              ))}
              {club.needs.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{club.needs.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 flex-wrap">
        <Button asChild variant="default" size="sm" className="flex-1" data-testid={`button-view-${club.id}`}>
          <Link href={`/clubs/${club.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
