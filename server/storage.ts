import {
  guests,
  budgetItems,
  timelineEvents,
  tasks,
  vendors,
  seatingTables,
  weddingDetails,
  type Guest,
  type InsertGuest,
  type BudgetItem,
  type InsertBudgetItem,
  type TimelineEvent,
  type InsertTimelineEvent,
  type Task,
  type InsertTask,
  type Vendor,
  type InsertVendor,
  type SeatingTable,
  type InsertSeatingTable,
  type WeddingDetails,
  type InsertWeddingDetails,
} from "@shared/schema";

export interface IStorage {
  // Guest management
  getGuests(): Promise<Guest[]>;
  getGuest(id: number): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: number, guest: Partial<InsertGuest>): Promise<Guest | undefined>;
  deleteGuest(id: number): Promise<boolean>;

  // Budget management
  getBudgetItems(): Promise<BudgetItem[]>;
  getBudgetItem(id: number): Promise<BudgetItem | undefined>;
  createBudgetItem(item: InsertBudgetItem): Promise<BudgetItem>;
  updateBudgetItem(id: number, item: Partial<InsertBudgetItem>): Promise<BudgetItem | undefined>;
  deleteBudgetItem(id: number): Promise<boolean>;

  // Timeline management
  getTimelineEvents(): Promise<TimelineEvent[]>;
  getTimelineEvent(id: number): Promise<TimelineEvent | undefined>;
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;
  updateTimelineEvent(id: number, event: Partial<InsertTimelineEvent>): Promise<TimelineEvent | undefined>;
  deleteTimelineEvent(id: number): Promise<boolean>;

  // Task management
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Vendor management
  getVendors(): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor | undefined>;
  deleteVendor(id: number): Promise<boolean>;

  // Seating management
  getSeatingTables(): Promise<SeatingTable[]>;
  getSeatingTable(id: number): Promise<SeatingTable | undefined>;
  createSeatingTable(table: InsertSeatingTable): Promise<SeatingTable>;
  updateSeatingTable(id: number, table: Partial<InsertSeatingTable>): Promise<SeatingTable | undefined>;
  deleteSeatingTable(id: number): Promise<boolean>;

  // Wedding details
  getWeddingDetails(): Promise<WeddingDetails | undefined>;
  createWeddingDetails(details: InsertWeddingDetails): Promise<WeddingDetails>;
  updateWeddingDetails(details: Partial<InsertWeddingDetails>): Promise<WeddingDetails | undefined>;
}

export class MemStorage implements IStorage {
  private guests: Map<number, Guest> = new Map();
  private budgetItems: Map<number, BudgetItem> = new Map();
  private timelineEvents: Map<number, TimelineEvent> = new Map();
  private tasks: Map<number, Task> = new Map();
  private vendors: Map<number, Vendor> = new Map();
  private seatingTables: Map<number, SeatingTable> = new Map();
  private weddingDetails: WeddingDetails | undefined;
  private currentId: number = 1;

  constructor() {
    // Initialize with default wedding details
    this.weddingDetails = {
      id: 1,
      brideName: "Sarah",
      groomName: "Michael",
      weddingDate: "2024-06-15",
      venue: "Rosewood Manor",
      totalBudget: "40000.00",
    };
  }

  private getNextId(): number {
    return this.currentId++;
  }

  // Guest methods
  async getGuests(): Promise<Guest[]> {
    return Array.from(this.guests.values());
  }

  async getGuest(id: number): Promise<Guest | undefined> {
    return this.guests.get(id);
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const id = this.getNextId();
    const newGuest: Guest = { ...guest, id };
    this.guests.set(id, newGuest);
    return newGuest;
  }

  async updateGuest(id: number, guest: Partial<InsertGuest>): Promise<Guest | undefined> {
    const existing = this.guests.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...guest };
    this.guests.set(id, updated);
    return updated;
  }

  async deleteGuest(id: number): Promise<boolean> {
    return this.guests.delete(id);
  }

  // Budget methods
  async getBudgetItems(): Promise<BudgetItem[]> {
    return Array.from(this.budgetItems.values());
  }

  async getBudgetItem(id: number): Promise<BudgetItem | undefined> {
    return this.budgetItems.get(id);
  }

  async createBudgetItem(item: InsertBudgetItem): Promise<BudgetItem> {
    const id = this.getNextId();
    const newItem: BudgetItem = { ...item, id };
    this.budgetItems.set(id, newItem);
    return newItem;
  }

  async updateBudgetItem(id: number, item: Partial<InsertBudgetItem>): Promise<BudgetItem | undefined> {
    const existing = this.budgetItems.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...item };
    this.budgetItems.set(id, updated);
    return updated;
  }

  async deleteBudgetItem(id: number): Promise<boolean> {
    return this.budgetItems.delete(id);
  }

  // Timeline methods
  async getTimelineEvents(): Promise<TimelineEvent[]> {
    return Array.from(this.timelineEvents.values());
  }

  async getTimelineEvent(id: number): Promise<TimelineEvent | undefined> {
    return this.timelineEvents.get(id);
  }

  async createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent> {
    const id = this.getNextId();
    const newEvent: TimelineEvent = { ...event, id };
    this.timelineEvents.set(id, newEvent);
    return newEvent;
  }

  async updateTimelineEvent(id: number, event: Partial<InsertTimelineEvent>): Promise<TimelineEvent | undefined> {
    const existing = this.timelineEvents.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...event };
    this.timelineEvents.set(id, updated);
    return updated;
  }

  async deleteTimelineEvent(id: number): Promise<boolean> {
    return this.timelineEvents.delete(id);
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.getNextId();
    const newTask: Task = { ...task, id };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...task };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Vendor methods
  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const id = this.getNextId();
    const newVendor: Vendor = { ...vendor, id };
    this.vendors.set(id, newVendor);
    return newVendor;
  }

  async updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const existing = this.vendors.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...vendor };
    this.vendors.set(id, updated);
    return updated;
  }

  async deleteVendor(id: number): Promise<boolean> {
    return this.vendors.delete(id);
  }

  // Seating methods
  async getSeatingTables(): Promise<SeatingTable[]> {
    return Array.from(this.seatingTables.values());
  }

  async getSeatingTable(id: number): Promise<SeatingTable | undefined> {
    return this.seatingTables.get(id);
  }

  async createSeatingTable(table: InsertSeatingTable): Promise<SeatingTable> {
    const id = this.getNextId();
    const newTable: SeatingTable = { ...table, id };
    this.seatingTables.set(id, newTable);
    return newTable;
  }

  async updateSeatingTable(id: number, table: Partial<InsertSeatingTable>): Promise<SeatingTable | undefined> {
    const existing = this.seatingTables.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...table };
    this.seatingTables.set(id, updated);
    return updated;
  }

  async deleteSeatingTable(id: number): Promise<boolean> {
    return this.seatingTables.delete(id);
  }

  // Wedding details methods
  async getWeddingDetails(): Promise<WeddingDetails | undefined> {
    return this.weddingDetails;
  }

  async createWeddingDetails(details: InsertWeddingDetails): Promise<WeddingDetails> {
    const id = this.getNextId();
    this.weddingDetails = { ...details, id };
    return this.weddingDetails;
  }

  async updateWeddingDetails(details: Partial<InsertWeddingDetails>): Promise<WeddingDetails | undefined> {
    if (!this.weddingDetails) return undefined;
    this.weddingDetails = { ...this.weddingDetails, ...details };
    return this.weddingDetails;
  }
}

export const storage = new MemStorage();
