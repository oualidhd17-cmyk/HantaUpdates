from __future__ import annotations

import hashlib
import html
import json
import re
import sys
import textwrap
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus, urljoin

import httpx

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content" / "posts"
DATA_DIR = ROOT / "public" / "data"
STATE_FILE = DATA_DIR / "health_articles_state.json"

SITE_URL = "https://hantaupdates.live"

MAX_ARTICLES_PER_RUN = 100
MAX_TRENDS_PER_MARKET = 12
MAX_ITEMS_PER_TREND_QUERY = 8
FETCH_ARTICLE_MEDIA = True

COUNTRY_MARKETS = [
    {
        "code": "US",
        "name": "United States",
        "hl": "en-US",
        "gl": "US",
        "ceid": "US:en",
        "category": "US Health",
    },
    {
        "code": "GB",
        "name": "United Kingdom",
        "hl": "en-GB",
        "gl": "GB",
        "ceid": "GB:en",
        "category": "Europe Health",
    },
    {
        "code": "DE",
        "name": "Germany",
        "hl": "en",
        "gl": "DE",
        "ceid": "DE:en",
        "category": "Europe Health",
    },
    {
        "code": "FR",
        "name": "France",
        "hl": "en",
        "gl": "FR",
        "ceid": "FR:en",
        "category": "Europe Health",
    },
    {
        "code": "IT",
        "name": "Italy",
        "hl": "en",
        "gl": "IT",
        "ceid": "IT:en",
        "category": "Europe Health",
    },
    {
        "code": "ES",
        "name": "Spain",
        "hl": "en",
        "gl": "ES",
        "ceid": "ES:en",
        "category": "Europe Health",
    },
    {
        "code": "SE",
        "name": "Sweden",
        "hl": "en",
        "gl": "SE",
        "ceid": "SE:en",
        "category": "Europe Health",
    },
    {
        "code": "NL",
        "name": "Netherlands",
        "hl": "en",
        "gl": "NL",
        "ceid": "NL:en",
        "category": "Europe Health",
    },
    {
        "code": "FI",
        "name": "Finland",
        "hl": "en",
        "gl": "FI",
        "ceid": "FI:en",
        "category": "Europe Health",
    },
    {
        "code": "NO",
        "name": "Norway",
        "hl": "en",
        "gl": "NO",
        "ceid": "NO:en",
        "category": "Europe Health",
    },
    {
        "code": "JP",
        "name": "Japan",
        "hl": "en",
        "gl": "JP",
        "ceid": "JP:en",
        "category": "Asia Health",
    },
    {
        "code": "CN",
        "name": "China",
        "hl": "en",
        "gl": "CN",
        "ceid": "CN:en",
        "category": "Asia Health",
    },
    {
        "code": "KR",
        "name": "South Korea",
        "hl": "en",
        "gl": "KR",
        "ceid": "KR:en",
        "category": "Asia Health",
    },
    {
        "code": "IN",
        "name": "India",
        "hl": "en-IN",
        "gl": "IN",
        "ceid": "IN:en",
        "category": "Asia Health",
    },
    {
        "code": "AU",
        "name": "Australia",
        "hl": "en-AU",
        "gl": "AU",
        "ceid": "AU:en",
        "category": "Global Health",
    },
    {
        "code": "CA",
        "name": "Canada",
        "hl": "en-CA",
        "gl": "CA",
        "ceid": "CA:en",
        "category": "Global Health",
    },
    {
        "code": "AE",
        "name": "United Arab Emirates",
        "hl": "en",
        "gl": "AE",
        "ceid": "AE:en",
        "category": "Arab Health",
    },
    {
        "code": "SA",
        "name": "Saudi Arabia",
        "hl": "en",
        "gl": "SA",
        "ceid": "SA:en",
        "category": "Arab Health",
    },
    {
        "code": "QA",
        "name": "Qatar",
        "hl": "en",
        "gl": "QA",
        "ceid": "QA:en",
        "category": "Arab Health",
    },
    {
        "code": "JO",
        "name": "Jordan",
        "hl": "en",
        "gl": "JO",
        "ceid": "JO:en",
        "category": "Arab Health",
    },
    {
        "code": "LB",
        "name": "Lebanon",
        "hl": "en",
        "gl": "LB",
        "ceid": "LB:en",
        "category": "Arab Health",
    },
]

