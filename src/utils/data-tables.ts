export const maskKey = (key: string) => {
  const parts = key.split(":");
  if (parts.length === 2) {
    return `${parts[0]!.slice(0, 8)}...${parts[0]!.slice(-4)}:${parts[1]!.slice(0, 8)}...${parts[1]!.slice(-4)}`;
  }
  return `${key.slice(0, 8)}...${key.slice(-4)}`;
};
