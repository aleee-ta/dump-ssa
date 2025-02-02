# dump-ssa README

This is README for dump-ssa VSCode extension for Noir.

## Features

# Process SSA Hovers
- Command `dump-ssa.processSSAHovers` adds parsed hovers on your source code file. Already works with main.nr.
- Command `dump-ssa.removeSSAHovers` removes hovers.
- Command `dump-ssa.showSSA` shows choosed SSA in right window.
- Command `dump-ssa.updateReadonlySettings` changes access mod for SSA log files to read-only.
- Command `dump-ssa.getSSADiff` shows diff for 2 SSA versions.
- Command `dump-ssa.flushSSALogs` flush all logs in target dir.
- Command `dump-ssa.compileWithSSA` compile program with dump SSA.

## Requirements

IDK

## Extension Settings



## Known Issues

dump-ssa in the early stages of development, the number of bugs can reach one million.

## Release Notes

### 0.0.1

Initial MVP release of dump-ssa

### 0.0.2

Add compileWithSSA & flushSSALogs

