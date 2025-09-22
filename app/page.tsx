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
import ViewPaperDialog from "@/domains/paper/components/view-paper-content";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";

export default function Dashboard() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);
  const { data: papers, isPending: isLoadingPapers } = useGetPapers({
    search: debouncedSearchValue,
  });
  const [openViewPaperDialog, setOpenViewPaperDialog] = useState(false);
  const [paperInView, setPaperInView] = useState<number | null>(null);

  const handleViewPaper = (paperId: number) => {
    setPaperInView(paperId);
    setOpenViewPaperDialog(true);
  };

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
        return (
          <Text size={"sm"} onClick={() => handleViewPaper(row.original.id)}>
            {row.original.title}
          </Text>
        );
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
          <Text size={"sm"} onClick={() => handleViewPaper(row.original.id)}>
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
        const colorMap = {
          pending: "bg-amber-300",
          published: "bg-green-300",
          rejected: "bg-red-400",
        };
        return (
          <Badge
            className={colorMap[status]}
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
        const paper = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-sm">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs">
                <Link href={paper.ipfsCid ? `/api/ipfs/${paper.ipfsCid}` : "#"}>
                  View PDF
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <RouteGuard>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {paperInView && (
            <ViewPaperDialog
              open={openViewPaperDialog}
              onOpenChange={(open) => setOpenViewPaperDialog(false)}
              paperId={paperInView}
            />
          )}
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
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
