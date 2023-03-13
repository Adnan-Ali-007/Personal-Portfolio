console.log('Hello World!')
let themeDots=document.getElementsByClassName('theme-dot');
let theme=localStorage.getItem('theme');// for first time visit theme
if(theme==null){
setTheme('white');
}
else{
setTheme(theme);
}
for(var i=0;i<themeDots.length;i++)
{
   themeDots[i].addEventListener('click',function(){
let mode=this.dataset.mode;
console.log('Clicked',mode);
setTheme(mode);
   }) 
}
function setTheme(mode)
{
if(mode =='white')
{
 document.getElementById('theme-style').href='style.css';
 
}
if(mode =='blue')
{
 document.getElementById('theme-style').href='blue.css';
 
}if(mode =='blackk')
{
 document.getElementById('theme-style').href='black.css';
 
}if(mode =='greyy')
{
 document.getElementById('theme-style').href='grey.css'; 
}
localStorage.setItem('theme',mode);
}
