"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { DataTable } from "@/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetPapers from "@/domains/paper/hooks/use-get-papers";
import { Paper } from "@/domains/paper/types";
import { Text } from "@/components/ui/text";
import { RouteGuard } from "@/components/auth/route-guard";

// Sample data type
type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: string;
  joinDate: string;
};

// Sample data
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    role: "Admin",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    role: "User",
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "inactive",
    role: "User",
    joinDate: "2024-01-10",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    status: "pending",
    role: "Moderator",
    joinDate: "2024-03-05",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    status: "active",
    role: "User",
    joinDate: "2024-02-28",
  },
  {
    id: "6",
    name: "Diana Davis",
    email: "diana@example.com",
    status: "active",
    role: "Admin",
    joinDate: "2024-01-25",
  },
  {
    id: "7",
    name: "Eva Martinez",
    email: "eva@example.com",
    status: "inactive",
    role: "User",
    joinDate: "2024-03-10",
  },
  {
    id: "8",
    name: "Frank Garcia",
    email: "frank@example.com",
    status: "pending",
    role: "User",
    joinDate: "2024-03-15",
  },
];

// Column definitions
const columns: ColumnDef<Paper>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-semibold"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <Text size={"sm"}>{row.original.title}</Text>;
    },
  },
  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-semibold"
        >
          Author
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Text size={"sm"}>
          {row.original.user.name}, {row.original.user.email}
        </Text>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "published"
              ? "default"
              : status === "pending"
              ? "secondary"
              : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Approve</DropdownMenuItem>
            <DropdownMenuItem>Reject</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function Dashboard() {
  const { data: papers, isPending: isLoadingPapers } = useGetPapers({});
  return (
    <RouteGuard>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Here's an overview of your data.
              </p>
            </div>

            <DataTable
              columns={columns}
              data={papers?.data ?? []}
              title="Papers"
              searchKey="title"
            />
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
