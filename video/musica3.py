"""Música v3 de «La cadena»: instrumentos reales (muestras grabadas, vía lemo-opuscar/sampler.py).
Vals criollo (3/4, 84 bpm). Tres temas de ocho compases (A, B y B en mayor) que van pasando por
distintos instrumentos solistas según la escena; en re menor hasta Eloy y en re mayor desde su nacimiento.
Lee linea-de-tiempo.json. Requiere: LEMO=<carpeta de lemo-opuscar> con las bibliotecas vsco2ce, salamander, vcsl, freepats."""
import json, os, sys, wave
import numpy as np
from scipy import signal

LEMO = os.environ.get('LEMO', '/home/user/lemomo-ai/lemo-opuscar')
sys.path.insert(0, LEMO)
cwd = os.getcwd(); os.chdir(LEMO)
from core.audio import sampler as S
os.chdir(cwd)
S.seed(5)
SR = 48000
TL = json.load(open('linea-de-tiempo.json'))
DUR = TL['dur'] + 0.6
N = int(SR * DUR)
BPM = 84.0
BEAT = 60.0 / BPM
BAR = 3 * BEAT
rs = np.random.RandomState(11)

BUS = ['guit', 'melo', 'cello', 'pad', 'bell', 'mall', 'bass', 'perc', 'sea']
bus = {k: np.zeros((2, N)) for k in BUS}
RV = {'guit': .20, 'melo': .30, 'cello': .28, 'pad': .45, 'bell': .55, 'mall': .22, 'bass': .0, 'perc': .10, 'sea': .2}

def put(name, sig, t0, pan=0.0, g=1.0):
    i = int(t0 * SR)
    if i >= N or i + len(sig) <= 0: return
    if i < 0: sig = sig[-i:]; i = 0
    n = min(len(sig), N - i)
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    bus[name][0, i:i + n] += sig[:n] * g * l
    bus[name][1, i:i + n] += sig[:n] * g * r

def biquad(kind, f0, q=0.707, gain_db=0.0):
    w0 = 2 * np.pi * f0 / SR; a = np.sin(w0) / (2 * q); A = 10 ** (gain_db / 40); c = np.cos(w0)
    if kind == 'lp': b = [(1 - c) / 2, 1 - c, (1 - c) / 2]; aa = [1 + a, -2 * c, 1 - a]
    elif kind == 'hp': b = [(1 + c) / 2, -(1 + c), (1 + c) / 2]; aa = [1 + a, -2 * c, 1 - a]
    elif kind == 'peak': b = [1 + a * A, -2 * c, 1 - a * A]; aa = [1 + a / A, -2 * c, 1 - a / A]
    b = np.array(b) / aa[0]; aa = np.array(aa) / aa[0]
    return b, aa
def filt(x, *fl):
    for kind, f0, q, g in fl:
        b, a = biquad(kind, f0, q, g); x = signal.lfilter(b, a, x, axis=-1)
    return x

# ───────────── instrumentos reales ─────────────
_cache = {}
def note(inst, m, dur, vel, **kw):
    """nota de muestra; se guarda en caché (dos variantes por clave para no repetir idéntico)"""
    key = (inst, int(round(m)), round(dur * 4) / 4, round(vel * 8) / 8, tuple(sorted(kw.items())), rs.randint(2))
    if key not in _cache:
        _cache[key] = S.note(inst, int(round(m)), max(.15, key[2]), vel=float(vel), **kw).astype(np.float64)
    return _cache[key]

def hit(inst, vel, name=None, dur=None):
    key = ('hit', inst, name, round(vel * 8) / 8, dur, rs.randint(2))
    if key not in _cache:
        _cache[key] = S.hit(inst, name, vel=float(vel), dur=dur).astype(np.float64)
    return _cache[key]

def brush(vel=0.5, dur=0.16):      # escobilla: ruido filtrado (no hay muestra criolla)
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

