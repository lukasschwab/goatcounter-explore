# goatcounter-explore

This is a web explorer for data exported from the excellent, privacy-conscious
web analytics tool [GoatCounter](https://www.goatcounter.com/). In that spirit,
this web app does not upload your GoatCounter data anywhere: all analysis
happens locally, in your browser.

This adds several features I feel are missing in the GoatCounter web UI:

+ View and filter a table of individual events
+ A unified graph of traffic to all paths
+ Reorganize traffic data by referrers
+ Dive into specific sessiosn

You can use the hosted application at
[goatcounter-explore.fly.dev](https://goatcounter-explore.fly.dev/).

>[!NOTE]
> This code was authored with minimal supervision/review by Gemini 3 Pro in
> Antigravity. It may be very bad.
>
> It is my general policy not to publicize slop, but I want to provide this
> source as evidence that this app does not steal your GoatCounter data.

## Usage

To use this tool, you'll need a CSV export of your GoatCounter data.

1. Visit your GoatCounter dashboard settings: `https://[your-code].goatcounter.com/settings/export`
2. In the "Export to CSV" section, click "Start export".
3. Wait for the email from GoatCounter containing your download link.
4. Download the CSV file (it may be gzipped as `.csv.gz`, which is fine).
5. Upload the file to GoatCounter Explore.

## Instructions

Run the application locally:

```console
$ mise install
$ mise run start
```

Deploy it to fly.io:

```console
$ fly deploy
```
