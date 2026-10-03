"""Música v2 de «La cadena».
Un vals criollo (3/4, 84 bpm) con un tema de ocho compases en re menor que pasa a re mayor
cuando llega Eloy. Cada escena suma o quita instrumentos; el árbol final los junta a todos.
Lee linea-de-tiempo.json (la genera el propio video), así que la música sigue a las escenas."""
import json, wave, sys
import numpy as np
from scipy import signal

SR = 44100
TL = json.load(open('linea-de-tiempo.json'))
DUR = TL['dur'] + 0.6
N = int(SR * DUR)
BPM = 84.0
BEAT = 60.0 / BPM
BAR = 3 * BEAT
rs = np.random.RandomState(11)

def hz(m): return 440.0 * 2 ** ((m - 69) / 12.0)

# ───────────── buses ─────────────
BUS = ['guit', 'piano', 'cello', 'pad', 'celesta', 'marimba', 'bass', 'perc', 'sea']
bus = {k: np.zeros((2, N)) for k in BUS}
RV = {'guit': .22, 'piano': .30, 'cello': .30, 'pad': .45, 'celesta': .55, 'marimba': .18, 'bass': .0, 'perc': .10, 'sea': .2}

def put(name, sig, t0, pan=0.0, g=1.0):
    i = int(t0 * SR)
    if i >= N or i + len(sig) <= 0: return
    if i < 0: sig = sig[-i:]; i = 0
    n = min(len(sig), N - i)
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    bus[name][0, i:i + n] += sig[:n] * g * l
    bus[name][1, i:i + n] += sig[:n] * g * r

# ───────────── filtros (RBJ) ─────────────
def biquad(kind, f0, q=0.707, gain_db=0.0):
    w0 = 2 * np.pi * f0 / SR; a = np.sin(w0) / (2 * q); A = 10 ** (gain_db / 40)
    c = np.cos(w0)
    if kind == 'lp': b = [(1 - c) / 2, 1 - c, (1 - c) / 2]; aa = [1 + a, -2 * c, 1 - a]
    elif kind == 'hp': b = [(1 + c) / 2, -(1 + c), (1 + c) / 2]; aa = [1 + a, -2 * c, 1 - a]
    elif kind == 'peak': b = [1 + a * A, -2 * c, 1 - a * A]; aa = [1 + a / A, -2 * c, 1 - a / A]
    elif kind == 'hshelf':
        s = 2 * np.sqrt(A) * a
        b = [A * ((A + 1) + (A - 1) * c + s), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - s)]
        aa = [(A + 1) - (A - 1) * c + s, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - s]
    b = np.array(b) / aa[0]; aa = np.array(aa) / aa[0]
    return b, aa
def filt(x, *fl):
    for kind, f0, q, g in fl:
        b, a = biquad(kind, f0, q, g); x = signal.lfilter(b, a, x, axis=-1)
    return x

# ───────────── instrumentos (síntesis aditiva, todo vectorizado) ─────────────
def env_ad(n, a, rel=0.05):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na) ** 1.5
    nr = max(1, int(rel * SR)); e[-nr:] *= np.linspace(1, 0, nr)
    return e

def guitar(m, dur=2.6, vel=0.8):
    n = int(SR * dur); t = np.arange(n) / SR; f = hz(m); y = np.zeros(n)
    tau0 = 1.9 - (m - 40) * 0.012
    for k in range(1, 15):
        fk = f * k * np.sqrt(1 + 0.00008 * k * k)
        if fk > 7500: break
        amp = abs(np.sin(np.pi * k * 0.17)) / k ** 1.05 * (vel ** (0.35 * (k - 1)))
        y += amp * np.sin(2 * np.pi * fk * t + rs.rand() * 6.28) * np.exp(-t / (tau0 / (1 + 0.5 * (k - 1))))
    nz = rs.uniform(-1, 1, int(.012 * SR)); nz = signal.lfilter(*signal.butter(2, 2200 / (SR / 2)), nz)
    y[:len(nz)] += nz * 0.12 * vel * np.exp(-np.arange(len(nz)) / (.004 * SR))
    return y * env_ad(n, 0.002, 0.08) * 0.34

