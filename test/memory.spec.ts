import { ContactMemory } from '../src/modules/memory/ContactMemory';
import { ContactProfileSchema } from '../src/modules/memory/schemas';

describe('ContactMemory', () => {
  let contactMemory: ContactMemory;
  
  beforeEach(() => {
    contactMemory = new ContactMemory();
  });

  describe('set and get operations', () => {
    it('should store and retrieve a contact profile', () => {
      const email = 'test@example.com';
      const profile = {
        email,
        name: 'Test User',
        timezone: 'Asia/Dubai',
        preferences: {
          morningOnly: true,
          avoidDays: ['Friday']
        },
        notes: 'Test contact'
      };

      contactMemory.set(email, profile);
      const retrieved = contactMemory.get(email);

      expect(retrieved).toEqual(profile);
    });

    it('should return undefined for non-existent contact', () => {
      const result = contactMemory.get('nonexistent@example.com');
      expect(result).toBeUndefined();
    });
  });

  describe('has operation', () => {
    it('should return true for existing contact', () => {
      const email = 'exists@example.com';
      const profile = { email, timezone: 'Asia/Dubai', preferences: {} };
      
      contactMemory.set(email, profile);
      expect(contactMemory.has(email)).toBe(true);
    });

    it('should return false for non-existent contact', () => {
      expect(contactMemory.has('nonexistent@example.com')).toBe(false);
    });
  });

  describe('delete operation', () => {
    it('should delete existing contact and return true', () => {
      const email = 'delete@example.com';
      const profile = { email, timezone: 'Asia/Dubai', preferences: {} };
      
      contactMemory.set(email, profile);
      const deleted = contactMemory.delete(email);
      
      expect(deleted).toBe(true);
      expect(contactMemory.has(email)).toBe(false);
    });

    it('should return false when deleting non-existent contact', () => {
      const deleted = contactMemory.delete('nonexistent@example.com');
      expect(deleted).toBe(false);
    });
  });

  describe('getAll operation', () => {
    it('should return all stored contacts', () => {
      const contacts = [
        { email: 'user1@example.com', timezone: 'Asia/Dubai', preferences: {} },
        { email: 'user2@example.com', name: 'User Two', timezone: 'UTC', preferences: {} }
      ];

      contacts.forEach(contact => {
        contactMemory.set(contact.email, contact);
      });

      const allContacts = contactMemory.getAll();
      expect(allContacts).toHaveLength(2);
      expect(allContacts).toEqual(expect.arrayContaining(contacts));
    });

    it('should return empty array when no contacts exist', () => {
      const allContacts = contactMemory.getAll();
      expect(allContacts).toEqual([]);
    });
  });

  describe('clear operation', () => {
    it('should remove all contacts', () => {
      const profile1 = { email: 'user1@example.com', timezone: 'Asia/Dubai', preferences: {} };
      const profile2 = { email: 'user2@example.com', timezone: 'UTC', preferences: {} };
      
      contactMemory.set(profile1.email, profile1);
      contactMemory.set(profile2.email, profile2);
      
      expect(contactMemory.getAll()).toHaveLength(2);
      
      contactMemory.clear();
      
      expect(contactMemory.getAll()).toHaveLength(0);
      expect(contactMemory.has(profile1.email)).toBe(false);
      expect(contactMemory.has(profile2.email)).toBe(false);
    });
  });
});

describe('ContactProfileSchema', () => {
  it('should validate a valid contact profile', () => {
    const validProfile = {
      email: 'valid@example.com',
      name: 'Valid User',
      timezone: 'America/New_York',
      preferences: {
        morningOnly: true,
        avoidDays: ['Saturday', 'Sunday']
      },
      notes: 'Important client'
    };

    const result = ContactProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('should apply default timezone when not provided', () => {
    const profile = {
      email: 'test@example.com'
    };

    const result = ContactProfileSchema.parse(profile);
    expect(result.timezone).toBe('Asia/Dubai');
    expect(result.preferences).toEqual({});
  });

  it('should fail validation for invalid email', () => {
    const invalidProfile = {
      email: 'not-an-email',
      timezone: 'Asia/Dubai'
    };

    const result = ContactProfileSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
  });

  it('should require email field', () => {
    const profileWithoutEmail = {
      name: 'Test User',
      timezone: 'Asia/Dubai'
    };

    const result = ContactProfileSchema.safeParse(profileWithoutEmail);
    expect(result.success).toBe(false);
  });
});
