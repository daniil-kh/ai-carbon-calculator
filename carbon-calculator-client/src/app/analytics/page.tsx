/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { useI18n } from "../../i18n/I18nProvider";
import { LanguageSelect } from "../../components/LanguageSelect";

type TimeBucket = "day" | "week" | "month";

type CarbonReportSummary = {
  from: string; // ISO
  to: string; // ISO
  periodDays: number;
  frequency: { avgReportsPerDay: number };
  count: number;
  totalsKgCO2e: { sum: number; avg: number; min: number; max: number };
  scopeTotalsKgCO2e: { scope1Avg: number; scope2Avg: number; scope3Avg: number };
};

type CarbonReportTimeseriesPoint = {
  bucketStart: string; // ISO
  count: number;
  totalKgCO2eSum: number;
  totalKgCO2eAvg: number;
};

type CarbonReportTimeseries = {
  from: string; // ISO
  to: string; // ISO
  bucket: TimeBucket;
  points: CarbonReportTimeseriesPoint[];
};

function toLocalInputValue(date: Date): string {
  const tzAdjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return tzAdjusted.toISOString().slice(0, 16);
}

function parseLocalDatetime(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const [datePart, timePart] = trimmed.split("T");
  if (!datePart || !timePart) return null;
  const [y, m, d] = datePart.split("-").map((x) => Number(x));
  const [hh, mm] = timePart.split(":").map((x) => Number(x));
  if (![y, m, d, hh, mm].every((n) => Number.isFinite(n))) return null;
  return new Date(y!, (m! - 1)!, d!, hh!, mm!);
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function AnalyticsPage() {
  const { t } = useI18n();
  const now = useMemo(() => new Date(), []);
  const [fromLocal, setFromLocal] = useState(() => toLocalInputValue(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)));
  const [toLocal, setToLocal] = useState(() => toLocalInputValue(now));
  const [bucket, setBucket] = useState<TimeBucket>("day");

  const [summary, setSummary] = useState<CarbonReportSummary | null>(null);
  const [series, setSeries] = useState<CarbonReportTimeseries | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fromIso = useMemo(() => parseLocalDatetime(fromLocal)?.toISOString(), [fromLocal]);
  const toIso = useMemo(() => parseLocalDatetime(toLocal)?.toISOString(), [toLocal]);

  const maxSum = useMemo(() => {
    const pts = series?.points ?? [];
    let max = 0;
    for (const p of pts) max = Math.max(max, Number.isFinite(p.totalKgCO2eSum) ? p.totalKgCO2eSum : 0);
    return max;
  }, [series]);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const summaryUrl = new URL("/api/analytics/carbon-reports/summary", window.location.origin);
      if (fromIso) summaryUrl.searchParams.set("from", fromIso);
      if (toIso) summaryUrl.searchParams.set("to", toIso);

      const tsUrl = new URL("/api/analytics/carbon-reports/timeseries", window.location.origin);
      tsUrl.searchParams.set("bucket", bucket);
      if (fromIso) tsUrl.searchParams.set("from", fromIso);
      if (toIso) tsUrl.searchParams.set("to", toIso);

      const [summaryRes, tsRes] = await Promise.all([fetch(summaryUrl), fetch(tsUrl)]);

      const summaryJson = await summaryRes.json().catch(() => null);
      if (!summaryRes.ok) {
        const message =
          typeof summaryJson?.message === "string"
            ? summaryJson.message
            : t("error.summaryRequestFailed", { status: summaryRes.status });
        throw new Error(message);
      }
      setSummary(summaryJson as CarbonReportSummary);

      const tsJson = await tsRes.json().catch(() => null);
      if (!tsRes.ok) {
        const message =
          typeof tsJson?.message === "string" ? tsJson.message : t("error.timeseriesRequestFailed", { status: tsRes.status });
        throw new Error(message);
      }
      setSeries(tsJson as CarbonReportTimeseries);
    } catch (err: any) {
      setError(err?.message ?? t("error.analyticsLoadFailed"));
      setSummary(null);
      setSeries(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{t("analytics.title")}</h1>
            <p className={styles.subtitle}>{t("analytics.subtitle")}</p>
          </div>
          <div className={styles.headerActions}>
            <Link className={styles.secondaryButton} href="/">
              {t("common.back")}
            </Link>
            <LanguageSelect className={styles.langSelect} />
            <button className={styles.primaryButton} type="button" onClick={load} disabled={isLoading}>
              {isLoading ? t("common.loading") : t("common.refresh")}
            </button>
          </div>
        </header>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>{t("analytics.filters.title")}</h2>
            <p>{t("analytics.filters.subtitle")}</p>
          </div>
          <div className={styles.filtersGrid}>
            <label className={styles.field}>
              <div className={styles.fieldLabel}>{t("analytics.filters.from")}</div>
              <input className={styles.input} type="datetime-local" value={fromLocal} onChange={(e) => setFromLocal(e.target.value)} />
            </label>
            <label className={styles.field}>
              <div className={styles.fieldLabel}>{t("analytics.filters.to")}</div>
              <input className={styles.input} type="datetime-local" value={toLocal} onChange={(e) => setToLocal(e.target.value)} />
            </label>
            <label className={styles.field}>
              <div className={styles.fieldLabel}>{t("analytics.filters.bucket")}</div>
              <select className={styles.select} value={bucket} onChange={(e) => setBucket(e.target.value as TimeBucket)}>
                <option value="day">{t("bucket.day")}</option>
                <option value="week">{t("bucket.week")}</option>
                <option value="month">{t("bucket.month")}</option>
              </select>
            </label>
          </div>
          <div className={styles.filtersActions}>
            <button className={styles.secondaryButton} type="button" onClick={load} disabled={isLoading}>
              {t("common.apply")}
            </button>
          </div>
        </section>

        {error ? (
          <section className={styles.alertError} role="alert">
            {error}
          </section>
        ) : null}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>{t("analytics.summary.title")}</h2>
            <p>{summary ? `${new Date(summary.from).toLocaleString()} → ${new Date(summary.to).toLocaleString()}` : "—"}</p>
          </div>
          <div className={styles.kpiGrid}>
            <div className={styles.kpiTile}>
              <div className={styles.kpiLabel}>{t("analytics.kpi.reports")}</div>
              <div className={styles.kpiValue}>{formatNumber(summary?.count ?? 0)}</div>
              <div className={styles.kpiMeta}>
                {t("analytics.kpi.avgPerDay")}: {formatNumber(summary?.frequency.avgReportsPerDay ?? 0)}
              </div>
            </div>
            <div className={styles.kpiTile}>
              <div className={styles.kpiLabel}>{t("analytics.kpi.totalSum")}</div>
              <div className={styles.kpiValue}>{formatNumber(summary?.totalsKgCO2e.sum ?? 0)}</div>
              <div className={styles.kpiMeta}>
                {t("analytics.kpi.avg")}: {formatNumber(summary?.totalsKgCO2e.avg ?? 0)}
              </div>
            </div>
            <div className={styles.kpiTile}>
              <div className={styles.kpiLabel}>{t("analytics.kpi.minMax")}</div>
              <div className={styles.kpiValue}>
                {formatNumber(summary?.totalsKgCO2e.min ?? 0)} / {formatNumber(summary?.totalsKgCO2e.max ?? 0)}
              </div>
              <div className={styles.kpiMeta}>
                {t("analytics.kpi.periodDays")}: {formatNumber(summary?.periodDays ?? 0)}
              </div>
            </div>
            <div className={styles.kpiTile}>
              <div className={styles.kpiLabel}>{t("analytics.kpi.scopeAverages")}</div>
              <div className={styles.kpiValue}>{formatNumber(summary?.scopeTotalsKgCO2e.scope1Avg ?? 0)}</div>
              <div className={styles.kpiMeta}>
                S2: {formatNumber(summary?.scopeTotalsKgCO2e.scope2Avg ?? 0)} • S3: {formatNumber(summary?.scopeTotalsKgCO2e.scope3Avg ?? 0)}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>{t("analytics.timeseries.title", { bucket: t(`bucket.${bucket}` as any) })}</h2>
            <p>{series ? t("analytics.timeseries.buckets", { count: String(series.points.length) }) : "—"}</p>
          </div>

          {series?.points?.length ? (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t("analytics.table.bucketStart")}</th>
                    <th className={styles.right}>{t("analytics.table.reports")}</th>
                    <th className={styles.right}>{t("analytics.table.sum")}</th>
                    <th className={styles.right}>{t("analytics.table.avg")}</th>
                    <th>{t("analytics.table.volume")}</th>
                  </tr>
                </thead>
                <tbody>
                  {series.points.map((p) => {
                    const width = maxSum > 0 ? Math.min(100, (p.totalKgCO2eSum / maxSum) * 100) : 0;
                    return (
                      <tr key={p.bucketStart}>
                        <td className={styles.mono}>{new Date(p.bucketStart).toLocaleString()}</td>
                        <td className={`${styles.right} ${styles.mono}`}>{formatNumber(p.count)}</td>
                        <td className={`${styles.right} ${styles.mono}`}>{formatNumber(p.totalKgCO2eSum)}</td>
                        <td className={`${styles.right} ${styles.mono}`}>{formatNumber(p.totalKgCO2eAvg)}</td>
                        <td>
                          <div className={styles.barTrack}>
                            <div className={styles.barFill} style={{ width: `${width}%` }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.muted}>{t("analytics.timeseries.noData")}</p>
          )}
        </section>
      </main>
    </div>
  );
}

