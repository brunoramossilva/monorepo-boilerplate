import type { User } from "@repo/types";

const now = new Date().toISOString();

const mockUsers: User[] = [
  { id: "1", email: "maria@example.com", name: "Maria Silva", createdAt: now, updatedAt: now },
  { id: "2", email: "joao@example.com", name: "João Souza", createdAt: now, updatedAt: now },
];

export async function listUsers(): Promise<User[]> {
  // Para usar o banco real: return prisma.user.findMany();
  return mockUsers;
}
