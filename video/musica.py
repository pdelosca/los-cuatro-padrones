import numpy as np, wave
SR=44100; DUR=72.5
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
# --- acordes: Dm | Bb | F | C  (lento), final Dm→D mayor
prog=[[50,57,62,65],[46,58,62,65],[41,57,60,65],[48,55,60,64]]
# GANCHO 0–8: pulso + ticks de máquina de escribir + pad oscuro
for k in range(0,8):
    thump(0.5+k*1.0,0.7+0.05*k)
for t0,s,cps in [(0.9,36,26),(2.0,42,26),(3.6,36,26),(5.0,21,26)]:
    for i in range(s): tick(t0+i/cps,0.09)
add(pad([38,45,50],9),0,0,1.0)
add(bell(74,6),6.5,0.3,0.9); add(bell(62,6),6.5,-0.3,0.6)   # cae "se ignoran"
# INTRO 8–14: tres notas ascendentes
for i,m in enumerate([62,65,69,74]): add(bell(m,3),9.6+i*0.55,(-1)**i*0.4,0.6)
# ESCENAS: cada rama una voz, sobre pad
def scene(t0,t1,chord,voice,notes,step):
    add(pad(chord,t1-t0+1.5),t0-0.3,0,1.0)
    t=t0+0.3;i=0
    while t<t1-0.4:
        voice(notes[i%len(notes)],t); t+=step;i+=1
def v_gtr(m,t): add(pluck(m,2.2),t,-0.35,0.55)
def v_bell(m,t): add(bell(m,3.5),t,0.4,0.55)
def v_glass(m,t): add(glass(m,3),t,0.2,0.7)
# Flores 12.5–28.5  guitarra (Dm-Bb)
add(pad([38,50,57],16),12.4,0,0.9); add(pad([34,46,53],10),20.5,0,0.7)
scene(12.6,28.4,[50,57,62],v_gtr,[62,65,69,65,62,60,65,60, 58,62,65,62,57,60,62,60],0.5)
# Cerro Largo 28.5–36.5 cuerda grave (F-C) sobre pulso lento
add(bow(41,8.5),28.3,0.3,1.0); add(bow(48,8.5),28.3,0.3,0.8); add(bow(53,8.5),29.5,0.3,0.7)
for k in range(8): thump(28.6+k*1.0,0.45)
scene(28.9,36.4,[41,53,57],lambda m,t:add(pluck(m,1.8,0.3),t,-0.2,0.3),[65,69,72,69],0.5)
# Montevideo 36.6–43.5 campana
add(pad([46,53,58],7.5),36.4,0,0.8)
scene(37,43.3,[46,58,62],v_bell,[74,70,67,70,65,67],0.55)
# Lavalleja 43.6–50 cristal
add(pad([48,55,64],7),43.4,0,0.8)
scene(44,49.8,[48,55,60],v_glass,[76,72,67,72,64,67],0.6)
# CONVERGENCIA 50–60: las cuatro juntas, tempo que sube; pulso
for k in range(int(10/0.5)):
    thump(50+k*0.5,0.55+0.02*k)
add(pad([38,50,57,62,65],10.5),49.8,0,1.1)
mel=[62,65,69,72,74,72,69,65]
for i in range(20):
    t=50.4+i*0.5; m=mel[i%8]
    [v_gtr,v_bell,v_glass,v_gtr][i%4](m+(12 if i%4==2 else 0),t)
add(bell(50,8),53.4,0,0.5)
# TRENZA 60–66: acorde que se abre hacia mayor
add(pad([38,45,50,54,57,62],7),59.6,0,1.3)
for i,m in enumerate([62,66,69,74,78,81]): add(bell(m,4),60.6+i*0.5,(i%3-1)*0.4,0.6)
# YA NO 66.6–: resuelve en D mayor y un solo acorde largo
add(pad([38,50,54,57,62,66],8),66.2,0,1.4)
add(bell(86,5),67.8,0,0.5); add(bell(74,6),67.8,0.2,0.6); add(bell(62,7),67.8,-0.2,0.6)
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
w=wave.open('musica.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
w.writeframes((st*32767).astype(np.int16).tobytes());w.close()
print('ok')
