export const POINTS_PER_SCOPE = {
  FREE: 5,
  PRO: 100,
} as const;

export const SCOPES_FEATURES = {
  FREE: [
    `${POINTS_PER_SCOPE.FREE} messages /month`,
    "Unlimited projects",
    "T3 App Docker Image",
  ],
  PRO: [
    `${POINTS_PER_SCOPE.PRO} messages /month`,
    "LLM and Sandbox configurations",
    "Unlock Runp at full capacity",
  ],
  // ENTERPRISE: [],
};
