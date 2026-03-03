const STORAGE_KEY = "fs_realty_first_visit";
const TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

export interface FreeTrialState {
  isTrialActive: boolean;
  trialEndsAt: Date;
  daysRemaining: number;
  hoursRemaining: number;
}

export function useFreeTrial(): FreeTrialState {
  // Read or initialise the first-visit timestamp
  let firstVisitStr = localStorage.getItem(STORAGE_KEY);
  if (!firstVisitStr) {
    firstVisitStr = Date.now().toString();
    localStorage.setItem(STORAGE_KEY, firstVisitStr);
  }

  const firstVisit = Number(firstVisitStr);
  const trialEndsAt = new Date(firstVisit + TRIAL_DURATION_MS);
  const now = Date.now();
  const msRemaining = trialEndsAt.getTime() - now;
  const isTrialActive = msRemaining > 0;

  const totalSecondsRemaining = Math.max(0, Math.floor(msRemaining / 1000));
  const daysRemaining = Math.floor(totalSecondsRemaining / (24 * 60 * 60));
  const hoursRemaining = Math.floor(
    (totalSecondsRemaining % (24 * 60 * 60)) / 3600,
  );

  return {
    isTrialActive,
    trialEndsAt,
    daysRemaining,
    hoursRemaining,
  };
}
