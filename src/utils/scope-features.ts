export const POINTS_PER_SCOPE = {
  FREE: 10,
  PRO: 200,
} as const;

export const SCOPES_FEATURES = {
  FREE: [
    `${POINTS_PER_SCOPE.FREE} messages /month`,
    "Unlimited projects",
    "End-to-end Encryption",
  ],
  PRO: [
    `${POINTS_PER_SCOPE.PRO} messages /month`,
    "LLM and Sandbox configurations",
    "Unlock Runp at full capacity",
  ],
  // ENTERPRISE: [],
};
