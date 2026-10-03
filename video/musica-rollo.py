import numpy as np, wave
SR=44100; DUR=106.5
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
def stab(m,t,g=0.5):   # metal de cómic
    tt=np.arange(int(SR*0.35))/SR; f=hz(m)
    s=(np.sign(np.sin(2*np.pi*f*tt))*0.4+np.sin(2*np.pi*f*2*tt)*0.3)*np.exp(-tt*9)
    add(s,t,0,g*0.7)
def marimba(m,t,g=0.5,pan=0):
    tt=np.arange(int(SR*0.6))/SR; f=hz(m)
    s=(np.sin(2*np.pi*f*tt)+0.35*np.sin(2*np.pi*f*4*tt))*np.exp(-tt*8)
    add(s,t,pan,g*0.8)
def epiano(m,t,dur=1.2,g=0.5,pan=0):
    tt=np.arange(int(SR*dur))/SR; f=hz(m)
    s=(np.sin(2*np.pi*f*tt)+0.5*np.sin(2*np.pi*f*2*tt+np.sin(2*np.pi*5*tt)*0.4)*np.exp(-tt*3)+0.2*np.sin(2*np.pi*f*3*tt))*np.exp(-tt*2.2)
    add(s,t,pan,g*0.6)
def slip(t0):   # "ka-chunk" del empalme
    thump(t0,1.0)
    for i in range(24): tick(t0+0.02+i*0.008,0.25)
# empalmes
for b in (7,26,48,70,92): slip(b)
# ACTO 0 · 16 mm 0–7: proyector y pulso
for k in range(0,14): tick(0.12+k*0.5,0.12)
add(pad([38,45,50],8),0,0,0.9)
thump(0.82,1.0); thump(1.5,1.0)
add(bell(62,6),1.8,0.2,0.8); add(bell(57,6),3.0,-0.2,0.6); add(bell(50,6),4.2,0,0.6)
# ACTO 1 · LÁPIZ 7–26: guitarra lenta + rasguño de lápiz
add(pad([38,50,57],19),7,0,0.8)
mel=[62,65,69,65,62,60,65,60, 58,62,65,62,57,60,62,60]
for i,t in enumerate(np.arange(7.6,25.6,0.62)): v_gtr(mel[i%16],t,0.55)
for t0,t1 in [(7.3,11),(10.8,12),(17.5,21)]:
    n=int(SR*(t1-t0)); x=np.random.uniform(-1,1,n)*0.04*(np.sin(np.arange(n)/SR*30)**2)
    add(x,t0,0,1.0)
add(bell(74,5),22,0.3,0.5)
# ACTO 2 · CÓMIC 26–48: swing con metales (Gm-Eb-Bb-F)
prog=[(43,[55,58,62]),(39,[51,55,58]),(46,[58,62,65]),(41,[53,57,60])]
beat=0.5; t=26.2; i=0
while t<47.6:
    root,ch=prog[(i//4)%4]
    add(pad(ch,0.9),t,0,0.35)
    if i%2==0: thump(t,0.5)
    marimba(root+12*(i%2),t+0.25,0.5)
    if i%4==2: stab(ch[0]+12,t,0.55); stab(ch[2]+12,t,0.4)
    i+=1;t+=beat
for tt in (27.0,28.4,30.5,31.0): stab(74,tt,0.4)
# ACTO 3 · CINÉTICA 48–70: marimba en pulso, una nota por palabra
sc=[62,65,67,69,72,69,67,65]
t=48.4;i=0
while t<69.4:
    marimba(sc[i%8]+(12 if i%5==0 else 0),t,0.55,(-1)**i*0.3)
    if i%2==0: tick(t,0.12)
    i+=1;t+=0.375
add(pad([38,50,57,62],21),48,0,0.7)
# ACTO 4 · AÑOS 70 70–92: piano eléctrico, bajo, groove
chords=[[50,57,62,65],[48,55,60,64],[46,53,58,62],[45,52,57,61]]
for k in range(0,44):
    t0=70.2+k*0.5
    ch=chords[(k//8)%4]
    if k%2==0: thump(t0,0.55)
    epiano(ch[0]-12,t0,0.5,0.7,-0.2)
    if k%4 in (1,3): epiano(ch[1]+12,t0+0.25,0.6,0.45,0.3); epiano(ch[3]+12,t0+0.25,0.6,0.35,0.3)
for k,(c) in enumerate(chords): add(pad(c,5.5),70+k*5.5,0,0.7)
# ACTO 5 · CIERRE 16 mm 92–106: acorde que se abre y resuelve
add(pad([38,45,50,57],6),92,0,1.1)
add(pad([38,50,54,57,62,66],8),98,0,1.3)
for i,m in enumerate([62,66,69,74,78,81]): add(bell(m,4),95+i*1.2,(i%3-1)*0.4,0.55)
add(bell(86,6),101,0,0.5); add(bell(74,7),101,0.2,0.6); add(bell(62,8),101,-0.2,0.6)
for k in range(0,12): tick(92.2+k*1.0,0.07)
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
w=wave.open('musica-rollo.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
w.writeframes((st*32767).astype(np.int16).tobytes());w.close()
print('ok')
