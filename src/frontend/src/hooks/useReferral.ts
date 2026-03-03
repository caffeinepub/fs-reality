import { useEffect, useState } from "react";

const REFERRAL_CODE_KEY = "fs_realty_referral_code";
const REFERRAL_BONUS_KEY = "fs_realty_referral_bonus_ms";
const USED_REF_KEY = "fs_realty_used_ref";
const BONUS_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in ms

function generateCode(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

function getOrCreateCode(): string {
  let code = localStorage.getItem(REFERRAL_CODE_KEY);
  if (!code) {
    code = generateCode();
    localStorage.setItem(REFERRAL_CODE_KEY, code);
  }
  return code;
}

function getBonusMs(): number {
  return Number(localStorage.getItem(REFERRAL_BONUS_KEY) || "0");
}

function addBonusMs(ms: number) {
  const current = getBonusMs();
  localStorage.setItem(REFERRAL_BONUS_KEY, String(current + ms));
}

export interface ReferralState {
  referralCode: string;
  referralUrl: string;
  bonusDaysEarned: number; // total bonus days earned from referrals
}

export function useReferral(): ReferralState {
  const [referralCode] = useState(() => getOrCreateCode());
  const [bonusDaysEarned, setBonusDaysEarned] = useState(() =>
    Math.floor(getBonusMs() / (24 * 60 * 60 * 1000)),
  );

  useEffect(() => {
    // Process incoming ?ref= param (credit the visitor)
    const params = new URLSearchParams(window.location.search);
    const incomingRef = params.get("ref");
    if (incomingRef && !localStorage.getItem(USED_REF_KEY)) {
      addBonusMs(BONUS_DURATION);
      localStorage.setItem(USED_REF_KEY, "1");
      // Store pending credit for the referrer
      const pendingKey = `fs_realty_pending_credit_${incomingRef}`;
      if (!localStorage.getItem(pendingKey)) {
        localStorage.setItem(pendingKey, "1");
      }
    }

    // Process pending credits for this user (as referrer)
    const myCode = getOrCreateCode();
    const pendingKey = `fs_realty_pending_credit_${myCode}`;
    const appliedKey = `fs_realty_credit_applied_${myCode}`;
    if (
      localStorage.getItem(pendingKey) === "1" &&
      !localStorage.getItem(appliedKey)
    ) {
      addBonusMs(BONUS_DURATION);
      localStorage.setItem(appliedKey, "1");
    }

    setBonusDaysEarned(Math.floor(getBonusMs() / (24 * 60 * 60 * 1000)));
  }, []);

  const referralUrl = `${window.location.origin}/?ref=${referralCode}`;

  return {
    referralCode,
    referralUrl,
    bonusDaysEarned,
  };
}
