// export function setMemberId(value: string) {
//     localStorage.setItem("MID", value);
//   }


export function getDigitCode() {
    return localStorage.getItem("DIGIT-CODE") ?? "";
}








export function setMemberIdObject(value: { id: string }) {
    localStorage.setItem("MID", JSON.stringify(value));
}

export function getMemberId() {
    let mid = localStorage.getItem("MID");
    return mid ? JSON.parse(mid).id : "";
}

export function getMemberDigitCode() {
    let mid = localStorage.getItem("MID");
    return mid ? JSON.parse(mid).digitcode : "";
}