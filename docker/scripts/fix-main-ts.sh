#!/usr/bin/env bash
set -eux

mf=app/main.ts
if [ -f "$mf" ] && ! grep -q "enableProdMode" "$mf"; then
  tmp="$mf.tmp"
  printf "import { enableProdMode } from '@angular/core';\n" > "$tmp"
  printf "enableProdMode();\n" >> "$tmp"
  cat "$mf" >> "$tmp"
  mv "$tmp" "$mf"
fi

if [ -f "$mf" ] && grep -q "app.module.ngfactory" "$mf"; then
  cat > "$mf" <<'TS'
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
TS
fi
