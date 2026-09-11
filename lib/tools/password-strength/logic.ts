export type StrengthLabel = "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong";

export type PasswordAnalysis = {
  score: number; // 0-100
  label: StrengthLabel;
  entropyBits: number;
  length: number;
  poolSize: number;
  issues: string[];
  recommendations: string[];
};

const COMMON_PASSWORDS = new Set([
  "password", "123456", "123456789", "qwerty", "12345678", "111111",
  "1234567", "letmein", "1234567890", "welcome", "monkey", "login",
  "abc123", "starwars", "dragon", "passw0rd", "iloveyou", "admin",
  "sunshine", "princess", "football", "654321", "master", "hello",
]);

function hasSequential(pw: string): boolean {
  const lower = pw.toLowerCase();
  const sequences = ["abcdefghijklmnopqrstuvwxyz", "01234567890"];
  for (const seq of sequences) {
    for (let i = 0; i <= seq.length - 4; i++) {
      const chunk = seq.slice(i, i + 4);
      if (lower.includes(chunk) || lower.includes([...chunk].reverse().join(""))) return true;
    }
  }
  return false;
}

function hasRepeatedRun(pw: string): boolean {
  return /(.)\1\1/.test(pw);
}

export function analyzePassword(pw: string): PasswordAnalysis {
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (!pw) {
    return {
      score: 0,
      label: "Very weak",
      entropyBits: 0,
      length: 0,
      poolSize: 0,
      issues: ["Enter a password to analyze."],
      recommendations: [],
    };
  }

  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigit) poolSize += 10;
  if (hasSymbol) poolSize += 32;

  const entropyBits = pw.length * Math.log2(Math.max(poolSize, 1));

  let score = Math.min(100, Math.round((entropyBits / 100) * 100));

  if (pw.length < 8) {
    issues.push("Shorter than 8 characters.");
    recommendations.push("Use at least 12 characters — length matters more than complexity.");
    score -= 25;
  }
  if (!hasUpper || !hasLower) {
    issues.push("Missing mixed letter case.");
    recommendations.push("Mix uppercase and lowercase letters.");
    score -= 10;
  }
  if (!hasDigit) {
    issues.push("No digits.");
    recommendations.push("Add a number.");
    score -= 8;
  }
  if (!hasSymbol) {
    issues.push("No symbols.");
    recommendations.push("Add a symbol such as ! # $ % or -.");
    score -= 8;
  }
  if (hasSequential(pw)) {
    issues.push("Contains a sequential pattern (e.g. abcd, 1234).");
    recommendations.push("Avoid keyboard or alphabet sequences.");
    score -= 20;
  }
  if (hasRepeatedRun(pw)) {
    issues.push("Contains a repeated character run (e.g. aaa).");
    recommendations.push("Avoid repeating the same character three or more times.");
    score -= 15;
  }
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) {
    issues.push("This is one of the most commonly used passwords in breach lists.");
    recommendations.push("Never reuse well-known passwords — they're the first thing attackers try.");
    score = 2;
  }

  score = Math.max(0, Math.min(100, score));

  let label: StrengthLabel;
  if (score < 20) label = "Very weak";
  else if (score < 40) label = "Weak";
  else if (score < 60) label = "Fair";
  else if (score < 80) label = "Strong";
  else label = "Very strong";

  if (recommendations.length === 0) {
    recommendations.push("Consider a password manager to generate and store something even longer.");
  }

  return { score, label, entropyBits, length: pw.length, poolSize, issues, recommendations };
}
