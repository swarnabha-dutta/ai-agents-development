export function logStep(step, data) {
    console.log(`\n[${new Date().toISOString()}] ${step}`);
    console.dir(data, { depth: null });
}