import { ContactProfile } from './schemas';

/**
 * In-memory contact storage using Map
 */
export class ContactMemory {
  private contacts: Map<string, ContactProfile> = new Map();

  /**
   * Get a contact by email
   * @param email The contact's email address
   * @returns The contact profile or undefined if not found
   */
  get(email: string): ContactProfile | undefined {
    return this.contacts.get(email);
  }

  /**
   * Set a contact profile
   * @param email The contact's email address
   * @param profile The contact profile
   */
  set(email: string, profile: ContactProfile): void {
    this.contacts.set(email, profile);
  }

  /**
   * Check if a contact exists
   * @param email The contact's email address
   * @returns true if the contact exists, false otherwise
   */
  has(email: string): boolean {
    return this.contacts.has(email);
  }

  /**
   * Delete a contact
   * @param email The contact's email address
   * @returns true if the contact was deleted, false if it didn't exist
   */
  delete(email: string): boolean {
    return this.contacts.delete(email);
  }

  /**
   * Get all contacts
   * @returns Array of all contact profiles
   */
  getAll(): ContactProfile[] {
    return Array.from(this.contacts.values());
  }

  /**
   * Clear all contacts
   */
  clear(): void {
    this.contacts.clear();
  }
}
