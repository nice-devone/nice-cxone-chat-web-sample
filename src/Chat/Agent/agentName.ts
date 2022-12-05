export function parseAgentName(
  inboxAssignee: { firstName: string; surname: string } | null,
): string | null {
  if (inboxAssignee === null) {
    return null;
  }

  return `${inboxAssignee.firstName} ${inboxAssignee.surname}`;
}
