import * as slug from "speakingurl";
import { generate } from "voucher-code-generator";
import * as bcrypt from "bcryptjs";
import { ImageExtensionsAsSet } from "./image.extensions";
import { VideoExtensionsAsSet } from "./video.extensions";
import * as fs from "fs";
import * as path from "path";
import * as dateFns from "date-fns";
import * as crypto from "crypto";
import { Timezone } from "../types/timezone";

export function slugify(value: string): string {
  if (value.charAt(value.length - 1) === "-")
    value = value.slice(0, value.length - 1);
  return `${slug(value, { titleCase: true })}-${
    generate({
      charset: "123456789abcdefghgklmnorstuvwxyz",
      length: 4,
    })[0]
  }`.toLowerCase();
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function isImage(filePath: string): boolean {
  if (!filePath) return false;
  return ImageExtensionsAsSet.has(
    path.extname(filePath).slice(1).toLowerCase()
  );
}

export function isVideo(filePath: string): boolean {
  if (!filePath) return false;
  return VideoExtensionsAsSet.has(
    path.extname(filePath).slice(1).toLowerCase()
  );
}

export function encryptStringWithRsaPublicKey(
  toEncrypt: string,
  relativeOrAbsolutePathToPublicKey: string
) {
  const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
  const publicKey = fs.readFileSync(absolutePath, "utf8");
  const buffer = Buffer.from(toEncrypt);
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
}

export function decryptStringWithRsaPrivateKey(
  toDecrypt: string,
  relativeOrAbsolutePathToPrivateKey: string
) {
  const absolutePath = path.resolve(relativeOrAbsolutePathToPrivateKey);
  const privateKey = fs.readFileSync(absolutePath, "utf8");
  const buffer = Buffer.from(toDecrypt, "base64");
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString("utf8");
}

export function getTimeBasedOnTimezone(
  timezoneObj: Timezone,
  date?: Date | number
): Date {
  let timeBasedOnTimezone = date ? new Date(date) : new Date();
  if (timezoneObj.minusSign) {
    timeBasedOnTimezone = dateFns.subHours(
      timeBasedOnTimezone,
      timezoneObj.hours
    );
    timeBasedOnTimezone = dateFns.subMinutes(
      timeBasedOnTimezone,
      timezoneObj.minutes
    );
  } else {
    timeBasedOnTimezone = dateFns.addHours(
      timeBasedOnTimezone,
      timezoneObj.hours
    );
    timeBasedOnTimezone = dateFns.addMinutes(
      timeBasedOnTimezone,
      timezoneObj.minutes
    );
  }
  return timeBasedOnTimezone;
}

export function trimAllSpaces(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function removeFieldsFromObject(obj: object, fields: string[]) {
  let newObj:any = { ...obj };
  for (const key in newObj) if (fields.includes(key)) delete newObj[key];
  return newObj;
}

export function getFileNameFromUrl(url: string): string {
  return url.split("/").reverse()[0];
}

export function getHHMMSSFromSeconds(seconds: number, noSeconds?: boolean) {
  // Hours, minutes and seconds
  var hrs = ~~(seconds / 3600);
  var mins = ~~((seconds % 3600) / 60);
  var secs = ~~seconds % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";
  if (hrs > 0) {
    ret +=
      "" + hrs + ` hour${hrs > 1 ? "s" : ""} ` + (mins && mins < 10 ? "0" : "");
  }
  ret +=
    "" +
    mins +
    ` minute${mins > 1 ? "s" : ""} ` +
    (secs && secs < 10 ? "0" : "");
  if (!noSeconds) ret += "" + secs + " seconds";

  return ret;
}
