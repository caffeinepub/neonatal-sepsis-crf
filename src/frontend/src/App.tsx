import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { Layout } from "./components/Layout";
import { AdjudicationGuide } from "./pages/AdjudicationGuide";
import { CRFForm } from "./pages/CRFForm";
import { Dashboard } from "./pages/Dashboard";

export type Page =
  | { name: "dashboard" }
  | { name: "crf-new" }
  | { name: "crf-edit"; id: bigint }
  | { name: "guide" };

export default function App() {
  const [page, setPage] = useState<Page>({ name: "dashboard" });

  return (
    <>
      <Layout
        currentPage={page.name}
        onNavigate={(p) => setPage({ name: p } as Page)}
      >
        {page.name === "dashboard" && (
          <Dashboard
            onNewCase={() => setPage({ name: "crf-new" })}
            onEditCase={(id) => setPage({ name: "crf-edit", id })}
          />
        )}
        {page.name === "crf-new" && (
          <CRFForm
            caseId={null}
            onBack={() => setPage({ name: "dashboard" })}
            onSaved={() => setPage({ name: "dashboard" })}
          />
        )}
        {page.name === "crf-edit" && (
          <CRFForm
            caseId={(page as { name: "crf-edit"; id: bigint }).id}
            onBack={() => setPage({ name: "dashboard" })}
            onSaved={() => setPage({ name: "dashboard" })}
          />
        )}
        {page.name === "guide" && <AdjudicationGuide />}
      </Layout>
      <Toaster position="top-right" richColors />
    </>
  );
}
