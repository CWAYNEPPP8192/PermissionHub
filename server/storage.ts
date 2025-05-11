import { 
  users, 
  permissions, 
  permissionRequests, 
  type User, 
  type InsertUser, 
  type Permission, 
  type InsertPermission,
  type PermissionRequest,
  type InsertPermissionRequest
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Permission operations
  getPermissions(userId: number): Promise<Permission[]>;
  getPermissionById(id: number): Promise<Permission | undefined>;
  createPermission(permission: InsertPermission): Promise<Permission>;
  updatePermission(id: number, updates: Partial<Permission>): Promise<Permission | undefined>;
  deletePermission(id: number): Promise<boolean>;

  // Permission request operations
  getPermissionRequests(userId: number): Promise<PermissionRequest[]>;
  getPermissionRequestById(id: number): Promise<PermissionRequest | undefined>;
  createPermissionRequest(request: InsertPermissionRequest): Promise<PermissionRequest>;
  deletePermissionRequest(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private permissions: Map<number, Permission>;
  private permissionRequests: Map<number, PermissionRequest>;
  currentUserId: number;
  currentPermissionId: number;
  currentRequestId: number;

  constructor() {
    this.users = new Map();
    this.permissions = new Map();
    this.permissionRequests = new Map();
    this.currentUserId = 1;
    this.currentPermissionId = 1;
    this.currentRequestId = 1;

    // Initialize with some demo data
    this.setupDemoData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPermissions(userId: number): Promise<Permission[]> {
    return Array.from(this.permissions.values()).filter(
      (permission) => permission.userId === userId,
    );
  }

  async getPermissionById(id: number): Promise<Permission | undefined> {
    return this.permissions.get(id);
  }

  async createPermission(insertPermission: InsertPermission): Promise<Permission> {
    const id = this.currentPermissionId++;
    const now = new Date();
    const permission: Permission = { 
      ...insertPermission, 
      id, 
      createdAt: now,
      callsUsed: 0,
    };
    this.permissions.set(id, permission);
    return permission;
  }

  async updatePermission(id: number, updates: Partial<Permission>): Promise<Permission | undefined> {
    const existing = this.permissions.get(id);
    if (!existing) {
      return undefined;
    }
    
    const updated: Permission = { ...existing, ...updates };
    this.permissions.set(id, updated);
    return updated;
  }

  async deletePermission(id: number): Promise<boolean> {
    return this.permissions.delete(id);
  }

  async getPermissionRequests(userId: number): Promise<PermissionRequest[]> {
    return Array.from(this.permissionRequests.values()).filter(
      (request) => request.userId === userId,
    );
  }

  async getPermissionRequestById(id: number): Promise<PermissionRequest | undefined> {
    return this.permissionRequests.get(id);
  }

  async createPermissionRequest(insertRequest: InsertPermissionRequest): Promise<PermissionRequest> {
    const id = this.currentRequestId++;
    const now = new Date();
    const request: PermissionRequest = { ...insertRequest, id, requestedAt: now };
    this.permissionRequests.set(id, request);
    return request;
  }

  async deletePermissionRequest(id: number): Promise<boolean> {
    return this.permissionRequests.delete(id);
  }

  private setupDemoData() {
    // Create demo user
    const demoUser: User = {
      id: 1,
      username: 'demo_user',
      password: 'password123'
    };
    this.users.set(demoUser.id, demoUser);
    this.currentUserId++;

    // Create demo permissions
    const streamingMusicPermission: Permission = {
      id: 1,
      userId: 1,
      type: 'token-stream',
      name: 'Music Subscription Stream',
      appName: 'Streaming Music App',
      description: 'Continuous micropayments for music streaming service',
      contractAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      functionSignature: 'transfer(address,uint256)',
      isActive: true,
      maxAmount: '100',
      amountPerSecond: '0.0001',
      totalAmount: '25.32',
      maxCalls: null,
      callsUsed: 0,
      expiryTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      additionalData: { token: 'USDC' }
    };
    
    const newsSubscriptionPermission: Permission = {
      id: 2,
      userId: 1,
      type: 'token-stream',
      name: 'News Subscription',
      appName: 'Web3 News Subscription',
      description: 'Subscription to premium crypto news content',
      contractAddress: '0x7f8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      functionSignature: 'transfer(address,uint256)',
      isActive: true,
      maxAmount: '0.5',
      amountPerSecond: '0.00005',
      totalAmount: '0.08',
      maxCalls: null,
      callsUsed: 0,
      expiryTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      additionalData: { token: 'ETH' }
    };
    
    const gameSessionPermission: Permission = {
      id: 3,
      userId: 1,
      type: 'session-based',
      name: 'Gaming NFT Session',
      appName: 'Blockchain Game',
      description: 'Limited access to use in-game NFT assets',
      contractAddress: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      functionSignature: 'useItem(),transferInGame()',
      isActive: true,
      maxAmount: null,
      amountPerSecond: null,
      totalAmount: null,
      maxCalls: 50,
      callsUsed: 12,
      expiryTime: new Date(Date.now() + 28 * 60 * 1000), // 28 mins from now
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      additionalData: { nftIds: ['#1234', '#5678'] }
    };
    
    const daoVotingPermission: Permission = {
      id: 4,
      userId: 1,
      type: 'session-based',
      name: 'Voting Delegation',
      appName: 'DAO Voting Portal',
      description: 'Delegated voting rights for proposal DIP-247',
      contractAddress: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      functionSignature: 'vote(uint256,bool)',
      isActive: true,
      maxAmount: null,
      amountPerSecond: null,
      totalAmount: null,
      maxCalls: 1,
      callsUsed: 0,
      expiryTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 2 days 4 hours from now
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      additionalData: { proposalId: 'DIP-247' }
    };
    
    const aiTradingPermission: Permission = {
      id: 5,
      userId: 1,
      type: 'delegation',
      name: 'Smart Account Delegation',
      appName: 'AI Trading Agent',
      description: 'Limited trading permissions for AI agent',
      contractAddress: '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
      functionSignature: 'executeTrade(address,uint256,uint256)',
      isActive: true,
      maxAmount: '500',
      amountPerSecond: null,
      totalAmount: '325',
      maxCalls: 20,
      callsUsed: 7,
      expiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      additionalData: { token: 'USDC', dailyLimit: 20 }
    };
    
    this.permissions.set(streamingMusicPermission.id, streamingMusicPermission);
    this.permissions.set(newsSubscriptionPermission.id, newsSubscriptionPermission);
    this.permissions.set(gameSessionPermission.id, gameSessionPermission);
    this.permissions.set(daoVotingPermission.id, daoVotingPermission);
    this.permissions.set(aiTradingPermission.id, aiTradingPermission);
    this.currentPermissionId = 6;
    
    // Create demo permission requests
    const defiProtocolRequest: PermissionRequest = {
      id: 1,
      userId: 1,
      type: 'contract-interaction',
      appName: 'DeFi Protocol',
      description: 'Automated token swaps permission',
      contractAddress: '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
      functionSignature: 'swap(address,uint256)',
      maxAmount: '500',
      amountPerSecond: null,
      maxCalls: 10,
      expiryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      requestedAt: new Date(),
      additionalData: { token: 'USDC' }
    };
    
    const nftMarketplaceRequest: PermissionRequest = {
      id: 2,
      userId: 1,
      type: 'session-based',
      appName: 'NFT Marketplace',
      description: 'NFT viewing session permission',
      contractAddress: '0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
      functionSignature: 'viewNFT(uint256)',
      maxAmount: null,
      amountPerSecond: null,
      maxCalls: 50,
      expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      requestedAt: new Date(),
      additionalData: { collectionId: 'bored-apes' }
    };
    
    this.permissionRequests.set(defiProtocolRequest.id, defiProtocolRequest);
    this.permissionRequests.set(nftMarketplaceRequest.id, nftMarketplaceRequest);
    this.currentRequestId = 3;
  }
}

export const storage = new MemStorage();
