import { getToken } from "../utils/auth";

if (!getToken()) {
  window.location.href = "/login";
}