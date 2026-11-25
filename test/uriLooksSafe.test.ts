import {uriLooksSafe} from '@portabletext/toolkit'
import {describe, expect, test} from 'vitest'

describe('uriLooksSafe', () => {
  test.each([
    'javascript:alert(1)',
    'javascript:alert("no this shouldnt execute")',
    'JAVASCRIPT:alert(1)',
    'JaVaScRiPt:alert(1)',
    '  javascript:alert(1)',
    '\tjavascript:alert(1)',
    '\n\r\tjavascript:alert(1)\n',
    '\u00a0javascript:alert(1)',
    '\u0001javascript:alert(1)',
    '\u0000javascript:alert(1)',
    'java\tscript:alert(1)',
    'java\nscript:alert(1)',
    'java\rscript:alert(1)',
    '%6Aavascript:alert(1)',
    '%6aavascript:alert(1)',
    'javascript://%0Aalert(1)',
    'data:text/html;base64,PHNjcmlwdD5hbGVydCgiSGkiKTwvc2NyaXB0Pgo=',
    'DATA:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'VBScript:msgbox(1)',
    'pt://my-block',
    'arbitrary://link',
    'file:///etc/passwd',
    'ftp://example.com/file',
  ])('rejects %j', (uri) => {
    expect(uriLooksSafe(uri)).toBe(false)
  })

  test.each([
    'http://example.com',
    'https://example.com/path?x=1#frag',
    'HTTPS://EXAMPLE.COM',
    '  https://example.com  ',
    'mailto:hello@portabletext.org',
    'MAILTO:hello@portabletext.org',
    'tel:+4712345678',
    '#fragment',
    '#javascript:alert(1)',
    '/',
    '/absolute/path',
    '//example.com/protocol-relative',
    '/javascript:alert(1)',
    'relative/path',
    './relative',
    '../relative',
    'page.html',
    '',
    'https://my.site/javascript:alert("no this shouldnt execute")',
    'https://example.com?next=javascript:alert(1)',
    'site/search?query=author:espen',
    'site/search?query=javascript:alert(1)',
    'site/search#my:encoded:data',
    'javascript%3Aalert(1)',
    'javascript&colon;alert(1)',
    '&#106;avascript:alert(1)',
    'jav&#x09;ascript:alert(1)',
  ])('accepts %j', (uri) => {
    expect(uriLooksSafe(uri)).toBe(true)
  })
})
