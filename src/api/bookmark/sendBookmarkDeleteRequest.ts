import { ACCESS_TOKEN, ENDPOINTS } from "constants/api";

import axiosInstance from "api/axiosInstance";

const sendBookmarkDeleteRequest = (restaurantId: number) => () => {
  const accessToken = window.sessionStorage.getItem(ACCESS_TOKEN);

  if (!accessToken) {
    window.sessionStorage.removeItem(ACCESS_TOKEN);
    window.alert("다시 로그인 해주세요");
    window.location.reload();
    throw new Error("엑세스토큰이 유효하지 않습니다");
  }

  return axiosInstance.delete(ENDPOINTS.BOOKMARK_STORE(restaurantId), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export default sendBookmarkDeleteRequest;
