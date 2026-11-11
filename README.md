# Teams Client for Old Macs

An unofficial desktop client for **Microsoft Teams** on older Macs running **macOS Catalina (10.15)**, built with Electron.

The official Teams desktop app no longer supports older macOS versions, and a plain browser tab is slow and easy to lose. This project wraps the Teams web app (`teams.microsoft.com`) in its own window, using an Electron version that still runs on Catalina.

> **Disclaimer:** This is an independent project. It is not affiliated with, endorsed by, or sponsored by Microsoft. "Microsoft Teams" is a trademark of Microsoft Corporation. The app only loads the official Teams web app and does not modify or reimplement it.

## Features

- Dedicated Teams window instead of a browser tab
- Stays signed in between launches
- Audio and video calls (microphone and camera)
- Screen sharing, with a dialog to pick a screen or window
- Desktop notifications
- Unread count shown on the Dock icon
- Closing the window hides it; click the Dock icon to bring it back, or press Cmd+Q to quit
- Microsoft sign-in pages open inside the app; other links open in your default browser

## Why Electron 32?

| Option | Result on Catalina |
|---|---|
| Tauri | Uses the system WebKit (Safari 15.6.1 on Catalina), which was too old for the web app to run properly |
| Electron 32 | Ships its own Chromium 128, the last Chromium version that supports Catalina |

Electron 33 and later require macOS 11 or newer, so this project is pinned to **Electron 32**. Do not upgrade it on Catalina.

## Requirements

- macOS 10.15 Catalina (Intel, x64)
- Node.js 20 or an older LTS (newer Node versions may not run on Catalina)
- npm

## Getting started

```bash
git clone https://github.com/AbhishekMadhura/Teams-darwin-x64.git
cd Teams-darwin-x64
npm install
npm start
```

Sign in with your Microsoft account when the window opens.

## Build the app

```bash
npx electron-packager . Teams --platform=darwin --arch=x64 --overwrite
```

This creates a `Teams-darwin-x64` folder containing `Teams.app`. Drag it into your Applications folder.

Because the app is unsigned, macOS may block it the first time. Right-click `Teams.app`, choose **Open**, then confirm.

## Permissions

macOS asks for access the first time you use these features:

| Feature | Where to allow it |
|---|---|
| Microphone and camera | The prompt shown on first launch, or System Preferences > Security & Privacy > Privacy |
| Screen sharing | System Preferences > Security & Privacy > Privacy > Screen Recording |

For screen sharing, tick the app in the list, then quit it completely (Cmd+Q) and reopen it. If you build the packaged app, grant the permission to `Teams` separately from the development `Electron` entry.

## Project structure

```
.
├── main.js         # Electron main process (window, permissions, screen share)
├── package.json
└── README.md
```

## Known limitations

- **Aging browser engine.** Chromium 128 no longer receives security updates, and Microsoft may eventually require a newer browser. If Teams shows an "unsupported browser" page, that is the likely cause.
- **Web feature set.** Anything the Teams web app cannot do, this client cannot do either.
- **Screen share has video only.** System audio is not shared on macOS this way, and the picker lists names without previews.
- **Unsigned app.** It is not code-signed or notarized.

## Troubleshooting

**`npm start` fails with a JSON error.** Check `package.json` for a missing comma or stray character.

**Syntax error at the first line of `main.js`.** A stray character was probably pasted before `const`. Open the file and delete it.

**Screen share shows a black screen.** Screen Recording permission was not applied. Check the tick box for the app and restart it.

**No microphone or camera prompt.** Check System Preferences > Security & Privacy > Privacy for the app and allow both.

**An old icon keeps showing after you rebuild.** Run `killall Dock` to clear the icon cache.

## Contributing

Issues and pull requests are welcome, especially from other people stuck on older macOS versions.

## License

MIT. See the `LICENSE` file.
