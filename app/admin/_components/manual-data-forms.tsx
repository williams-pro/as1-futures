"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const teamSchema = z.object({
  teamCode: z
    .string()
    .min(3)
    .max(8)
    .regex(/^[A-Z0-9_]+$/, "Only uppercase letters, numbers, and underscores"),
  teamName: z.string().min(1, "Team name is required"),
  groupCode: z.enum(["A", "B"]),
  isAS1Team: z.boolean(),
})

const playerSchema = z.object({
  dni: z.string().optional(),
  teamCode: z.string().min(1, "Team is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  jerseyNumber: z.number().min(1).max(99),
  position: z.enum(["Forward", "Midfielder", "Defender", "Goalkeeper"]),
  birthDate: z.string().min(1, "Birth date is required"),
  heightCm: z.number().min(120).max(220),
  dominantFoot: z.enum(["Right", "Left", "Both"]),
  videoUrl1: z.string().url().optional().or(z.literal("")),
  videoUrl2: z.string().url().optional().or(z.literal("")),
  videoUrl3: z.string().url().optional().or(z.literal("")),
  comments: z.string().optional(),
})

const matchSchema = z.object({
  matchCode: z.string().min(1, "Match code is required"),
  groupCode: z.enum(["A", "B"]),
  team1Code: z.string().min(1, "Team 1 is required"),
  team2Code: z.string().min(1, "Team 2 is required"),
  matchDate: z.string().min(1, "Match date is required"),
  matchTime: z.string().min(1, "Match time is required"),
  videoUrl: z.string().url().optional().or(z.literal("")),
})

interface ManualDataFormsProps {
  type: "team" | "player" | "match"
}

export function ManualDataForms({ type }: ManualDataFormsProps) {
  if (type === "team") {
    return <TeamForm />
  } else if (type === "player") {
    return <PlayerForm />
  } else {
    return <MatchForm />
  }
}

function TeamForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(teamSchema),
  })

  const onSubmit = (data: any) => {
    console.log("[v0] Team form submitted:", data)
    reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Team Manually</CardTitle>
        <CardDescription>Create a new team using the form below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamCode">Team Code</Label>
              <Input
                id="teamCode"
                {...register("teamCode")}
                placeholder="GREAT_FARCOS_A"
                className={errors.teamCode ? "border-destructive" : ""}
              />
              {errors.teamCode && <p className="text-sm text-destructive">{errors.teamCode.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                {...register("teamName")}
                placeholder="Great Farcos FC"
                className={errors.teamName ? "border-destructive" : ""}
              />
              {errors.teamName && <p className="text-sm text-destructive">{errors.teamName.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupCode">Group</Label>
              <Select {...register("groupCode")}>
                <SelectTrigger className={errors.groupCode ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Group A</SelectItem>
                  <SelectItem value="B">Group B</SelectItem>
                </SelectContent>
              </Select>
              {errors.groupCode && <p className="text-sm text-destructive">{errors.groupCode.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isAS1Team">AS1 Team</Label>
              <Select {...register("isAS1Team")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Add Team</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function PlayerForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(playerSchema),
  })

  const onSubmit = (data: any) => {
    console.log("[v0] Player form submitted:", data)
    reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Player Manually</CardTitle>
        <CardDescription>Create a new player using the form below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} className={errors.lastName ? "border-destructive" : ""} />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dni">DNI (Optional)</Label>
              <Input id="dni" {...register("dni")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamCode">Team</Label>
              <Input id="teamCode" {...register("teamCode")} className={errors.teamCode ? "border-destructive" : ""} />
              {errors.teamCode && <p className="text-sm text-destructive">{errors.teamCode.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jerseyNumber">Jersey Number</Label>
              <Input
                id="jerseyNumber"
                type="number"
                {...register("jerseyNumber", { valueAsNumber: true })}
                className={errors.jerseyNumber ? "border-destructive" : ""}
              />
              {errors.jerseyNumber && (
                <p className="text-sm text-destructive">{errors.jerseyNumber.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select {...register("position")}>
                <SelectTrigger className={errors.position ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Forward">Forward</SelectItem>
                  <SelectItem value="Midfielder">Midfielder</SelectItem>
                  <SelectItem value="Defender">Defender</SelectItem>
                  <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                </SelectContent>
              </Select>
              {errors.position && <p className="text-sm text-destructive">{errors.position.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate")}
                className={errors.birthDate ? "border-destructive" : ""}
              />
              {errors.birthDate && <p className="text-sm text-destructive">{errors.birthDate.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="heightCm">Height (cm)</Label>
              <Input
                id="heightCm"
                type="number"
                {...register("heightCm", { valueAsNumber: true })}
                className={errors.heightCm ? "border-destructive" : ""}
              />
              {errors.heightCm && <p className="text-sm text-destructive">{errors.heightCm.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dominantFoot">Dominant Foot</Label>
              <Select {...register("dominantFoot")}>
                <SelectTrigger className={errors.dominantFoot ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select foot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Right">Right</SelectItem>
                  <SelectItem value="Left">Left</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
              {errors.dominantFoot && (
                <p className="text-sm text-destructive">{errors.dominantFoot.message as string}</p>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="videoUrl1">Video URL 1 (Optional)</Label>
              <Input id="videoUrl1" type="url" {...register("videoUrl1")} />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="comments">Comments (Optional)</Label>
              <Textarea id="comments" {...register("comments")} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Add Player</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function MatchForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(matchSchema),
  })

  const onSubmit = (data: any) => {
    console.log("[v0] Match form submitted:", data)
    reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Match Manually</CardTitle>
        <CardDescription>Create a new match using the form below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matchCode">Match Code</Label>
              <Input
                id="matchCode"
                {...register("matchCode")}
                placeholder="JORNADA_1_A"
                className={errors.matchCode ? "border-destructive" : ""}
              />
              {errors.matchCode && <p className="text-sm text-destructive">{errors.matchCode.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupCode">Group</Label>
              <Select {...register("groupCode")}>
                <SelectTrigger className={errors.groupCode ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Group A</SelectItem>
                  <SelectItem value="B">Group B</SelectItem>
                </SelectContent>
              </Select>
              {errors.groupCode && <p className="text-sm text-destructive">{errors.groupCode.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="team1Code">Team 1</Label>
              <Input
                id="team1Code"
                {...register("team1Code")}
                className={errors.team1Code ? "border-destructive" : ""}
              />
              {errors.team1Code && <p className="text-sm text-destructive">{errors.team1Code.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="team2Code">Team 2</Label>
              <Input
                id="team2Code"
                {...register("team2Code")}
                className={errors.team2Code ? "border-destructive" : ""}
              />
              {errors.team2Code && <p className="text-sm text-destructive">{errors.team2Code.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchDate">Match Date</Label>
              <Input
                id="matchDate"
                type="date"
                {...register("matchDate")}
                className={errors.matchDate ? "border-destructive" : ""}
              />
              {errors.matchDate && <p className="text-sm text-destructive">{errors.matchDate.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchTime">Match Time</Label>
              <Input
                id="matchTime"
                type="time"
                {...register("matchTime")}
                className={errors.matchTime ? "border-destructive" : ""}
              />
              {errors.matchTime && <p className="text-sm text-destructive">{errors.matchTime.message as string}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="videoUrl">Video URL (Optional)</Label>
              <Input id="videoUrl" type="url" {...register("videoUrl")} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Add Match</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
