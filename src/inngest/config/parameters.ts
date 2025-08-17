export const CODE_AGENT_PARAMETERS = {
  temperature: 0.1, // low randomness → consistent, reliable code
  top_p: 0.9, // allow some diversity but still constrained
  presence_penalty: 0, // don’t force novelty → stick to known patterns
  frequency_penalty: 0, // don’t penalize repetition → good for classNames
};
