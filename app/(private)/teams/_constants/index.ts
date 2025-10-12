export const TEAMS_TEXTS = {
  PAGE: {
    TITLE: "Teams",
    DESCRIPTION: "Browse teams organized by tournament groups",
  },
  TABS: {
    ALL_GROUPS: "All Groups",
    GROUP_A: "Group A", 
    GROUP_B: "Group B",
  },
  STATS: {
    TOURNAMENT_GROUPS: "2 Tournament Groups",
  },
} as const

export const TABS_DATA = [
  {
    value: "all",
    label: TEAMS_TEXTS.TABS.ALL_GROUPS,
    group: null, // null significa mostrar todos los grupos
  },
  {
    value: "a", 
    label: TEAMS_TEXTS.TABS.GROUP_A,
    group: "A",
  },
  {
    value: "b",
    label: TEAMS_TEXTS.TABS.GROUP_B,
    group: "B",
  },
] as const

// Re-export team card constants
export { TEAM_CARD_TEXTS } from './team-card'