# ───────────── armonía y temas ─────────────
CH = {  # bajo, notas medias del arpegio, notas del colchón
 'Dm': (38, [50, 53, 57], [50, 57, 62, 65]), 'Gm': (43, [50, 55, 58], [43, 50, 55, 58, 62]),
 'A7': (45, [49, 52, 55], [45, 52, 55, 61]), 'Bb': (46, [50, 53, 58], [46, 53, 58, 62]),
 'D': (38, [50, 54, 57], [50, 54, 57, 62]), 'G': (43, [50, 55, 59], [43, 50, 55, 59]),
 'F': (41, [48, 53, 57], [41, 48, 53, 57, 60]), 'C': (36, [48, 52, 55], [48, 52, 55, 60]),
 'A': (45, [49, 52, 57], [45, 52, 57, 61]),
}
TH = {
 'A': dict(prog=['Dm', 'Gm', 'A7', 'Dm', 'Dm', 'Gm', 'A7', 'Dm'],
           notes=[(74, 0, 2), (77, 2, 1), (76, 3, 2), (74, 5, 1), (73, 6, 1.5), (74, 7.5, .5), (76, 8, 1), (69, 9, 3),
                  (74, 12, 2), (77, 14, 1), (81, 15, 2), (79, 17, 1), (77, 18, 1.5), (76, 19.5, .5), (74, 20, 1), (74, 21, 3)]),
 'Am': dict(prog=['D', 'G', 'A7', 'D', 'D', 'G', 'A7', 'D'],
            notes=[(74, 0, 2), (78, 2, 1), (76, 3, 2), (74, 5, 1), (73, 6, 1.5), (74, 7.5, .5), (76, 8, 1), (69, 9, 3),
                   (74, 12, 2), (78, 14, 1), (81, 15, 2), (79, 17, 1), (78, 18, 1.5), (76, 19.5, .5), (74, 20, 1), (74, 21, 3)]),
 'B': dict(prog=['Dm', 'Bb', 'F', 'C', 'Dm', 'Gm', 'A7', 'Dm'],
           notes=[(69, 0, 2), (72, 2, 1), (70, 3, 2), (74, 5, 1), (72, 6, 2), (69, 8, 1), (67, 9, 2), (64, 11, 1),
                  (65, 12, 2), (69, 14, 1), (70, 15, 2), (67, 17, 1), (64, 18, 1), (73, 19, 1), (76, 20, 1), (74, 21, 3)]),
 'Bm': dict(prog=['D', 'G', 'D', 'A', 'D', 'G', 'A7', 'D'],
            notes=[(74, 0, 2), (78, 2, 1), (79, 3, 2), (74, 5, 1), (78, 6, 2), (81, 8, 1), (76, 9, 2), (73, 11, 1),
                   (78, 12, 2), (74, 14, 1), (79, 15, 2), (83, 17, 1), (81, 18, 1), (76, 19, 1), (73, 20, 1), (74, 21, 3)]),
}

SC = {s['id']: s for s in TL['scenes']}
T_MAJOR = SC['eloy-nace']['a'] - 0.2
def is_major(t): return t >= T_MAJOR
def scene_at(t):
    for s in TL['scenes']:
        if s['a'] <= t < s['b']: return s
    return TL['scenes'][-1]

