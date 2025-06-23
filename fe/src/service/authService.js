export const saveUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
}

export const removeUser = () => {
    localStorage.removeItem("user");
}

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
}

export const getUserRole = () => {
    return getUser()?.role;
}