def piano(m, dur=3.0, vel=0.7):
    n = int(SR * dur); t = np.arange(n) / SR; f = hz(m); y = np.zeros(n)
    tau0 = max(0.9, 3.4 - (m - 40) * 0.035); B = 0.00022 * (m / 60.0) ** 2
    for k in range(1, 12):
        fk = f * k * np.sqrt(1 + B * k * k)
        if fk > 9000: break
        amp = (1.0 / k ** 0.95) * (vel ** (0.4 * (k - 1)))
        y += amp * np.sin(2 * np.pi * fk * t + rs.rand() * 6.28) * np.exp(-t / (tau0 / (1 + 0.65 * (k - 1))))
    # fuerte decaimiento inicial más lento (doble pendiente)
    y *= (0.65 * np.exp(-t / 0.28) + 0.35 + 0.0) * 1.0 + 0.0
    h = rs.uniform(-1, 1, int(.008 * SR)); h = signal.lfilter(*signal.butter(2, [200 / (SR / 2), 2500 / (SR / 2)], 'band'), h)
    y[:len(h)] += h * 0.5 * vel * np.exp(-np.arange(len(h)) / (.003 * SR))
    return y * env_ad(n, 0.003, 0.2) * 0.30

def strings(m, dur, vel=0.7, voices=3, atk=0.18, rel=0.5, bright=6.0, vib=0.0045):
    n = int(SR * dur); t = np.arange(n) / SR; y = np.zeros(n)
    ramp = np.minimum(1, t / 0.7)
    for v in range(voices):
        f = hz(m) * 2 ** ((v - (voices - 1) / 2) * 0.0035 / 1.0)
        vphase = 2 * np.pi * 5.2 * t + rs.rand() * 6.28
        ph = 2 * np.pi * f * (t + vib * ramp * (1 - np.cos(vphase)) / (2 * np.pi * 5.2))
        for k in range(1, 16):
            if f * k > 6500: break
            y += np.sin(k * ph + rs.rand() * 6.28) / k * np.exp(-k / bright)
    y /= voices
    return y * env_ad(n, atk, rel) * vel * 0.16

def padv(ms, dur, vel=0.6):
    return sum(strings(m, dur, vel, voices=2, atk=min(1.4, dur * .35), rel=min(1.6, dur * .4), bright=3.0, vib=0.002) for m in ms) / max(1, len(ms)) * 2.2

def bell(m, dur=3.0, vel=0.6, kind='celesta'):
    n = int(SR * dur); t = np.arange(n) / SR; f = hz(m)
    parts = [(1, 1.0, 1.0), (3.0, .35, .5), (5.2, .15, .3), (7.6, .08, .2)] if kind == 'celesta' else [(1, 1.0, 1.4), (2.76, .45, .9), (5.4, .22, .5), (8.9, .1, .3)]
    y = sum(a * np.sin(2 * np.pi * f * r * t + rs.rand() * 6.28) * np.exp(-t / (d * (dur / 3.0) * 1.1)) for r, a, d in parts)
    return y * env_ad(n, 0.002, 0.1) * vel * 0.34

def marimba(m, dur=0.7, vel=0.6):
    n = int(SR * dur); t = np.arange(n) / SR; f = hz(m)
    y = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 4 * t + .3)) * np.exp(-t / 0.22)
    return y * env_ad(n, 0.001, 0.05) * vel * 0.42

def bass(m, dur=1.5, vel=0.7):
    n = int(SR * dur); t = np.arange(n) / SR; f = hz(m)
    y = (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 2 * t) + 0.12 * np.sin(2 * np.pi * f * 3 * t)) * np.exp(-t / 0.7)
    return y * env_ad(n, 0.004, 0.1) * vel * 0.5

