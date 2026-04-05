/** Mock fraud intensity 0–1 per Indian state/UT name (matches common census `st_nm` labels). */
const OVERRIDES: Record<string, number> = {
  Maharashtra: 0.88,
  'NCT of Delhi': 0.82,
  Karnataka: 0.71,
  'Tamil Nadu': 0.45,
  Gujarat: 0.38,
  'West Bengal': 0.62,
  'Uttar Pradesh': 0.79,
  Telangana: 0.55,
  Rajasthan: 0.41,
  Kerala: 0.33,
  'Madhya Pradesh': 0.58,
  Punjab: 0.36,
  Haryana: 0.52,
  Bihar: 0.74,
  Odisha: 0.48,
  Assam: 0.51,
  Jharkhand: 0.67,
  Uttarakhand: 0.29,
  'Himachal Pradesh': 0.22,
  Goa: 0.26,
  Mizoram: 0.18,
  Nagaland: 0.24,
  Meghalaya: 0.2,
  Manipur: 0.27,
  Tripura: 0.31,
  Sikkim: 0.15,
  'Arunachal Pradesh': 0.19,
  Chhattisgarh: 0.59,
  Chandigarh: 0.44,
  Puducherry: 0.35,
  Lakshadweep: 0.12,
  'Andaman & Nicobar Island': 0.16,
  Ladakh: 0.14,
  'Jammu & Kashmir': 0.43,
};

function hashToUnit(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return (Math.abs(h) % 997) / 997;
}

export function getFraudRateForState(stateName: string | undefined): number {
  if (!stateName?.trim()) return 0.25;
  const key = stateName.trim();
  if (key in OVERRIDES) return OVERRIDES[key];
  return 0.2 + hashToUnit(key) * 0.65;
}

export function fraudRateToColor(rate: number): string {
  const t = Math.min(1, Math.max(0, rate));
  const r = Math.round(40 + t * 215);
  const g = Math.round(200 - t * 160);
  const b = Math.round(120 - t * 80);
  return `rgb(${r}, ${g}, ${b})`;
}
