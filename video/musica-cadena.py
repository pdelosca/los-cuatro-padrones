import numpy as np, wave
SR=44100; DUR=158.5
N=int(SR*DUR); L=np.zeros(N); R=np.zeros(N)
def hz(m): return 440*2**((m-69)/12)
def add(sig,t0,pan=0.0,gain=1.0):
    i=int(t0*SR); n=min(len(sig),N-i)
    if n<=0: return
    L[i:i+n]+=sig[:n]*gain*(1-pan)/2*1.4; R[i:i+n]+=sig[:n]*gain*(1+pan)/2*1.4
def env(n,a,d):
    t=np.arange(n)/SR; return np.minimum(1,t/a)*np.exp(-t/d)
def pluck(m,dur=2.5,bright=0.5):   # guitarra: Karplus-Strong
    f=hz(m); n=int(SR*dur); p=int(SR/f); buf=np.random.uniform(-1,1,p)*0.8
    out=np.zeros(n)
    for i in range(n):
        out[i]=buf[i%p]; buf[i%p]=(buf[i%p]+buf[(i+1)%p])*0.5*(0.997-0.01*(1-bright))
    return out
def bell(m,dur=4):
    t=np.arange(int(SR*dur))/SR; f=hz(m)
    s=sum(a*np.sin(2*np.pi*f*r*t)*np.exp(-t/(dur/ (1+i*0.8))) for i,(r,a) in enumerate([(1,1),(2.76,.4),(5.4,.2),(8.9,.1)]))
    return s*0.4
def glass(m,dur=3.5):
    t=np.arange(int(SR*dur))/SR; f=hz(m)
    s=np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*f*2*t+0.4)+0.15*np.sin(2*np.pi*f*3*t)
    return s*np.minimum(1,t/0.5)*np.exp(-t/2.2)*0.35
def pad(ms,dur,vib=0.3):
    t=np.arange(int(SR*dur))/SR; s=np.zeros(len(t))
    for m in ms:
        f=hz(m)
        for det in (-0.004,0,0.004):
            ph=2*np.pi*f*(1+det)*t
            s+=(np.sin(ph)+0.5*np.sin(2*ph)*0.5+0.3*np.sin(3*ph)*0.3)/3
    a=np.minimum(1,t/(dur*0.3))*np.minimum(1,(dur-t)/(dur*0.35))
    return s*a*0.1/len(ms)*3
def bow(m,dur):  # cuerda grave
    t=np.arange(int(SR*dur))/SR; f=hz(m)
    s=np.zeros(len(t))
    for h in range(1,9): s+=np.sin(2*np.pi*f*h*t*(1+0.0015*np.sin(2*np.pi*5*t)))/h
    a=np.minimum(1,t/1.2)*np.minimum(1,(dur-t)/1.5)
    return s*a*0.12
def thump(t0,g=1.0):
    t=np.arange(int(SR*0.5))/SR; f=55*np.exp(-t*12)+40
    add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)*0.8*g,t0)
def tick(t0,g=0.18):
    n=int(SR*0.03); x=np.random.uniform(-1,1,n)*np.exp(-np.arange(n)/SR*180)
    add(x*g,t0,pan=np.random.uniform(-.3,.3))

def v_gtr(m,t,g=0.5,pan=-0.3): add(pluck(m,2.2),t,pan,g)
def v_bell(m,t,g=0.5,pan=0.4): add(bell(m,3.5),t,pan,g)
def celesta(m,t,g=0.45,pan=0.3):
    tt=np.arange(int(SR*1.6))/SR; f=hz(m)
    s=(np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*f*3*tt)+0.12*np.sin(2*np.pi*f*5.1*tt))*np.exp(-tt*3.2)
    add(s,t,pan,g*0.7)
def piano(m,t,dur=1.8,g=0.5,pan=0):
    tt=np.arange(int(SR*dur))/SR; f=hz(m)
    s=(np.sin(2*np.pi*f*tt)+0.45*np.sin(2*np.pi*f*2*tt)*np.exp(-tt*2)+0.2*np.sin(2*np.pi*f*3*tt)*np.exp(-tt*4))*np.exp(-tt*1.6)*np.minimum(1,tt/0.005)
    add(s,t,pan,g*0.6)
# escala de la cadena: un tono más alto por cada eslabón (Re menor pentatónico)
LINK=[62,65,67,69,72,74,77,81]
def link_chime(i,t):
    for k,m in enumerate([LINK[i],LINK[i]+7]): celesta(m,t+k*0.12,0.55,(-1)**k*0.3)
