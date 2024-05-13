export class BlacklistTokenService {
    private static blacklistedTokens: Set<string> = new Set();

    static async addTokenToBlacklist(token: string): Promise<void> {
        this.blacklistedTokens.add(token);
    }

    static async isTokenBlacklisted(token: string): Promise<boolean> {
        return this.blacklistedTokens.has(token);
    }

    // Add more methods as needed
}
