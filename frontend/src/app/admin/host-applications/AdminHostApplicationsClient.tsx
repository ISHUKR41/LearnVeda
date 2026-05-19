/**
 * FILE: AdminHostApplicationsClient.tsx
 * LOCATION: src/app/admin/host-applications/AdminHostApplicationsClient.tsx
 * PURPOSE: Client-side admin console for reviewing host applications.
 * LAST UPDATED: 2026-05-19
 */

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Badge, Button } from "@/components/ui";
import type {
  HostApplicationDetail,
  HostApplicationStatus,
  HostApplicationsOverview,
  HostApplicationSummary,
} from "@/types/host-applications";
import styles from "./AdminHostApplications.module.css";

type StatusFilter = HostApplicationStatus | "all";

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "needs_info", label: "Needs Info" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_LABELS: Record<HostApplicationStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  needs_info: "Needs Info",
};

const STATUS_BADGE: Record<HostApplicationStatus, "warning" | "success" | "danger" | "info"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  needs_info: "info",
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminHostApplicationsClient() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [overview, setOverview] = useState<HostApplicationsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<HostApplicationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionLoading, setActionLoading] = useState<HostApplicationStatus | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/host-applications?status=${statusFilter}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load host applications.");
        }

        const payload = await res.json();
        if (active) {
          setOverview(payload.data);
          setSelectedId((prev) => {
            if (payload.data.applications.some((item: HostApplicationSummary) => item.id === prev)) {
              return prev;
            }
            return payload.data.applications[0]?.id ?? null;
          });
        }
      } catch {
        if (active) {
          toast.error("Unable to load host applications.");
          setOverview({ applications: [], totals: { pending: 0, approved: 0, rejected: 0, needsInfo: 0 } });
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadOverview();
    return () => { active = false; };
  }, [statusFilter]);

  useEffect(() => {
    let active = true;

    async function loadDetail() {
      if (!selectedId) {
        setDetail(null);
        return;
      }

      setDetailLoading(true);
      try {
        const res = await fetch(`/api/admin/host-applications/${selectedId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load application.");
        }

        const payload = await res.json();
        if (active) {
          setDetail(payload.data.application);
          setReviewNotes(payload.data.application.reviewNotes ?? "");
        }
      } catch {
        if (active) {
          toast.error("Unable to load application detail.");
          setDetail(null);
        }
      } finally {
        if (active) {
          setDetailLoading(false);
        }
      }
    }

    loadDetail();
    return () => { active = false; };
  }, [selectedId]);

  async function handleStatusUpdate(nextStatus: HostApplicationStatus) {
    if (!detail) return;

    setActionLoading(nextStatus);
    try {
      const res = await fetch(`/api/admin/host-applications/${detail.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          reviewNotes: reviewNotes.trim() || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      const payload = await res.json();
      setDetail(payload.data.application);
      toast.success(`Marked as ${STATUS_LABELS[nextStatus]}.`);

      const refreshed = await fetch(`/api/admin/host-applications?status=${statusFilter}`, {
        cache: "no-store",
      });
      if (refreshed.ok) {
        const refreshedPayload = await refreshed.json();
        setOverview(refreshedPayload.data);
      }
    } catch {
      toast.error("Could not update application.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <label htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            className={styles.select}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.overviewBadges}>
          <Badge variant="warning">Pending {overview?.totals.pending ?? 0}</Badge>
          <Badge variant="info">Needs Info {overview?.totals.needsInfo ?? 0}</Badge>
          <Badge variant="success">Approved {overview?.totals.approved ?? 0}</Badge>
          <Badge variant="danger">Rejected {overview?.totals.rejected ?? 0}</Badge>
        </div>
      </div>

      <div className={styles.tableGrid}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Institution</th>
                <th>Event</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>Loading applications…</td>
                </tr>
              )}
              {!isLoading && overview?.applications.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>No applications for this filter.</td>
                </tr>
              )}
              {!isLoading && overview?.applications.map((item) => (
                <tr
                  key={item.id}
                  className={`${styles.tableRow} ${item.id === selectedId ? styles.tableRowActive : ""}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <td>{item.referenceNumber}</td>
                  <td>
                    <strong>{item.institutionName}</strong>
                    <br />
                    <span>{item.city}, {item.state}</span>
                  </td>
                  <td>{item.eventName}</td>
                  <td>
                    <Badge variant={STATUS_BADGE[item.status]}>{STATUS_LABELS[item.status]}</Badge>
                  </td>
                  <td>{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.detailPanel}>
          {!selectedId && (
            <div className={styles.emptyState}>Select an application to review.</div>
          )}
          {selectedId && detailLoading && (
            <div className={styles.emptyState}>Loading application detail…</div>
          )}
          {selectedId && !detailLoading && detail && (
            <>
              <div>
                <h3 className={styles.detailTitle}>{detail.eventName}</h3>
                <Badge variant={STATUS_BADGE[detail.status]}>{STATUS_LABELS[detail.status]}</Badge>
              </div>

              <div className={styles.detailList}>
                <div className={styles.detailItem}><strong>Reference:</strong> {detail.referenceNumber}</div>
                <div className={styles.detailItem}><strong>Institution:</strong> {detail.institutionName} ({detail.institutionType})</div>
                <div className={styles.detailItem}><strong>Organizer:</strong> {detail.organizerName} · {detail.organizerEmail}</div>
                <div className={styles.detailItem}><strong>Location:</strong> {detail.city}, {detail.state}</div>
                <div className={styles.detailItem}><strong>Event Date:</strong> {formatDate(detail.eventDate)}</div>
                <div className={styles.detailItem}><strong>Expected Participants:</strong> {detail.expectedParticipants}</div>
              </div>

              {detail.eventDescription && (
                <p>{detail.eventDescription}</p>
              )}

              <div className={styles.detailNotes}>
                <label htmlFor="reviewNotes"><strong>Review Notes</strong></label>
                <textarea
                  id="reviewNotes"
                  className={styles.noteInput}
                  value={reviewNotes}
                  onChange={(event) => setReviewNotes(event.target.value)}
                  placeholder="Add internal review notes for this application."
                />
              </div>

              <div className={styles.actionRow}>
                <Button
                  variant="primary"
                  isLoading={actionLoading === "approved"}
                  onClick={() => handleStatusUpdate("approved")}
                >
                  Approve
                </Button>
                <Button
                  variant="secondary"
                  isLoading={actionLoading === "needs_info"}
                  onClick={() => handleStatusUpdate("needs_info")}
                >
                  Needs Info
                </Button>
                <Button
                  variant="danger"
                  isLoading={actionLoading === "rejected"}
                  onClick={() => handleStatusUpdate("rejected")}
                >
                  Reject
                </Button>
              </div>
            </>
          )}
          {selectedId && !detailLoading && !detail && (
            <div className={styles.emptyState}>Unable to load this application.</div>
          )}
        </div>
      </div>
    </>
  );
}
