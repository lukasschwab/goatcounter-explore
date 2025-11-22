# goatcounter-explore

This is a web explorer for data exported from the excellent, privacy-conscious
web analytics tool [GoatCounter](https://www.goatcounter.com/). In that spirit,
this web app does not upload your GoatCounter data anywhere: all analysis
happens locally, in your browser.

You can use the hosted application at
[goatcounter-explore.fly.dev](https://goatcounter-explore.fly.dev/).

>[!NOTE]
> This code was authored with minimal supervision/review by Gemini 3 Pro in
> Antigravity. It may be very bad.
>
> It is my general policy not to publicize slop, but I want to provide this
> source as evidence that this app does not steal your GoatCounter data.

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
