import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  PlusCircle,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { PatientCase } from "../backend.d";
import {
  useGetCaseCount,
  useListCases,
  useSearchCases,
} from "../hooks/useQueries";

const PAGE_SIZE = 20;

interface DashboardProps {
  onNewCase: () => void;
  onEditCase: (id: bigint) => void;
}

export function Dashboard({ onNewCase, onEditCase }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: totalCount = BigInt(0), isLoading: countLoading } =
    useGetCaseCount();
  const { data: cases = [], isLoading: casesLoading } = useListCases(
    currentPage * PAGE_SIZE,
    PAGE_SIZE,
  );
  const { data: searchResults = [], isLoading: searchLoading } =
    useSearchCases(debouncedQuery);

  const isSearching = debouncedQuery.trim().length > 0;
  const displayCases: PatientCase[] = isSearching ? searchResults : cases;
  const isLoading = isSearching ? searchLoading : casesLoading;

  const totalPages = Math.max(1, Math.ceil(Number(totalCount) / PAGE_SIZE));
  const completedCount = cases.filter((c) => c.isComplete).length;
  const incompleteCount = cases.filter((c) => !c.isComplete).length;

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Neonatal Sepsis CRF
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Use and Misuse of Sepsis Screen in Neonates — Observational Study
            </p>
          </div>
          <Button
            onClick={onNewCase}
            className="gap-2 flex-shrink-0"
            data-ocid="dashboard.new_case.primary_button"
          >
            <PlusCircle className="w-4 h-4" />
            New Case
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Cases"
          value={countLoading ? "—" : Number(totalCount).toString()}
          color="primary"
          loading={countLoading}
        />
        <StatCard
          label="Completed"
          value={countLoading ? "—" : completedCount.toString()}
          color="success"
          loading={countLoading}
        />
        <StatCard
          label="Incomplete"
          value={countLoading ? "—" : incompleteCount.toString()}
          color="warning"
          loading={countLoading}
        />
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by S.No or Baby's name..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(0);
          }}
          data-ocid="dashboard.search_input"
        />
        {isSearching && searchLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full crf-table">
            <thead>
              <tr>
                <th className="w-16">S.No</th>
                <th>CR Number</th>
                <th>Baby's Name</th>
                <th>Date of Enrollment</th>
                <th>Area</th>
                <th className="w-28">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_row, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no stable id
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_cell, j) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells have no stable id
                      <td key={j}>
                        <Skeleton className="h-4 w-full rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : displayCases.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div
                      className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                      data-ocid="cases.empty_state"
                    >
                      <FileText className="w-10 h-10 mb-3 opacity-30" />
                      <p className="font-medium">
                        {isSearching
                          ? "No cases match your search"
                          : "No cases yet"}
                      </p>
                      <p className="text-sm mt-1">
                        {isSearching
                          ? "Try a different name or S.No"
                          : "Create your first CRF entry to get started"}
                      </p>
                      {!isSearching && (
                        <Button
                          variant="outline"
                          className="mt-4 gap-2"
                          onClick={onNewCase}
                          data-ocid="empty.new_case.button"
                        >
                          <PlusCircle className="w-4 h-4" />
                          New Case
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                displayCases.map((c, idx) => (
                  <motion.tr
                    key={c.sNo.toString()}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="cursor-pointer hover:bg-accent/40 transition-colors"
                    onClick={() => onEditCase(c.sNo)}
                    data-ocid={`cases.item.${idx + 1}`}
                  >
                    <td className="font-mono text-sm font-semibold text-primary">
                      {Number(c.sNo)}
                    </td>
                    <td className="font-medium">
                      {c.crNumber || (
                        <span className="text-muted-foreground italic text-xs">
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      {c.babysName || (
                        <span className="text-muted-foreground italic text-xs">
                          —
                        </span>
                      )}
                    </td>
                    <td className="text-muted-foreground text-sm">
                      {c.dateOfEnrollment || "—"}
                    </td>
                    <td>
                      {c.area ? (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-accent text-accent-foreground">
                          {c.area}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      <Badge
                        variant={c.isComplete ? "default" : "outline"}
                        className={cn(
                          "text-xs",
                          c.isComplete
                            ? "bg-success/15 text-success border-success/30"
                            : "bg-warning/15 text-warning border-warning/30",
                        )}
                      >
                        {c.isComplete ? "Complete" : "Draft"}
                      </Badge>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isSearching && Number(totalCount) > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
            <span className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages} · {Number(totalCount)}{" "}
              total
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => p - 1)}
                data-ocid="cases.pagination_prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage((p) => p + 1)}
                data-ocid="cases.pagination_next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  loading,
}: {
  label: string;
  value: string;
  color: "primary" | "success" | "warning";
  loading: boolean;
}) {
  const colorClasses = {
    primary: "text-primary border-primary/20 bg-primary/5",
    success: "text-success border-success/20 bg-success/5",
    warning: "text-warning border-warning/20 bg-warning/5",
  };

  return (
    <div className={cn("rounded-lg border p-4 shadow-xs", colorClasses[color])}>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">
        {label}
      </div>
      {loading ? (
        <Skeleton className="h-7 w-12 rounded" />
      ) : (
        <div className="text-2xl font-bold font-mono">{value}</div>
      )}
    </div>
  );
}
