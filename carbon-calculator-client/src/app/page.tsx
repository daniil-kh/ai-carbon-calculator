/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useI18n } from "../i18n/I18nProvider";
import { LanguageSelect } from "../components/LanguageSelect";

type DistanceDtoUnit = "km" | "mile";

type CreateCarbonReportDto = {
  scope1: {
    stationaryCombustion: {
      naturalGasM3?: number;
      heatingMazutL?: number;
      coalT?: number;
      fleetGasolineL?: number;
      fleetDieselL?: number;
      generatorsDieselL?: number;
    };
    refrigerants: {
      r407cKg?: number;
      r32Kg?: number;
      r410aKg?: number;
    };
  };
  scope2: {
    electricityKwh?: number;
    districtHeatGj?: number;
  };
  scope3: {
    category1: {
      waterSupplyM3?: number;
      paperStandardKg?: number;
      paperEcoKg?: number;
    };
    category5: {
      wastewaterTreatmentM3?: number;
      wastePaperKg?: number;
      wasteMonitorsKg?: number;
      wasteElectronicsKg?: number;
      wasteTonersKg?: number;
    };
    category6: {
      flights?: { distance: number; unit: DistanceDtoUnit };
      rail?: { distance: number; unit: DistanceDtoUnit };
      taxi?: { distance: number; unit: DistanceDtoUnit };
      bus?: { distance: number; unit: DistanceDtoUnit };
    };
  };
};

type CarbonReportResponse = {
  id: string;
  createdAt: string;
  input: CreateCarbonReportDto;
  totals: {
    totalKgCO2e: number;
    scope1: {
      stationaryCombustionKgCO2e: number;
      refrigerantsKgCO2e: number;
      totalKgCO2e: number;
    };
    scope2: { totalKgCO2e: number };
    scope3: {
      category1KgCO2e: number;
      category5KgCO2e: number;
      category6KgCO2e: number;
      totalKgCO2e: number;
    };
  };
};

type TravelState = { distance: string; unit: DistanceDtoUnit };

type FormState = {
  scope1: {
    stationaryCombustion: {
      naturalGasM3: string;
      heatingMazutL: string;
      coalT: string;
      fleetGasolineL: string;
      fleetDieselL: string;
      generatorsDieselL: string;
    };
    refrigerants: {
      r407cKg: string;
      r32Kg: string;
      r410aKg: string;
    };
  };
  scope2: {
    electricityKwh: string;
    districtHeatGj: string;
  };
  scope3: {
    category1: {
      waterSupplyM3: string;
      paperStandardKg: string;
      paperEcoKg: string;
    };
    category5: {
      wastewaterTreatmentM3: string;
      wastePaperKg: string;
      wasteMonitorsKg: string;
      wasteElectronicsKg: string;
      wasteTonersKg: string;
    };
    category6: {
      flights: TravelState;
      rail: TravelState;
      taxi: TravelState;
      bus: TravelState;
    };
  };
};

const emptyTravel = (): TravelState => ({ distance: "", unit: "km" });

const initialState: FormState = {
  scope1: {
    stationaryCombustion: {
      naturalGasM3: "",
      heatingMazutL: "",
      coalT: "",
      fleetGasolineL: "",
      fleetDieselL: "",
      generatorsDieselL: "",
    },
    refrigerants: {
      r407cKg: "",
      r32Kg: "",
      r410aKg: "",
    },
  },
  scope2: {
    electricityKwh: "",
    districtHeatGj: "",
  },
  scope3: {
    category1: {
      waterSupplyM3: "",
      paperStandardKg: "",
      paperEcoKg: "",
    },
    category5: {
      wastewaterTreatmentM3: "",
      wastePaperKg: "",
      wasteMonitorsKg: "",
      wasteElectronicsKg: "",
      wasteTonersKg: "",
    },
    category6: {
      flights: emptyTravel(),
      rail: emptyTravel(),
      taxi: emptyTravel(),
      bus: emptyTravel(),
    },
  },
};

function parseOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

function buildTravel(travel: TravelState): { distance: number; unit: DistanceDtoUnit } | undefined {
  const distance = parseOptionalNumber(travel.distance);
  if (distance === undefined) return undefined;
  return { distance, unit: travel.unit };
}

