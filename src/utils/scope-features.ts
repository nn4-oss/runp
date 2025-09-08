export const POINTS_PER_SCOPE = {
  FREE: 10,
  PRO: 200,
} as const;

export const SCOPES_FEATURES = {
  FREE: [
    `${POINTS_PER_SCOPE.FREE} messages /month`,
    "Customizable System Prompts",
    "End-to-end Encryption",
  ],
  PRO: [
    `${POINTS_PER_SCOPE.PRO} messages /month`,
    "Access to API Configurations",
    "Custom Docker Image and Sandbox",
  ],
  // ENTERPRISE: [],
};
