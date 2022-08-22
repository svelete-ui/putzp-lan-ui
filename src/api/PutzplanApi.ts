import * as env from "../env";

function headers(memberId: string = null) {
  let headers = {
    "Content-Type": "application/json",
  }
  if (memberId) {
    headers["X-MID"] = memberId;
  }
  return headers;
}

export function init(memberId: string = null) {
  return fetch(`${env.apiPath}/init`, {
    headers: headers(memberId)
  })
}