## Step 1: Relase the Rust & Javascript/TS code

### Release
```sh
npm run build:wasm:release // release rust code
npm install // create javascript file and install all npm dependencies
```

## Step 2: Claude Desktop Configuration

Create a configuration file at:

```json
{
  "mcpServers": {
    "mcp-server": {
      "command": "node",
      "args": [
        "[your local path]/mcpserver/build/index.js"
      ]
    }
  }
}
```

locations:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
(source: https://modelcontextprotocol.info/docs/quickstart/user/#2-add-the-filesystem-mcp-server)

## Step 3: Start Claude Desktop

TODO

## Misc

### test the rust code

```sh
npm run test:rust
```

or

```sh
cd src/lib/rust-functions-lib
cargo test && cargo fmt --all -- --check
```

### clean the output files and folders

```sh
npm run clean
```

### Build the rust code - alternatives

npm
```sh
npm run build:wasm

```

Alternative approach using wasm tool
```sh
cd src/lib/rust-functions-lib
wasm-pack build --target bundler
```

### Build only ts code (npm)

```sh
npm build
```

### Copy build Rust code
manual copy to the correct location - included in `npm run build:wasm:release`

```sh
mkdir -p build/lib/rust-functions-lib/pkg && cp src/lib/rust-functions-lib/pkg/rust_funcations_lib.js build/lib/rust-functions-lib/pkg/rust_funcations_lib.js
```