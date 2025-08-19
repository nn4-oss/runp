export interface AgentState {
  summary: string;
  files: { [path: string]: string };
}
