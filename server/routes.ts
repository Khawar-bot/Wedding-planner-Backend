import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertGuestSchema,
  insertBudgetItemSchema,
  insertTimelineEventSchema,
  insertTaskSchema,
  insertVendorSchema,
  insertSeatingTableSchema,
  insertWeddingDetailsSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Guest routes
  app.get("/api/guests", async (req, res) => {
    try {
      const guests = await storage.getGuests();
      res.json(guests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch guests" });
    }
  });

  app.get("/api/guests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const guest = await storage.getGuest(id);
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }
      res.json(guest);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch guest" });
    }
  });

  app.post("/api/guests", async (req, res) => {
    try {
      const guestData = insertGuestSchema.parse(req.body);
      const guest = await storage.createGuest(guestData);
      res.status(201).json(guest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid guest data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create guest" });
    }
  });

  app.put("/api/guests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const guestData = insertGuestSchema.partial().parse(req.body);
      const guest = await storage.updateGuest(id, guestData);
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }
      res.json(guest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid guest data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update guest" });
    }
  });

  app.delete("/api/guests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGuest(id);
      if (!success) {
        return res.status(404).json({ message: "Guest not found" });
      }
      res.json({ message: "Guest deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete guest" });
    }
  });

  // Budget routes
  app.get("/api/budget", async (req, res) => {
    try {
      const budgetItems = await storage.getBudgetItems();
      res.json(budgetItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budget items" });
    }
  });

  app.post("/api/budget", async (req, res) => {
    try {
      const budgetData = insertBudgetItemSchema.parse(req.body);
      const budgetItem = await storage.createBudgetItem(budgetData);
      res.status(201).json(budgetItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid budget data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create budget item" });
    }
  });

  app.put("/api/budget/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const budgetData = insertBudgetItemSchema.partial().parse(req.body);
      const budgetItem = await storage.updateBudgetItem(id, budgetData);
      if (!budgetItem) {
        return res.status(404).json({ message: "Budget item not found" });
      }
      res.json(budgetItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid budget data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update budget item" });
    }
  });

  app.delete("/api/budget/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBudgetItem(id);
      if (!success) {
        return res.status(404).json({ message: "Budget item not found" });
      }
      res.json({ message: "Budget item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete budget item" });
    }
  });

  // Timeline routes
  app.get("/api/timeline", async (req, res) => {
    try {
      const events = await storage.getTimelineEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline events" });
    }
  });

  app.post("/api/timeline", async (req, res) => {
    try {
      const eventData = insertTimelineEventSchema.parse(req.body);
      const event = await storage.createTimelineEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create timeline event" });
    }
  });

  app.put("/api/timeline/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const eventData = insertTimelineEventSchema.partial().parse(req.body);
      const event = await storage.updateTimelineEvent(id, eventData);
      if (!event) {
        return res.status(404).json({ message: "Timeline event not found" });
      }
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update timeline event" });
    }
  });

  app.delete("/api/timeline/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTimelineEvent(id);
      if (!success) {
        return res.status(404).json({ message: "Timeline event not found" });
      }
      res.json({ message: "Timeline event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete timeline event" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const taskData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, taskData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTask(id);
      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Vendor routes
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.post("/api/vendors", async (req, res) => {
    try {
      const vendorData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(vendorData);
      res.status(201).json(vendor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vendor data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create vendor" });
    }
  });

  app.put("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vendorData = insertVendorSchema.partial().parse(req.body);
      const vendor = await storage.updateVendor(id, vendorData);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vendor data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update vendor" });
    }
  });

  app.delete("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteVendor(id);
      if (!success) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json({ message: "Vendor deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vendor" });
    }
  });

  // Seating routes
  app.get("/api/seating", async (req, res) => {
    try {
      const tables = await storage.getSeatingTables();
      res.json(tables);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seating tables" });
    }
  });

  app.post("/api/seating", async (req, res) => {
    try {
      const tableData = insertSeatingTableSchema.parse(req.body);
      const table = await storage.createSeatingTable(tableData);
      res.status(201).json(table);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid table data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create seating table" });
    }
  });

  app.put("/api/seating/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tableData = insertSeatingTableSchema.partial().parse(req.body);
      const table = await storage.updateSeatingTable(id, tableData);
      if (!table) {
        return res.status(404).json({ message: "Seating table not found" });
      }
      res.json(table);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid table data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update seating table" });
    }
  });

  app.delete("/api/seating/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSeatingTable(id);
      if (!success) {
        return res.status(404).json({ message: "Seating table not found" });
      }
      res.json({ message: "Seating table deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete seating table" });
    }
  });

  // Wedding details routes
  app.get("/api/wedding-details", async (req, res) => {
    try {
      const details = await storage.getWeddingDetails();
      if (!details) {
        return res.status(404).json({ message: "Wedding details not found" });
      }
      res.json(details);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wedding details" });
    }
  });

  app.put("/api/wedding-details", async (req, res) => {
    try {
      const detailsData = insertWeddingDetailsSchema.partial().parse(req.body);
      const details = await storage.updateWeddingDetails(detailsData);
      if (!details) {
        return res.status(404).json({ message: "Wedding details not found" });
      }
      res.json(details);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid wedding details data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update wedding details" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
