import {GET_APP_BRANDING} from "./actionTypes";
import { GET_APP_BRANDING_DATA} from "../../API/api.js";
import Cookies from "js-cookie";
import axios from "axios";




export const SET_APPDETAILS = (payload) => {
    return {
        type: GET_APP_BRANDING,
        payload,
    };
};

export const GET_APPDETAILS = async(dispatch) => {
  let { user, token } = JSON.parse(Cookies.get("user_token"));
    try {
        const response = await axios.get(GET_APP_BRANDING_DATA, { headers: { "Authorization": "Bearer " + token } });
        dispatch(SET_APPDETAILS(response.data));
      } catch (error) {
        console.log(error);
      }
};