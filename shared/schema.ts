import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (original remains)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Permission types
export const permissionTypes = {
  CONTRACT_INTERACTION: "contract-interaction",
  TOKEN_STREAM: "token-stream",
  SESSION_BASED: "session-based",
  DELEGATION: "delegation",
} as const;

// Permissions table
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // One of permissionTypes
  name: text("name").notNull(), 
  appName: text("app_name").notNull(),
  description: text("description"),
  contractAddress: text("contract_address"),
  functionSignature: text("function_signature"),
  isActive: boolean("is_active").notNull().default(true),
  maxAmount: text("max_amount"),
  amountPerSecond: text("amount_per_second"),
  totalAmount: text("total_amount"),
  maxCalls: integer("max_calls"),
  callsUsed: integer("calls_used").default(0),
  expiryTime: timestamp("expiry_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  additionalData: json("additional_data"),
});

export const insertPermissionSchema = createInsertSchema(permissions).omit({
  id: true,
  createdAt: true,
  callsUsed: true,
});

export type InsertPermission = z.infer<typeof insertPermissionSchema>;
export type Permission = typeof permissions.$inferSelect;

// Permission requests table (pending permissions)
export const permissionRequests = pgTable("permission_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  appName: text("app_name").notNull(),
  description: text("description"),
  contractAddress: text("contract_address"),
  functionSignature: text("function_signature"),
  maxAmount: text("max_amount"),
  amountPerSecond: text("amount_per_second"),
  maxCalls: integer("max_calls"),
  expiryTime: timestamp("expiry_time"),
  requestedAt: timestamp("requested_at").notNull().defaultNow(),
  additionalData: json("additional_data"),
});

export const insertPermissionRequestSchema = createInsertSchema(permissionRequests).omit({
  id: true,
  requestedAt: true,
});

export type InsertPermissionRequest = z.infer<typeof insertPermissionRequestSchema>;
export type PermissionRequest = typeof permissionRequests.$inferSelect;
