let requestCounter = 1;

export function generateRequestId() {
    const id = `REQ-${String(requestCounter).padStart(4, "0")}`;
    requestCounter++;
    return id;
}