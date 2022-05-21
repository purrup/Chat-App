export const host = process.env.NODE_ENV === 'production' ? "" : "http://localhost:5000";
export const loginRoute = `${host}/users/login`;
export const registerRoute = `${host}/users/register`;
export const logoutRoute = `${host}/users/logout`;
export const allUsersRoute = `${host}/users`;
export const setAvatarRoute = `${host}/users/setAvatar`;
export const sendMessageRoute = `${host}/room/sendMessage`;
export const receiveMessageRoute = `${host}/room/getMessage`;