# --- indicador: cada eslabón entra con su campanada
for i,t in enumerate([14.2,46.2,70.2,81.2,103.2]): link_chime(i,t)
# Mario, Pablo y los chicos: aparecen en el árbol
for i,t in enumerate([140+1.0+k*1.6+0.2 for k in range(8)]): celesta(LINK[min(i,7)]+(0 if i<5 else 0),t,0.5,(-1)**i*0.3)
# ACTO 1 · tek çizgi 0–14: pulso lento y notas sueltas de piano
add(pad([38,45,50],14),0,0,0.8)
for i,(t,m) in enumerate([(2.0,62),(3.0,65),(4.0,69),(6.2,67),(7.2,65),(9.6,62),(10.8,69),(12.0,74)]): piano(m,t,2.2,0.55,(-1)**i*0.2)
for k in range(14): thump(0.5+k*1.0,0.35)
# S2 Miguel 14–27: mar, cuerda grave + guitarra
add(bow(38,13),14,0.3,0.9); add(bow(45,13),14,0.3,0.6); add(pad([38,50,57],13),14,0,0.7)
for i,t in enumerate(np.arange(14.8,26.6,0.7)): v_gtr([62,65,69,65,62,60][i%6],t,0.5)
# S3 campo 27–36: celesta alegre
add(pad([41,53,57,60],9),27,0,0.8)
for i,t in enumerate(np.arange(27.4,35.6,0.45)): celesta([69,72,74,72,69,67,72,67][i%8],t,0.45,(-1)**i*0.3)
# S4 escritura 36–46: guitarra lenta, rasguño
add(pad([38,45,50,57],10),36,0,0.8)
for i,t in enumerate(np.arange(36.6,45.6,0.8)): v_gtr([62,65,69,74][i%4],t,0.55)
# S5 plaza 46–58: marcha suave, bell + celesta
for k in range(24): thump(46.2+k*0.5,0.5 if k%2==0 else 0.25)
add(pad([43,55,58,62],12),46,0,0.8)
for i,t in enumerate(np.arange(46.4,57.6,0.5)): celesta([67,70,74,70,67,62,65,70][i%8],t,0.5)
# S6 papeles 58–70: guitarra tensa y calma
add(pad([40,52,57,64],12),58,0,0.8)
for i,t in enumerate(np.arange(58.4,69.6,0.9)): v_gtr([64,67,71,67,64,59][i%6],t,0.55)
add(bell(50,6),66,0.2,0.5)
# S7 Flores 70–81: celesta amanecer
add(pad([38,50,54,57],11),70,0,0.9)
for i,t in enumerate(np.arange(70.4,80.6,0.55)): celesta([62,66,69,74,78,74,69,66][i%8],t,0.5)
# S8 Delmiro 81–94: calma, estrellas que se apagan
add(pad([36,48,55,60],13),81,0,0.9)
for i,t in enumerate(np.arange(81.4,93.6,0.9)): celesta([72,69,67,65,64,60][i%6],t,0.45)
for k in range(7): bell_t=89.2+k*0.2; v_bell(60-k,bell_t,0.3,0.0)
# S9 ruta 94–103: guitarra caminando
for i,t in enumerate(np.arange(94.3,102.6,0.5)): v_gtr([57,60,62,64,62,60,57,55][i%8],t,0.5)
add(pad([33,45,52],9),94,0,0.8)
# S10 Eloy tek 103–116: piano con pulso de coche
for k in range(26): thump(103.2+k*0.5,0.45)
add(pad([38,50,57,62],13),103,0,0.8)
for i,t in enumerate(np.arange(103.4,115.6,0.5)): piano([62,65,69,72,69,65,62,60][i%8],t,1.2,0.5,(-1)**i*0.2)
# S11 sótano 116–129: viernes de noche, swing suave
add(pad([38,50,53,57],13),116,0,0.8)
for k in range(26):
    t=116.2+k*0.5
    if k%2==0: thump(t,0.55)
    piano([50,53,57,60][(k//2)%4]-12,t,0.5,0.6,-0.2)
    if k%4 in (1,3): piano([62,65,69,72][(k//2)%4],t+0.25,0.8,0.4,0.3)
# S12 boda y despedida 129–140: acorde mayor, luego silencio con una vela
add(pad([38,50,54,57,62],11),129,0,1.1)
for i,m in enumerate([62,66,69,74,78]): v_bell(m,129.6+i*0.7,0.5,(i%3-1)*0.4)
add(bell(74,8),135.2,0,0.5)
# S13 árbol 140–158: la cadena suena entera y resuelve en mayor
add(pad([38,45,50,54,57,62],18),140,0,1.1)
add(pad([38,50,54,57,62,66,69],8),150.5,0,1.2)
add(bell(86,6),150.8,0,0.5); add(bell(74,7),150.8,0.2,0.6); add(bell(62,8),150.8,-0.2,0.6)
# reverb simple
def reverb(x):
    out=x.copy()
    for d,g in [(0.041,0.35),(0.083,0.28),(0.137,0.2),(0.229,0.14),(0.41,0.09)]:
        k=int(d*SR); out[k:]+=x[:-k]*g
    return out
L=reverb(L);R=reverb(np.roll(R,int(0.013*SR)))
m=max(abs(L).max(),abs(R).max()); L/=m;R/=m
t=np.arange(N)/SR
fade=np.minimum(1,t/1.0)*np.minimum(1,(DUR-t)/2.5)
L*=fade*0.8;R*=fade*0.8
st=np.stack([L,R],1)
w=wave.open('musica-cadena.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
w.writeframes((st*32767).astype(np.int16).tobytes());w.close()
print('ok')