def bombo(vel=0.6):
    n = int(SR * 0.5); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(50 + 60 * np.exp(-t * 18)) / SR
    y = np.sin(ph) * np.exp(-t / 0.14)
    c = signal.lfilter(*signal.butter(2, 1200 / (SR / 2)), rs.uniform(-1, 1, n)) * np.exp(-t / 0.01) * 0.3
    return (y + c) * vel * 0.55

def brush(vel=0.5, dur=0.16):
    n = int(SR * dur); t = np.arange(n) / SR
    x = signal.lfilter(*signal.butter(2, [2500 / (SR / 2), 9000 / (SR / 2)], 'band'), rs.uniform(-1, 1, n))
    return x * np.minimum(1, t / 0.012) * np.exp(-t / 0.05) * vel * 0.4

def swish(dur=0.6, vel=0.5):
    n = int(SR * dur); t = np.arange(n) / SR; x = rs.uniform(-1, 1, n)
    y = np.zeros(n); seg = 24
    for i in range(seg):
        a, b = int(i / seg * n), int((i + 1) / seg * n)
        fc = 1200 + 3800 * (i / seg)
        y[a:b] = signal.lfilter(*signal.butter(2, [fc * .7 / (SR / 2), min(.95, fc * 1.3 / (SR / 2))], 'band'), x[a:b])
    return y * np.sin(np.pi * t / dur) ** 2 * vel * 0.5

def sea(dur, vel=0.4):
    n = int(SR * dur); x = signal.lfilter(*signal.butter(2, 500 / (SR / 2)), rs.uniform(-1, 1, n))
    t = np.arange(n) / SR; lfo = 0.55 + 0.45 * np.sin(2 * np.pi * t / 7.0 + 1.0)
    return x * lfo * vel * 1.4

# ───────────── armonía y tema ─────────────
CH = {  # bajo, notas medias del arpegio, notas del colchón
 'Dm': (38, [50, 53, 57], [50, 57, 62, 65]), 'Gm': (43, [50, 55, 58], [43, 50, 55, 58, 62]),
 'A7': (45, [49, 52, 55], [45, 52, 55, 61]), 'Bb': (46, [50, 53, 58], [46, 53, 58, 62]),
 'D': (38, [50, 54, 57], [50, 54, 57, 62]), 'G': (43, [50, 55, 59], [43, 50, 55, 59]),
}
PROG_M = ['Dm', 'Gm', 'A7', 'Dm', 'Dm', 'Gm', 'A7', 'Dm']
PROG_D = ['D', 'G', 'A7', 'D', 'D', 'G', 'A7', 'D']
THEME = [(74, 0, 2), (77, 2, 1), (76, 3, 2), (74, 5, 1), (72, 6, 1.5), (74, 7.5, .5), (76, 8, 1), (69, 9, 3),
         (74, 12, 2), (77, 14, 1), (81, 15, 2), (79, 17, 1), (77, 18, 1.5), (76, 19.5, .5), (74, 20, 1), (74, 21, 3)]
def theme_pitch(m, major):
    # do sostenido siempre (sobre La7); fa sostenido en mayor
    if not major: return {72: 73}.get(m, m)
    return {77: 78, 72: 73}.get(m, m)

SC = {s['id']: s for s in TL['scenes']}
T_MAJOR = SC['eloy-nace']['a'] - 0.2
def is_major(t): return t >= T_MAJOR
def scene_at(t):
    for s in TL['scenes']:
        if s['a'] <= t < s['b']: return s
    return TL['scenes'][-1]

