import { getUserShortFullName } from "@/utils";

export function sessionDto({ user, accessToken, refreshToken }) {
  return {
    user: {
      id: user.id,
      image: user.avatar_url,
      shortFullName: getUserShortFullName(user.names, user.lastNames),
      username: user.username,
      email: user.email,
      roles: user.roles.map((role) => role.slug),
    },
    hasDeviceToken: user.has_device_token,
    store: user.store ? user.store : null,
    accessToken,
    refreshToken,
  };
}
