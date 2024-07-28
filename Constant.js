const getLocalUserData = () => localStorage.getItem("useInfo");
const setLocalUserData = (data) => localStorage.setItem("userInfo", data);

const LocalStoargeKeys = { USERINFO: "userInfo" };

export { getLocalUserData, setLocalUserData, LocalStoargeKeys };
