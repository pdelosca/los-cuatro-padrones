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

# ===== PADRÓN I: guitarra (ocre) siempre; campana (cian) desde la firma =====
def v_gtr(m,t,g=0.55,pan=-0.3): add(pluck(m,2.2),t,pan,g)
def v_bell(m,t,g=0.55,pan=0.4): add(bell(m,3.5),t,pan,g)
# GANCHO 0–8: pulso, ticks de máquina de escribir, pad oscuro, campana al caer «indigencia»
for k in range(0,8): thump(0.5+k*1.0,0.6+0.05*k)
for t0,n in [(0.9,25),(2.0,22),(3.0,24),(4.2,25)]:
    for i in range(n): tick(t0+i/26,0.09)
add(pad([38,45,50],9),0,0,1.0)
add(bell(74,6),6.4,0.3,0.9); add(bell(62,6),6.4,-0.3,0.6)
# REWIND 8–12.5: notas que bajan (el tiempo vuelve)
for i,m in enumerate([81,77,74,69,65,62]): add(bell(m,2.5),8.6+i*0.6,(-1)**i*0.4,0.45)
# 12.5–27 Las Piedras, el campo: guitarra lenta, Dm-Bb
add(pad([38,50,57],16),12.4,0,0.9); add(pad([34,46,53],10),20.5,0,0.7)
for k in range(15): thump(12.8+k*1.0,0.35)
mel=[62,65,69,65,62,60,65,60, 58,62,65,62,57,60,62,60]
for i,t in enumerate(np.arange(12.9,27.0,0.5)): v_gtr(mel[i%16],t)
# 27–40.5 Felipe Pascual: más pulso, entra cuerda grave
add(bow(41,13.5),27.2,0.3,0.9); add(bow(48,13.5),27.2,0.3,0.7)
add(pad([41,53,57,60],13.5),27.0,0,0.9)
for k in range(27): thump(27.2+k*0.5,0.4+0.01*k)
mel2=[65,69,72,69,65,72,69,65, 67,70,74,70,67,74,70,67]
for i,t in enumerate(np.arange(27.4,40.4,0.5)): v_gtr(mel2[i%16],t,0.55)
# 40.5–47.5 nace Flores y luego cae el tiempo: acordes mayores que se apagan
add(pad([43,55,59,62],7),40.6,0,1.0)
for i,m in enumerate([67,71,74,71,67,64,62,59]): v_gtr(m,41+i*0.8,0.5)
# 48–62.5: 1913, entra la campana (los Nin) a partir de 56.8
add(pad([38,50,57,62],14.5),47.8,0,1.0)
for k in range(30): thump(48+k*0.5,0.5)
for i,t in enumerate(np.arange(48.4,56.8,0.6)): v_gtr([62,65,69,65][i%4],t,0.5)
for i,t in enumerate(np.arange(56.8,62.8,0.5)):
    v_gtr([62,65,69,72][i%4],t,0.4); v_bell([74,77,81,77][i%4],t+0.25,0.5)
add(bell(50,8),59.6,0,0.6)   # el encuentro
# 63–68.5 trenza: acorde que se abre hacia mayor
add(pad([38,45,50,54,57,62],7),62.8,0,1.3)
for i,m in enumerate([62,66,69,74,78,81]): add(bell(m,4),63.4+i*0.55,(i%3-1)*0.4,0.6)
# 68.5–72: un solo acorde mayor
add(pad([38,50,54,57,62,66],5),68.2,0,1.4)
add(bell(86,5),68.9,0,0.5); add(bell(74,6),68.9,0.2,0.6); add(bell(62,7),68.9,-0.2,0.6)
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
w=wave.open('musica-decampos.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
w.writeframes((st*32767).astype(np.int16).tobytes());w.close()
print('ok')
