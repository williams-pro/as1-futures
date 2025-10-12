export const PLAYER_LIST_ITEM_TEXTS = {
  UI: {
    JERSEY_PREFIX: "#",
    POSITION_SEPARATOR: " · ",
  },
  TOOLTIPS: {
    FAVORITE: {
      ADD: "Add to favorites",
      REMOVE: "Remove from favorites",
      CANNOT_REMOVE: "Cannot remove favorite while exclusive. Remove exclusive status first.",
    },
    EXCLUSIVE: {
      ADD: "Mark as exclusive",
      REMOVE: "Remove from exclusives",
      LIMIT_REACHED: "Maximum exclusives reached (3/3). Remove one first.",
    },
  },
  MODAL: {
    REMOVE_EXCLUSIVE: {
      TITLE: "Remove Exclusive Player",
      DESCRIPTION: "Are you sure you want to remove this player from your exclusives? This will free up a slot for another player.",
      CANCEL: "Cancel",
      CONFIRM: "Yes, Remove",
    },
  },
  ALT_TEXTS: {
    PLAYER_PHOTO: (firstName: string, lastName: string) => `${firstName} ${lastName} photo`,
    PLACEHOLDER_PHOTO: "placeholder.svg",
  },
} as const
