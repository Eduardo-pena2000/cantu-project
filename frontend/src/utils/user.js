export function hasRole(session, roles) {
  if (session) {
    return session.user.roles.some((role) => roles.includes(role));
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