SEED_HEALTH_QUERIES = [
    "health when:1d",
    "medical when:1d",
    "public health when:1d",
    "health warning when:1d",
    "health alert when:1d",
    "outbreak when:1d",
    "virus when:1d",
    "infection when:1d",
    "mental health when:1d",
    "diet nutrition wellness when:1d",
    "AI healthcare medical technology when:7d",
    "drug approval vaccine treatment clinical trial when:7d",
    "cancer diabetes heart disease stroke when:7d",
    "flu covid measles mpox bird flu when:7d",
    "women health pregnancy fertility menopause when:7d",
    "children health pediatric school health when:7d",
    "healthcare system health insurance hospital when:7d",
]

OFFICIAL_RSS_FEEDS = [
    {
        "name": "CDC Emerging Infectious Diseases",
        "url": "https://wwwnc.cdc.gov/eid/rss/ahead-of-print.xml",
        "category": "Outbreaks",
        "region": "United States",
        "confidence": "high",
    },
    {
        "name": "CDC EID Expedited Articles",
        "url": "https://wwwnc.cdc.gov/eid/rss/expedited.xml",
        "category": "Outbreaks",
        "region": "United States",
        "confidence": "high",
    },
]

HEALTH_KEYWORDS = [
    "health",
    "medical",
    "medicine",
    "disease",
    "virus",
    "outbreak",
    "infection",
    "vaccine",
    "drug",
    "treatment",
    "symptom",
    "hospital",
    "doctor",
    "patient",
    "mental",
    "anxiety",
    "depression",
    "sleep",
    "nutrition",
    "diet",
    "wellness",
    "cancer",
    "diabetes",
    "heart",
    "stroke",
    "flu",
    "covid",
    "measles",
    "mpox",
    "bird flu",
    "hantavirus",
    "who",
    "cdc",
    "ecdc",
    "nih",
    "fda",
    "nhs",
    "clinic",
    "therapy",
    "research",
    "study",
    "trial",
    "approval",
    "warning",
    "pregnancy",
    "fertility",
    "children",
    "pediatric",
    "obesity",
    "weight",
]

STOP_WORDS = {
    "the",
    "and",
    "for",
    "with",
    "from",
    "that",
    "this",
    "after",
    "before",
    "over",
    "into",
    "about",
    "says",
    "said",
    "will",
    "your",
    "you",
    "are",
    "was",
    "were",
    "new",
    "news",
    "latest",
    "update",
    "updates",
    "live",
    "report",
    "reports",
    "study",
    "studies",
    "could",
    "would",
    "should",
    "what",
    "why",
    "how",
    "when",
    "where",
    "who",
    "have",
    "has",
    "had",
    "may",
    "can",
    "more",
    "than",
    "its",
    "their",
    "they",
    "them",
    "his",
    "her",
    "our",
    "not",
    "but",
    "all",
    "one",
    "two",
    "first",
    "last",
    "google",
    "yahoo",
    "msn",
    "bbc",
    "cnn",
    "fox",
    "reuters",
    "ap",
}

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif")
VIDEO_EXTENSIONS = (".mp4", ".webm", ".mov", ".m3u8")


@dataclass
class TrendItem:
    trend: str
    market_code: str
    market_name: str
    category: str
    score: int
    examples: list[str]


