import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  rsvpStatus: text("rsvp_status").notNull().default("pending"), // pending, confirmed, declined
  plusOne: boolean("plus_one").default(false),
  dietaryRestrictions: text("dietary_restrictions"),
  tableAssignment: integer("table_assignment"),
  notes: text("notes"),
});

export const budgetItems = pgTable("budget_items", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  budgetAmount: decimal("budget_amount", { precision: 10, scale: 2 }).notNull(),
  actualAmount: decimal("actual_amount", { precision: 10, scale: 2 }).default("0"),
  isPaid: boolean("is_paid").default(false),
  notes: text("notes"),
});

export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location"),
  eventType: text("event_type").notNull(), // ceremony, reception, photo, etc.
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").default(false),
  dueDate: text("due_date"),
  priority: text("priority").notNull().default("medium"), // low, medium, high
  category: text("category"),
});

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  contactName: text("contact_name"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  address: text("address"),
  contractAmount: decimal("contract_amount", { precision: 10, scale: 2 }),
  isBooked: boolean("is_booked").default(false),
  notes: text("notes"),
});

export const seatingTables = pgTable("seating_tables", {
  id: serial("id").primaryKey(),
  tableNumber: integer("table_number").notNull(),
  capacity: integer("capacity").notNull(),
  positionX: integer("position_x").default(0),
  positionY: integer("position_y").default(0),
  shape: text("shape").notNull().default("round"), // round, rectangular
});

export const weddingDetails = pgTable("wedding_details", {
  id: serial("id").primaryKey(),
  brideName: text("bride_name").notNull(),
  groomName: text("groom_name").notNull(),
  weddingDate: text("wedding_date").notNull(),
  venue: text("venue").notNull(),
  totalBudget: decimal("total_budget", { precision: 10, scale: 2 }).notNull(),
});

// Insert schemas
export const insertGuestSchema = createInsertSchema(guests).omit({ id: true });
export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({ id: true });
export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true });
export const insertSeatingTableSchema = createInsertSchema(seatingTables).omit({ id: true });
export const insertWeddingDetailsSchema = createInsertSchema(weddingDetails).omit({ id: true });

// Types
export type Guest = typeof guests.$inferSelect;
export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type BudgetItem = typeof budgetItems.$inferSelect;
export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;
export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type SeatingTable = typeof seatingTables.$inferSelect;
export type InsertSeatingTable = z.infer<typeof insertSeatingTableSchema>;
export type WeddingDetails = typeof weddingDetails.$inferSelect;
export type InsertWeddingDetails = z.infer<typeof insertWeddingDetailsSchema>;