# instrumento solista: (muestra, transposición en octavas, duración extra, panorama)
SOLO = {
 'piano': ('piano', 0, .2, .1), 'flute': ('flute', 0, .15, -.15), 'clarinet': ('clarinet', -12, .15, .15),
 'oboe': ('oboe', 0, .15, .1), 'violin': ('violin', 0, .25, -.1), 'cello': ('cellos', -12, .3, -.1),
 'horn': ('horn', -12, .2, .15), 'harp': ('harp', 0, 1.2, .2), 'accordion': ('accordion', -12, .1, 0),
 'glock': ('glockenspiel', 12, 1.5, .3), 'guitar': ('guitar_nylon', 0, .6, -.1),
}
# qué toca cada escena. mel=(solista, ganancia, tema)
ROLE = {
 'linea-apertura':  dict(pad=.5, mel=('piano', .8, 'A')),
 'miguel-mar':      dict(guit=.8, cello=.5, pad=.45, sea=.5, mel=('flute', .75, 'A')),
 'escritura':       dict(guit=.8, cello=.3, pad=.4, mel=('piano', .7, 'B')),
 'felipe-plaza':    dict(guit=.75, brush=.5, pad=.35, mel=('clarinet', .8, 'A')),
 'felipe-papeles':  dict(guit=.7, cello=.6, pad=.5, mel=('violin', .75, 'B')),
 'sandalio-flores': dict(guit=.5, pad=.6, mel=('harp', .9, 'B')),
 'delmiro':         dict(guit=.3, cello=.4, pad=.6, mel=('oboe', .7, 'B')),
 'ruta-villa-colon':dict(guit=.8, bass=.4, pad=.35, mel=('accordion', .6, 'A')),
 'eloy-nace':       dict(guit=.75, pad=.5, mel=('piano', .85, 'Am')),
 'eloy-ciclista':   dict(guit8=.8, brush=.7, bass=.55, bombo=.3, mel=('flute', .8, 'Am')),
 'eloy-mosaicos':   dict(mall=.8, guit=.5, bass=.5, brush=.5, mel=('clarinet', .6, 'Bm')),
 'eloy-chofer':     dict(guit=.75, bass=.55, brush=.55, mel=('accordion', .65, 'Am')),
 'eloy-boda':       dict(strings=.8, harp8=.6, guit=.4, mel=('violin', .85, 'Bm')),
 'eloy-sotano':     dict(guit=.8, bass=.6, brush=.5, bombo=.4, pad=.4, mel=('accordion', .65, 'Am')),
 'eloy-final':      dict(pad=.55, mel=('piano', .8, 'Am')),
 'puente':          dict(guit=.75, cello=.4, pad=.5, mel=('piano', .8, 'Bm')),
 'arbol':           dict(),
}
def jit(): return rs.uniform(-.012, .012)
def vj(v): return float(np.clip(v * rs.uniform(.9, 1.08), .2, 1.0))

nbars = int(DUR / BAR) + 2
LINKN = [62, 65, 67, 69, 72, 74, 77, 81]

def theme_notes(th, bar_idx):
    b0 = (bar_idx % 8) * 3
    return [(m, st - b0, d) for (m, st, d) in TH[th]['notes'] if b0 <= st < b0 + 3]

arbol = SC['arbol']
from_tree = json.load(open('linea-de-tiempo.json'))
NT = 11  # nodos del árbol: Miguel…Eloy (5), Mario, Ercilia, Pablo, Matías, Facundo y Camila, Antonia
NODE_T = [arbol['a'] + (1.0 + i * 1.25 if i <= 5 else 7.25 + (i - 5) * 1.0) for i in range(NT)]
title_t = arbol['caps'][0]['b'] + 0.3

def pad_chord(ms, dur, vel=.6, inst='violins'):
    return sum(note(inst, m, dur, vel, attack=min(1.2, dur * .3)) for m in ms) / max(1, len(ms)) * 2.0

