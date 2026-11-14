import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import React from 'react';
import { readFile, writeFile } from 'node:fs/promises';
import { sitePages } from './src/site.js';

const server = await createServer({ configFile: false, plugins: [react()], server: { middlewareMode: true }, appType: 'custom' });
try {
  const { AppContent } = await server.ssrLoadModule('/src/main.jsx');
  for (const path of Object.keys(sitePages)) {
    const file = path === '/' ? 'dist/index.html' : `dist${path}.html`;
    const html = await readFile(file, 'utf8');
    const markup = renderToString(React.createElement(StaticRouter, { location: path }, React.createElement(AppContent)));
    if (!html.includes('<div id="root"></div>')) throw new Error(`Missing root in ${file}`);
    await writeFile(file, html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`));
  }
} finally { await server.close(); }
