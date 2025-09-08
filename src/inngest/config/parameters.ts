export const MAX_ITERATION = 10;
export const CONTEXT_MAX_LENGTH = 5;
export const CODE_AGENT_PARAMETERS = {
  temperature: 0.1, // low randomness → consistent, reliable code
  top_p: 0.9, // allow some diversity but still constrained
  presence_penalty: 0, // don’t force novelty → stick to known patterns
  frequency_penalty: 0, // don’t penalize repetition → good for classNames
};
export const TITLE_AGENT_PARAMETERS = {
  temperature: 0.1,
  top_p: 0.9,
};
export const RESPONSE_AGENT_PARAMETERS = {
  temperature: 0.1,
};
export const TITLE_AGENT_FALLBACK = "Fragment Code";
export const RESPONSE_AGENT_FALLBACK =
  "Here is the code generated for your request.";