# qué toca cada escena (ganancias; 0 = no suena)
ROLE = {
 'linea-apertura':  dict(pad=.5, pmel=.75),
 'miguel-mar':      dict(guit=.8, cello=.55, pad=.45, sea=.5),
 'miguel-campo':    dict(guit=.8, pmel=.45, cel=.3, pad=.4),
 'escritura':       dict(guit=.85, cello=.3, pad=.45),
 'felipe-plaza':    dict(guit=.75, cmel=.7, brush=.5, pad=.4),
 'felipe-papeles':  dict(guit=.75, cello=.6, pad=.5),
 'sandalio-flores': dict(pmel=.8, guit=.55, pad=.6, cel=.25),
 'delmiro':         dict(cel_mel=.5, guit=.3, cello=.4, pad=.6),
 'ruta-villa-colon':dict(guit=.8, pmel=.5, pad=.4, bass=.4),
 'eloy-nace':       dict(guit=.8, pmel=.7, pad=.55),
 'eloy-chofer':     dict(guit=.8, bass=.55, brush=.55, pmel=.5),
 'eloy-mosaicos':   dict(marimba=.8, guit=.55, bass=.5, brush=.5),
 'eloy-ciclista':   dict(guit8=.8, pmel=.6, brush=.7, bass=.55, bombo=.3),
 'eloy-boda':       dict(strings=.8, pmel=.8, cel=.5, guit=.5),
 'eloy-sotano':     dict(guit=.8, bass=.6, brush=.5, bombo=.4, pad=.5),
 'eloy-final':      dict(pmel=.7, pad=.55),
 'arbol':           dict(),   # se arma por capas más abajo
}
def jit(): return rs.uniform(-.012, .012)
def vj(v): return float(np.clip(v * rs.uniform(.9, 1.08), .2, 1.0))

nbars = int(DUR / BAR) + 2
LINKN = [62, 65, 67, 69, 72, 74, 77, 81]   # el motivo de la cadena sube un grado por eslabón

def theme_notes(bar_idx):
    b0 = (bar_idx % 8) * 3
    return [(m, st - b0, d) for (m, st, d) in THEME if b0 <= st < b0 + 3]

arbol = SC['arbol']; NODE_T = [arbol['a'] + 1.0 + i * 1.25 for i in range(8)]
title_t = arbol['caps'][0]['b'] + 0.3

for bi in range(nbars):
    t0 = bi * BAR
    if t0 >= DUR: break
    s = scene_at(t0 + 0.05); role = dict(ROLE.get(s['id'], {}))
    major = is_major(t0)
    prog = PROG_D if major else PROG_M
    ch = prog[bi % 8]; bs, mids, padn = CH[ch]
    local = t0 - s['a']
    if s['id'] == 'arbol':     # capas progresivas
        k = sum(1 for tn in NODE_T if t0 + 0.05 >= tn)
        role = {}
        if k >= 1: role.update(guit=.7, pad=.5)
        if k >= 2: role.update(bass=.5)
        if k >= 3: role.update(cello=.6)
        if k >= 4: role.update(pmel=.75)
        if k >= 5: role.update(strings=.7, cel=.4)
        if k >= 6: role.update(brush=.5)
        if k >= 8: role.update(bombo=.3)
        if t0 >= title_t - 0.3: role.update(strings=.9, pmel=.9, cel=.6, guit=.8, cello=.7)
    scale = 1.0
    if s['id'] == 'eloy-final': scale = 0.9
    # pad y cuerdas largas
    if role.get('pad'): put('pad', padv(padn, BAR + .9, .6), t0 - .15, 0, role['pad'])
    if role.get('strings'): put('cello', padv([p + 12 for p in padn[1:]], BAR + .8, .7), t0 - .1, 0, role['strings'])
    if role.get('cello'): put('cello', strings(bs + 12, BAR - .1, .7), t0, -.25, role['cello'])
    # guitarra: vals (bajo en 1; acorde en 2 y 3)
    if role.get('guit'):
        g = role['guit'] * scale
        put('guit', guitar(bs, 2.4, vj(.85)), t0 + jit(), -.15, g)
        for b in (1, 2):
            for i, m in enumerate(mids):
                put('guit', guitar(m + 12 * (1 if i == 2 else 0), 1.4, vj(.55)), t0 + b * BEAT + i * .018 + jit(), -.1 + i * .08, g * .8)
    if role.get('guit8'):   # arpegio en corcheas (ciclista)
        g = role['guit8']
        put('guit', guitar(bs, 2.0, vj(.85)), t0 + jit(), -.15, g)
        seq = [mids[0] + 12, mids[1] + 12, mids[2] + 12, mids[1] + 12, mids[0] + 12]
        for i, m in enumerate(seq):
            put('guit', guitar(m, 1.0, vj(.5)), t0 + BEAT + i * BEAT / 2 + jit(), -.1, g * .75)
    if role.get('bass'):
        put('bass', bass(bs, 1.4, vj(.8)), t0 + jit(), 0, role['bass'])
        if ch != 'A7': put('bass', bass(bs + 7, .8, vj(.6)), t0 + 2 * BEAT, 0, role['bass'] * .6)
    if role.get('marimba'):
        pat = [mids[0] + 12, mids[1] + 12, mids[2] + 12, mids[1] + 12, mids[2] + 12, mids[1] + 12]
        for i, m in enumerate(pat): put('marimba', marimba(m, .6, vj(.6)), t0 + i * BEAT / 2 + jit(), (-1) ** i * .25, role['marimba'])
    # percusión suave: bombo en 1, escobilla en 2 y 3
    if role.get('bombo'): put('perc', bombo(vj(.6)), t0, 0, role['bombo'])
    if role.get('brush'):
        for b in (1, 2): put('perc', brush(vj(.5)), t0 + b * BEAT + jit(), .2, role['brush'])
    # tema: cada instrumento melódico toca los compases del tema
    for (m, st, d) in theme_notes(bi):
        mm = theme_pitch(m, major); tt = t0 + st * BEAT
        if role.get('pmel'): put('piano', piano(mm, 3.2, vj(.75)), tt + jit(), .1, role['pmel'] * scale)
        if role.get('cmel'): put('cello', strings(mm - 12, d * BEAT + .3, .8, voices=2, atk=.08, rel=.3), tt, -.1, role['cmel'])
        if role.get('cel_mel'): put('celesta', bell(mm + 12, 3.0, vj(.6)), tt + jit(), .25, role['cel_mel'])
        if role.get('cel') and (st in (0, 6, 12, 18)): put('celesta', bell(mm + 12, 2.5, vj(.5)), tt, .3, role['cel'])

