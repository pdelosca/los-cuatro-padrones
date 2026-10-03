"""Auditoría de audio: pico, recorte, nivel por escena, silencios y alineación con la línea de tiempo."""
import json, sys, wave
import numpy as np
from scipy import signal
f = sys.argv[1] if len(sys.argv) > 1 else 'musica-cadena2.wav'
TL = json.load(open('linea-de-tiempo.json'))
w = wave.open(f); sr = w.getframerate(); n = w.getnframes()
x = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, 2).astype(np.float64) / 32768
mono = x.mean(axis=1)
ok = True
def chk(cond, msg):
    global ok
    print(('  ok   ' if cond else '  FALLA ') + msg)
    ok = ok and cond
pk = 20 * np.log10(np.abs(x).max() + 1e-12)
chk(pk <= -1.0, f'pico {pk:.1f} dBFS (límite -1.0)')
chk(int((np.abs(x) >= 0.999).sum()) == 0, 'sin muestras recortadas')
chk(abs(mono.mean()) < 0.002, f'sin componente continua ({mono.mean():.5f})')
rms_all = 20 * np.log10(np.sqrt(np.mean(x ** 2)))
chk(-24 <= rms_all <= -16, f'nivel global {rms_all:.1f} dBFS RMS (objetivo -24 a -16)')
corr = np.corrcoef(x[:, 0], x[:, 1])[0, 1]
chk(0.2 < corr < 0.98, f'imagen estéreo razonable (correlación L/R {corr:.2f})')
# nivel por escena
print('\nNivel por escena (dBFS RMS):')
lv = []
for s in TL['scenes']:
    a, b = int(s['a'] * sr), min(n, int(s['b'] * sr))
    r = 20 * np.log10(np.sqrt(np.mean(x[a:b] ** 2)) + 1e-12); lv.append(r)
    print(f"  {s['id']:18} {r:6.1f}   {s['b']-s['a']:5.1f} s")
d = np.abs(np.diff(lv))
chk(d.max() <= 5.0, f'salto máximo entre escenas contiguas {d.max():.1f} dB (límite 5)')
# silencios
win = int(.25 * sr); rms = np.array([np.sqrt(np.mean(mono[i:i + win] ** 2)) for i in range(0, n - win, win)])
db = 20 * np.log10(rms + 1e-12); quiet = db < -52
runs = []; cur = 0
for i, q in enumerate(quiet):
    if q: cur += 1
    else:
        if cur: runs.append((i - cur, cur)); cur = 0
if cur: runs.append((len(quiet) - cur, cur))
body = [(a * .25, c * .25) for a, c in runs if a * .25 < TL['dur'] - 3.5]
chk(all(c <= 1.5 for a, c in body), 'sin silencios mayores a 1,5 s antes del cierre' + ('' if all(c <= 1.5 for a, c in body) else f' {body}'))
# alineación: energía de "paso de página" cerca de cada empalme
hp = signal.lfilter(*signal.butter(4, 2500 / (sr / 2), 'high'), mono)
env = np.sqrt(signal.lfilter([1], [1, -.999], hp ** 2) * .001)
sc = 0
for s in TL['scenes'][1:]:
    c = int(s['a'] * sr); near = env[max(0, c - int(.25 * sr)):c + int(.35 * sr)].max(); far = np.median(env[max(0, c - int(3 * sr)):c - int(1 * sr)]) + 1e-9
    if near > far * 1.1: sc += 1
chk(sc >= len(TL['scenes']) - 3, f'empalmes con evento sonoro: {sc} de {len(TL["scenes"]) - 1}')
# duración
chk(abs(n / sr - (TL['dur'] + .6)) < .3, f'duración {n/sr:.1f} s vs video {TL["dur"]:.1f} s (+0,6 de cola)')
print('\nRESULTADO:', 'APROBADO' if ok else 'REVISAR')
# espectrograma
try:
    import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
    fig, ax = plt.subplots(2, 1, figsize=(14, 6), sharex=True)
    ff, tt, S = signal.spectrogram(mono, sr, nperseg=2048, noverlap=1536)
    ax[0].pcolormesh(tt, ff[:200], 10 * np.log10(S[:200] + 1e-12), shading='auto', cmap='magma'); ax[0].set_ylabel('Hz')
    ax[1].plot(np.arange(len(db)) * .25, db); ax[1].set_ylabel('dBFS'); ax[1].set_ylim(-70, -5)
    for s in TL['scenes']: ax[1].axvline(s['a'], color='r', lw=.5)
    plt.tight_layout(); plt.savefig('/tmp/claude-0/-home-user-los-cuatro-padrones/f24983fd-4066-50ca-bbcb-a58ecd5eea17/scratchpad/espectro.png', dpi=70)
except Exception as e: print('sin gráfico:', e)
