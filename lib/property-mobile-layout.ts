/** Sticky offset for content below the mobile stay header (matches header inner `h-11`). */
export const MOBILE_STAY_HEADER_HEIGHT = "2.75rem";

export const MOBILE_STAY_HEADER_STICKY_TOP = `calc(${MOBILE_STAY_HEADER_HEIGHT} + env(safe-area-inset-top, 0px))`;