for bi in range(nbars):
    t0 = bi * BAR
    if t0 >= DUR: break
    s = scene_at(t0 + 0.05); role = dict(ROLE.get(s['id'], {}))
    major = is_major(t0)
    th = role.get('mel', (None, 0, 'Am' if major else 'A'))[2]
    ch = TH[th]['prog'][bi % 8]; bs, mids, padn = CH[ch]
    if s['id'] == 'arbol':
        k = sum(1 for tn in NODE_T if t0 + 0.05 >= tn)
        role = {}
        if k >= 1: role.update(guit=.7, pad=.5)
        if k >= 2: role.update(bass=.5)
        if k >= 3: role.update(cello=.6)
        if k >= 4: role.update(mel=('piano', .8, 'Am'))
        if k >= 5: role.update(strings=.7)
        if k >= 6: role.update(mel=('violin', .8, 'Am'), brush=.5)
        if k >= 8: role.update(bombo=.3, harp8=.5)
        if k >= 9: role.update(mel=('horn', .7, 'Am'))
        if t0 >= title_t - 0.3: role.update(strings=.9, guit=.8, cello=.7, mel=('piano', .9, 'Am'))
        th = role.get('mel', (None, 0, 'Am'))[2]; ch = TH[th]['prog'][bi % 8]; bs, mids, padn = CH[ch]
    scale = .9 if s['id'] == 'eloy-final' else 1.0
    if role.get('pad'): put('pad', pad_chord(padn[1:], BAR + .9, .55, 'violas'), t0 - .15, 0, role['pad'])
    if role.get('strings'): put('pad', pad_chord([p + 12 for p in padn[1:]], BAR + .8, .6, 'violins'), t0 - .1, 0, role['strings'])
    if role.get('cello'): put('cello', note('cellos', bs + 12, BAR - .1, .6, attack=.05), t0, -.25, role['cello'])
    if role.get('guit'):
        g = role['guit'] * scale
        put('guit', note('guitar_nylon', bs + 12, 2.2, vj(.8)), t0 + jit(), -.15, g)
        for b in (1, 2):
            for i, m in enumerate(mids):
                put('guit', note('guitar_nylon', m + 12 * (1 if i == 2 else 0) + 12, 1.2, vj(.55)), t0 + b * BEAT + i * .02 + jit(), -.1 + i * .08, g * .8)
    if role.get('guit8'):
        g = role['guit8']
        put('guit', note('guitar_nylon', bs + 12, 1.8, vj(.8)), t0 + jit(), -.15, g)
        seq = [mids[0] + 24, mids[1] + 24, mids[2] + 24, mids[1] + 24, mids[0] + 24]
        for i, m in enumerate(seq):
            put('guit', note('guitar_nylon', m, .9, vj(.5)), t0 + BEAT + i * BEAT / 2 + jit(), -.1, g * .75)
    if role.get('harp8'):
        for i, m in enumerate([mids[0] + 12, mids[1] + 12, mids[2] + 12, mids[1] + 12, mids[2] + 12, mids[1] + 24]):
            put('bell', note('harp', m, 1.2, vj(.55)), t0 + i * BEAT / 2 + jit(), .25 * (-1) ** i, role['harp8'])
    if role.get('bass'):
        put('bass', note('contrabass_pizz', bs, 1.2, vj(.8)), t0 + jit(), 0, role['bass'])
        if ch != 'A7': put('bass', note('contrabass_pizz', bs + 7, .7, vj(.6)), t0 + 2 * BEAT, 0, role['bass'] * .6)
    if role.get('mall'):
        pat = [mids[0] + 12, mids[1] + 12, mids[2] + 12, mids[1] + 12, mids[2] + 12, mids[1] + 12]
        for i, m in enumerate(pat): put('mall', note('marimba', m, .6, vj(.6)), t0 + i * BEAT / 2 + jit(), (-1) ** i * .25, role['mall'])
    if role.get('bombo'): put('perc', hit('frame_drum', vj(.55)), t0, 0, role['bombo'])
    if role.get('brush'):
        for b in (1, 2): put('perc', brush(vj(.5)), t0 + b * BEAT + jit(), .2, role['brush'])
    if role.get('sea') and bi % 4 == 0: put('sea', sea(4 * BAR + .5, .35), t0, 0, role['sea'])
    if role.get('mel'):
        inst, g, thn = role['mel']; smp, octv, extra, pan = SOLO[inst]
        for (m, st, d) in theme_notes(thn, bi):
            put('melo', note(smp, m + octv, d * BEAT + extra, vj(.7)), t0 + st * BEAT + jit(), pan, g * scale)

# ───────────── motivo de la cadena y paso de página ─────────────
prev_link = -1
for s in TL['scenes']:
    if s['link'] != prev_link and 0 <= s['link'] <= 4:
        i = s['link']
        for k, m in enumerate([LINKN[i], LINKN[i] + 7, LINKN[i] + 12]):
            put('bell', note('glockenspiel', m + 12, 2.5, .55), s['a'] + .4 + k * .13, (-1) ** k * .3, .7)
    prev_link = s['link']
    if s['a'] > 0: put('perc', swish(.6, .55), s['a'] - .05, 0, .8)
for i, tn in enumerate(NODE_T):
    lk = LINKN[min(i, 7)]
    put('bell', note('harp', lk + 12, 3.0, .7), tn + .6, (-1) ** i * .3, .9)
    put('bell', note('glockenspiel', lk + 24, 2.5, .45), tn + .75, (-1) ** i * -.3, .5)
tt = title_t
for m in (50, 57, 62, 66, 69, 74):
    put('pad', note('violins' if m > 60 else 'cellos', m, 8.5, .7, attack=.6), tt - .2, 0, .8)