@dataclass
class FeedItem:
    title: str
    url: str
    summary: str
    published_at: str
    source: str
    category: str
    region: str
    confidence: str
    trend: str = ""
    image_url: str = ""
    video_url: str = ""


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def ensure_dirs() -> None:
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def strip_html(value: str) -> str:
    value = re.sub(r"(?is)<script.*?</script>", " ", value)
    value = re.sub(r"(?is)<style.*?</style>", " ", value)
    value = re.sub(r"(?is)<[^>]+>", " ", value)
    return normalize_space(html.unescape(value))


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"&", " and ", value)
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value)
    return value.strip("-")[:95]


def short_hash(value: str) -> str:
    return hashlib.sha1(value.encode("utf-8", errors="ignore")).hexdigest()[:10]


def clean_url(value: str, base_url: str = "") -> str:
    value = html.unescape(value or "").strip()

    if not value:
        return ""

    if value.startswith("//"):
        return f"https:{value}"

    if base_url and value.startswith("/"):
        return urljoin(base_url, value)

    if value.startswith("http://") or value.startswith("https://"):
        return value

    return ""


def is_image_url(value: str) -> bool:
    lowered = value.lower().split("?")[0]
    return lowered.endswith(IMAGE_EXTENSIONS)


def is_video_url(value: str) -> bool:
    lowered = value.lower().split("?")[0]
    return (
        lowered.endswith(VIDEO_EXTENSIONS)
        or "youtube.com" in lowered
        or "youtu.be" in lowered
    )


def contains_health_keyword(text: str) -> bool:
    lowered = text.lower()
    return any(keyword in lowered for keyword in HEALTH_KEYWORDS)


def infer_category(text: str, fallback: str) -> str:
    lowered = text.lower()

    if any(
        word in lowered
        for word in [
            "outbreak",
            "virus",
            "infection",
            "measles",
            "mpox",
            "flu",
            "covid",
            "bird flu",
        ]
    ):
        return "Outbreaks"

    if any(
        word in lowered
        for word in ["mental", "anxiety", "depression", "sleep", "stress"]
    ):
        return "Mental Health"

    if any(
        word in lowered
        for word in ["diet", "nutrition", "weight", "wellness", "obesity"]
    ):
        return "Diet & Wellness"

    if any(
        word in lowered
        for word in [
            "ai",
            "technology",
            "digital health",
            "medical device",
            "health tech",
        ]
    ):
        return "Medical Technology"

    if any(
        word in lowered
        for word in ["drug", "approval", "vaccine", "treatment", "clinical trial"]
    ):
        return "Drug & Treatment News"

    if any(word in lowered for word in ["cancer", "diabetes", "heart", "stroke"]):
        return "Chronic Disease"

    if any(
        word in lowered for word in ["pregnancy", "fertility", "women", "menopause"]
    ):
        return "Women Health"

    if any(word in lowered for word in ["children", "pediatric", "school"]):
        return "Children Health"

    return fallback


def read_state() -> dict[str, Any]:
    if not STATE_FILE.exists():
        return {"seen_urls": [], "generated_posts": []}

    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except Exception:
        return {"seen_urls": [], "generated_posts": []}