# ───────────── motivo de la cadena y paso de página ─────────────
prev_link = -1
for s in TL['scenes']:
    if s['link'] != prev_link and s['link'] >= 0 and s['link'] <= 4:
        i = s['link']
        for k, m in enumerate([LINKN[i], LINKN[i] + 7, LINKN[i] + 12]):
            put('celesta', bell(m, 3.0, .7), s['a'] + .4 + k * .13, (-1) ** k * .3, .8)
    prev_link = s['link']
    if s['a'] > 0: put('perc', swish(.6, .55), s['a'] - .05, 0, .8)
# el árbol: una campanada por eslabón y el cierre
for i, tn in enumerate(NODE_T):
    put('celesta', bell(LINKN[i], 3.2, .75), tn + .6, (-1) ** i * .3, .9)
    put('celesta', bell(LINKN[i] + 12, 3.0, .5), tn + .75, (-1) ** i * -.3, .6)
# cierre: acorde de re mayor sostenido con campanas
tt = title_t
for m in (50, 57, 62, 66, 69, 74):
    put('cello', strings(m, 8.5, .8, voices=3, atk=.6, rel=3.0), tt - .2, 0, .8)
for k, m in enumerate((86, 78, 74, 69, 62)):
    put('celesta', bell(m, 7.0, .65, 'bell'), tt + .2 + k * .35, (k % 3 - 1) * .4, .8)
put('piano', piano(62, 9.0, .8), tt, 0, .8); put('piano', piano(74, 9.0, .7), tt + .02, 0, .6); put('piano', piano(50, 9.0, .8), tt, 0, .7)

