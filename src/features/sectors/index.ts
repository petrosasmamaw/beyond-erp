import type { SectorConfig } from "./types";
import { retailTradingConfig } from "./retail-trading/config";
import { manufacturingConfig } from "./manufacturing/config";
import { agricultureConfig } from "./agriculture/config";
import { constructionConfig } from "./construction/config";
import { healthcareConfig } from "./healthcare/config";
import { educationConfig } from "./education/config";
import { hospitalityConfig } from "./hospitality/config";
import { transportLogisticsConfig } from "./transport-logistics/config";
import { financeBankingConfig } from "./finance-banking/config";
import { realEstateConfig } from "./real-estate/config";
import { ngoDevelopmentConfig } from "./ngo-development/config";
import { requestCustomConfig } from "./request-custom/config";

const registry: Record<string, SectorConfig> = {
  "retail-trading": retailTradingConfig,
  manufacturing: manufacturingConfig,
  agriculture: agricultureConfig,
  construction: constructionConfig,
  healthcare: healthcareConfig,
  education: educationConfig,
  hospitality: hospitalityConfig,
  "transport-logistics": transportLogisticsConfig,
  "finance-banking": financeBankingConfig,
  "real-estate": realEstateConfig,
  "ngo-development": ngoDevelopmentConfig,
  "request-custom": requestCustomConfig
};

export function getSectorConfig(sectorId?: string | null): SectorConfig | null {
  if (!sectorId) return null;
  return registry[sectorId] ?? null;
}

export type { SectorConfig, SectorNavItem } from "./types";