def write_state(state: dict[str, Any]) -> None:
    STATE_FILE.write_text(
        json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def write_json(filename: str, data: Any) -> None:
    path = DATA_DIR / filename
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generated: {path}")


def get_xml_text(node: ET.Element, tag: str) -> str:
    child = node.find(tag)

    if child is not None and child.text:
        return normalize_space(child.text)

    for item in node:
        if item.tag.endswith(tag) and item.text:
            return normalize_space(item.text)

    return ""


def get_xml_link(node: ET.Element) -> str:
    link = get_xml_text(node, "link")

    if link:
        return link

    for child in node:
        if child.tag.endswith("link"):
            href = child.attrib.get("href")
            if href:
                return href

    return ""


def extract_media_from_xml_item(node: ET.Element) -> tuple[str, str]:
    image_url = ""
    video_url = ""

    for child in node.iter():
        tag = child.tag.lower()
        attrs = child.attrib

        url = (
            attrs.get("url")
            or attrs.get("href")
            or attrs.get("resource")
            or attrs.get("{http://www.w3.org/1999/02/22-rdf-syntax-ns#}resource")
            or ""
        )

        url = clean_url(url)
        medium = (attrs.get("medium") or "").lower()
        mime_type = (attrs.get("type") or "").lower()

        if not image_url and (
            "thumbnail" in tag
            or "image" in tag
            or medium == "image"
            or mime_type.startswith("image/")
            or is_image_url(url)
        ):
            image_url = url

        if not video_url and (
            "video" in tag
            or medium == "video"
            or mime_type.startswith("video/")
            or is_video_url(url)
        ):
            video_url = url

    if not image_url:
        description = get_xml_text(node, "description") or get_xml_text(node, "summary")
        image_match = re.search(r'(?is)<img[^>]+src=["\']([^"\']+)["\']', description)

        if image_match:
            image_url = clean_url(image_match.group(1))

    return image_url, video_url


def parse_rss_xml(
    xml_text: str,
    source_name: str,
    category: str,
    region: str,
    confidence: str,
    trend: str = "",
) -> list[FeedItem]:
    items: list[FeedItem] = []

    try:
        root = ET.fromstring(xml_text.encode("utf-8"))
    except Exception:
        return []

    for item in root.findall(".//item"):
        title = strip_html(get_xml_text(item, "title"))
        url = get_xml_link(item)
        summary = strip_html(
            get_xml_text(item, "description") or get_xml_text(item, "summary")
        )
        published_at = (
            get_xml_text(item, "pubDate")
            or get_xml_text(item, "published")
            or get_xml_text(item, "updated")
            or now_iso()
        )
        image_url, video_url = extract_media_from_xml_item(item)

        if title and url:
            final_category = infer_category(f"{title} {summary} {trend}", category)

            items.append(
                FeedItem(
                    title=title,
                    url=url,
                    summary=summary,
                    published_at=published_at,
                    source=source_name,
                    category=final_category,
                    region=region,
                    confidence=confidence,
                    trend=trend,
                    image_url=image_url,
                    video_url=video_url,
                )
            )

    namespaces = {"atom": "http://www.w3.org/2005/Atom"}

    for entry in root.findall(".//atom:entry", namespaces):
        title_node = entry.find("atom:title", namespaces)
        summary_node = entry.find("atom:summary", namespaces)
        published_node = entry.find("atom:published", namespaces) or entry.find(
            "atom:updated", namespaces
        )

        title = strip_html(title_node.text if title_node is not None else "")
        summary = strip_html(summary_node.text if summary_node is not None else "")
        published_at = (
            normalize_space(published_node.text)
            if published_node is not None and published_node.text
            else now_iso()
        )

        url = ""

        for link_node in entry.findall("atom:link", namespaces):
            href = link_node.attrib.get("href", "")
            if href:
                url = href
                break

        image_url, video_url = extract_media_from_xml_item(entry)

        if title and url:
            final_category = infer_category(f"{title} {summary} {trend}", category)

            items.append(
                FeedItem(
                    title=title,
                    url=url,
                    summary=summary,
                    published_at=published_at,
                    source=source_name,
                    category=final_category,
                    region=region,
                    confidence=confidence,
                    trend=trend,
                    image_url=image_url,
                    video_url=video_url,
                )
            )

    return items


def google_news_rss_url(query: str, market: dict[str, str]) -> str:
    return (
        "https://news.google.com/rss/search"
        f"?q={quote_plus(query)}"
        f"&hl={market['hl']}"
        f"&gl={market['gl']}"
        f"&ceid={market['ceid']}"
    )


def fetch_feed(client: httpx.Client, url: str) -> str:
    response = client.get(url, follow_redirects=True)
    response.raise_for_status()
    return response.text


def tokenize_title(title: str) -> list[str]:
    text = title.lower()
    text = re.sub(r"https?://\S+", " ", text)
    text = re.sub(r"[^a-z0-9\s-]", " ", text)

    words = [
        word.strip("-")
        for word in text.split()
        if len(word.strip("-")) >= 4 and word.strip("-") not in STOP_WORDS
    ]

    return words


def extract_candidate_phrases(title: str) -> list[str]:
    words = tokenize_title(title)
    phrases: list[str] = []

    for word in words:
        if word in HEALTH_KEYWORDS or contains_health_keyword(word):
            phrases.append(word)

    for size in [2, 3]:
        for index in range(0, max(len(words) - size + 1, 0)):
            chunk = words[index : index + size]
            phrase = " ".join(chunk)

            if contains_health_keyword(phrase) or any(
                word in HEALTH_KEYWORDS for word in chunk
            ):
                phrases.append(phrase)

    return phrases


def discover_market_trends(
    client: httpx.Client, market: dict[str, str]
) -> tuple[list[TrendItem], list[FeedItem]]:
    print("")
    print(f"Stage 1: Discovering health trends for {market['name']}")

    collected_items: list[FeedItem] = []
    phrase_counter: Counter[str] = Counter()
    phrase_examples: dict[str, list[str]] = defaultdict(list)

    for query in SEED_HEALTH_QUERIES:
        url = google_news_rss_url(query, market)

        try:
            xml_text = fetch_feed(client, url)
        except Exception as exc:
            print(f"  seed failed: {query} / {exc}")
            continue

        items = parse_rss_xml(
            xml_text=xml_text,
            source_name=f"Google News / {market['name']}",
            category=market["category"],
            region=market["name"],
            confidence="medium",
            trend=query.replace(" when:1d", "").replace(" when:7d", ""),
        )

        collected_items.extend(items[:6])

        for item in items[:10]:
            text = f"{item.title} {item.summary}"

            if not contains_health_keyword(text):
                continue

            for phrase in extract_candidate_phrases(item.title):
                if len(phrase) < 4:
                    continue

                phrase_counter[phrase] += 1

                if len(phrase_examples[phrase]) < 3:
                    phrase_examples[phrase].append(item.title)

    trends: list[TrendItem] = []

    for phrase, score in phrase_counter.most_common(MAX_TRENDS_PER_MARKET * 2):
        if score <= 0:
            continue

        if phrase in STOP_WORDS:
            continue

        if not contains_health_keyword(phrase):
            continue

        category = infer_category(phrase, market["category"])

        trends.append(
            TrendItem(
                trend=phrase,
                market_code=market["code"],
                market_name=market["name"],
                category=category,
                score=score,
                examples=phrase_examples.get(phrase, [])[:3],
            )
        )

        if len(trends) >= MAX_TRENDS_PER_MARKET:
            break

    if not trends:
        fallback_terms = [
            "health alert",
            "outbreak",
            "mental health",
            "medical research",
            "drug approval",
            "diet wellness",
        ]

        trends = [
            TrendItem(
                trend=term,
                market_code=market["code"],
                market_name=market["name"],
                category=infer_category(term, market["category"]),
                score=1,
                examples=[],
            )
            for term in fallback_terms
        ]

    print(f"  discovered trends: {len(trends)}")

    return trends, collected_items


def discover_health_trends(
    client: httpx.Client,
) -> tuple[list[TrendItem], list[FeedItem]]:
    all_trends: list[TrendItem] = []
    seed_items: list[FeedItem] = []

    for market in COUNTRY_MARKETS:
        trends, items = discover_market_trends(client, market)
        all_trends.extend(trends)
        seed_items.extend(items)

    return all_trends, seed_items


def collect_items_from_trends(
    client: httpx.Client, trends: list[TrendItem]
) -> list[FeedItem]:
    print("")
    print("Stage 2: Collecting news from discovered trends")

    items: list[FeedItem] = []

    for trend in trends:
        market = next(
            (item for item in COUNTRY_MARKETS if item["code"] == trend.market_code),
            None,
        )

        if not market:
            continue

        query = f'"{trend.trend}" health OR medical OR public health when:7d'
        url = google_news_rss_url(query, market)

        print(f"  {trend.market_name}: {trend.trend}")

        try:
            xml_text = fetch_feed(client, url)
        except Exception as exc:
            print(f"    failed: {exc}")
            continue

        feed_items = parse_rss_xml(
            xml_text=xml_text,
            source_name=f"Google News / {trend.market_name}",
            category=trend.category,
            region=trend.market_name,
            confidence="medium",
            trend=trend.trend,
        )

        items.extend(feed_items[:MAX_ITEMS_PER_TREND_QUERY])

    return items


def collect_official_feed_items(client: httpx.Client) -> list[FeedItem]:
    items: list[FeedItem] = []

    for feed in OFFICIAL_RSS_FEEDS:
        print(f"Fetching official feed: {feed['name']}")

        try:
            xml_text = fetch_feed(client, feed["url"])
        except Exception as exc:
            print(f"  failed: {exc}")
            continue

        items.extend(
            parse_rss_xml(
                xml_text=xml_text,
                source_name=feed["name"],
                category=feed["category"],
                region=feed["region"],
                confidence=feed["confidence"],
                trend="official public health",
            )[:20]
        )

    return items


def extract_meta_content(raw_html: str, names: list[str], base_url: str) -> str:
    for name in names:
        patterns = [
            rf'(?is)<meta[^>]+property=["\']{re.escape(name)}["\'][^>]+content=["\']([^"\']+)["\']',
            rf'(?is)<meta[^>]+name=["\']{re.escape(name)}["\'][^>]+content=["\']([^"\']+)["\']',
            rf'(?is)<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']{re.escape(name)}["\']',
            rf'(?is)<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']{re.escape(name)}["\']',
        ]

        for pattern in patterns:
            match = re.search(pattern, raw_html)

            if match:
                value = clean_url(match.group(1), base_url=base_url)

                if value:
                    return value

    return ""


def fetch_article_media(client: httpx.Client, item: FeedItem) -> FeedItem:
    if not FETCH_ARTICLE_MEDIA:
        return item

    if item.image_url and item.video_url:
        return item

    try:
        response = client.get(item.url, follow_redirects=True)
        response.raise_for_status()

        raw_html = response.text or ""
        base_url = str(response.url)

        image_url = item.image_url or extract_meta_content(
            raw_html,
            ["og:image", "twitter:image", "twitter:image:src"],
            base_url=base_url,
        )

        video_url = item.video_url or extract_meta_content(
            raw_html,
            ["og:video", "og:video:url", "og:video:secure_url", "twitter:player"],
            base_url=base_url,
        )

        if not image_url:
            img_match = re.search(r'(?is)<img[^>]+src=["\']([^"\']+)["\']', raw_html)

            if img_match:
                image_url = clean_url(img_match.group(1), base_url=base_url)

        item.image_url = image_url
        item.video_url = video_url

    except Exception:
        pass

    return item


def dedupe_items(items: list[FeedItem]) -> list[FeedItem]:
    seen: set[str] = set()
    result: list[FeedItem] = []

    for item in items:
        key = item.url.strip().lower() or normalize_space(item.title).lower()

        if not key or key in seen:
            continue

        seen.add(key)
        result.append(item)

    return result


def score_item(item: FeedItem) -> int:
    text = f"{item.title} {item.summary} {item.category} {item.trend}".lower()
    score = 0

    if contains_health_keyword(text):
        score += 40

    if item.trend:
        score += 18

    if item.confidence == "high":
        score += 25

    if item.image_url:
        score += 10

    if item.video_url:
        score += 8

    if any(
        word in text
        for word in ["outbreak", "warning", "alert", "virus", "infection", "disease"]
    ):
        score += 18

    if any(
        word in text
        for word in ["new", "study", "research", "approval", "vaccine", "treatment"]
    ):
        score += 12

    if any(
        word in text for word in ["mental health", "anxiety", "sleep", "depression"]
    ):
        score += 10

    if item.region in [
        "United States",
        "United Kingdom",
        "Germany",
        "Japan",
        "China",
        "Saudi Arabia",
        "United Arab Emirates",
    ]:
        score += 8

    return score


def make_article_title(item: FeedItem) -> str:
    clean_title = normalize_space(item.title)
    clean_title = re.sub(r"\s+-\s+[^-]{2,90}$", "", clean_title).strip()

    if clean_title.endswith("."):
        clean_title = clean_title[:-1]

    if len(clean_title) > 105:
        clean_title = clean_title[:102].rstrip() + "..."

    return clean_title


def make_excerpt(item: FeedItem) -> str:
    summary = normalize_space(item.summary)

    if not summary:
        summary = (
            f"This health update is trending in {item.region} and is being tracked "
            f"as part of global medical and public-health monitoring."
        )

    if len(summary) > 260:
        summary = summary[:257].rstrip() + "..."

    return summary


def make_keywords(item: FeedItem) -> list[str]:
    base = [
        item.category.lower(),
        f"{item.region.lower()} health news",
        "health trends",
        "medical news",
        "public health",
    ]

    if item.trend:
        base.insert(0, item.trend.lower())

    title_words = [
        word.lower()
        for word in re.findall(r"[A-Za-z][A-Za-z0-9-]{3,}", item.title)
        if word.lower() not in STOP_WORDS
    ]

    return list(dict.fromkeys(base + title_words[:12]))


def yaml_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', "'").strip()


def build_markdown(item: FeedItem) -> tuple[str, str]:
    article_title = make_article_title(item)
    excerpt = make_excerpt(item)
    slug = f"{slugify(article_title)}-{short_hash(item.url)}"
    date = now_iso()
    keywords = make_keywords(item)

    media_block = ""

    if item.image_url:
        media_block += f'\nimage_url: "{yaml_escape(item.image_url)}"'

    if item.video_url:
        media_block += f'\nvideo_url: "{yaml_escape(item.video_url)}"'

    if item.trend:
        media_block += f'\ntrend: "{yaml_escape(item.trend)}"'

    body = f"""---
title: "{yaml_escape(article_title)}"
description: "{yaml_escape(excerpt)}"
slug: "{slug}"
category: "{yaml_escape(item.category)}"
region: "{yaml_escape(item.region)}"
source: "{yaml_escape(item.source)}"
source_url: "{yaml_escape(item.url)}"
source_confidence: "{yaml_escape(item.confidence)}"
published_at: "{yaml_escape(item.published_at)}"
generated_at: "{date}"{media_block}
keywords:
{chr(10).join(f'  - "{yaml_escape(keyword)}"' for keyword in keywords)}
---

# {article_title}

{excerpt}

## Why this topic is trending

This update was selected because it is connected to a detected health trend in **{item.region}**.

{f'Tracked trend: **{item.trend}**.' if item.trend else 'Tracked trend: **global health update**.'}

## What happened

This update is part of a wider health signal being monitored from public sources and regional news feeds. It may relate to public health, medical research, symptoms, outbreaks, treatments, wellness, healthcare systems, or health technology.

## Why it matters

- It may affect public awareness or online health searches.
- It may be connected to health policy, disease monitoring, treatment updates, or scientific research.
- The original source should be reviewed for full details and context.

## Region

**{item.region}**

## Category

**{item.category}**

## Source context

This article summarizes a public health signal from **{item.source}**. HantaUpdates links to the original source so readers can verify details directly.

## Medical disclaimer

HantaUpdates does not provide medical advice, diagnosis, or treatment. Always follow guidance from your local health authority or a qualified medical professional.
"""

    return slug, textwrap.dedent(body).strip() + "\n"


def generate_posts(items: list[FeedItem], client: httpx.Client) -> list[dict[str, Any]]:
    state = read_state()
    seen_urls = set(state.get("seen_urls", []))

    items = dedupe_items(items)

    filtered_items = [
        item
        for item in items
        if item.url
        and item.url not in seen_urls
        and contains_health_keyword(
            f"{item.title} {item.summary} {item.category} {item.trend}"
        )
    ]

    ranked_items = sorted(filtered_items, key=score_item, reverse=True)

    generated: list[dict[str, Any]] = []

    for item in ranked_items[:MAX_ARTICLES_PER_RUN]:
        item = fetch_article_media(client, item)

        slug, markdown = build_markdown(item)
        path = CONTENT_DIR / f"{slug}.md"

        if path.exists():
            seen_urls.add(item.url)
            continue

        path.write_text(markdown, encoding="utf-8")
        seen_urls.add(item.url)

        generated.append(
            {
                "title": make_article_title(item),
                "slug": slug,
                "category": item.category,
                "region": item.region,
                "trend": item.trend,
                "source": item.source,
                "source_url": item.url,
                "confidence": item.confidence,
                "image_url": item.image_url,
                "video_url": item.video_url,
                "generated_at": now_iso(),
            }
        )

        media_status = []

        if item.image_url:
            media_status.append("image")

        if item.video_url:
            media_status.append("video")

        print(
            f"Generated article: {path.name}"
            + (f" ({', '.join(media_status)})" if media_status else "")
        )

    state["seen_urls"] = sorted(seen_urls)
    state["generated_posts"] = (state.get("generated_posts", []) + generated)[-5000:]
    write_state(state)

    return generated


def write_discovered_trends(trends: list[TrendItem]) -> None:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)

    for trend in trends:
        grouped[trend.market_name].append(
            {
                "trend": trend.trend,
                "market_code": trend.market_code,
                "category": trend.category,
                "score": trend.score,
                "examples": trend.examples,
            }
        )

    write_json(
        "discovered-health-trends.json",
        {
            "updated_at": now_iso(),
            "total_trends": len(trends),
            "markets": grouped,
        },
    )


