/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as appointments from "../appointments.js";
import type * as auth from "../auth.js";
import type * as blogPosts from "../blogPosts.js";
import type * as contactMessages from "../contactMessages.js";
import type * as http from "../http.js";
import type * as mediaGallery from "../mediaGallery.js";
import type * as mediaUploads from "../mediaUploads.js";
import type * as payments from "../payments.js";
import type * as resend from "../resend.js";
import type * as services from "../services.js";
import type * as siteContent from "../siteContent.js";
import type * as testimonials from "../testimonials.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  appointments: typeof appointments;
  auth: typeof auth;
  blogPosts: typeof blogPosts;
  contactMessages: typeof contactMessages;
  http: typeof http;
  mediaGallery: typeof mediaGallery;
  mediaUploads: typeof mediaUploads;
  payments: typeof payments;
  resend: typeof resend;
  services: typeof services;
  siteContent: typeof siteContent;
  testimonials: typeof testimonials;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
