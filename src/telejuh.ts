import type { Events, SendMsgParams, SendPhotoParams, Update} from "./types.ts";

export class Telejuh {
    /** The token bot. */
    private token:string;

    /** The base url telegram api. */
    private base_url:string;

    /** Listeners */
    private listeners: {[K in keyof Events]?: ((data:Events[K]) => void)[]} ={};
    
    /**
     * Create new bot.
     * @param token 
     */
    constructor(token:string) {
        this.token = token;
        this.base_url = "https://api.telegram.org/bot";
    }

    /**
     * on function.
     * @param ev events.
     * @param handler hanlers.
     */
    on<K extends keyof Events>(ev:K, handler:(data:Events[K])=> void) {
        if (!this.listeners[ev]) this.listeners[ev]=[];
        this.listeners[ev]!.push(handler);
    }

    /**
     * emit function.
     * @param ev events.
     * @param data hanlers.
     */
    emit<K extends keyof Events>(ev:K, data:Events[K]) {
        const handlers = this.listeners[ev];
        if(handlers)
            for (const fn of handlers) fn(data);
    }

    /**
     * Bot Send message.
     * @param params 
     */
    async sendMessage(params: SendMsgParams) {
        const data = new FormData();
        data.append("chat_id", String(params.chat_id));
        data.append("text", params.text);
        if (params.parse_mode) data.append("parse_mode", params.parse_mode);
        await fetch(`${this.base_url}${this.token}/sendMessage`, {
            method:"POST",
            body:data
        });
    }

    /**
     * Bot Send photo.
     * @param params 
     */
    async sendPhoto(params: SendPhotoParams) {
        const data = new FormData();
        data.append("chat_id",String(params.chat_id));
        if (typeof params.photo === "string")
            data.append("photo", params.photo);
        else
            data.append("photo", new Blob([params.photo], {type:"image/jpeg"}), "photo.jpg");
        if (params.caption) data.append("caption", params.caption);
        if (params.parse_mode) data.append("parse_mode", params.parse_mode);
        await fetch(`${this.base_url}${this.token}/sendPhoto`, {
            method:"POST",
            body:data,
        });
    }

    /** Run polling bot. */
    async runPolling() {
        let offset = 0;
        while (true) {
            const res = await fetch(`${this.base_url}${this.token}/getUpdates?offset=${offset}&timeout=30`);
            const data = await res.json();

            for (const upt of data.result as Update[]) {
                offset = upt.update_id + 1;
                if (upt.message) this.emit("message", upt.message);
            }
        }
    }
}