/** @module */
/** A Base Message Parameter function. */
interface BaseMsgParams {
    chat_id:number | undefined;
    parse_mode?:string;
}

/** A Send Message Patameter function. */
export interface SendMsgParams extends BaseMsgParams {
    text:string;
}

/** A Send Photo Paramenter function. */
export interface SendPhotoParams extends BaseMsgParams {
    photo: Uint8Array<ArrayBuffer> | string;
    caption?: string;
}

/** A Event on/emit function. */
export type Events = {
    message:{
        chat?:{
            id?:number,
            is_bot?:boolean,
            first_name?:string,
            username?:string,
            language_code?:string
        },
        text?:string
    }
}

/** A Update on polling. */
export interface Update {
    update_id:number;
    message?: {
        message_id?:number,
        from?: {
            id:number,
            is_bot:boolean,
            first_name:string,
            username:string,
            language_code:string,
        },
        chat?:{
            id:number,
            first_name:string,
            username:string,
            type:string
        },
        date?:number,
        text?:string
    }
}