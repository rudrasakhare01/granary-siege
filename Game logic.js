// ===== math core (BigInt keeps big inputs exact) =====
const B=x=>BigInt(x);
function nCr(n,r){n=B(n);r=B(r);if(r<0n||r>n)return 0n;const k=r<n-r?r:n-r;let res=1n;for(let i=1n;i<=k;i++)res=res*(n-k+i)/i;return res;}
function nPr(n,r){n=B(n);r=B(r);if(r<0n||r>n)return 0n;let res=1n;for(let i=0n;i<r;i++)res*=(n-i);return res;}
const ceilDiv=(a,b)=>Math.floor((a+b-1)/b), rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));

function solvePigeonFull(N,K){const m=ceilDiv(N,K);
  return {ans:B(m),steps:['Pigeonhole: N items in K boxes ⇒ some box has ≥ ⌈N/K⌉.',`N=${N}, K=${K}`,`⌈${N}/${K}⌉ = ${m}`,`Check: ${m-1} per box holds only ${K*(m-1)} < ${N}.`,`Answer: ${m}`]};}
function solvePigeonForce(K,r){const n=K*(r-1)+1;
  return {ans:B(n),steps:[`Worst case: every box holds r−1 = ${r-1}.`,`That absorbs ${K}×${r-1} = ${K*(r-1)} items.`,`One more item forces a box to reach ${r}.`,`Answer: ${K}(${r}−1)+1 = ${n}`]};}
function solveIE(A,Bv,C,ab,ac,bc,t,U){const un=A+Bv+C-ab-ac-bc+t,none=U-un;
  return {ans:B(none),steps:['|A∪B∪C| = ΣSingles − ΣPairs + Triple',`= ${A}+${Bv}+${C} − ${ab} − ${ac} − ${bc} + ${t}`,`= ${A+Bv+C} − ${ab+ac+bc} + ${t} = ${un}`,`Outside all sets = ${U} − ${un} = ${none}`],
    regions:{a:A-ab-ac+t,b:Bv-ab-bc+t,c:C-ac-bc+t,ab:ab-t,ac:ac-t,bc:bc-t,t:t,o:none}};}
function solveSel(n,r,k){
  if(k==='C')return {ans:nCr(n,r),steps:['Order irrelevant: C(n,r) = n!/(r!(n−r)!)',`C(${n},${r}) = ${nCr(n,r)}`]};
  if(k==='P')return {ans:nPr(n,r),steps:['Order matters: P(n,r) = n!/(n−r)!',`P(${n},${r}) = ${nPr(n,r)}`]};
  const all=nCr(n,r),both=nCr(n-2,r-2);
  return {ans:all-both,steps:['Total minus the forbidden groups.',`Total C(${n},${r}) = ${all}`,`Both rivals in: C(${n-2},${r-2}) = ${both}`,`Answer: ${all} − ${both} = ${all-both}`]};}

// ===== visuals =====
let trial=null; // interactive crate placement for pigeonhole rounds
function drawBins(){
  const left=trial.N-trial.c.reduce((a,b)=>a+b,0),mx=Math.max(...trial.c);
  $('viz').innerHTML=`<div class="mut">Experiment: click a storehouse to add a crate, shift-click to remove. Crates left: <b>${left}</b>. Can you keep every storehouse small?</div>
  <div class="bins">${trial.c.map((c,i)=>`<div class="bin ${c===mx&&mx>0?'max':''}" data-i="${i}"><div>${'🌾'.repeat(Math.min(c,5))}${c>5?'+':''}</div><span>${c}</span></div>`).join('')}</div>
  <button class="btn ghost" id="rst">Reset</button> <span class="mut">Fullest so far: ${mx}</span>`;
  document.querySelectorAll('.bin').forEach(b=>b.onclick=e=>{const i=+b.dataset.i,l=trial.N-trial.c.reduce((x,y)=>x+y,0);
    if(e.shiftKey){if(trial.c[i]>0)trial.c[i]--;}else if(l>0)trial.c[i]++;drawBins();});
  $('rst').onclick=()=>{trial.c.fill(0);drawBins();};
}
function staticBins(N,K){const c=Array(K).fill(0);for(let i=0;i<N;i++)c[i%K]++;
  return `<div class="bins">${c.map(x=>`<div class="bin"><div>${'🌾'.repeat(Math.min(x,5))}${x>5?'+':''}</div><span>${x}</span></div>`).join('')}</div><div class="mut">An even spread of ${N} items.</div>`;}
function venn(r){return `<svg viewBox="0 0 300 220" width="100%" style="max-width:340px"><rect x="2" y="2" width="296" height="216" rx="14" fill="none" stroke="#ffffff30"/>
  <circle cx="115" cy="95" r="62" fill="#5eead4" fill-opacity=".75"/><circle cx="185" cy="95" r="62" fill="#a78bfa" fill-opacity=".75"/><circle cx="150" cy="150" r="62" fill="#fbbf24" fill-opacity=".75"/>
  <text x="85" y="80">${r.a}</text><text x="200" y="80">${r.b}</text><text x="140" y="190">${r.c}</text>
  <text x="140" y="75">${r.ab}</text><text x="108" y="135">${r.ac}</text><text x="172" y="135">${r.bc}</text><text x="141" y="112">${r.t}</text>
  <text x="14" y="208" style="fill:#9aa3c7">outside: ${r.o}</text></svg>`;}