# ───────────── eq por instrumento y reverb ─────────────
EQ = {
 'guit': [('hp', 70, .7, 0), ('peak', 110, 1.2, 3.0), ('peak', 230, 1.0, 2.0), ('peak', 3200, 1.0, 1.5), ('lp', 7500, .7, 0)],
 'piano': [('hp', 50, .7, 0), ('peak', 300, 1.0, -1.5), ('hshelf', 5000, .7, 1.5), ('lp', 11000, .7, 0)],
 'cello': [('hp', 60, .7, 0), ('peak', 200, 1.0, 2.0), ('lp', 4500, .7, 0)],
 'pad': [('hp', 90, .7, 0), ('lp', 3800, .7, 0)],
 'celesta': [('hp', 300, .7, 0), ('lp', 9000, .7, 0)],
 'marimba': [('hp', 100, .7, 0), ('lp', 6000, .7, 0)],
 'bass': [('hp', 35, .7, 0), ('peak', 90, 1.0, 2.0), ('lp', 900, .7, 0)],
 'perc': [('hp', 30, .7, 0)], 'sea': [('lp', 1200, .7, 0)],
}
LEVEL = {'guit': 1.0, 'piano': 1.0, 'cello': .95, 'pad': .8, 'celesta': .85, 'marimba': .9, 'bass': .9, 'perc': .75, 'sea': .6}
dry = np.zeros((2, N)); rv_in = np.zeros((2, N))
for k in BUS:
    x = filt(bus[k], *EQ[k]) * LEVEL[k]
    dry += x; rv_in += x * RV[k]
# respuesta de sala: 2,3 s, ligeramente oscura, estéreo decorrelacionado
irn = int(2.3 * SR); tir = np.arange(irn) / SR
IR = np.stack([rs.randn(irn) * np.exp(-tir / 0.55) for _ in range(2)])
IR = filt(IR, ('lp', 5200, .7, 0), ('hp', 160, .7, 0))
for i, d in enumerate((.011, .019, .027, .041)):
    k = int(d * SR); IR[0, k] += .9 / (i + 1); IR[1, k + 17] += .9 / (i + 1)
IR /= np.sqrt((IR ** 2).sum(axis=1, keepdims=True)) / 4.5
wet = np.stack([signal.fftconvolve(rv_in[c], IR[c])[:N] for c in range(2)])
mix = dry + wet * 0.55

# ───────────── masterización: nivel parejo por escena, compresión suave, límite ─────────────
mix = filt(mix, ('hp', 32, .7, 0))
# curva de ganancia por escena (acerca cada escena a un nivel objetivo, con carácter propio)
OFFS = {'linea-apertura': -4.0, 'miguel-mar': -1.0, 'delmiro': -3.5, 'ruta-villa-colon': -1.5, 'eloy-nace': -1.0, 'eloy-boda': 1.5, 'eloy-sotano': 0.0, 'eloy-final': -4.0, 'arbol': 2.5}
rms_s = []
for s in TL['scenes']:
    a, b = int(s['a'] * SR), min(N, int(s['b'] * SR)); seg_ = mix[:, a:b]
    rms_s.append(np.sqrt(np.mean(seg_ ** 2)) + 1e-9)
target = np.median(rms_s)
gain = np.ones(N); pts_t = [0.0]; pts_g = [1.0]
for s, r in zip(TL['scenes'], rms_s):
    g = np.clip((target * 10 ** (OFFS.get(s['id'], 0) / 20)) / r, 10 ** (-3 / 20), 10 ** (4 / 20))
    pts_t += [s['a'] + .8, s['b'] - .8]; pts_g += [g, g]
pts_t.append(DUR); pts_g.append(pts_g[-1])
gain = np.interp(np.arange(N) / SR, pts_t, pts_g)
mix = mix * gain
# compresor suave (tanh) y normalización
mix = np.tanh(mix * 1.3 / (np.percentile(np.abs(mix), 99.5) + 1e-9))
tt_ = np.arange(N) / SR
mix *= np.minimum(1, tt_ / 1.2) * np.minimum(1, (DUR - tt_) / 3.0) ** 1.3
rms = np.sqrt(np.mean(mix ** 2)); mix *= (10 ** (-17.5 / 20)) / rms
pk = np.abs(mix).max()
if pk > 10 ** (-1.5 / 20): mix *= (10 ** (-1.5 / 20)) / pk
out = (mix.T * 32767).astype(np.int16)
w = wave.open('musica-cadena2.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
print('ok', round(DUR, 1), 's')
