export interface InboxItem {
  id: string;
  from: string;
  subject: string;
  snippet?: string;
}

export async function classify(item: InboxItem): Promise<string> {
  // Simple stub implementation for classification
  // In a real implementation, this would use ML/AI to classify inbox items
  return "action";
}
