document.documentElement.classList.add('js');
const menu=document.querySelector('.menu');
const links=document.getElementById('nav-links');
function closeMenu(){menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation');links?.classList.remove('is-open');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');links.classList.toggle('is-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
links?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.getElementById('print-summary')?.addEventListener('click',()=>window.print());
document.getElementById('copy-email')?.addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText('ridho90@gmail.com');status.textContent='Email address copied.';}catch{status.textContent='Please copy this address: ridho90@gmail.com';}});
