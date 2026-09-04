import { writeFileSync } from 'node:fs'

export const head = (fonts, css) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap">
  <style>
    *{box-sizing:border-box}
    body{margin:0;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
    p{margin:0;text-wrap:pretty}
    h1,h2,h3{margin:0;text-wrap:balance;line-height:1.1}
${css}
  </style>
</helmet>
`
export const tail = `</x-dc>
<script data-dc-script data-props='{}'>
class Component extends DCLogic { renderVals() { return {}; } }
</script>
</body>
</html>
`
export const write = (name, body) => { writeFileSync(name, body); console.log('  ✓', name) }
