export const PLAYER_DETAIL_TEXTS = {
  UI: {
    BACK_TO_TEAM: "Back to",
    BACK_TO_TEAMS: "Back to Teams",
    JERSEY_PREFIX: "#",
    GROUP_PREFIX: "Group",
    FAVORITE_BADGE: "Favorite",
    EXCLUSIVE_BADGE: "Exclusive",
  },
  BUTTONS: {
    FAVORITE: {
      ADD: "Add to Favorites",
      REMOVE: "Remove Favorite",
    },
    EXCLUSIVE: {
      ADD: "Mark as Exclusive",
      REMOVE: "Remove Exclusive",
    },
  },
  TOOLTIPS: {
    FAVORITE: {
      ADD: "Click to add to favorites (unlimited)",
      REMOVE: "Click to remove from favorites",
      CANNOT_REMOVE: "Cannot remove from favorites while player is exclusive. Remove exclusive status first.",
    },
    EXCLUSIVE: {
      ADD: "Click to mark as exclusive (max 3 players). Automatically adds to favorites.",
      REMOVE: "Click to remove exclusive status. Player will remain in favorites.",
      LIMIT_REACHED: "Maximum exclusives reached (3/3). Remove one first.",
    },
  },
  MODAL: {
    REMOVE_FAVORITE: {
      TITLE: "Remove from Favorites?",
      DESCRIPTION: (firstName: string, lastName: string) => 
        `Are you sure you want to remove ${firstName} ${lastName} from your favorites? This action cannot be undone.`,
      CONFIRM: "Remove",
      CANCEL: "Cancel",
    },
    REMOVE_EXCLUSIVE: {
      TITLE: "Remove Exclusive Status?",
      DESCRIPTION: (firstName: string, lastName: string) => 
        `${firstName} ${lastName} will no longer be marked as exclusive, but will remain in your favorites. You can mark another player as exclusive.`,
      CONFIRM: "Remove Exclusive",
      CANCEL: "Cancel",
    },
  },
  ALT_TEXTS: {
    PLAYER_PHOTO: (firstName: string, lastName: string) => `${firstName} ${lastName} photo`,
    PLACEHOLDER_PHOTO: "placeholder.svg",
  },
} as const