for k, m in enumerate((86, 78, 74, 69, 62)):
    put('bell', note('glockenspiel', m, 6.0, .5), tt + .2 + k * .35, (k % 3 - 1) * .4, .6)
for m, v in ((62, .8), (74, .7), (50, .8)): put('melo', note('piano', m, 8.0, v), tt, 0, .8)

# ───────────── eq, reverb, mezcla ─────────────
EQ = {
 'guit': [('hp', 70, .7, 0), ('lp', 8000, .7, 0)], 'melo': [('hp', 60, .7, 0), ('lp', 11000, .7, 0)],
 'cello': [('hp', 60, .7, 0), ('lp', 5000, .7, 0)], 'pad': [('hp', 90, .7, 0), ('lp', 4800, .7, 0)],
 'bell': [('hp', 250, .7, 0), ('lp', 10000, .7, 0)], 'mall': [('hp', 100, .7, 0), ('lp', 6500, .7, 0)],
 'bass': [('hp', 35, .7, 0), ('lp', 1200, .7, 0)], 'perc': [('hp', 30, .7, 0)], 'sea': [('lp', 1200, .7, 0)],
}
LEVEL = {'guit': 1.0, 'melo': 1.0, 'cello': .9, 'pad': .8, 'bell': .8, 'mall': .85, 'bass': 1.0, 'perc': .75, 'sea': .6}
dry = np.zeros((2, N)); rv_in = np.zeros((2, N))
for k in BUS:
    x = filt(bus[k], *EQ[k]) * LEVEL[k]
    dry += x; rv_in += x * RV[k]
irn = int(2.3 * SR); tir = np.arange(irn) / SR
IR = np.stack([rs.randn(irn) * np.exp(-tir / 0.55) for _ in range(2)])
IR = filt(IR, ('lp', 5200, .7, 0), ('hp', 160, .7, 0))
for i, d in enumerate((.011, .019, .027, .041)):
    k = int(d * SR); IR[0, k] += .9 / (i + 1); IR[1, k + 17] += .9 / (i + 1)
IR /= np.sqrt((IR ** 2).sum(axis=1, keepdims=True)) / 4.5
wet = np.stack([signal.fftconvolve(rv_in[c], IR[c])[:N] for c in range(2)])
mix = dry + wet * 0.5
mix = filt(mix, ('hp', 32, .7, 0))

OFFS = {'linea-apertura': -3.0, 'miguel-mar': -.5, 'delmiro': -2.5, 'ruta-villa-colon': -1.0, 'eloy-nace': -.5, 'eloy-boda': 1.0, 'eloy-final': -3.0, 'arbol': 2.0}
rms_s = []
for s in TL['scenes']:
    a, b = int(s['a'] * SR), min(N, int(s['b'] * SR)); rms_s.append(np.sqrt(np.mean(mix[:, a:b] ** 2)) + 1e-9)
target = np.median(rms_s)
pts_t = [0.0]; pts_g = [1.0]
for s, r in zip(TL['scenes'], rms_s):
    g = np.clip((target * 10 ** (OFFS.get(s['id'], 0) / 20)) / r, 10 ** (-3 / 20), 10 ** (4 / 20))
    pts_t += [s['a'] + .8, s['b'] - .8]; pts_g += [g, g]
pts_t.append(DUR); pts_g.append(pts_g[-1])
mix = mix * np.interp(np.arange(N) / SR, pts_t, pts_g)
mix = np.tanh(mix * 1.3 / (np.percentile(np.abs(mix), 99.5) + 1e-9))
tt_ = np.arange(N) / SR
mix *= np.minimum(1, tt_ / 1.2) * np.minimum(1, (DUR - tt_) / 3.0) ** 1.3
rms = np.sqrt(np.mean(mix ** 2)); mix *= (10 ** (-17.5 / 20)) / rms
pk = np.abs(mix).max()
if pk > 10 ** (-1.5 / 20): mix *= (10 ** (-1.5 / 20)) / pk
out = (mix.T * 32767).astype(np.int16)
w = wave.open('musica-cadena3.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes()); w.close()
print('ok', round(DUR, 1), 's')
