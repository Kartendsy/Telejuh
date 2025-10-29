export * from "./src/telejuh.ts";
export * from "./src/types.ts";

/**
 * This module Telegram Bot API
 * 
 * @example
 * ```ts
 * import {Telejuh} from "jsr:@kartendsy/telejuh";
 * 
 * const bot = new Telejuh("TOKEN");
 * 
 * bot.on("message", (msg) => {
 *    console.log(msg);
 * })
 * 
 * bot.runPolling();
 */
