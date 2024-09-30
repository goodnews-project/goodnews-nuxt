const KEY = 'authorization';

export const getToken = () => {
  return useCookie(KEY);
};

export const setToken = (token, expire) => {
  const cookie = useCookie(KEY, {
    expires: new Date(new Date().getTime() + expire * 1000),
  });
  cookie.value = token;
};
export const removeToken = () => {
  const cookie = useCookie(KEY);

  cookie.value = null;
};

const USER_KEY = 'user';

export const getUser = () => {
  return useCookie(USER_KEY);
};

export const setUser = (data, expire) => {
  const cookie = useCookie(USER_KEY, {
    expires: new Date(new Date().getTime() + expire * 1000),
  });
  const obj = {
    acct: data.acct,
    id: data.id,
    avatar: data.avatar,
    created_at: data.created_at,
    display_name: data.display_name,
    followers_count: data.followers_count,
    following_count: data.following_count,
    is_activate: data.is_activate,
    is_bot: data.is_bot,
    is_display_sensitive: data.is_display_sensitive,
    is_sensitive: data.is_sensitive,
    manually_approves_follower: data.manually_approves_follower,
    status_count: data.status_count,
    updated_at: data.updated_at,
    username: data.username,
    is_admin: data.is_admin
  };
  cookie.value = obj;
};

export const removeUser = () => {
  const cookie = useCookie(USER_KEY);

  cookie.value = null;
};
