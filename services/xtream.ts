import { Credentials, AccountInfo, Category, LiveStream } from '../types';

export class XtreamService {
    private baseUrl: string;
    private username: string;
    private password: string;

    constructor(creds: Credentials) {
        // Ensure URL has http/https and no trailing slash
        let url = creds.url.trim();
        if (!url.startsWith('http')) {
            url = `http://${url}`;
        }
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }

        this.baseUrl = url;
        this.username = creds.username;
        this.password = creds.password;
    }

    private getApiUrl(action: string, params: Record<string, string> = {}): string {
        const query = new URLSearchParams({
            username: this.username,
            password: this.password,
            action: action,
            ...params
        });
        return `${this.baseUrl}/player_api.php?${query.toString()}`;
    }

    async authenticate(): Promise<AccountInfo> {
        try {
            // Action is implicit for auth in Xtream
            const response = await fetch(`${this.baseUrl}/player_api.php?username=${this.username}&password=${this.password}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.user_info && data.user_info.auth === 0) {
                throw new Error('Authentication failed');
            }
            return data;
        } catch (error) {
            console.error("Auth Error:", error);
            throw error;
        }
    }

    async getCategories(): Promise<Category[]> {
        const url = this.getApiUrl('get_live_categories');
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    async getStreams(categoryId: string): Promise<LiveStream[]> {
        const url = this.getApiUrl('get_live_streams', { category_id: categoryId });
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    getStreamUrl(streamId: number, extension: string = 'm3u8'): string {
        return `${this.baseUrl}/live/${this.username}/${this.password}/${streamId}.${extension}`;
    }
}
