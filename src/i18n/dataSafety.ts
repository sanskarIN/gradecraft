import type { Locale } from "../domain/types";

interface DataSafetyMessages {
  restoreReplaceConfirm: string;
  restoreCancelled: string;
  exportFailed: string;
}

const catalogs: Record<Locale, DataSafetyMessages> = {
  en: {
    restoreReplaceConfirm:
      "Restore this backup and replace the current GradeCraft data on this device? The current state will be kept as the local recovery snapshot when possible.",
    restoreCancelled: "Restore cancelled. Current local data was not changed.",
    exportFailed: "Export failed. Your local data was not changed. Try again or choose a different save location.",
  },
  hi: {
    restoreReplaceConfirm:
      "यह बैकअप पुनर्स्थापित करके इस डिवाइस का वर्तमान GradeCraft डेटा बदलें? जहाँ संभव होगा, वर्तमान स्थिति स्थानीय रिकवरी स्नैपशॉट के रूप में रखी जाएगी।",
    restoreCancelled: "पुनर्स्थापना रद्द हुई। वर्तमान स्थानीय डेटा नहीं बदला गया।",
    exportFailed:
      "निर्यात विफल हुआ। आपका स्थानीय डेटा नहीं बदला गया। फिर प्रयास करें या कोई अलग सहेजने का स्थान चुनें।",
  },
};

export function getDataSafetyMessages(locale: Locale | undefined): DataSafetyMessages {
  return catalogs[locale ?? "en"] ?? catalogs.en;
}
