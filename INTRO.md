# Replacement video opening — local only

Source: `/Users/aviralsrivastava/Downloads/Character_walking_in_cyberpunk_city_20260911231755.mp4`.
This is the replacement, not the rejected Times Square clip. Source untouched.

Native scroll drives a single Motion value. First 80% advances the supplied
camera move through the city to the eye. 84.5–94% reveals the identity, followed
by a reading hold and native sticky release into existing Langflow content.
Desktop height 560svh; phone 450svh. No initial dead scroll interval, wheel
interception, autoplay, audio, or per-frame React state updates.

Frame quantization + one seek in flight prevent decoder flooding and repeated
alternate frames. Hidden/offscreen media work stops. Links remain available.
Reduced motion and video errors use a poster with immediately readable identity.

The original is 1080p/24 fps. Delivery copy is 720p/60 fps H.264, all-intra,
silent, approximately 18 MB. Optical flow creates intermediate frames, not new
source detail; it can introduce artifacts. No hundreds-of-images sequence is
stored or decoded into RAM. No new runtime library or service was installed.

Preparation with the existing ffmpeg installation (do not overwrite source):

```sh
ffmpeg -n -i /absolute/path/to/replacement.mp4 -an \
 -vf 'scale=1280:720:flags=lanczos,minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,tpad=stop_mode=clone:stop_duration=0.1' \
 -t 10 -c:v libx264 -preset fast -crf 19 -g 1 -keyint_min 1 -bf 0 \
 -pix_fmt yuv420p -movflags +faststart public/intro/cyberpunk-walk.mp4
```

Run `npm run build`, then `npm run preview:local` if the preview is not already
running. Review at http://127.0.0.1:4174/. No push/deployment performed.

Browser verification script: `output/playwright/intro-check.js`; captures are
`output/playwright/intro-*.jpg`. Real-device iOS/Safari and production-network
performance have not been established. Do not interpret a 60 fps file as an
all-device guarantee of 60 presented frames per second.

Measured September 11, 2026: foreground desktop Chrome, 1440x900, DPR 1,
local optimized build, 10 seconds of forward travel and 10 seconds in reverse.
requestVideoFrameCallback measured 58.84 / 58.95 presented frames per second;
95th-percentile gaps 25 / 24.7 ms; maximum gaps 34.4 / 41.9 ms. The browser's
dropped-frame counter was zero, which does not mean every presentation was
evenly timed. No claim of completely stutter-free playback across devices.

Five representative desktop compositions and four at 390x844 were captured.
No horizontal overflow at those phone states. Research navigation and reload
landed 95px beneath the header; resume returned HTTP 200. Reduced motion removed
the video/long scroll span and showed identity immediately. Aborted media loading
correctly selected the same static fallback. No page exceptions. Five unit tests
passed, including existing contact success/error/timeout tests (mocked, no email
sent). Build passes with two pre-existing lint warnings outside this change.

Native wheel scroll-through and reversal recording:
`output/playwright/intro-motion.webm` (browser capture, not a generated concept).
Only one review recording is retained in the project.
