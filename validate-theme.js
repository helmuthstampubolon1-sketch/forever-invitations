const fs = require("fs");
const path = require("path");

console.log("🪵 STARTING THEME VALIDATION TEST...");

const PROJECT_ROOT = __dirname;

function assertContains(filePath, ...expectedSubstrings) {
  const content = fs.readFileSync(filePath, "utf-8");
  for (const sub of expectedSubstrings) {
    if (!content.includes(sub)) {
      console.error(`❌ TEST FAILED: File ${filePath} does not contain expected pattern: "${sub}"`);
      process.exit(1);
    }
  }
  console.log(`✅ File parsed successfully and assertions passed: ${path.basename(filePath)}`);
}

try {
  // Test 1: OpeningOverlay theme type and background
  assertContains(
    path.join(PROJECT_ROOT, "src", "components", "invitation", "OpeningOverlay.tsx"),
    'Theme = "elegant" | "floral" | "modern-dark" | "javanese" | "leafitation" | "bobby";',
    'bobby: {',
    'theme === "bobby" ? "#b5814a" : "var(--color-primary)"',
    'theme === "bobby" ? "#1f2620" : "#fff"'
  );

  // Test 2: InvitationPage passes rawTheme
  assertContains(
    path.join(PROJECT_ROOT, "src", "components", "invitation", "InvitationPage.tsx"),
    'theme={rawTheme}'
  );

  // Test 3: styles.css contains the variable overrides for Bobby theme
  assertContains(
    path.join(PROJECT_ROOT, "src", "styles.css"),
    '.theme-bobby {',
    '--color-primary: #d9b886 !important;',
    '--color-secondary: rgba(228, 220, 200, 0.08) !important;',
    '--color-accent: #b5814a !important;',
    '--color-bg: #1f2620 !important;',
    '--color-text: #f4ede0 !important;'
  );

  // Test 4: ThemeTab contains the precision defaults
  assertContains(
    path.join(PROJECT_ROOT, "src", "components", "admin", "settings", "ThemeTab.tsx"),
    'defaults: { primary_color: "#d9b886", secondary_color: "rgba(228, 220, 200, 0.08)", accent_color: "#b5814a", text_color: "#f4ede0", background_color: "#1f2620"'
  );

  // Test 5: ThemeProvider contains the precision defaults
  assertContains(
    path.join(PROJECT_ROOT, "src", "components", "ThemeProvider.tsx"),
    'bobby:       { primary: "#d9b886", secondary: "rgba(228, 220, 200, 0.08)", accent: "#b5814a", text: "#f4ede0", bg: "#1f2620" }'
  );

  console.log("🎉 ALL THEME VALIDATION TESTS PASSED TRIUMPHANTLY! 🥩🪵");
} catch (err) {
  console.error("❌ TEST ENCOUNTERED UNEXPECTED ERROR:", err.message);
  process.exit(1);
}
