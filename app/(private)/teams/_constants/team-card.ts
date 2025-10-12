export const TEAM_CARD_TEXTS = {
  UI: {
    GROUP_PREFIX: "Group",
    PLAYERS_LABEL: "players",
    VIEW_PLAYERS: "View Players",
    VIEW_TEAM: "View Team",
    AS1_LABEL: "AS1",
  },
  ALT_TEXTS: {
    TEAM_LOGO: (teamName: string) => `${teamName} logo`,
    PLACEHOLDER_LOGO: "placeholder.svg",
  },
  STYLES: {
    IMAGE_FILTER: "brightness(1.05) contrast(1.1)",
  },
} as const
