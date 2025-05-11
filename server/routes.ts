import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPermissionSchema, insertPermissionRequestSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for permissions
  app.get("/api/permissions", async (req: Request, res: Response) => {
    try {
      // In a real app, we would get userId from session/auth
      const userId = 1; // Demo user
      const permissions = await storage.getPermissions(userId);
      res.json(permissions);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      res.status(500).json({ message: "Failed to fetch permissions" });
    }
  });

  app.get("/api/permissions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const permission = await storage.getPermissionById(id);
      
      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }
      
      res.json(permission);
    } catch (error) {
      console.error("Error fetching permission:", error);
      res.status(500).json({ message: "Failed to fetch permission" });
    }
  });

  app.post("/api/permissions", async (req: Request, res: Response) => {
    try {
      // Validate incoming data
      const validatedData = insertPermissionSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const validationError = fromZodError(validatedData.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const permission = await storage.createPermission(validatedData.data);
      res.status(201).json(permission);
    } catch (error) {
      console.error("Error creating permission:", error);
      res.status(500).json({ message: "Failed to create permission" });
    }
  });

  app.patch("/api/permissions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedPermission = await storage.updatePermission(id, updates);
      
      if (!updatedPermission) {
        return res.status(404).json({ message: "Permission not found" });
      }
      
      res.json(updatedPermission);
    } catch (error) {
      console.error("Error updating permission:", error);
      res.status(500).json({ message: "Failed to update permission" });
    }
  });

  app.delete("/api/permissions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePermission(id);
      
      if (!success) {
        return res.status(404).json({ message: "Permission not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting permission:", error);
      res.status(500).json({ message: "Failed to delete permission" });
    }
  });

  // API Routes for permission requests
  app.get("/api/permission-requests", async (req: Request, res: Response) => {
    try {
      // In a real app, we would get userId from session/auth
      const userId = 1; // Demo user
      const requests = await storage.getPermissionRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching permission requests:", error);
      res.status(500).json({ message: "Failed to fetch permission requests" });
    }
  });

  app.post("/api/permission-requests", async (req: Request, res: Response) => {
    try {
      // Validate incoming data
      const validatedData = insertPermissionRequestSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const validationError = fromZodError(validatedData.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const request = await storage.createPermissionRequest(validatedData.data);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating permission request:", error);
      res.status(500).json({ message: "Failed to create permission request" });
    }
  });

  app.post("/api/permission-requests/:id/approve", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getPermissionRequestById(id);
      
      if (!request) {
        return res.status(404).json({ message: "Permission request not found" });
      }
      
      // Create a new permission from the request
      const newPermission = await storage.createPermission({
        userId: request.userId,
        type: request.type,
        name: request.description || `${request.appName} Permission`,
        appName: request.appName,
        description: request.description,
        contractAddress: request.contractAddress,
        functionSignature: request.functionSignature,
        isActive: true,
        maxAmount: request.maxAmount,
        amountPerSecond: request.amountPerSecond,
        totalAmount: "0",
        maxCalls: request.maxCalls,
        expiryTime: request.expiryTime,
        additionalData: request.additionalData
      });
      
      // Delete the request
      await storage.deletePermissionRequest(id);
      
      res.status(201).json(newPermission);
    } catch (error) {
      console.error("Error approving permission request:", error);
      res.status(500).json({ message: "Failed to approve permission request" });
    }
  });

  app.delete("/api/permission-requests/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePermissionRequest(id);
      
      if (!success) {
        return res.status(404).json({ message: "Permission request not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting permission request:", error);
      res.status(500).json({ message: "Failed to delete permission request" });
    }
  });

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
