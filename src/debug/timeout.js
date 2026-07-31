export async function withTimeout(promise, ms = 10000) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("Operation timed out."));
        }, ms);
    });

    return Promise.race([promise, timeout]);
}