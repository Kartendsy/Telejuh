

// CREATED BY KARTENDSY

type EventMap = {
  message: any;
}

interface BaseMsgParams {
  chat_id:number,
  parse_mode?:string
}

interface SendMsgParams extends BaseMsgParams {
  text:string;
}

interface SendPhotoParams extends BaseMsgParams {
  photo: Uint8Array<ArrayBuffer> | string;
  caption?: string;
}

interface SendAudioParams extends BaseMsgParams {
  audio: Uint8Array<ArrayBuffer> | string;
  caption?:string;
}

interface SendVideoParams extends BaseMsgParams {
  video: Uint8Array<ArrayBuffer> | string;
  caption?:string;
}

export class Telejuh {
  token: string;
  listeners: {[K in keyof EventMap]?: ((data: EventMap[K]) => void)[]} = {};
  base: string = "https://api.telegram.org/bot";

  
  constructor(TOKEN: string) {
    this.token = TOKEN;
  }

  on<K extends keyof EventMap>(ev:K, handler:(data: EventMap[K]) => void) {
    if (!this.listeners[ev]) this.listeners[ev]=[];
    this.listeners[ev]!.push(handler);
  }

  emit<K extends keyof EventMap>(ev:K, data:EventMap[K]) {
    const handlers = this.listeners[ev];
    if (handlers) {
      for (const fn of handlers) fn(data);
    }
  }

  async sendMessage(params: SendMsgParams) {
    const res = await fetch(`${this.base}${this.token}/sendMessage`,{
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(params)
    });
    return res.json();
  }

  async sendPhoto(params: SendPhotoParams) {
    const form = new FormData();
    form.append("chat_id", String(params.chat_id));
    if (typeof params.photo === "string") {
      form.append("photo", params.photo);
    } else {
      form.append("photo", new Blob([params.photo], {type:"image/jpeg"}), "photo.jpg");
    }
    if (params.caption) form.append("caption", params.caption);
    if (params.parse_mode) form.append("parse_mode", params.parse_mode);

    const res = await fetch(`${this.base}${this.token}/sendPhoto`, {
      method: "POST",
      body: form,
    });
    return res.json();
  }

  async sendAudio(params: SendAudioParams) {
    const form = new FormData();
    form.append("chat_id", String(params.chat_id));
    if (typeof params.audio === "string")
      form.append("audio", params.audio);
    else
      form.append("audio", new Blob([params.audio], {type:"audio/mp3"}), "audio.mp3");
    if (params.caption) form.append("caption", params.caption);
    if (params.parse_mode) form.append("parse_mode", params.parse_mode);

    const res = await fetch(`${this.base}${this.token}/sendAudio`, {
      method:"POST",
      body:form
    })

    return res.json();
  }

  async sendVideo(params: SendVideoParams) {
    const form = new FormData();
    form.append("chat_id", String(params.chat_id));
    if (typeof params.video === "string")
      form.append("audio", params.video);
    else
      form.append("audio", new Blob([params.video], {type:"video/mp4"}), "video.mp4");
    if (params.caption) form.append("caption", params.caption);
    if (params.parse_mode) form.append("parse_mode", params.parse_mode);

    const res = await fetch(`${this.base}${this.token}/sendAudio`, {
      method:"POST",
      body:form
    })

    return res.json();
  }

  async sendAnimation() {}

  async sendDocument() {}

  async sendPaidMedia() {}

  async sendSticker() {}

  async sendVideoNote() {}

  async sendVoice() {}

  async sendLocation() {}

  async sendVenue() {}

  async sendContact() {}

  async sendDice() {}

  async sendInvoice() {}

  async sendMediaGroup() {}

  async copyMessage() {}


  async runPolling() {
    let offset = 0;
    while (true) {
      const res = await fetch(`https://api.telegram.org/bot${this.token}/getUpdates?offset=${offset}&timeout=30`);
      const data = await res.json();

      for (const update of data.result) {
        offset = update.update_id + 1;
        if (update.message) {
          this.emit("message", update.message);
        }
      }
    }
  }

}