def main() -> None:
    ensure_dirs()

    headers = {
        "User-Agent": "HantaUpdatesHealthTrendsBot/2.0 (+https://hantaupdates.live)",
        "Accept": "application/rss+xml,application/xml,text/xml,text/html;q=0.9,*/*;q=0.8",
    }

    timeout = httpx.Timeout(30.0)
    all_items: list[FeedItem] = []

    with httpx.Client(timeout=timeout, headers=headers) as client:
        print("Fetching official health feeds...")
        all_items.extend(collect_official_feed_items(client))

        trends, seed_items = discover_health_trends(client)
        write_discovered_trends(trends)

        trend_items = collect_items_from_trends(client, trends)

        all_items.extend(seed_items)
        all_items.extend(trend_items)

        print("")
        print("Ranking and generating articles...")
        generated = generate_posts(all_items, client)

    trend_index = {
        "updated_at": now_iso(),
        "total_collected_items": len(all_items),
        "unique_items": len(dedupe_items(all_items)),
        "discovered_trends_count": len(trends),
        "generated_count": len(generated),
        "generated": generated,
        "categories": sorted({item["category"] for item in generated}),
        "regions": sorted({item["region"] for item in generated}),
    }

    write_json("health-trends.json", trend_index)

    print("")
    print("Summary")
    print("-------")
    print(f"Discovered trends: {len(trends)}")
    print(f"Collected items: {len(all_items)}")
    print(f"Unique items: {len(dedupe_items(all_items))}")
    print(f"Generated posts: {len(generated)}")
    print("Done.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Stopped.")
        sys.exit(130)