function NumberField(props: {
  label: string;
  hint?: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <label className={styles.field}>
      <div className={styles.fieldTop}>
        <div className={styles.fieldLabel}>{props.label}</div>
        {props.hint ? <div className={styles.fieldHint}>{props.hint}</div> : null}
      </div>
      <input
        className={styles.input}
        inputMode="decimal"
        placeholder={props.placeholder ?? "0"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}

function TravelField(props: {
  label: string;
  value: TravelState;
  onChange: (next: TravelState) => void;
  placeholder: string;
  distanceAriaLabel: string;
  unitAriaLabel: string;
}) {
  return (
    <div className={styles.travelRow}>
      <div className={styles.travelLabel}>{props.label}</div>
      <input
        className={styles.input}
        inputMode="decimal"
        placeholder={props.placeholder}
        aria-label={props.distanceAriaLabel}
        value={props.value.distance}
        onChange={(e) => props.onChange({ ...props.value, distance: e.target.value })}
      />
      <select
        className={styles.select}
        aria-label={props.unitAriaLabel}
        value={props.value.unit}
        onChange={(e) => props.onChange({ ...props.value, unit: e.target.value as DistanceDtoUnit })}
      >
        <option value="km">km</option>
        <option value="mile">mile</option>
      </select>
    </div>
  );
}

export default function Home() {
  const { t } = useI18n();
  const [state, setState] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<CarbonReportResponse | null>(null);

  const dto: CreateCarbonReportDto = useMemo(() => {
    return {
      scope1: {
        stationaryCombustion: {
          naturalGasM3: parseOptionalNumber(state.scope1.stationaryCombustion.naturalGasM3),
          heatingMazutL: parseOptionalNumber(state.scope1.stationaryCombustion.heatingMazutL),
          coalT: parseOptionalNumber(state.scope1.stationaryCombustion.coalT),
          fleetGasolineL: parseOptionalNumber(state.scope1.stationaryCombustion.fleetGasolineL),
          fleetDieselL: parseOptionalNumber(state.scope1.stationaryCombustion.fleetDieselL),
          generatorsDieselL: parseOptionalNumber(state.scope1.stationaryCombustion.generatorsDieselL),
        },
        refrigerants: {
          r407cKg: parseOptionalNumber(state.scope1.refrigerants.r407cKg),
          r32Kg: parseOptionalNumber(state.scope1.refrigerants.r32Kg),
          r410aKg: parseOptionalNumber(state.scope1.refrigerants.r410aKg),
        },
      },
      scope2: {
        electricityKwh: parseOptionalNumber(state.scope2.electricityKwh),
        districtHeatGj: parseOptionalNumber(state.scope2.districtHeatGj),
      },
      scope3: {
        category1: {
          waterSupplyM3: parseOptionalNumber(state.scope3.category1.waterSupplyM3),
          paperStandardKg: parseOptionalNumber(state.scope3.category1.paperStandardKg),
          paperEcoKg: parseOptionalNumber(state.scope3.category1.paperEcoKg),
        },
        category5: {
          wastewaterTreatmentM3: parseOptionalNumber(state.scope3.category5.wastewaterTreatmentM3),
          wastePaperKg: parseOptionalNumber(state.scope3.category5.wastePaperKg),
          wasteMonitorsKg: parseOptionalNumber(state.scope3.category5.wasteMonitorsKg),
          wasteElectronicsKg: parseOptionalNumber(state.scope3.category5.wasteElectronicsKg),
          wasteTonersKg: parseOptionalNumber(state.scope3.category5.wasteTonersKg),
        },
        category6: {
          flights: buildTravel(state.scope3.category6.flights),
          rail: buildTravel(state.scope3.category6.rail),
          taxi: buildTravel(state.scope3.category6.taxi),
          bus: buildTravel(state.scope3.category6.bus),
        },
      },
    };
  }, [state]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch("/api/carbon-reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(dto),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message = typeof data?.message === "string" ? data.message : `Request failed (${res.status})`;
        throw new Error(message);
      }
      setReport(data as CarbonReportResponse);
    } catch (err: any) {
      setError(err?.message ?? t("error.somethingWentWrong"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onDownloadPdf() {
    if (!report) return;

    setIsDownloadingPdf(true);
    setError(null);
    try {
      const res = await fetch(`/api/carbon-reports/${report.id}/pdf`, { method: "GET" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || t("error.pdfExportFailed", { status: res.status }));
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.message ?? t("error.pdfDownloadFailed"));
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  const emptyTotals = useMemo(
    () => ({
      totalKgCO2e: 0,
      scope1: {
        stationaryCombustionKgCO2e: 0,
        refrigerantsKgCO2e: 0,
        totalKgCO2e: 0,
      },
      scope2: { totalKgCO2e: 0 },
      scope3: {
        category1KgCO2e: 0,
        category5KgCO2e: 0,
        category6KgCO2e: 0,
        totalKgCO2e: 0,
      },
    }),
    [],
  );

  const totals = report?.totals ?? emptyTotals;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{t("home.title")}</h1>
            <p className={styles.subtitle}>
              {t("home.subtitle")}
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link className={styles.secondaryButton} href="/analytics">
              {t("common.analytics")}
            </Link>
            <LanguageSelect className={styles.langSelect} />
            <button className={styles.secondaryButton} type="button" onClick={() => setState(initialState)} disabled={isSubmitting}>
              {t("home.reset")}
            </button>
            <button className={styles.primaryButton} type="submit" form="carbonForm" disabled={isSubmitting}>
              {isSubmitting ? t("home.creating") : t("home.createReport")}
            </button>
          </div>
        </header>

        <form id="carbonForm" className={styles.form} onSubmit={onSubmit}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>{t("home.scope1.title")}</h2>
              <p>{t("home.scope1.subtitle")}</p>
            </div>
            <div className={styles.subsection}>
              <h3>{t("home.scope1.stationary.title")}</h3>
              <div className={styles.grid}>
                <NumberField
                  label={t("field.naturalGas")}
                  hint="m³"
                  value={state.scope1.stationaryCombustion.naturalGasM3}
                  onChange={(v) =>
                    setState((s) => ({ ...s, scope1: { ...s.scope1, stationaryCombustion: { ...s.scope1.stationaryCombustion, naturalGasM3: v } } }))
                  }
                />
                <NumberField
                  label={t("field.heatingMazut")}
                  hint="L"
                  value={state.scope1.stationaryCombustion.heatingMazutL}
                  onChange={(v) =>
                    setState((s) => ({ ...s, scope1: { ...s.scope1, stationaryCombustion: { ...s.scope1.stationaryCombustion, heatingMazutL: v } } }))
                  }
                />
                <NumberField
                  label={t("field.coal")}
                  hint="t"
                  value={state.scope1.stationaryCombustion.coalT}
                  onChange={(v) =>
                    setState((s) => ({ ...s, scope1: { ...s.scope1, stationaryCombustion: { ...s.scope1.stationaryCombustion, coalT: v } } }))
                  }
                />
                <NumberField
                  label={t("field.fleetGasoline")}
                  hint="L"
                  value={state.scope1.stationaryCombustion.fleetGasolineL}
                  onChange={(v) =>
                    setState((s) => ({ ...s, scope1: { ...s.scope1, stationaryCombustion: { ...s.scope1.stationaryCombustion, fleetGasolineL: v } } }))
                  }
                />
                <NumberField
                  label={t("field.fleetDiesel")}
                  hint="L"
                  value={state.scope1.stationaryCombustion.fleetDieselL}
                  onChange={(v) =>
                    setState((s) => ({ ...s, scope1: { ...s.scope1, stationaryCombustion: { ...s.scope1.stationaryCombustion, fleetDieselL: v } } }))
                  }
                />
                <NumberField
                  label={t("field.generatorsDiesel")}
                  hint="L"
                  value={state.scope1.stationaryCombustion.generatorsDieselL}
                  onChange={(v) =>
                    setState((s) => ({ ...s, scope1: { ...s.scope1, stationaryCombustion: { ...s.scope1.stationaryCombustion, generatorsDieselL: v } } }))
                  }
                />
              </div>
            </div>
            <div className={styles.subsection}>
              <h3>{t("home.scope1.refrigerants.title")}</h3>
              <div className={styles.grid}>
                <NumberField
                  label={t("field.r407c")}
                  hint="kg"
                  value={state.scope1.refrigerants.r407cKg}
                  onChange={(v) => setState((s) => ({ ...s, scope1: { ...s.scope1, refrigerants: { ...s.scope1.refrigerants, r407cKg: v } } }))}
                />
                <NumberField
                  label={t("field.r32")}
                  hint="kg"
                  value={state.scope1.refrigerants.r32Kg}
                  onChange={(v) => setState((s) => ({ ...s, scope1: { ...s.scope1, refrigerants: { ...s.scope1.refrigerants, r32Kg: v } } }))}
                />
                <NumberField
                  label={t("field.r410a")}
                  hint="kg"
                  value={state.scope1.refrigerants.r410aKg}
                  onChange={(v) => setState((s) => ({ ...s, scope1: { ...s.scope1, refrigerants: { ...s.scope1.refrigerants, r410aKg: v } } }))}
                />
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>{t("home.scope2.title")}</h2>
              <p>{t("home.scope2.subtitle")}</p>
            </div>
            <div className={styles.grid}>
              <NumberField
                label={t("field.electricity")}
                hint="kWh"
                value={state.scope2.electricityKwh}
                onChange={(v) => setState((s) => ({ ...s, scope2: { ...s.scope2, electricityKwh: v } }))}
              />
              <NumberField
                label={t("field.districtHeat")}
                hint="GJ"
                value={state.scope2.districtHeatGj}
                onChange={(v) => setState((s) => ({ ...s, scope2: { ...s.scope2, districtHeatGj: v } }))}
              />
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>{t("home.scope3.title")}</h2>
              <p>{t("home.scope3.subtitle")}</p>
            </div>

            <div className={styles.subsection}>
              <h3>{t("home.scope3.cat1.title")}</h3>
              <div className={styles.grid}>
                <NumberField
                  label={t("field.waterSupply")}
                  hint="m³"
                  value={state.scope3.category1.waterSupplyM3}
                  onChange={(v) => setState((s) => ({ ...s, scope3: { ...s.scope3, category1: { ...s.scope3.category1, waterSupplyM3: v } } }))}
                />
                <NumberField
                  label={t("field.paperStandard")}
                  hint="kg"
                  value={state.scope3.category1.paperStandardKg}
                  onChange={(v) => setState((s) => ({ ...s, scope3: { ...s.scope3, category1: { ...s.scope3.category1, paperStandardKg: v } } }))}
                />
                <NumberField
                  label={t("field.paperEco")}
                  hint="kg"
                  value={state.scope3.category1.paperEcoKg}
                  onChange={(v) => setState((s) => ({ ...s, scope3: { ...s.scope3, category1: { ...s.scope3.category1, paperEcoKg: v } } }))}
                />
              </div>
            </div>

            <div className={styles.subsection}>
              <h3>{t("home.scope3.cat5.title")}</h3>
              <div className={styles.grid}>
                <NumberField
                  label={t("field.wastewaterTreatment")}
                  hint="m³"
                  value={state.scope3.category5.wastewaterTreatmentM3}
                  onChange={(v) =>
                    setState((s) => ({ ...s, scope3: { ...s.scope3, category5: { ...s.scope3.category5, wastewaterTreatmentM3: v } } }))
                  }
                />
                <NumberField
                  label={t("field.wastePaper")}
                  hint="kg"
                  value={state.scope3.category5.wastePaperKg}
                  onChange={(v) => setState((s) => ({ ...s, scope3: { ...s.scope3, category5: { ...s.scope3.category5, wastePaperKg: v } } }))}
                />
                <NumberField
                  label={t("field.wasteMonitors")}
                  hint="kg"
                  value={state.scope3.category5.wasteMonitorsKg}
                  onChange={(v) =>
                    setState((s) => ({ ...s, scope3: { ...s.scope3, category5: { ...s.scope3.category5, wasteMonitorsKg: v } } }))
                  }
                />
                <NumberField
                  label={t("field.wasteElectronics")}
                  hint="kg"
                  value={state.scope3.category5.wasteElectronicsKg}
                  onChange={(v) =>
                    setState((s) => ({ ...s, scope3: { ...s.scope3, category5: { ...s.scope3.category5, wasteElectronicsKg: v } } }))
                  }
                />
                <NumberField
                  label={t("field.wasteToners")}
                  hint="kg"
                  value={state.scope3.category5.wasteTonersKg}
                  onChange={(v) => setState((s) => ({ ...s, scope3: { ...s.scope3, category5: { ...s.scope3.category5, wasteTonersKg: v } } }))}
                />
              </div>
            </div>

            <div className={styles.subsection}>
              <h3>{t("home.scope3.cat6.title")}</h3>
              <div className={styles.travelGrid}>
                <TravelField
                  label={t("field.flights")}
                  placeholder={t("field.distancePlaceholder")}
                  distanceAriaLabel={`${t("field.flights")} — ${t("field.distance")}`}
                  unitAriaLabel={`${t("field.flights")} — ${t("field.unit")}`}
                  value={state.scope3.category6.flights}
                  onChange={(next) => setState((s) => ({ ...s, scope3: { ...s.scope3, category6: { ...s.scope3.category6, flights: next } } }))}
                />
                <TravelField
                  label={t("field.rail")}
                  placeholder={t("field.distancePlaceholder")}
                  distanceAriaLabel={`${t("field.rail")} — ${t("field.distance")}`}
                  unitAriaLabel={`${t("field.rail")} — ${t("field.unit")}`}
                  value={state.scope3.category6.rail}
                  onChange={(next) => setState((s) => ({ ...s, scope3: { ...s.scope3, category6: { ...s.scope3.category6, rail: next } } }))}
                />
                <TravelField
                  label={t("field.taxi")}
                  placeholder={t("field.distancePlaceholder")}
                  distanceAriaLabel={`${t("field.taxi")} — ${t("field.distance")}`}
                  unitAriaLabel={`${t("field.taxi")} — ${t("field.unit")}`}
                  value={state.scope3.category6.taxi}
                  onChange={(next) => setState((s) => ({ ...s, scope3: { ...s.scope3, category6: { ...s.scope3.category6, taxi: next } } }))}
                />
                <TravelField
                  label={t("field.bus")}
                  placeholder={t("field.distancePlaceholder")}
                  distanceAriaLabel={`${t("field.bus")} — ${t("field.distance")}`}
                  unitAriaLabel={`${t("field.bus")} — ${t("field.unit")}`}
                  value={state.scope3.category6.bus}
                  onChange={(next) => setState((s) => ({ ...s, scope3: { ...s.scope3, category6: { ...s.scope3.category6, bus: next } } }))}
                />
              </div>
              <p className={styles.muted}>
                {t("home.scope3.cat6.tip")}
              </p>
            </div>
          </section>

        </form>

        {error ? (
          <section className={styles.alertError} role="alert">
            {error}
          </section>
        ) : null}

        <section className={`${styles.card} ${styles.reportCard}`}>
          <div className={styles.cardHeader}>
            <h2>{t("home.reportTotals")}</h2>
            <div className={styles.reportHeaderRight}>
              {report ? (
                <p>
                  {t("home.report")} <span className={styles.mono}>{report.id}</span> •{" "}
                  <span className={styles.mono}>{new Date(report.createdAt).toLocaleString()}</span>
                </p>
              ) : (
                <p>{t("home.noReportYet")}</p>
              )}
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={onDownloadPdf}
                disabled={!report || isDownloadingPdf}
              >
                {isDownloadingPdf ? t("home.preparingPdf") : t("home.downloadPdf")}
              </button>
            </div>
          </div>
          <div className={styles.totalsGrid}>
            <div className={styles.totalTile}>
              <div className={styles.totalLabel}>{t("totals.total")}</div>
              <div className={styles.totalValue}>{totals.totalKgCO2e.toFixed(2)} kg CO₂e</div>
            </div>
            <div className={styles.totalTile}>
              <div className={styles.totalLabel}>{t("totals.scope1")}</div>
              <div className={styles.totalValue}>{totals.scope1.totalKgCO2e.toFixed(2)} kg CO₂e</div>
              <div className={styles.totalMeta}>
                {t("totals.stationary")}: {totals.scope1.stationaryCombustionKgCO2e.toFixed(2)} • {t("totals.refrigerants")}:{" "}
                {totals.scope1.refrigerantsKgCO2e.toFixed(2)}
              </div>
            </div>
            <div className={styles.totalTile}>
              <div className={styles.totalLabel}>{t("totals.scope2")}</div>
              <div className={styles.totalValue}>{totals.scope2.totalKgCO2e.toFixed(2)} kg CO₂e</div>
            </div>
            <div className={styles.totalTile}>
              <div className={styles.totalLabel}>{t("totals.scope3")}</div>
              <div className={styles.totalValue}>{totals.scope3.totalKgCO2e.toFixed(2)} kg CO₂e</div>
              <div className={styles.totalMeta}>
                {t("totals.cat1")}: {totals.scope3.category1KgCO2e.toFixed(2)} • {t("totals.cat5")}: {totals.scope3.category5KgCO2e.toFixed(2)} • {t("totals.cat6")}:{" "}
                {totals.scope3.category6KgCO2e.toFixed(2)}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
