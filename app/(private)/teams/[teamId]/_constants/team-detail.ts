export const TEAM_DETAIL_TEXTS = {
  UI: {
    BACK_TO_TEAMS: "Back to Teams",
    GROUP_PREFIX: "Group",
    PLAYER_COUNT: {
      SINGLE: "player",
      PLURAL: "players",
    },
    TEAM_ROSTER: "Team Roster",
    NO_PLAYERS_TITLE: "No players found",
    NO_PLAYERS_DESCRIPTION: "This team doesn't have any players registered yet",
  },
  ALT_TEXTS: {
    TEAM_LOGO: (teamName: string) => `${teamName} logo`,
  },
  PLACEHOLDERS: {
    TEAM_LOGO: "Team logo placeholder",
  },
} as const
