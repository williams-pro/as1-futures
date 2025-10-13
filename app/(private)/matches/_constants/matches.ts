export const MATCHES_TEXTS = {
  UI: {
    PAGE_TITLE: "Matches",
    PAGE_DESCRIPTION: "View match schedule and watch game videos",
    NO_MATCHES_TITLE: "No matches found",
    NO_MATCHES_DESCRIPTION: "Try adjusting your filters",
  },
  MATCH_CARD: {
    GROUPS: {
      A: "Group A",
      B: "Group B",
    },
    TEAM_LABELS: {
      HOME: "Home",
      AWAY: "Away",
    },
    BUTTONS: {
      WATCH_VIDEO: "Watch Video",
      VIDEO_NOT_AVAILABLE: "Video Not Available",
    },
  },
  ALT_TEXTS: {
    TEAM_LOGO: (teamName: string) => `${teamName} logo`,
  },
} as const
