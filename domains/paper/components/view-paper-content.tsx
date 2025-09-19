"use client";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import useGetPaper from "../hooks/use-get-paper";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import Link from "next/link";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import useUpdatePaperStatus from "../hooks/use-update-paper-status";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { paperKeys } from "@/lib/react-query/query-keys";
import Loader from "@/components/ui/loader";

const RejectPaperDialog = ({
  open,
  close,
  paperId,
  paperTitle,
}: {
  open: boolean;
  close: () => void;
  paperId: number;
  paperTitle: string;
}) => {
  const queryClient = useQueryClient();
  const updatePaperStatusMutation = useUpdatePaperStatus({ paperId });
  const [rejectionReason, setRejectionReason] = useState("");

  const handleConfirm = () => {
    updatePaperStatusMutation.mutate(
      { status: "rejected", rejectionReason },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: paperKeys.list() });
          close();
        },
        onError: (err) => {
          if (isAxiosError(err)) {
            toast.error(err.response?.data.message);
          } else {
            toast.error(`An error occurred: ${err.message}`);
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={() => close()}>
      <DialogContent showCloseButton={false}>
        <div className="flex flex-col gap-10">
          <DialogTitle>
            Are you sure you want to reject the paper "{paperTitle}"?
          </DialogTitle>

          <div className="flex flex-col gap-1">
            <Label className="text-sm text-text font-bold">
              Rejection reason
            </Label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              variant="minimal"
              size={"lg"}
              placeholder="0/2000 characters"
              className="rounded-md bg-white py-2 placeholder:text-xs"
              required
            />
            {!rejectionReason && (
              <Text size={"xs"} className="text-rose-600">
                Rejection reason is required
              </Text>
            )}
          </div>

          <Button
            disabled={!rejectionReason || updatePaperStatusMutation.isPending}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PublishPaperDialog = ({
  open,
  close,
  paperId,
  paperTitle,
}: {
  open: boolean;
  close: () => void;
  paperId: number;
  paperTitle: string;
}) => {
  const queryClient = useQueryClient();
  const updatePaperStatusMutation = useUpdatePaperStatus({ paperId });

  const handleConfirm = () => {
    updatePaperStatusMutation.mutate(
      { status: "published" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: paperKeys.list() });
          close();
        },
        onError: (err) => {
          if (isAxiosError(err)) {
            toast.error(err.response?.data.message);
          } else {
            toast.error(`An error occurred: ${err.message}`);
          }
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={() => close()}>
      <DialogContent showCloseButton={false}>
        <div className="flex flex-col gap-10">
          <DialogTitle>
            Are you sure you want to publish the paper "{paperTitle}"?
          </DialogTitle>
          <Button
            disabled={updatePaperStatusMutation.isPending}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ViewPaperDialog = ({
  open,
  onOpenChange,
  paperId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paperId: number;
}) => {
  const [openPaperActionDialog, setOpenPaperActionDialog] = useState(false);
  const [paperStatus, setPaperStatus] = useState<"rejected" | "published">();
  const { data: paper, isPending: isLoadingPaper } = useGetPaper({
    id: paperId.toString(),
  });

  const handleShowActionDialog = (status: "rejected" | "published") => {
    setPaperStatus(status);
    setOpenPaperActionDialog(true);
  };

  const closePaperActionDialog = () => {
    setOpenPaperActionDialog(false);
    onOpenChange(false);
    setPaperStatus(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="w-full">
        {paperStatus === "published" ? (
          <PublishPaperDialog
            open={openPaperActionDialog}
            close={closePaperActionDialog}
            paperId={paperId}
            paperTitle={paper?.title || ""}
          />
        ) : (
          <RejectPaperDialog
            open={openPaperActionDialog}
            close={closePaperActionDialog}
            paperId={paperId}
            paperTitle={paper?.title || ""}
          />
        )}
        {isLoadingPaper || !paper ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <section>
            <div className="flex flex-col gap-10 w-full mx-auto">
              <div className="flex flex-col gap-4 text-left md:text-left">
                <DialogTitle>
                  <Text size={"xl"} weight={"semibold"}>
                    {paper.title}
                  </Text>
                </DialogTitle>
                <Text size={"sm"}>{paper?.user.name}</Text>

                <DialogDescription>
                  <Text size={"sm"} className="leading-6">
                    {paper.abstract}
                  </Text>
                </DialogDescription>
              </div>

              <section className="md:w-4/5 w-full mx-auto flex flex-col gap-3">
                <div>
                  <div className="flex flex-wrap justify-between gap-4 text-xs">
                    <p className="flex gap-2">
                      <TooltipInfo text="Coming soon">
                        <Text size={"xs"}>[AI Cross-Ref]</Text>
                      </TooltipInfo>

                      <Link
                        href={
                          paper?.ipfsCid ? `/api/ipfs/${paper.ipfsCid}` : "#"
                        }
                        target="_blank"
                        className="hover:underline font-semibold"
                      >
                        [View PDF]
                      </Link>
                    </p>

                    <Text size={"xs"}>[Cite as: desci.ng.1308.2025]</Text>
                  </div>
                </div>
                <div>
                  <p className="flex flex-wrap justify-between gap-4 text-xs">
                    <Text size={"xs"}>
                      [Uploaded on{" "}
                      {format(paper.createdAt ?? new Date(), "PPpp")}]
                    </Text>

                    {/* TODO: Add an hyperlink to the rendered tags that links to the search page and adds a tag as a query */}
                    {paper && paper.keywords.length > 0 && (
                      <Text size={"xs"}>
                        [
                        {paper.keywords
                          .map((keyword) => keyword.name)
                          .join(", ")}
                        ]
                      </Text>
                    )}
                  </p>
                </div>
              </section>

              <section>
                <Text as="p" size={"sm"} weight={"semibold"}>
                  Notes
                </Text>

                <Text as="p" size={"sm"} className="leading-6">
                  {paper?.notes}
                </Text>
              </section>
            </div>

            <div className="flex justify-between w-2/3 mx-auto my-4">
              <Button
                variant={"destructive"}
                className="px-8 py-3 text-white font-medium"
                onClick={() => handleShowActionDialog("rejected")}
              >
                Reject
              </Button>
              <Button
                className="px-8 py-3 text-white font-medium"
                onClick={() => handleShowActionDialog("published")}
              >
                Approve
              </Button>
            </div>
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewPaperDialog;
