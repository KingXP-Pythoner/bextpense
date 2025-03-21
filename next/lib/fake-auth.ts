export const fakeAuth = async () => {
    // 8ms fake delay
    await sleep(8)
    return {
        userId: "test-fake-user-id",
        email: "john.doe@example.com",
        name: "John Doe",
    }
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
