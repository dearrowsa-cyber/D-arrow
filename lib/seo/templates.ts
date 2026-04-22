export function compileTemplate(template: string, context: Record<string, string>): string {
  let compiled = template;
  for (const [key, value] of Object.entries(context)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    compiled = compiled.replace(regex, value);
  }
  // Clean up any unmatched tags
  compiled = compiled.replace(/{{[^}]+}}/g, '');
  return compiled;
}
