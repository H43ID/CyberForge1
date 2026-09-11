export type JsonResult = {
  formatted: string;
  minified: string;
  valid: true;
} | {
  valid: false;
  error: string;
};

export function processJson(input: string): JsonResult {
  try {
    const parsed = JSON.parse(input);
    return {
      valid: true,
      formatted: JSON.stringify(parsed, null, 2),
      minified: JSON.stringify(parsed),
    };
  } catch (e) {
    let message = e instanceof Error ? e.message : "Invalid JSON.";
    // Try to surface a friendlier position hint if V8 gave us one
    const posMatch = message.match(/position (\d+)/);
    if (posMatch) {
      const pos = Number(posMatch[1]);
      const before = input.slice(0, pos).split("\n");
      const line = before.length;
      const col = before[before.length - 1].length + 1;
      message = `${message} (line ${line}, column ${col})`;
    }
    return { valid: false, error: message };
  }
}
