const TICKER_ITEMS = [
  {
    icon: null,
    dot: "bg-primary",
    label: "PALANDÖKEN İRTİFA:",
    value: "2.100 M",
  },
  { icon: "compress", color: "text-secondary", label: "ATM BASINCI:", value: "590 mmHg" },
  {
    icon: "bloodtype",
    color: "text-primary",
    label: "O₂ BASINCI (PO2):",
    value: "123 mmHg (-%21 vs Deniz)",
  },
  {
    icon: "speed",
    color: "text-secondary",
    label: "AEROBİK KAZANIM POTANSİYELİ:",
    value: "+%12.4",
    valueColor: "text-secondary",
  },
  {
    icon: "device_thermostat",
    color: "text-on-surface",
    label: "YILLIK ORT. KAMP SICAKLIĞI:",
    value: "18.5°C (YAZ)",
  },
];

export function BiometricTicker() {
  return (
    <section className="w-full overflow-x-auto bg-surface-container-lowest px-margin-mobile py-space-sm md:px-margin">
      <div className="flex min-w-[900px] items-center justify-between font-label-caps text-label-caps tracking-wider text-on-surface-variant uppercase">
        {TICKER_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-space-sm">
            {item.icon ? (
              <span className={`material-symbols-outlined text-sm ${item.color}`}>
                {item.icon}
              </span>
            ) : (
              <span className={`h-2 w-2 animate-pulse rounded-full ${item.dot}`} />
            )}
            <span>
              {item.label}{" "}
              <strong className={item.valueColor ?? "text-on-surface"}>{item.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
