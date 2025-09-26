# Scheduling Playbook

This playbook outlines the step-by-step process for handling scheduling requests efficiently and accurately.

## Step 1: Parse Request

### Extract Key Information
- **Attendees**: Who needs to be invited?
  - Internal participants
  - External stakeholders
  - Optional vs. required attendees
- **Duration**: How long should the meeting be?
  - Default to 30 minutes if not specified
  - Consider prep/buffer time
- **Time Hints**: Any timing preferences or constraints?
  - Preferred days/times
  - Timezone considerations
  - Deadline or urgency indicators
  - Blackout periods or conflicts

### Meeting Context
- Meeting purpose and agenda
- Location preferences (virtual/in-person)
- Special requirements (recording, materials, etc.)
- Recurring vs. one-time meeting

## Step 2: Check Free/Busy Status

### Availability Analysis
- Query all attendees' calendars
- Identify overlapping free time slots
- Consider travel time between meetings
- Account for timezone differences

### Constraint Evaluation
- Respect working hours preferences
- Avoid meal times and common break periods
- Check for competing priorities or deadlines
- Consider meeting room/resource availability

## Step 3: Propose Top 3 Slots

### Selection Criteria
- **Optimal timing**: Best fit for all attendees' schedules
- **Convenience**: Minimal travel time, reasonable hours
- **Context**: Consider what meetings come before/after

### Proposal Format
```
**Option 1**: [Date/Time] - [Timezone]
Reason: [Brief explanation why this is optimal]

**Option 2**: [Date/Time] - [Timezone] 
Reason: [Brief explanation of benefits/trade-offs]

**Option 3**: [Date/Time] - [Timezone]
Reason: [Fallback option with any compromises noted]
```

### Include Context
- Note any scheduling challenges or compromises
- Highlight particularly good fits
- Mention alternative dates if current options don't work

## Step 4: Handle Ambiguity

### When to Ask for Clarification
- Missing critical information (attendees, duration)
- Conflicting constraints
- Unclear priorities or preferences
- Multiple interpretation possibilities

### Clarification Best Practices
- Ask **one targeted question** at a time
- Provide context for why clarification is needed
- Offer suggested defaults when appropriate
- Include relevant options to speed decision-making

### Examples of Good Clarifying Questions
- "Should I prioritize [Attendee A]'s availability over [Attendee B]'s preference for mornings?"
- "Would you prefer a 60-minute deep dive or two separate 30-minute sessions?"
- "Is this meeting urgent enough to schedule outside normal business hours?"

## Step 5: Create Event (Upon Confirmation)

### Event Creation Checklist
- [ ] Add all confirmed attendees
- [ ] Set correct date, time, and duration
- [ ] Include Google Meet link for virtual meetings
- [ ] Add clear meeting title and agenda
- [ ] Set appropriate reminders
- [ ] Include any relevant documents or links
- [ ] Set correct timezone for all attendees

### Meeting Details
- **Title**: Clear, descriptive meeting name
- **Description**: Include agenda, dial-in info, and any prep materials
- **Location**: Physical address or "Google Meet" for virtual
- **Attendees**: Required vs. optional designation

## Step 6: Confirm and Communicate

### Confirmation Email (from nk@fikra.ventures if permitted)
- Meeting details recap
- Any action items or prep work needed
- Contact information for changes
- Agenda or objectives

### Slack Notification (Optional)
- Post confirmation in relevant channel
- Tag participants with <@U09DB024QS2> when notifications enabled
- Include key details and any follow-up needed

## Error Recovery

### Common Issues and Solutions
- **Double-booking**: Immediately notify all parties and propose alternatives
- **Timezone confusion**: Clarify and send updated invites with correct times
- **Missing attendees**: Follow up and add to existing event
- **Technical issues**: Provide backup meeting options (phone, alternative platform)

### Escalation Triggers
- Unable to find suitable time within reasonable period
- Conflicts between high-priority attendees
- Technical or access issues preventing scheduling
- Requests outside normal scope or authority

## Success Metrics
- First-option acceptance rate
- Time to schedule (request to confirmation)
- Number of reschedules required
- Attendee satisfaction and feedback