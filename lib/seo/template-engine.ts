export function processTemplate(
  template: string,
  variables: Record<string, string>
): string {
  if (!template) return '';
  
  let processed = template;
  
  // Default variables if not provided
  const vars = {
    site_name: 'D Arrow',
    separator: '|',
    current_year: new Date().getFullYear().toString(),
    ...variables
  };

  // Replace all {{key}} with value
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
    processed = processed.replace(regex, value || '');
  }

  // Clean up any unreplaced variables
  processed = processed.replace(/{{\s*[a-zA-Z0-9_]+\s*}}/g, '');

  return processed.trim();
}
