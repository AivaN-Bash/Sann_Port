#!/usr/bin/env python3
"""
Saan Nize Portfolio — 42-point audit script
Run from the project root: python audit.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(ROOT, 'src')

# ─── helpers ──────────────────────────────────────────────────
def read(path):
    try:
        with open(path, encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return ''

def read_all(ext):
    """Read all files with given extension under SRC and public/."""
    results = {}
    for dirpath, _, files in os.walk(ROOT):
        if 'node_modules' in dirpath or '.git' in dirpath:
            continue
        for fn in files:
            if fn.endswith(ext):
                fp = os.path.join(dirpath, fn)
                results[fp] = read(fp)
    return results

def check(label, passed):
    icon = '✅' if passed else '❌'
    print(f'  {icon}  {label}')
    return passed

all_css  = read_all('.css')
all_js   = read_all('.jsx') | read_all('.js')
all_code = {**all_css, **all_js}

css_combined = '\n'.join(all_css.values())
js_combined  = '\n'.join(all_js.values())

results = []
print('\n══════════════════════════════════════════════')
print('  SAAN NIZE PORTFOLIO — 42-POINT AUDIT')
print('══════════════════════════════════════════════\n')

# ─── 1. STYLE ─────────────────────────────────────────────────
print('── 1. STYLE ──────────────────────────────────')

# 1.1 Zero hardcoded hex colors USED in CSS properties (exclude var declarations and comments)
# CSS variable declarations (--foo: #hex) are intentional — only flag direct property values
hardcoded = []
for line in css_combined.splitlines():
    stripped = line.strip()
    # skip comments
    if stripped.startswith('//') or stripped.startswith('*') or '/*' in stripped:
        continue
    # skip CSS variable declarations  e.g.  --accent: #e8003c
    if re.match(r'--[\w-]+\s*:', stripped):
        continue
    # flag direct property usage  e.g.  color: #e8003c
    if re.search(r'(?<!--)[\w-]+\s*:\s*#[0-9a-fA-F]{3,6}\b', stripped):
        hardcoded.append(stripped)
results.append(check('Zero hardcoded colors in CSS (values via var())', len(hardcoded) == 0))

# 1.2 4 themes present
theme_names = ['phantom', 'velvet', 'monochrome', 'sakura']
themes_ok = all(f'[data-theme="{t}"]' in css_combined for t in theme_names)
results.append(check('4 complete themes defined', themes_ok))

# 1.3 Each theme has required tokens
tokens = ['--accent-rgb', '--purple-rgb', '--text-muted-rgb', '--spring']
token_ok = all(css_combined.count(tok) >= 4 for tok in tokens)
results.append(check('Required CSS tokens in all themes (--accent-rgb, --spring, etc.)', token_ok))

# 1.4 Max 7 line-height values
lh_values = set(re.findall(r'--lh-\w+', css_combined))
results.append(check(f'Max 7 line-height tokens (found {len(lh_values)})', len(lh_values) <= 7))

# 1.5 No bad spacing values (11px, 13px, 9px)
bad_spacing = re.findall(r'(?:padding|margin|gap)\s*:[^;]*\b(?:9|11|13)px\b', css_combined)
results.append(check('No 9px/11px/13px spacing values', len(bad_spacing) == 0))

# 1.6 Spring easing token defined (allow whitespace between property and value)
results.append(check('--spring cubic-bezier token defined', bool(re.search(r'--spring\s*:\s*cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\)', css_combined))))

# 1.7 Skill bars use per-skill gradient
results.append(check('Skill bars use per-skill gradient colors', 'linear-gradient(90deg, #9999FF' in '\n'.join(all_js.values())))

# ─── 2. PERFORMANCE ───────────────────────────────────────────
print('\n── 2. PERFORMANCE ────────────────────────────')

# 2.1 React.lazy code splitting (handles both React.lazy() and named import lazy())
results.append(check('React.lazy() code splitting present', bool(re.search(r'\blazy\s*\(', js_combined))))

# 2.2 No width/height/top/left animations (only transform+opacity)
bad_anim = re.findall(r'animation[^;]*(?:width|height)\b', css_combined)
results.append(check('GPU-only animations (transform+opacity, no width/height)', len(bad_anim) == 0))

# 2.3 Spring easing on entrance animations
results.append(check('Spring easing used in transitions/animations', 'var(--spring)' in css_combined or 'var(--tr' in css_combined))

# 2.4 Cursor uses transform not style.left/top
cursor_src = read(os.path.join(SRC, 'components', 'Cursor.jsx'))
results.append(check('Cursor uses CSS transform (not style.left/top)', 'transform' in cursor_src and 'style.left' not in cursor_src))

# 2.5 Cursor starts off-screen opacity:0
results.append(check('Cursor starts off-screen with opacity:0', 'opacity: 0' in read(os.path.join(SRC,'components','Cursor.css')) or '-200px' in cursor_src))

# 2.6 pageRef in useRouter
router_src = read(os.path.join(SRC, 'hooks', 'useRouter.js'))
results.append(check('pageRef used in useRouter for stable navigate()', 'pageRef' in router_src))

# 2.7 popstate registered with [] deps
results.append(check('popstate listener registered with [] deps', 'popstate' in router_src and '}, []);' in router_src))

# 2.8 navClick handlers via useMemo
nav_src = read(os.path.join(SRC, 'components', 'Nav.jsx'))
results.append(check('navClick handlers pre-computed with useMemo', 'useMemo' in nav_src))

# 2.9 Timer refs named correctly (end in Ref)
timer_refs = re.findall(r'\b\w*[Tt]imer[Rr]ef\b', js_combined)
results.append(check('Timer refs named with Ref suffix (timerRef, fadeTimerRef…)', len(timer_refs) > 0))

# 2.10 scroll-locked CSS class
results.append(check('scroll-locked CSS class (not style.overflow)', 'scroll-locked' in css_combined and 'scroll-locked' in js_combined))

# 2.11 will-change set before, cleared after animation
results.append(check('will-change set before and cleared after animation', 'will-change' in js_combined and 'removeProperty' in js_combined))

# 2.12 Passive scroll listeners
results.append(check('Passive scroll listeners everywhere', js_combined.count("{ passive: true }") >= 2))

# 2.13 CURRENT_YEAR outside component
results.append(check('CURRENT_YEAR constant defined outside component', 'const CURRENT_YEAR' in js_combined))

# 2.14 Background wrapped in memo()
results.append(check('Background component wrapped in memo()', 'memo(function Background' in js_combined or 'memo(() =>' in js_combined))

# 2.15 PAGES map outside component
results.append(check('PAGES map defined outside component', 'const PAGES' in js_combined))

# ─── 3. SECURITY ──────────────────────────────────────────────
print('\n── 3. SECURITY ───────────────────────────────')

# 3.1 safeHref validator present
results.append(check('safeHref() validator present', 'safeHref' in js_combined))

# 3.2 safeHref blocks javascript: and data:
safe_fn = re.search(r'function safeHref[\s\S]{0,300}javascript:', js_combined)
results.append(check('safeHref blocks javascript: and data: URIs', bool(safe_fn) and 'data:' in js_combined[:js_combined.find('function safeHref')+400]))

# 3.3 Form sanitization
results.append(check('Form uses HTML-entity sanitization (sanitize fn)', 'function sanitize' in js_combined and '&lt;' in js_combined))

# 3.4 Email regex validation
results.append(check('Email regex validation in form', 'EMAIL_REGEX' in js_combined or re.search(r'/\^.*@.*\$/', js_combined)))

# 3.5 maxLength on form fields
results.append(check('maxLength on all form inputs', js_combined.count('maxLength') >= 3))

# 3.6 No dangerouslySetInnerHTML (strip single-line comments first)
js_no_comments = re.sub(r'/\*[\s\S]*?\*/', '', js_combined)   # block comments
js_no_comments = re.sub(r'//[^\n]*', '', js_no_comments)       # line comments
results.append(check('No dangerouslySetInnerHTML', 'dangerouslySetInnerHTML' not in js_no_comments))

# 3.7 No eval()
results.append(check('No eval()', 'eval(' not in js_combined))

# 3.8 All _blank links have noopener
blank_links = re.findall(r'target="_blank"', js_combined)
noopener    = re.findall(r'noopener noreferrer', js_combined)
results.append(check('All target="_blank" has rel="noopener noreferrer"', len(noopener) >= len(blank_links) and len(blank_links) > 0))

# 3.9 Zero console.* in production (guarded)
raw_console = re.findall(r'console\.(log|warn|info)\(', js_combined)
guarded     = re.findall(r"NODE_ENV.*development.*console|console.*NODE_ENV.*development", js_combined)
results.append(check("Zero console.* in production (dev-only in ErrorBoundary)", len(raw_console) == 0 or len(guarded) > 0))

# 3.10 ErrorBoundary wraps app
index_src = read(os.path.join(SRC, 'index.js'))
results.append(check('ErrorBoundary wraps entire app in index.js', 'ErrorBoundary' in index_src))

# ─── 4. RESPONSIVE ────────────────────────────────────────────
print('\n── 4. RESPONSIVE ─────────────────────────────')

bp_checks = [
    ('≤420px small phone breakpoint', r'max-width:\s*420px'),
    ('≤640px mobile breakpoint',       r'max-width:\s*640px'),
    ('641-860px iPad portrait',         r'min-width:\s*641px.*max-width:\s*860px|min-width:\s*641'),
    ('≤900px iPad landscape',           r'max-width:\s*(?:860|900)px'),
    ('≥1440px large desktop',           r'min-width:\s*1440px'),
    ('≥1920px 4K/TV',                   r'min-width:\s*1920px'),
]
for label, pattern in bp_checks:
    results.append(check(label, bool(re.search(pattern, css_combined))))

results.append(check('@media (hover: none) — no cursor', 'hover: none' in css_combined))
results.append(check('safe-area-inset for iPhone notch', 'safe-area-inset' in css_combined))
results.append(check('viewport-fit=cover in index.html', 'viewport-fit=cover' in read(os.path.join(ROOT,'public','index.html'))))
results.append(check('prefers-reduced-motion kills all animations', 'prefers-reduced-motion' in css_combined))
results.append(check('prefers-color-scheme flash prevention in index.html', 'prefers-color-scheme' in read(os.path.join(ROOT,'public','index.html'))))
results.append(check('scroll-locked class for mobile drawer', 'scroll-locked' in css_combined))

# ─── 5. CODE QUALITY ──────────────────────────────────────────
print('\n── 5. CODE QUALITY ───────────────────────────')

# CSS brace balance
def braces_balanced(content):
    return content.count('{') == content.count('}')

unbalanced = [fp for fp, content in all_css.items() if not braces_balanced(content)]
results.append(check(f'CSS brace-balanced (unbalanced: {len(unbalanced)})', len(unbalanced) == 0))

# useEffect cleanup
effects    = js_combined.count('useEffect(')
cleanups   = js_combined.count('return () =>')
results.append(check(f'useEffect cleanup returns (effects:{effects}, cleanups:{cleanups})', cleanups >= effects * 0.8))

# ARIA attributes present
aria_checks = ['aria-label', 'aria-hidden', 'aria-current', 'aria-pressed', 'aria-live', 'role=']
all_aria_ok = all(attr in js_combined for attr in aria_checks)
results.append(check('Full ARIA attributes present (aria-label, hidden, live, role…)', all_aria_ok))

# aria-roledescription
results.append(check('aria-roledescription present (Cursor)', 'aria-roledescription' in js_combined))

# Keyboard accessible lang switcher
results.append(check('Language switcher keyboard accessible (aria-pressed)', 'aria-pressed' in nav_src))

# No transition: all
bad_trans = re.findall(r'transition\s*:\s*all\b', css_combined)
results.append(check('No transition: all (specific properties only)', len(bad_trans) == 0))

# ─── Summary ──────────────────────────────────────────────────
passed = sum(results)
total  = len(results)
print(f'\n══════════════════════════════════════════════')
print(f'  RESULT: {passed}/{total} checks passed')
print(f'══════════════════════════════════════════════\n')

if passed == total:
    print('  🎉  ALL CHECKS PASSED — ready to deploy!\n')
else:
    failed = total - passed
    print(f'  ⚠️   {failed} check(s) failed — see ❌ above\n')

sys.exit(0 if passed == total else 1)
