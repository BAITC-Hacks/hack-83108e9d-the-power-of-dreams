import type { CatalogOptionsResponse, RecommendationRequest, RecommendationResponse, ErrorResponse } from '../contractor-selection.ts';
import type { CatalogLoadResult, SelectionResult } from '../../back/domain/types.ts';
import type { EvidenceResult } from '../../back/recommend/ports.ts';

/** Hand-authored development data. Never substitute for the real catalogue. */
export const fixtures = {
  "fixtureNotice": "Controlled synthetic development fixtures, not real catalogue results or observed AI output. FX IDs and zero digest are examples only.",
  "request": {
    "city": "Алматы",
    "date": "2026-10-10",
    "eventFormat": "корпоратив",
    "category": "Ведущий",
    "budgetKzt": 1500000
  },
  "optionsResponse": {
    "requestId": "fixture-options",
    "context": {
      "catalogVersion": "sha256:0000000000000000000000000000000000000000000000000000000000000000",
      "selectionPolicyVersion": "selection-v1"
    },
    "options": {
      "cities": [
        "Алматы",
        "Астана"
      ],
      "categories": [
        "Ведущий",
        "Фотограф"
      ],
      "eventFormats": [
        "корпоратив"
      ],
      "languages": [
        "русский"
      ],
      "dateWindow": {
        "min": "2026-09-23",
        "max": "2026-12-31"
      }
    }
  },
  "recommendations": [
    {
      "requestId": "fixture-openai_evidence",
      "normalizedRequest": {
        "city": "Алматы",
        "date": "2026-10-10",
        "eventFormat": "корпоратив",
        "category": "Ведущий",
        "budgetKzt": 1500000
      },
      "context": {
        "catalogVersion": "sha256:0000000000000000000000000000000000000000000000000000000000000000",
        "selectionPolicyVersion": "selection-v1"
      },
      "outcome": "matched",
      "cards": [
        {
          "id": "FX-001",
          "name": "Пример А",
          "category": "Ведущий",
          "city": "Алматы",
          "priceFromKzt": 100000,
          "explanation": "Поддерживает корпоратив; стартовая цена 100000 ₸ укладывается в бюджет 1500000 ₸. В описании указано: «Проводит командные игры».",
          "qualityFlags": {
            "synthetic": true,
            "cityImputed": false,
            "priceImputed": false
          }
        },
        {
          "id": "FX-002",
          "name": "Пример Б",
          "category": "Ведущий",
          "city": "Алматы",
          "priceFromKzt": 200000,
          "explanation": "Поддерживает корпоратив; стартовая цена 200000 ₸ укладывается в бюджет 1500000 ₸. В описании указано: «Ведёт танцевальную программу».",
          "qualityFlags": {
            "synthetic": true,
            "cityImputed": false,
            "priceImputed": false
          }
        },
        {
          "id": "FX-003",
          "name": "Пример В",
          "category": "Ведущий",
          "city": "Алматы",
          "priceFromKzt": 300000,
          "explanation": "Поддерживает корпоратив; стартовая цена 300000 ₸ укладывается в бюджет 1500000 ₸. В описании указано: «Специализируется на музыкальных конкурсах».",
          "qualityFlags": {
            "synthetic": true,
            "cityImputed": false,
            "priceImputed": false
          }
        }
      ],
      "summary": {
        "candidateCount": 3,
        "eligibleCount": 3,
        "exclusions": {
          "busy": 0,
          "budget": 0,
          "format": 0,
          "language": 0,
          "duration": 0
        },
        "busyProfileIds": []
      },
      "explanationMode": "openai_evidence"
    },
    {
      "requestId": "fixture-mixed",
      "normalizedRequest": {
        "city": "Алматы",
        "date": "2026-10-10",
        "eventFormat": "корпоратив",
        "category": "Ведущий",
        "budgetKzt": 1500000
      },
      "context": {
        "catalogVersion": "sha256:0000000000000000000000000000000000000000000000000000000000000000",
        "selectionPolicyVersion": "selection-v1"
      },
      "outcome": "matched",
      "cards": [
        {
          "id": "FX-001",
          "name": "Пример А",
          "category": "Ведущий",
          "city": "Алматы",
          "priceFromKzt": 100000,
          "explanation": "Поддерживает корпоратив; стартовая цена 100000 ₸ укладывается в бюджет 1500000 ₸. В описании указано: «Проводит командные игры».",
          "qualityFlags": {
            "synthetic": true,
            "cityImputed": false,
            "priceImputed": false
          }
        },
        {
          "id": "FX-002",
          "name": "Пример Б",
          "category": "Ведущий",
          "city": "Алматы",
          "priceFromKzt": 200000,
          "explanation": "Поддерживает корпоратив; стартовая цена 200000 ₸ укладывается в бюджет 1500000 ₸. В описании указано: «Ведёт танцевальную программу».",
          "qualityFlags": {
            "synthetic": true,
            "cityImputed": false,
            "priceImputed": false
          }
        },
        {
          "id": "FX-003",
          "name": "Пример В",
          "category": "Ведущий",
          "city": "Алматы",
          "priceFromKzt": 300000,
          "explanation": "Поддерживает корпоратив; стартовая цена 300000 ₸ укладывается в бюджет 1500000 ₸.",
          "qualityFlags": {
            "synthetic": true,
            "cityImputed": false,
            "priceImputed": false
          }
        }
      ],
      "summary": {
        "candidateCount": 3,
        "eligibleCount": 3,
        "exclusions": {
          "busy": 0,
          "budget": 0,
          "format": 0,
          "language": 0,
          "duration": 0
        },
        "busyProfileIds": []
      },
      "explanationMode": "mixed"
    },
    {
      "requestId": "fixture-catalog_fallback",
      "normalizedRequest": {
        "city": "Алматы",
        "date": "2026-10-10",
        "eventFormat": "корпоратив",
        "category": "Ведущий",
        "budgetKzt": 1500000
      },
      "context": {
        "catalogVersion": "sha256:0000000000000000000000000000000000000000000000000000000000000000",
        "selectionPolicyVersion": "selection-v1"
      },
      "outcome": "matched",
      "cards": [
        {
          "id": "FX-001",
          "name": "Пример А",
          "category": "Ведущий",
          "city": "Алматы",
          "priceFromKzt": 100000,
          "explanation": "Поддерживает корпоратив; стартовая цена 100000 ₸ укладывается в бюджет 1500000 ₸.",
          "qualityFlags": {
            "synthetic": true,
            "cityImputed": false,
            "priceImputed": false
          }
        },
        {
          "id": "FX-002",
          "name": "Пример Б",
          "category": "Ведущий",
          "city": "Алматы",
          "priceFromKzt": 200000,
          "explanation": "Поддерживает корпоратив; стартовая цена 200000 ₸ укладывается в бюджет 1500000 ₸.",
          "qualityFlags": {
            "synthetic": true,
            "cityImputed": false,
            "priceImputed": false
          }
        },
        {
          "id": "FX-003",
          "name": "Пример В",
          "category": "Ведущий",
          "city": "Алматы",
          "priceFromKzt": 300000,
          "explanation": "Поддерживает корпоратив; стартовая цена 300000 ₸ укладывается в бюджет 1500000 ₸.",
          "qualityFlags": {
            "synthetic": true,
            "cityImputed": false,
            "priceImputed": false
          }
        }
      ],
      "summary": {
        "candidateCount": 3,
        "eligibleCount": 3,
        "exclusions": {
          "busy": 0,
          "budget": 0,
          "format": 0,
          "language": 0,
          "duration": 0
        },
        "busyProfileIds": []
      },
      "explanationMode": "catalog_fallback"
    },
    {
      "requestId": "fixture-no_match",
      "normalizedRequest": {
        "city": "Алматы",
        "date": "2026-10-10",
        "eventFormat": "корпоратив",
        "category": "Ведущий",
        "budgetKzt": 1
      },
      "context": {
        "catalogVersion": "sha256:0000000000000000000000000000000000000000000000000000000000000000",
        "selectionPolicyVersion": "selection-v1"
      },
      "outcome": "no_match",
      "cards": [],
      "summary": {
        "candidateCount": 3,
        "eligibleCount": 0,
        "exclusions": {
          "busy": 0,
          "budget": 3,
          "format": 0,
          "language": 0,
          "duration": 0
        },
        "busyProfileIds": []
      },
      "explanationMode": "not_needed"
    },
    {
      "requestId": "fixture-category_absent",
      "normalizedRequest": {
        "city": "Астана",
        "date": "2026-10-10",
        "eventFormat": "корпоратив",
        "category": "Ведущий",
        "budgetKzt": 1500000
      },
      "context": {
        "catalogVersion": "sha256:0000000000000000000000000000000000000000000000000000000000000000",
        "selectionPolicyVersion": "selection-v1"
      },
      "outcome": "category_absent",
      "cards": [],
      "summary": {
        "candidateCount": 0,
        "eligibleCount": 0,
        "exclusions": {
          "busy": 0,
          "budget": 0,
          "format": 0,
          "language": 0,
          "duration": 0
        },
        "busyProfileIds": []
      },
      "explanationMode": "not_needed"
    }
  ],
  "errors": [
    {
      "status": 400,
      "body": {
        "error": {
          "code": "INVALID_REQUEST",
          "message": "Бюджет должен быть положительным целым числом.",
          "requestId": "fixture-invalid",
          "fields": [
            {
              "field": "budgetKzt",
              "message": "Введите положительное целое число."
            }
          ]
        }
      }
    },
    {
      "status": 400,
      "body": {
        "error": {
          "code": "DATE_OUT_OF_RANGE",
          "message": "Дата вне календарного окна набора.",
          "requestId": "fixture-date",
          "fields": [
            {
              "field": "date",
              "message": "Выберите дату с 2026-09-23 по 2026-12-31."
            }
          ]
        }
      }
    },
    {
      "status": 503,
      "body": {
        "error": {
          "code": "CATALOG_UNAVAILABLE",
          "message": "Каталог временно недоступен.",
          "requestId": "fixture-unavailable"
        }
      }
    },
    {
      "status": 500,
      "body": {
        "error": {
          "code": "INTERNAL_ERROR",
          "message": "Не удалось выполнить запрос.",
          "requestId": "fixture-internal"
        }
      }
    }
  ],
  "moduleBoundaries": {
    "catalogReady": {
      "status": "ready",
      "snapshot": {
        "profiles": [
          {
            "id": "FX-001",
            "name": "Пример А",
            "categories": [
              "Ведущий"
            ],
            "city": "Алматы",
            "priceFromKzt": 100000,
            "eventFormats": [
              "корпоратив"
            ],
            "languages": [
              "русский"
            ],
            "maxHours": 4,
            "busyDates": [],
            "description": "Проводит командные игры",
            "qualityFlags": {
              "synthetic": true,
              "cityImputed": false,
              "priceImputed": false
            }
          },
          {
            "id": "FX-002",
            "name": "Пример Б",
            "categories": [
              "Ведущий"
            ],
            "city": "Алматы",
            "priceFromKzt": 200000,
            "eventFormats": [
              "корпоратив"
            ],
            "languages": [
              "русский"
            ],
            "maxHours": 4,
            "busyDates": [],
            "description": "Ведёт танцевальную программу",
            "qualityFlags": {
              "synthetic": true,
              "cityImputed": false,
              "priceImputed": false
            }
          },
          {
            "id": "FX-003",
            "name": "Пример В",
            "categories": [
              "Ведущий"
            ],
            "city": "Алматы",
            "priceFromKzt": 300000,
            "eventFormats": [
              "корпоратив"
            ],
            "languages": [
              "русский"
            ],
            "maxHours": 4,
            "busyDates": [],
            "description": "Специализируется на музыкальных конкурсах",
            "qualityFlags": {
              "synthetic": true,
              "cityImputed": false,
              "priceImputed": false
            }
          },
          {
            "id": "FX-004",
            "name": "Пример Г",
            "categories": [
              "Фотограф"
            ],
            "city": "Астана",
            "priceFromKzt": 100000,
            "eventFormats": [
              "корпоратив"
            ],
            "languages": [
              "русский"
            ],
            "maxHours": 4,
            "busyDates": [],
            "description": "Снимает репортажи",
            "qualityFlags": {
              "synthetic": true,
              "cityImputed": false,
              "priceImputed": false
            }
          }
        ],
        "options": {
          "cities": [
            "Алматы",
            "Астана"
          ],
          "categories": [
            "Ведущий",
            "Фотограф"
          ],
          "eventFormats": [
            "корпоратив"
          ],
          "languages": [
            "русский"
          ],
          "dateWindow": {
            "min": "2026-09-23",
            "max": "2026-12-31"
          }
        },
        "catalogVersion": "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    "catalogUnavailable": {
      "status": "unavailable",
      "error": {
        "kind": "invalid"
      }
    },
    "selection": {
      "outcome": "matched",
      "selectedIds": [
        "FX-001",
        "FX-002",
        "FX-003"
      ],
      "summary": {
        "candidateCount": 3,
        "eligibleCount": 3,
        "exclusions": {
          "busy": 0,
          "budget": 0,
          "format": 0,
          "language": 0,
          "duration": 0
        },
        "busyProfileIds": []
      }
    },
    "providerEnvelope": {
      "items": [
        {
          "id": "FX-001",
          "evidenceQuote": "Проводит командные игры"
        },
        {
          "id": "FX-002",
          "evidenceQuote": "Ведёт танцевальную программу"
        },
        {
          "id": "FX-003",
          "evidenceQuote": "Специализируется на музыкальных конкурсах"
        }
      ]
    },
    "evidenceMixed": {
      "status": "validated",
      "byId": {
        "FX-001": {
          "status": "accepted",
          "quote": "Проводит командные игры"
        },
        "FX-002": {
          "status": "accepted",
          "quote": "Ведёт танцевальную программу"
        },
        "FX-003": {
          "status": "fallback",
          "reason": "source_mismatch"
        }
      }
    },
    "evidenceUnavailable": {
      "status": "unavailable",
      "reason": "invalid_batch"
    }
  }
} as const satisfies {
  fixtureNotice: string;
  request: RecommendationRequest;
  optionsResponse: CatalogOptionsResponse;
  recommendations: readonly RecommendationResponse[];
  errors: readonly { status: number; body: ErrorResponse }[];
  moduleBoundaries: {
    catalogReady: CatalogLoadResult;
    catalogUnavailable: CatalogLoadResult;
    selection: SelectionResult;
    providerEnvelope: { items: readonly { id: string; evidenceQuote: string | null }[] };
    evidenceMixed: EvidenceResult;
    evidenceUnavailable: EvidenceResult;
  };
};
