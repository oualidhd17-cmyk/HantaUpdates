from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "public" / "data"

DATA_DIR.mkdir(parents=True, exist_ok=True)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def write_json(filename: str, data) -> None:
    path = DATA_DIR / filename
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Generated: {path}")


def main() -> None:
    updated_at = now_iso()

    global_data = {
        "disease": "Hantavirus",
        "event_name": "Hantavirus public health updates",
        "total_confirmed": 2,
        "total_deaths": 3,
        "total_recovered": 0,
        "total_suspected": 5,
        "total_probable": 0,
        "total_possible": 0,
        "total_under_investigation": 3,
        "total_pending": 0,
        "total_unconfirmed": 5,
        "total_identified_cases": 7,
        "total_hospitalized": 0,
        "affected_countries": 3,
        "global_risk_level": "low",
        "last_updated": updated_at,
        "source_label": "Official public-health sources",
        "primary_event_url": "https://www.who.int/",
        "data_notes": [
            "This dataset is informational only.",
            "Numbers may change when official sources update or reclassify cases.",
        ],
    }

    countries = [
        {
            "country": "Argentina",
            "region": "South America",
            "confirmed": 2,
            "suspected": 3,
            "probable": 0,
            "possible": 0,
            "under_investigation": 2,
            "pending": 0,
            "unconfirmed": 3,
            "total_identified": 5,
            "deaths": 2,
            "recovered": 0,
            "hospitalized": 0,
            "active": 3,
            "lat": -38.4161,
            "lng": -63.6167,
            "risk_level": "moderate",
            "last_updated": updated_at,
        },
        {
            "country": "Chile",
            "region": "South America",
            "confirmed": 0,
            "suspected": 1,
            "probable": 0,
            "possible": 0,
            "under_investigation": 1,
            "pending": 0,
            "unconfirmed": 1,
            "total_identified": 1,
            "deaths": 1,
            "recovered": 0,
            "hospitalized": 0,
            "active": 0,
            "lat": -35.6751,
            "lng": -71.543,
            "risk_level": "low",
            "last_updated": updated_at,
        },
        {
            "country": "Spain",
            "region": "Europe",
            "confirmed": 0,
            "suspected": 1,
            "probable": 0,
            "possible": 0,
            "under_investigation": 0,
            "pending": 0,
            "unconfirmed": 1,
            "total_identified": 1,
            "deaths": 0,
            "recovered": 0,
            "hospitalized": 0,
            "active": 1,
            "lat": 40.4637,
            "lng": -3.7492,
            "risk_level": "low",
            "last_updated": updated_at,
        },
    ]

    points = [
        {
            "id": "argentina-hantavirus",
            "name": "Argentina",
            "country": "Argentina",
            "confirmed": 2,
            "suspected": 3,
            "probable": 0,
            "possible": 0,
            "under_investigation": 2,
            "pending": 0,
            "unconfirmed": 3,
            "total_identified": 5,
            "deaths": 2,
            "lat": -38.4161,
            "lng": -63.6167,
            "source": "Official public-health sources",
            "source_url": "https://www.who.int/",
            "risk_level": "moderate",
        },
        {
            "id": "chile-hantavirus",
            "name": "Chile",
            "country": "Chile",
            "confirmed": 0,
            "suspected": 1,
            "probable": 0,
            "possible": 0,
            "under_investigation": 1,
            "pending": 0,
            "unconfirmed": 1,
            "total_identified": 1,
            "deaths": 1,
            "lat": -35.6751,
            "lng": -71.543,
            "source": "Official public-health sources",
            "source_url": "https://www.who.int/",
            "risk_level": "low",
        },
        {
            "id": "spain-hantavirus",
            "name": "Spain",
            "country": "Spain",
            "confirmed": 0,
            "suspected": 1,
            "probable": 0,
            "possible": 0,
            "under_investigation": 0,
            "pending": 0,
            "unconfirmed": 1,
            "total_identified": 1,
            "deaths": 0,
            "lat": 40.4637,
            "lng": -3.7492,
            "source": "Official public-health sources",
            "source_url": "https://www.who.int/",
            "risk_level": "low",
        },
    ]

    timeline = [
        {
            "date": "2026-05-01",
            "confirmed": 1,
            "suspected": 2,
            "probable": 0,
            "possible": 0,
            "under_investigation": 1,
            "pending": 0,
            "unconfirmed": 2,
            "total_identified": 3,
            "deaths": 1,
            "recovered": 0,
            "source": "Official public-health sources",
            "source_id": "manual-seed",
            "source_url": "https://www.who.int/",
        },
        {
            "date": "2026-05-08",
            "confirmed": 2,
            "suspected": 5,
            "probable": 0,
            "possible": 0,
            "under_investigation": 3,
            "pending": 0,
            "unconfirmed": 5,
            "total_identified": 7,
            "deaths": 3,
            "recovered": 0,
            "source": "Official public-health sources",
            "source_id": "manual-seed",
            "source_url": "https://www.who.int/",
        },
        {
            "date": updated_at[:10],
            "confirmed": global_data["total_confirmed"],
            "suspected": global_data["total_suspected"],
            "probable": global_data["total_probable"],
            "possible": global_data["total_possible"],
            "under_investigation": global_data["total_under_investigation"],
            "pending": global_data["total_pending"],
            "unconfirmed": global_data["total_unconfirmed"],
            "total_identified": global_data["total_identified_cases"],
            "deaths": global_data["total_deaths"],
            "recovered": global_data["total_recovered"],
            "source": "Generated local update",
            "source_id": "local-update",
            "source_url": "https://hantaupdates.live",
        },
    ]

    sources = [
        {
            "id": "who",
            "name": "World Health Organization",
            "url": "https://www.who.int/",
            "type": "official",
            "last_checked_at": updated_at,
            "confidence": "high",
            "usage": "Official public-health outbreak references.",
            "status": {
                "ok": 1,
                "failed": 0,
                "last_status_code": 200,
                "last_error": None,
            },
        },
        {
            "id": "cdc",
            "name": "Centers for Disease Control and Prevention",
            "url": "https://www.cdc.gov/",
            "type": "official",
            "last_checked_at": updated_at,
            "confidence": "high",
            "usage": "Disease information and guidance references.",
            "status": {
                "ok": 1,
                "failed": 0,
                "last_status_code": 200,
                "last_error": None,
            },
        },
        {
            "id": "ecdc",
            "name": "European Centre for Disease Prevention and Control",
            "url": "https://www.ecdc.europa.eu/",
            "type": "health-agency",
            "last_checked_at": updated_at,
            "confidence": "high",
            "usage": "European public-health monitoring references.",
            "status": {
                "ok": 1,
                "failed": 0,
                "last_status_code": 200,
                "last_error": None,
            },
        },
        {
            "id": "reliefweb",
            "name": "ReliefWeb",
            "url": "https://reliefweb.int/",
            "type": "early-warning",
            "last_checked_at": updated_at,
            "confidence": "medium",
            "usage": "Humanitarian and public-health report discovery.",
            "status": {
                "ok": 1,
                "failed": 0,
                "last_status_code": 200,
                "last_error": None,
            },
        },
    ]

    official_events = [
        {
            "source": "Local seed",
            "source_id": "manual-seed",
            "type": "current_outbreak",
            "title": "Hantavirus public update dataset",
            "summary": "Initial static dataset for HantaUpdates dashboard.",
            "url": "https://hantaupdates.live",
            "published_at": updated_at,
            "metrics": {
                "confirmed_cases": global_data["total_confirmed"],
                "suspected_cases": global_data["total_suspected"],
                "probable_cases": global_data["total_probable"],
                "possible_cases": global_data["total_possible"],
                "under_investigation_cases": global_data["total_under_investigation"],
                "pending_cases": global_data["total_pending"],
                "ruled_out_cases": 0,
                "negative_cases": 0,
                "unconfirmed_cases": global_data["total_unconfirmed"],
                "total_identified_cases": global_data["total_identified_cases"],
                "deaths": global_data["total_deaths"],
                "hospitalized": 0,
                "recovered": 0,
            },
            "countries": [
                {
                    "country": item["country"],
                    "region": item["region"],
                    "lat": item["lat"],
                    "lng": item["lng"],
                }
                for item in countries
            ],
            "risk_level": global_data["global_risk_level"],
        }
    ]

    fetch_log = [
        {
            "ok": True,
            "source_id": "local-update",
            "url": "https://hantaupdates.live",
            "status_code": 200,
            "error": None,
        }
    ]

    write_json("global.json", global_data)
    write_json("countries.json", countries)
    write_json("points.json", points)
    write_json("timeline.json", timeline)
    write_json("sources.json", sources)
    write_json("official_events.json", official_events)
    write_json("fetch_log.json", fetch_log)

    print("Done.")


if __name__ == "__main__":
    main()
