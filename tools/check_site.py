#!/usr/bin/env python3
"""Dependency-free checks for the public ZIN GitHub Pages site."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://selvaganapathir.github.io/Zin-website/"

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.meta = {}
        self.title_depth = 0
        self.title_text = []
        self.json_ld = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag in {"a", "link", "script"}:
            key = "href" if tag in {"a", "link"} else "src"
            if attrs.get(key):
                self.links.append((tag, attrs[key]))
        if tag == "meta":
            key = attrs.get("name") or attrs.get("property")
            if key:
                self.meta[key] = attrs.get("content", "")
        if tag == "title":
            self.title_depth += 1
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.json_ld.append("")

    def handle_endtag(self, tag):
        if tag == "title" and self.title_depth:
            self.title_depth -= 1

    def handle_data(self, data):
        if self.title_depth:
            self.title_text.append(data)
        if self.json_ld:
            self.json_ld[-1] += data

def fail(message):
    print(f"FAIL: {message}")
    return False

def main():
    ok = True
    html_path = ROOT / "index.html"
    if not html_path.is_file():
        return 1 if fail("index.html is missing") else 0
    html = html_path.read_text(encoding="utf-8")
    parser = PageParser()
    parser.feed(html)

    title = "".join(parser.title_text).strip()
    if not title:
        ok = fail("page title is missing") and ok
    description = parser.meta.get("description", "")
    if len(description) < 50 or len(description) > 180:
        ok = fail("meta description should be between 50 and 180 characters") and ok
    if parser.meta.get("og:title") != title:
        ok = fail("Open Graph title should match the page title") and ok
    if parser.meta.get("og:url") != BASE:
        ok = fail("Open Graph URL does not match the canonical site URL") and ok
    if not re.search(r'<link\\s+rel=["\\']canonical["\\']\\s+href=', html):
        ok = fail("canonical link is missing") and ok
    for payload in parser.json_ld:
        try:
            json.loads(payload)
        except json.JSONDecodeError:
            ok = fail("JSON-LD structured data is invalid JSON") and ok

    for tag, target in parser.links:
        if target.startswith("#") and target[1:] and target[1:] not in parser.ids:
            ok = fail(f"missing in-page anchor: {target}") and ok
        elif target.startswith(("https://", "http://", "mailto:", "tel:", "#")):
            continue
        else:
            local = target.split("#", 1)[0].split("?", 1)[0]
            if local and not (ROOT / local).is_file():
                ok = fail(f"missing local asset: {local}") and ok

    robots = ROOT / "robots.txt"
    sitemap = ROOT / "sitemap.xml"
    if not robots.is_file() or "Sitemap:" not in robots.read_text(encoding="utf-8"):
        ok = fail("robots.txt must declare the sitemap") and ok
    try:
        tree = ET.parse(sitemap)
        locs = [node.text for node in tree.findall(".//{*}loc")]
        if BASE not in locs:
            ok = fail("sitemap does not include the canonical homepage") and ok
    except (ET.ParseError, OSError):
        ok = fail("sitemap.xml is missing or invalid") and ok

    if ok:
        print("PASS: website metadata, local references, crawler files and structured data")
        return 0
    return 1

if __name__ == "__main__":
    sys.exit(main())
