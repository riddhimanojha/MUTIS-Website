import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { useToast } from "../components/Toast";

type EtoroSettingsRow = Database["public"]["Tables"]["etoro_settings"]["Row"];
type EtoroPortfolioCacheRow = Database["public"]["Tables"]["etoro_portfolio_cache"]["Row"];

export function Integrations() {
  const toast = useToast();
  const [settings, setSettings] = useState<EtoroSettingsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [userKey, setUserKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSettings = () => {
    supabase
      .from("etoro_settings")
      .select("*")
      .eq("id", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast.error("Could not load eToro settings.");
        else setSettings(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!apiKey.trim() || !userKey.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.functions.invoke<{ error?: string }>("etoro-set-key", {
      body: { apiKey: apiKey.trim(), userKey: userKey.trim() },
    });
    setSaving(false);
    if (error || data?.error) {
      toast.error(data?.error ?? error?.message ?? "Could not save the eToro key.");
      return;
    }
    setApiKey("");
    setUserKey("");
    toast.success("eToro key saved.");
    fetchSettings();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const { data, error } = await supabase.functions.invoke<EtoroPortfolioCacheRow & { error?: string }>(
      "etoro-portfolio",
    );
    setRefreshing(false);
    if (error || data?.error) {
      toast.error(data?.error ?? error?.message ?? "Could not refresh the portfolio.");
      return;
    }
    if (data?.sync_status === "error") {
      toast.error(data.sync_error ?? "eToro rejected the request — check the key.");
      return;
    }
    toast.success("Portfolio refreshed from eToro.");
  };

  return (
    <div className="mx-auto max-w-[640px] px-[24px] py-[48px] lg:px-[40px] lg:py-[56px]">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">Settings</p>
      <h1 className="mt-[8px] text-[22px] font-medium text-foreground">Integrations</h1>
      <p className="mt-[8px] text-[13px] leading-[1.6] text-muted-foreground">
        eToro API credentials for the live MEIF portfolio. The key pair is stored encrypted in Supabase
        Vault and is only ever read by the eToro Edge Functions — it's never sent to the browser.
      </p>

      {loading ? (
        <div className="mt-[32px] flex items-center justify-center py-[48px] text-muted-foreground">
          <Loader2 className="h-[18px] w-[18px] animate-spin" />
        </div>
      ) : (
        <>
          <div className="mt-[24px] rounded-[10px] border border-border bg-card px-[16px] py-[14px] text-[13px] text-muted-foreground">
            {settings?.is_configured ? (
              <>
                <span className="text-accent">Configured</span> — last updated{" "}
                {settings.updated_at ? new Date(settings.updated_at).toLocaleString("en-GB") : "unknown"}.
              </>
            ) : (
              "Not configured yet — the MEIF page will show a placeholder until a key is saved."
            )}
          </div>

          <form onSubmit={onSubmit} className="mt-[24px] flex flex-col gap-[20px]">
            <Field label="Public API key (x-api-key)">
              <input
                type="password"
                autoComplete="off"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={settings?.is_configured ? "•••••••••••• (unchanged unless replaced)" : ""}
                className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent"
              />
            </Field>

            <Field label="User key (x-user-key)">
              <input
                type="password"
                autoComplete="off"
                value={userKey}
                onChange={(e) => setUserKey(e.target.value)}
                placeholder={settings?.is_configured ? "•••••••••••• (unchanged unless replaced)" : ""}
                className="w-full rounded-[10px] border border-input bg-input px-[14px] py-[12px] text-[15px]! text-foreground outline-hidden transition-colors focus:border-accent"
              />
            </Field>

            <div className="mt-[8px] flex justify-end gap-[10px]">
              {settings?.is_configured && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={refreshing}
                  className="rounded-[10px] border border-border px-[16px] py-[10px] text-[13px]! font-medium text-foreground transition-colors hover:bg-white/5 disabled:opacity-60"
                >
                  {refreshing ? "Refreshing…" : "Refresh portfolio now"}
                </button>
              )}
              <button
                type="submit"
                disabled={saving || !apiKey.trim() || !userKey.trim()}
                className="rounded-[10px] bg-primary px-[16px] py-[10px] text-[13px]! font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save key"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
