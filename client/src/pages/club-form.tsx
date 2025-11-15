import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClubSchema } from "@shared/schema";
import type { InsertClub, Club } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Plus, X } from "lucide-react";

const iconOptions = [
  "Sparkles", "Users", "Code", "Palette", "Music", "Gamepad2",
  "Rocket", "GraduationCap", "Briefcase", "Lightbulb", "Trophy", "Target"
];

const categoryOptions = [
  "Technology", "Business", "Arts", "Sports", "Social Impact",
  "Academic", "Cultural", "Professional Development", "Innovation", "Community"
];

export default function ClubForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEdit = !!id;

  const [goalInput, setGoalInput] = useState("");
  const [offeringInput, setOfferingInput] = useState("");
  const [needInput, setNeedInput] = useState("");

  const { data: club } = useQuery<Club>({
    queryKey: ["/api/clubs", id],
    queryFn: async () => {
      const response = await fetch(`/api/clubs/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch club");
      }
      return response.json();
    },
    enabled: isEdit,
  });

  const form = useForm<InsertClub>({
    resolver: zodResolver(insertClubSchema),
    defaultValues: {
      name: "",
      description: "",
      goals: [],
      offerings: [],
      needs: [],
      categories: [],
      icon: "Users",
    },
  });

  useEffect(() => {
    if (club) {
      form.reset({
        name: club.name,
        description: club.description,
        goals: club.goals,
        offerings: club.offerings,
        needs: club.needs,
        categories: club.categories,
        icon: club.icon,
      });
    }
  }, [club]);

  const createMutation = useMutation({
    mutationFn: (data: InsertClub) => apiRequest("POST", "/api/clubs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      toast({ title: "Success!", description: "Club created successfully" });
      setLocation("/");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertClub) => apiRequest("PUT", `/api/clubs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      toast({ title: "Success!", description: "Club updated successfully" });
      setLocation(`/clubs/${id}`);
    },
  });

  const onSubmit = (data: InsertClub) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const addItem = (field: "goals" | "offerings" | "needs", value: string, setValue: (v: string) => void) => {
    if (value.trim()) {
      const current = form.getValues(field);
      form.setValue(field, [...current, value.trim()]);
      setValue("");
    }
  };

  const removeItem = (field: "goals" | "offerings" | "needs", index: number) => {
    const current = form.getValues(field);
    form.setValue(field, current.filter((_, i) => i !== index));
  };

  const toggleCategory = (category: string) => {
    const current = form.getValues("categories");
    if (current.includes(category)) {
      form.setValue("categories", current.filter(c => c !== category));
    } else {
      form.setValue("categories", [...current, category]);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild data-testid="button-back">
            <Link href={isEdit ? `/clubs/${id}` : "/"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {isEdit ? "Edit Club" : "Add Your Club"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEdit ? "Update your club information" : "Join the CollabCMU community"}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Basic Information
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Heinz AI Club" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your club's mission and activities..."
                          className="min-h-24"
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-icon">
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value.map((category) => (
                          <Badge key={category} variant="secondary" className="gap-1" data-testid={`badge-category-${category}`}>
                            {category}
                            <button
                              type="button"
                              onClick={() => toggleCategory(category)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categoryOptions.filter(c => !field.value.includes(c)).map((category) => (
                          <Badge
                            key={category}
                            variant="outline"
                            className="cursor-pointer hover-elevate"
                            onClick={() => toggleCategory(category)}
                            data-testid={`badge-add-category-${category}`}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            {category}
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Goals & Objectives
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are your club's goals?</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a goal..."
                          value={goalInput}
                          onChange={(e) => setGoalInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("goals", goalInput, setGoalInput))}
                          data-testid="input-goal"
                        />
                        <Button
                          type="button"
                          onClick={() => addItem("goals", goalInput, setGoalInput)}
                          data-testid="button-add-goal"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 mt-2">
                        {field.value.map((goal, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted" data-testid={`item-goal-${index}`}>
                            <span className="flex-1 text-sm">{goal}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeItem("goals", index)}
                              data-testid={`button-remove-goal-${index}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  What We Offer
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="offerings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resources, skills, or support your club can provide</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Workshop hosting, Technical expertise..."
                          value={offeringInput}
                          onChange={(e) => setOfferingInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("offerings", offeringInput, setOfferingInput))}
                          data-testid="input-offering"
                        />
                        <Button
                          type="button"
                          onClick={() => addItem("offerings", offeringInput, setOfferingInput)}
                          data-testid="button-add-offering"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((offering, index) => (
                          <Badge key={index} variant="secondary" className="gap-1" data-testid={`badge-offering-${index}`}>
                            {offering}
                            <button
                              type="button"
                              onClick={() => removeItem("offerings", index)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  What We Need
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="needs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resources or support your club is looking for</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Event space, Marketing support..."
                          value={needInput}
                          onChange={(e) => setNeedInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("needs", needInput, setNeedInput))}
                          data-testid="input-need"
                        />
                        <Button
                          type="button"
                          onClick={() => addItem("needs", needInput, setNeedInput)}
                          data-testid="button-add-need"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((need, index) => (
                          <Badge key={index} variant="outline" className="gap-1" data-testid={`badge-need-${index}`}>
                            {need}
                            <button
                              type="button"
                              onClick={() => removeItem("needs", index)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" asChild data-testid="button-cancel">
                <Link href={isEdit ? `/clubs/${id}` : "/"}>
                  Cancel
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-submit"
              >
                {isEdit ? "Update Club" : "Create Club"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
