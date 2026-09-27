const READING_PROMPT_MARKER = "Then write exactly 3 multiple-choice comprehension questions";

const READING_CHOICE_RULES = `

Additional rules for the 4 choices:
- The correct choice MUST NOT copy the wording of the evidence sentence or clause from the passage. Paraphrase it naturally while preserving exactly the same meaning.
- Do not make the answer obvious by repeating a distinctive phrase from the passage. Prefer synonyms, a changed sentence structure, or a concise restatement appropriate for the selected learner level.
- All 4 choices should be similarly natural, plausible, and roughly similar in length and style, so the correct answer does not stand out.
- Wrong choices should be plausible but clearly contradicted by, or unsupported by, the passage.
- The learner should need to understand the meaning of the passage, not simply match identical words.
- Keep evidence_en unchanged: it must still be an exact substring copied from the passage for the explanation/highlight feature.
`;

function applyPromptRules(systemPrompt) {
  if (typeof systemPrompt !== "string") return systemPrompt;
  if (!systemPrompt.includes(READING_PROMPT_MARKER)) return systemPrompt;
  if (systemPrompt.includes("Additional rules for the 4 choices:")) return systemPrompt;
  return systemPrompt + READING_CHOICE_RULES;
}

module.exports = { applyPromptRules };
