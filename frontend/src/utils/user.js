export function hasRole(session, roles) {
  if (session && session.user && Array.isArray(session.user.roles)) {
    return session.user.roles.some((role) => roles.includes(role));
  } else if (session && session.user && session.user.role) {
    // Fallback in case token has old format with singular 'role'
    return roles.includes(session.user.role.slug || session.user.role);
  }

  return false;
}

export function getUserFullName(names, lastNames) {
  let fullName = "";

  if (names) {
    fullName += names;
  }

  if (lastNames) {
    fullName = fullName + " " + lastNames;
  }

  return fullName;
}

export function getUserShortFullName(names, lastNames) {
  let shortFullName = "";

  if (names) {
    shortFullName += names.split(" ")[0];
  }

  if (lastNames) {
    shortFullName = shortFullName + " " + lastNames.split(" ")[0];
  }

  return shortFullName;
}

export function getUserInitials(names, lastNames) {
  let initials = "";

  if (names) {
    initials += names[0];
  }

  if (lastNames) {
    initials += lastNames[0];
  }

  return initials;
}
