# My Exotic Fruit

---

## Setup in WebStorm:

### Create new file watcher:
- File type: `any`
- scope: create `new`, with pattern `file:src//*`
- program: `node`
- arguments: `build.js "$FilePathRelativeToProjectRoot$"`
- working directory: `Project root`

When saving a file a version is output in the build path with the static html.
It's done this way so I can easily create reusable elements like footers and headers.