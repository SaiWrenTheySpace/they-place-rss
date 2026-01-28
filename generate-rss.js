import fs from "fs";
import fetch from "node-fetch";
import Papa from "papaparse";

const SHEET_ID = "19kQgcSz620MQDpZgP3264RsaJETmcRZac6UKyjArAuM";
const SHEET_NAME = "Sheet1";

const SHEET_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQFlgm-iSbmHzsUAzqTX5a5YjSlrg_WV-HX9wZMYiOSN3bpmyBAeg62bUD1grVIWVUQjYi_EfSaUUiv/pub?output=csv`;

const SITE_TITLE = "They Place";
const SITE_URL = "https://sites.google.com/view/they-place";
const SITE_DESCRIPTION = "My personal slice of the world wide web and the pinkest blog on the net";

async function run() {
  const res = await fetch(SHEET_URL);
  const csv = await res.text();

  const parsed = Papa.parse(csv, { header: true }).data;

  const items = parsed.map(post => `
    <item>
      <title><![CDATA[${post.Title}]]></title>
      <link>${post.URL}</link>
      <guid>${post.URL}</guid>
      <pubDate>${new Date(post.Date).toUTCString()}</pubDate>
      <description><![CDATA[${post.Description || ""}]]></description>
    </item>
  `).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    ${items}
  </channel>
</rss>
`;

  fs.writeFileSync("rss.xml", rss.trim());
}

run();
