import { requestApi } from "./main.api";

export const accountApi = async () => {
    try {
        const response = await requestApi({
            url: `${process.env.NEXT_PUBLIC_REST_API_URL}/account`,
            method: 'GET',
            isAuth: true
        })
        return response
    } catch (err) {
        throw err
    }
};

export const editPasswordApi = async (oldPassword, newPassword) => {
  try {
      const response = await requestApi({
          url: `${process.env.NEXT_PUBLIC_REST_API_URL}/account/update-password`,
          method: 'POST',
          isAuth: true,
          body: {
              old_password: oldPassword,
              password: newPassword
          }
      })
      return response
  } catch (err) {
      throw err
  }
};

export const editProfileApi = async (params) => {
  try {
      const response = await requestApi({
          url: `${process.env.NEXT_PUBLIC_REST_API_URL}/account/update-profile`,
          method: 'POST',
          isAuth: true,
          body: params
      })
      return response
  } catch (err) {
      throw err
  }
};