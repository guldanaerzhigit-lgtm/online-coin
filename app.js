(() => {
 const $=id=>document.getElementById(id);
 const symbols=['🍇','🍊','🍉','🍒','🍋','🔔','🍉','🍇','🍊','👑','💎','🍒'];
 const payouts={'🍇':2,'🍊':3,'🍉':4,'🍒':5,'🍋':6,'🔔':8,'💎':12,'👑':20};
 let balance=10000, bet=100, spinning=false, auto=false, turbo=false, sound=true;
 const betSteps=[10,20,50,100,200,500,1000];
 const reels=[...document.querySelectorAll('.reel')];
 function update(){ $('balance').textContent=balance.toFixed(2);$('betValue').textContent=bet.toFixed(2);$('autoBtn').style.borderColor=auto?'#ffd34e':'#fff';$('turboBtn').style.borderColor=turbo?'#ffd34e':'#fff'; }
 function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2300)}
 function randomSymbol(){return symbols[Math.floor(Math.random()*symbols.length)]}
 function setGrid(grid){grid.forEach((col,x)=>col.forEach((s,y)=>reels[x].children[y].textContent=s))}
 function score(grid){let total=0,lines=[[0,0,0],[1,1,1],[2,2,2],[0,1,2],[2,1,0]];let hits=[];for(const line of lines){const a=grid[0][line[0]],b=grid[1][line[1]],c=grid[2][line[2]];if(a===b&&b===c&&payouts[a]){total+=bet*payouts[a]/10;hits.push(line)}}return {total,hits}}
 async function spin(){if(spinning)return;if(balance<bet){toast('Недостаточно игровых кредитов');auto=false;update();return}spinning=true;$('spinBtn').disabled=true;balance-=bet;update();$('status').textContent='БАРАБАНЫ ВРАЩАЮТСЯ…';let grid=[[],[],[]];const delay=turbo?250:650;
  for(let step=0;step<9;step++){for(let x=0;x<3;x++){grid[x]=[randomSymbol(),randomSymbol(),randomSymbol()]}setGrid(grid);await new Promise(r=>setTimeout(r,delay/9))}
  grid=[0,1,2].map(()=>[randomSymbol(),randomSymbol(),randomSymbol()]);
  const roll=Math.random();if(roll<.12){const s=['🍇','🍊','🍉','🍒','🍋','🔔'][Math.floor(Math.random()*6)];grid[0][1]=s;grid[1][1]=s;grid[2][1]=s}else if(roll<.15){grid[0][0]='👑';grid[1][1]='👑';grid[2][2]='👑'}
  setGrid(grid);const result=score(grid);let win=result.total;const bonus=grid.flat().filter(s=>s==='👑').length>=3;
  if(bonus){win+=bet*5;toast('БОНУС! +'+(bet*5).toFixed(2)+' кредитов')}if(win>0){balance+=win;$('winFlash').classList.remove('active');void $('winFlash').offsetWidth;$('winFlash').classList.add('active');$('status').textContent='ПОЗДРАВЛЯЕМ! ВЫИГРЫШ';}else{$('status').textContent='УДАЧИ В СЛЕДУЮЩЕМ ВРАЩЕНИИ';}
  $('lastWin').textContent=win.toFixed(2);update();spinning=false;$('spinBtn').disabled=false;if(auto&&balance>=bet)setTimeout(spin,turbo?180:450);else if(auto){auto=false;update()}
 }
 $('spinBtn').addEventListener('click',spin);$('autoBtn').addEventListener('click',()=>{auto=!auto;update();toast(auto?'Автоигра включена':'Автоигра выключена');if(auto&&!spinning)spin()});$('turboBtn').addEventListener('click',()=>{turbo=!turbo;update();toast(turbo?'Турбо включено':'Турбо выключено')});
 $('betDown').addEventListener('click',()=>{let i=betSteps.indexOf(bet);bet=betSteps[Math.max(0,i-1)];update()});$('betUp').addEventListener('click',()=>{let i=betSteps.indexOf(bet);bet=betSteps[Math.min(betSteps.length-1,i+1)];update()});
 $('infoBtn').addEventListener('click',()=>$('infoModal').classList.remove('hidden'));$('closeInfo').addEventListener('click',()=>$('infoModal').classList.add('hidden'));$('infoModal').addEventListener('click',e=>{if(e.target===$('infoModal'))$('infoModal').classList.add('hidden')});
 $('soundBtn').addEventListener('click',()=>{sound=!sound;$('soundBtn').textContent=sound?'🔊':'🔇';toast(sound?'Звук включён':'Звук выключен')});$('menuBtn').addEventListener('click',()=>toast('Демо-меню: используйте ⓘ для просмотра правил'));
 update();
})();