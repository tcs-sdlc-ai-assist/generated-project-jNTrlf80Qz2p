import MemberRow from './memberRow.jsx';

/**
 * MemberList — renders the list of group members with role badges and
 * admin-only remove controls.
 *
 * Each member object is expected to have at minimum:
 *   { id: string, displayName: string, isAdmin?: boolean }
 *
 * The `isAdmin` flag on each member determines the role badge shown.
 * The parent component is responsible for enriching user objects with
 * this flag (derived from the conversation's adminId).
 *
 * @param {{
 *   members: Array<{ id: string, displayName: string, isAdmin?: boolean }>,
 *   isAdmin: boolean,
 *   onRemove: (memberId: string) => void,
 * }} props
 */
export default function MemberList({ members = [], isAdmin = false, onRemove }) {
  // ── Empty state ──────────────────────────────────────────────────
  if (!members || members.length === 0) {
    return (
      <div className="py-10 text-center" role="status">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 text-text-muted/40 mx-auto mb-3"
          aria-hidden="true"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <p className="text-sm text-text-muted">No members to display</p>
      </div>
    );
  }

  // ── Member list ──────────────────────────────────────────────────
  return (
    <ul
      className="divide-y divide-border-light"
      role="list"
      aria-label="Group members"
    >
      {members.map((member) => {
        const memberIsAdmin = member.isAdmin === true;
        const canRemove = isAdmin && !memberIsAdmin;

        return (
          <li key={member.id}>
            <MemberRow
              member={member}
              isAdmin={memberIsAdmin}
              canRemove={canRemove}
              onRemove={() => onRemove?.(member.id)}
            />
          </li>
        );
      })}
    </ul>
  );
}