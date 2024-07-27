/*****Ravan*******
Author: Ravan
Version: 3.4.57
*/


//DEBUG
/*var debug=false;
var Android={
pipvid:()=>{},
gohome:()=>{},
getInfo:()=>{},
oplink:()=>{},
downvid:()=>{}
};
if(window.eruda == null){
//ERUDA
window.location.href=`javascript:(function () { var script = document.createElement('script'); script.src="//cdn.jsdelivr.net/npm/eruda"; document.body.appendChild(script); script.onload = function () { eruda.init() } })();`;
}
/**/


/*Few Stupid Inits*/
var YTProVer="3.45";
if(ytproNCode == undefined && ytproDecipher == undefined){
var ytproNCode=[];
var ytproDecipher=[];
}
var ytoldV="";
var isF=false;   //what is this for?
var isAP=false; // oh it's for bg play 
var isM=false; // no idea !!
var sTime=[];

if(localStorage.getItem("autoSpn") == null || localStorage.getItem("fitS") == null){
localStorage.setItem("autoSpn","true");
localStorage.setItem("fitS","true");
localStorage.setItem("fzoom","false");
}
if(localStorage.getItem("fzoom") == "true"){
document.getElementsByName("viewport")[0].setAttribute("content","");
}



if(window.location.pathname.indexOf("shorts") > -1){
ytoldV=window.location.pathname;
}
else{
ytoldV=(new URLSearchParams(window.location.search)).get('v') ;
}

/*Cleans the URL for various functions of the YTPRO*/
function ytproGetURL(o,p){
try{
var url=o;

if(p == "sig"){
var sig=(new URLSearchParams(o)).get('s');
url=(new URLSearchParams(o)).get('url');
sig=eval(ytproDecipher[0]+ytproDecipher[1]+"('"+decodeURIComponent(sig)+"');");
url=decodeURIComponent(url);
}
const components = new URL(decodeURIComponent(url));
const n = components.searchParams.get('n');
var nc=eval(ytproNCode[0]+ytproNCode[1]+"('"+n+"');");
components.searchParams.set('n',nc);
if(p == "sig"){
return  components.toString()+"&sig="+sig;
}
else{
return components.toString();
}
}catch{}
}


/*Dark and Light Mode*/
var c="#000";
var d="#f2f2f2";
var dislikes="...";

if(document.cookie.indexOf("PREF") < 0 || document.cookie.indexOf("f6=") < 0){
document.cookie.replace(
/(?<=^|;).+?(?=\=|;|$)/g,
name => location.hostname
.split(/\.(?=[^\.]+\.)/)
.reduceRight((acc, val, i, arr) => i ? arr[i]='.'+val+acc : (arr[i]='', arr), '')
.map(domain => document.cookie=`${name}=;max-age=0;path=/;domain=${domain}`)
);
document.cookie="PREF=f6=400&f7=100;";
window.location.href=window.location.href;
}
if(document.cookie.indexOf("f6=400") > -1){
c ="#fff";d="rgba(255,255,255,0.1)";
}else{
c="#000";d="rgba(0,0,0,0.1)";
}
var downBtn=`<svg xmlns="http://www.w3.org/2000/svg" height="18" fill="${c}" viewBox="0 0 24 24" width="18" focusable="false"><path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z"></path></svg>`;



/*Extract Functions , Credits:node-ytdl-core && @distube/ytdl-core*/
var extractFunctions = (body)=> {

/*Regex & Functions for Decipher & NCode*/
// NewPipeExtractor regexps
const DECIPHER_NAME_REGEXPS = [
  '\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\);',
  '\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)',
  // eslint-disable-next-line max-len
  '(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*""\\s*\\)',
  '([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(""\\)\\s*;',
];

// LavaPlayer regexps
const VARIABLE_PART = '[a-zA-Z_\\$][a-zA-Z_0-9]*';
const VARIABLE_PART_DEFINE = `\\"?${VARIABLE_PART}\\"?`;
const BEFORE_ACCESS = '(?:\\[\\"|\\.)';
const AFTER_ACCESS = '(?:\\"\\]|)';
const VARIABLE_PART_ACCESS = BEFORE_ACCESS + VARIABLE_PART + AFTER_ACCESS;
const REVERSE_PART = ':function\\(a\\)\\{(?:return )?a\\.reverse\\(\\)\\}';
const SLICE_PART = ':function\\(a,b\\)\\{return a\\.slice\\(b\\)\\}';
const SPLICE_PART = ':function\\(a,b\\)\\{a\\.splice\\(0,b\\)\\}';
const SWAP_PART = ':function\\(a,b\\)\\{' +
      'var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b(?:%a.length|)\\]=c(?:;return a)?\\}';

const DECIPHER_REGEXP = `function(?: ${VARIABLE_PART})?\\(a\\)\\{` +
  `a=a\\.split\\(""\\);\\s*` +
  `((?:(?:a=)?${VARIABLE_PART}${VARIABLE_PART_ACCESS}\\(a,\\d+\\);)+)` +
  `return a\\.join\\(""\\)` +
  `\\}`;

const HELPER_REGEXP = `var (${VARIABLE_PART})=\\{((?:(?:${
  VARIABLE_PART_DEFINE}${REVERSE_PART}|${
  VARIABLE_PART_DEFINE}${SLICE_PART}|${
  VARIABLE_PART_DEFINE}${SPLICE_PART}|${
  VARIABLE_PART_DEFINE}${SWAP_PART}),?\\n?)+)\\};`;

const N_TRANSFORM_REGEXP = 'function\\(\\s*(\\w+)\\s*\\)\\s*\\{' +
  'var\\s*(\\w+)=(?:\\1\\.split\\(""\\)|String\\.prototype\\.split\\.call\\(\\1,""\\)),' +
  '\\s*(\\w+)=(\\[.*?]);\\s*\\3\\[\\d+]' +
  '(.*?try)(\\{.*?})catch\\(\\s*(\\w+)\\s*\\)\\s*\\' +
  '{\\s*return"enhanced_except_([A-z0-9-]+)"\\s*\\+\\s*\\1\\s*}' +
  '\\s*return\\s*(\\2\\.join\\(""\\)|Array\\.prototype\\.join\\.call\\(\\2,""\\))};';


/*Matches the Regex*/

const matchRegex = (regex, str) => {
const match = str.match(new RegExp(regex, 's'));
if (!match) throw new Error(`Could not match ${regex}`);
return match;
};

const matchFirst = (regex, str) => matchRegex(regex, str)[0];

const matchGroup1 = (regex, str) => matchRegex(regex, str)[1];

const getFuncName = (body, regexps) => {
let fn;
for (const regex of regexps) {
try {
fn = matchGroup1(regex, body);
const idx = fn.indexOf('[0]');
if (idx > -1) {
fn = matchGroup1(`${fn.substring(idx, 0).replace(/\$/g, '\\$')}=\\[([a-zA-Z0-9$\\[\\]]{2,})\\]`, body);
}
break;
} catch (err) {
continue;
}
}
if (!fn || fn.includes('[')) throw Error();
return fn;
};






const extractDecipherFunc = body => {
try {
const DECIPHER_FUNC_NAME = 'ytproDecipher';
const helperObject = matchFirst(HELPER_REGEXP, body);
const decipherFunc = matchFirst(DECIPHER_REGEXP, body);
const resultFunc = `var ${DECIPHER_FUNC_NAME}=${decipherFunc};`;
const callerFunc = `${decipherFuncName}`;
return [helperObject + resultFunc , callerFunc];
} catch (e) {
return null;
}
};



const extractDecipherWithName = body => {
try {
const decipherFuncName = getFuncName(body, DECIPHER_NAME_REGEXPS);
const funcPattern = `(${decipherFuncName.replace(/\$/g, '\\$')}=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})`;
const decipherFunc = `var ${matchGroup1(funcPattern, body)};`;
const helperObjectName = matchGroup1(';([A-Za-z0-9_\\$]{2,})\\.\\w+\\(', decipherFunc);
const helperPattern = `(var ${helperObjectName.replace(/\$/g, '\\$')}=\\{[\\s\\S]+?\\}\\};)`;
const helperObject = matchGroup1(helperPattern, body);
const callerFunc = `${decipherFuncName}`;
return [helperObject + decipherFunc , callerFunc];
} catch (e) {
return null;
}
};





const getExtractFunctions = (extractFunctions, body) => {
for (const extractFunction of extractFunctions) {
try {
const func = extractFunction(body);
if (!func) continue;
return func;
} catch (err) {
continue;
}
}
return null;
};






const extractDecipher = body => {
const decipherFunc = getExtractFunctions([extractDecipherWithName, extractDecipherFunc], body);
if (!decipherFunc) {
console.warn('WARNING: Could not parse decipher function.\n' );
}
return decipherFunc;
};





const extractNTransformFunc = body => {
try {
const N_TRANSFORM_FUNC_NAME = 'ytproNCode';
const nFunc = matchFirst(N_TRANSFORM_REGEXP, body);
const resultFunc = `var ${N_TRANSFORM_FUNC_NAME}=${nFunc}`;
const callerFunc = `${N_TRANSFORM_FUNC_NAME}`;
return [resultFunc , callerFunc];
} catch (e) {
return null;
}
};




const extractNTransform = body => {
const nTransformFunc = getExtractFunctions([extractNTransformFunc], body);
if (!nTransformFunc) {
console.warn('WARNING: Could not parse nTransform function.\n');
}
return nTransformFunc;
};


ytproDecipher=extractDecipher(body);
ytproNCode=extractNTransform(body);




};



function insertAfter(referenceNode, newNode) {try{referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);}catch{}}

/*Add Settings Tab*/
setInterval(()=>{
if(document.getElementById("setDiv") == null){
var setDiv=document.createElement("div");
setDiv.setAttribute("style",`
height:30px;width:30px;
z-index:9999999999;
font-size:22px;
text-align:center;line-height:35px;
`);
setDiv.setAttribute("id","setDiv");
var svg=document.createElement("div");
svg.innerHTML=`<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 22 22" width="22"  id="hSett"><path d="M12 9.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5m0-1c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zM13.22 3l.55 2.2.13.51.5.18c.61.23 1.19.56 1.72.98l.4.32.5-.14 2.17-.62 1.22 2.11-1.63 1.59-.37.36.08.51c.05.32.08.64.08.98s-.03.66-.08.98l-.08.51.37.36 1.63 1.59-1.22 2.11-2.17-.62-.5-.14-.4.32c-.53.43-1.11.76-1.72.98l-.5.18-.13.51-.55 2.24h-2.44l-.55-2.2-.13-.51-.5-.18c-.6-.23-1.18-.56-1.72-.99l-.4-.32-.5.14-2.17.62-1.21-2.12 1.63-1.59.37-.36-.08-.51c-.05-.32-.08-.65-.08-.98s.03-.66.08-.98l.08-.51-.37-.36L3.6 8.56l1.22-2.11 2.17.62.5.14.4-.32c.53-.44 1.11-.77 1.72-.99l.5-.18.13-.51.54-2.21h2.44M14 2h-4l-.74 2.96c-.73.27-1.4.66-2 1.14l-2.92-.83-2 3.46 2.19 2.13c-.06.37-.09.75-.09 1.14s.03.77.09 1.14l-2.19 2.13 2 3.46 2.92-.83c.6.48 1.27.87 2 1.14L10 22h4l.74-2.96c.73-.27 1.4-.66 2-1.14l2.92.83 2-3.46-2.19-2.13c.06-.37.09-.75.09-1.14s-.03-.77-.09-1.14l2.19-2.13-2-3.46-2.92.83c-.6-.48-1.27-.87-2-1.14L14 2z"></path></svg>
`;
setDiv.appendChild(svg);
insertAfter(document.getElementsByTagName("ytm-home-logo")[0],setDiv);

if(document.getElementById("hSett") != null){
document.getElementById("hSett").addEventListener("click",
function(ev){
window.location.hash="settings";
});
}
}


},50);



/*Fetches da base.js*/
var scripts = document.getElementsByTagName('script');
for(var i=0;i<scripts.length;i++){
if(scripts[i].src.indexOf("/base.js") > 0){
fetch(scripts[i].src).then((res) => res.text()).then((r) => extractFunctions(r));
}
}

/*Dislikes To Locale, Credits: Return YT Dislikes*/
function getDislikesInLocale(num){
var nn=num;
if (num < 1000){
nn = num;
}
else{
const int = Math.floor(Math.log10(num) - 2);
const decimal = int + (int % 3 ? 1 : 0);
const value = Math.floor(num / 10 ** decimal);
nn= value * 10 ** decimal;
}
let userLocales;
if (document.documentElement.lang) {
userLocales = document.documentElement.lang;
} else if (navigator.language) {
userLocales = navigator.language;
} else {
try {
userLocales = new URL(
Array.from(document.querySelectorAll("head > link[rel='search']"))
?.find((n) => n?.getAttribute("href")?.includes("?locale="))
?.getAttribute("href")
)?.searchParams?.get("locale");
} catch {
userLocales = "en";
}
}
return Intl.NumberFormat(userLocales, {
notation: "compact",
compactDisplay: "short",
}).format(nn);
}



/*Skips the bad part :)*/
function skipSponsor(){
var sDiv=document.createElement("div");
sDiv.setAttribute("style",`height:3px;pointer-events:none;width:100%;background:transparent;position:fixed;z-index:99999999;`)
sDiv.setAttribute("id","sDiv");
var dur=document.getElementsByClassName('video-stream')[0].duration;

for(var x in sTime){
var s1=document.createElement("div");
var s2=sTime[x];
s1.setAttribute("style",`height:3px;width:${(100/dur) * (s2[1]-s2[0])}%;background:#0f8;position:fixed;z-index:99999999;left:${(100/dur) * s2[0]}%;`)
sDiv.appendChild(s1);
}
if(document.getElementById("sDiv") == null){
if(document.getElementsByClassName('YtmChapteredProgressBarHost')[0] != null){
document.getElementsByClassName('YtmChapteredProgressBarHost')[0].appendChild(sDiv);
}else{
try{document.getElementsByClassName('YtmProgressBarProgressBarLine')[0].appendChild(sDiv);}catch{}
}
}
}





/*Fetch The Dislikes*/
async function fDislikes(){ 
var vID="";
var Url=new URL(window.location.href);
if(Url.pathname.indexOf("shorts") > -1){
vID=Url.pathname.substr(8,Url.pathname.length);
}
else if(Url.pathname.indexOf("watch") > -1){
vID=Url.searchParams.get("v");
}


fetch("https://returnyoutubedislikeapi.com/votes?videoId="+vID)
.then(response => {
return response.json();
}).then(jsonObject => {
if('dislikes' in jsonObject){
dislikes=getDislikesInLocale(parseInt(jsonObject.dislikes));
}
}).catch(error => {});

}
fDislikes();


if(window.location.pathname.indexOf("watch") > -1){

/*Check For Sponsorships*/
fetch("https://sponsor.ajay.app/api/skipSegments?videoID="+(new URLSearchParams(window.location.search)).get('v'))
.then(response => {
return response.json();
}).then(jsonObject => {
for(var x in jsonObject){
var time=jsonObject[x].segment;
sTime.push(time);
}
}).catch(error => {});




/*Skip the Sponsor*/
document.getElementsByClassName('video-stream')[0].ontimeupdate=()=>{
var cur=document.getElementsByClassName('video-stream')[0].currentTime;
for(var x in sTime){
var s2=sTime[x];
if(Math.floor(cur) == Math.floor(s2[0])){
if(localStorage.getItem("autoSpn") == "true"){
document.getElementsByClassName('video-stream')[0].currentTime=s2[1];
addSkipper(s2[0]);
}
}
}
};


setInterval(skipSponsor,50);


}




if((window.location.pathname.indexOf("watch") > -1) || (window.location.pathname.indexOf("shorts") > -1)){
var unV=setInterval(() => {
/*Set Orientation*/

var v=document.getElementsByClassName('video-stream')[0].getBoundingClientRect();
if(v.height > v.width){
Android.fullScreen(true);
}
else{
Android.fullScreen(false);
}

/*Unmute The Video*/ 

document.getElementsByClassName('video-stream')[0].muted=false;
if(!document.getElementsByClassName('video-stream')[0].muted){
clearInterval(unV);
}

}, 5);

}


/*Add Skip Sponsor Element*/
function addSkipper(sT){
var sSDiv=document.createElement("div");
sSDiv.setAttribute("style",`
height:50px;${(screen.width > screen.height) ? "width:50%;" : "width:80%;"}overflow:auto;background:rgba(130,130,130,.3);
backdrop-filter:blur(6px);
position:absolute;bottom:40px;
line-height:50px;
left:calc(15% / 2 );padding-left:10px;padding-right:10px;
z-index:99999999999999;text-align:center;border-radius:25px;
color:white;text-align:center;
`);
sSDiv.innerHTML=`<span style="height:30px;line-height:30px;margin-top:10px;display:block;font-family:monospace;font-size:16px;float:left;">Skipped Sponsor</span>
<span style="height:30px;line-height:44px;float:right;padding-right:30px;margin-top:10px;display:block;padding-left:30px;border-left:1px solid white;">
<svg onclick="this.parentElement.parentElement.remove();document.getElementsByClassName('video-stream')[0].currentTime=${sT+1};" xmlns="http://www.w3.org/2000/svg" width="23" height="23" style="margin-top:0px;" fill="currentColor" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg>
<svg onclick="this.parentElement.parentElement.remove();" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left:30px;" fill="#f24" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>
</span>`;
document.getElementById("player-control-container").appendChild(sSDiv);
setTimeout(()=>{sSDiv.remove();},5000);
}


/*Funtion to set Element Styles*/
function sty(e,v){
var s={
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"550",
height:"65%",
width:"80px",
borderRadius:"20px",
background:d,
fontSize:"12px",
marginRight:"5px",
textAlign:"center"
};
for(x in s){
e.style[x]=s[x];
}
}

/*The settings tab*/
async function ytproSettings(){
var ytpSet=document.createElement("div");
var ytpSetI=document.createElement("div");
ytpSet.setAttribute("id","settingsprodiv");
ytpSetI.setAttribute("id","ssprodivI");
ytpSet.setAttribute("style",`
height:100%;width:100%;position:fixed;top:0;left:0;
display:flex;justify-content:center;
background:rgba(0,0,0,0.4);
z-index:9999;
`);
ytpSet.addEventListener("click",
function(ev){
if(!(ev.target == ytpSetI  || ytpSetI.contains(ev.target))){
history.back();
}
});

ytpSetI.setAttribute("style",`
height:65%;width:85%;overflow:auto;background:#0f0f0f;
position:absolute;bottom:20px;
z-index:99999999999999;padding:20px;text-align:center;border-radius:25px;color:white;text-align:center;
`);

ytpSetI.innerHTML=`<style>
#settingsprodiv a{text-decoration:underline;color:white;} #settingsprodiv li{list-style:none; display:flex;align-items:center;justify-content:center;color:#fff;border-radius:25px;padding:10px;background:#000;margin:5px;}
#ssprodivI div{
height:10px;
width:calc(100% - 20px);
padding:10px;
font-size:1.35rem;
font-family:monospace;
text-align:left;
display:block;
}
#ssprodivI div span{
display:block;
height:15px;
width:30px;
border-radius:20px;
float:right;
position:relative;
background:rgba(255,0,0,.5);
}
#ssprodivI div span b{
display:block;
height:20px;
width:20px;
position:absolute;
right:-6px;
top:-2px;
border-radius:50px;
background:rgba(255,0,220,5);
}
#ssprodivI div input::placeholder{color:white;}
#ssprodivI div input,#ssprodivI div button{
height:30px;
background:rgba(255,255,255,.1);
width:100%;
border:0;
border-radius:20px;
padding:10px;
font-size:1.25rem;
}
#ssprodivI div button{
background:linear-gradient(120deg,#038,#0a3);
font-size:1.25rem;
width:47%;
border-radius:50px;
padding:0;
color:white;
}

</style>`;
ytpSetI.innerHTML+=`<b style='font-size:18px' >YT PRO Settings</b>
<span style="font-size:10px">v${YTProVer}</span>
<br><br>
<div><input type="url" placeholder="Enter Youtube URL" onkeyup="searchUrl(this,event)"></div>
<br>
<div style="text-align:center" ><button onclick="showHearts();">Hearted Videos</button>
<button style="margin-left:10px" onclick="checkUpdates();">Check for Updates</button>
</div>
<br>
<div>Autoskip Sponsors <span onclick="sttCnf(this,'autoSpn');" style="${sttCnf(0,0,"autoSpn")}" ><b style="${sttCnf(0,1,"autoSpn")}"></b></span></div>
<br>
<div>Auto FitScreen <span onclick="sttCnf(this,'fitS');" style="${sttCnf(0,0,"fitS")}" ><b style="${sttCnf(0,1,"fitS")}" ></b></span></div> 
<br>
<div>Force Zoom <span onclick="sttCnf(this,'fzoom');" style="${sttCnf(0,0,"fzoom")}" ><b style="${sttCnf(0,1,"fzoom")}" ></b></span></div> 
<br>
<div>Hide Shorts <span onclick="sttCnf(this,'shorts');" style="${sttCnf(0,0,"shorts")}" ><b style="${sttCnf(0,1,"shorts")}" ></b></span></div> 
<br>
<div style="display:flex;justify-content:center;font-family:cursive;text-align:center;font-size:2.25rem;font-weight:bolder;color:#0f8;">Made with 
&#x2665; by Prateek Chaubey</div>
<br><br>
<div style="font-size:1.25rem;"><b style="font-weight:bold">Disclaimer</b>: This is an unofficial OSS Youtube Mod , all the logos and brand names are property of Google LLC.<br>
You can get the source code at <a href="#" onclick="Android.oplink('https://github.com/prateek-chaubey/YTPRO')" > https://github.com/prateek-chaubey/YTPRO</a>
<br><br><center>
<a href="#" onclick="Android.oplink('https://github.com/prateek-chaubey/YTPRO/issues')" >Report Bugs</a>
</center></div>`;

document.body.appendChild(ytpSet);
ytpSet.appendChild(ytpSetI);

}

function searchUrl(x,e){
if(e.keyCode === 13 || e === "Enter"){
window.location.href=x.value;
}
}

function checkUpdates(){
if(parseFloat(Android.getInfo()) < parseFloat(YTProVer) ){
updateModel();
}else{
alert("Your app is up to date");
}

fetch('https://cdn.jsdelivr.net/npm/ytpro', {cache: 'reload'});
fetch('https://cdn.jsdelivr.net/npm/ytpro/bgplay.js', {cache: 'reload'});
}


/*Set Configration*/
function sttCnf(x,z,y){

/*Way too complex to understand*/

if(typeof y == "string"){

if(localStorage.getItem(y) != "true"){
if(z == 1){
return 'background:rgba(255,255,255,.7);left:-6px;'
}else{
return 'background:rgba(255,255,255,.1)';
}
}else{
if(z == 1){
return 'background:rgba(255,50,50,1);left:auto;right:-6px;'
}else{
return 'background:rgba(255,50,50,.5)';
}
}
}
if(localStorage.getItem(z) == "true"){
localStorage.setItem(z,"false");
x.style.background="rgba(255,255,255,.1)";
x.children[0].style.left="-6px";
x.children[0].style.background="rgba(255,255,255,.7)";
}
else{
localStorage.setItem(z,"true");
x.style.background="rgba(255,50,50,.5)";
x.children[0].style.left="auto";
x.children[0].style.right="-6px";
x.children[0].style.background="rgba(255,50,50,7)";
}

if(localStorage.getItem("fzoom") == "false"){
document.getElementsByName("viewport")[0].setAttribute("content","width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,");
}else{
document.getElementsByName("viewport")[0].setAttribute("content","");
}

}


/*Format File Size*/
function formatFileSize(x){
var s=parseInt(x);
let ss = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
for (var i=0; s > 1024; i++) s /= 1024;
return ` | ${s.toFixed(1)} ${ss[i]}`;
}

/*Video Downloader*/
async function ytproDownVid(){
var ytproDown=document.createElement("div");
var ytproDownDiv=document.createElement("div");
ytproDownDiv.setAttribute("id","downytprodiv");
ytproDown.setAttribute("id","outerdownytprodiv");
ytproDown.setAttribute("style",`
height:100%;width:100%;position:fixed;top:0;left:0;
display:flex;justify-content:center;
background:rgba(0,0,0,0.4);
z-index:99999999999999;
`);
ytproDown.addEventListener("click",
function(ev){
if(ev.target != ytproDownDiv ){
history.back();
}
});

ytproDownDiv.setAttribute("style",`
height:50%;width:85%;overflow:auto;background:#0f0f0f;
position:absolute;bottom:20px;
z-index:99999999999999;padding:20px;text-align:center;border-radius:25px;color:white;text-align:center;
`);

document.body.appendChild(ytproDown);
ytproDown.appendChild(ytproDownDiv);

var id="";

if(window.location.pathname.indexOf("shorts") > -1){
id=window.location.pathname.substr(8,window.location.pathname.length);
}
else{
id=new URLSearchParams(window.location.search).get("v");
}



ytproDownDiv.innerHTML="Loading...";

var info=await fetch("https://m.youtube.com/watch?v="+id).then(r => r.text());



try{
var sD=JSON.parse("{"+(info.substr(info.indexOf("streamingData")-1,((info.indexOf("playbackTracking")-1)-info.indexOf("streamingData"))))+"}");
var vD=JSON.parse("{"+info.substr(info.indexOf("\"videoDetails"),((info.indexOf("\"trackingParams")-1)-info.indexOf("\"videoDetails")))+"}");
var cD=JSON.parse("{"+info.substr(info.indexOf("\"captionTracks\""),(info.indexOf("\"audioTracks\"") -1 - info.indexOf("\"captionTracks\"")))+"}");
}catch(e){
history.back();
return Android.showToast("Download Error , Please open and issue on Github if the error persists.\n\n"+e);
}




var thumb=vD?.videoDetails?.thumbnail?.thumbnails;
var vids=sD?.streamingData?.formats;
var avids=sD?.streamingData?.adaptiveFormats;
var cap=cD?.captionTracks;
var t=vD?.videoDetails?.title.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","");
ytproDownDiv.innerHTML="<style>#downytprodiv a{text-decoration:none;color:white;} #downytprodiv li{list-style:none; display:flex;align-items:center;justify-content:center;color:#fff;border-radius:25px;padding:8px;background:rgb(10,0,0);margin:5px;box-shadow:0px 0px 2px rgb(236,84,232);margin-top:8px}</style>";



ytproDownDiv.innerHTML+="Select Avilaible Formats<ul id='listurl'>";

for(var x in vids){

var url="";
if("signatureCipher" in vids[x]){
url=ytproGetURL(vids[x].signatureCipher,"sig");
}else{
url=ytproGetURL(vids[x].url,"n");
}

ytproDownDiv.innerHTML+=`<li data-ytprotit="${t}"  style="background:#001;box-shadow:0px 0px 2px rgb(70,84,232);"  onclick="YTDownVid(this,'.mp4')"  data-ytprourl="${url}">
${downBtn}<span style="margin-left:10px;"  >${vids[x].qualityLabel} ${formatFileSize(((vids[x].bitrate*(vids[x].approxDurationMs/1000))/8))} </span></li>` ;
}




for(x in avids){


if(avids[x].mimeType.indexOf("audio") > -1){

var url="";
if("signatureCipher" in avids[x]){
url=ytproGetURL(avids[x].signatureCipher,"sig");
}else{
url=ytproGetURL(avids[x].url,"n");
}

ytproDownDiv.innerHTML+=`<li data-ytprotit="${t}"  onclick="YTDownVid(this,'.mp3')"  data-ytprourl="${url}">
${downBtn}<span style="margin-left:10px;"  >Audio | ${avids[x].audioQuality.replace("AUDIO_QUALITY_","")}${formatFileSize(avids[x].contentLength)} 
</span></li>` ;
}
}



ytproDownDiv.innerHTML+="<br>Thumbnails<br><br><style>.thu{height:80px;border-radius:10px;}.thu img{max-height:97%;max-width:70%;border-radius:10px;border:1px solid silver;}</style>";
for(x in thumb){
ytproDownDiv.innerHTML+=`<li data-ytprotit="${t+Date.now()}"  onclick="YTDownVid(this,'.png')" style="box-shadow:0px 0px 2px rgb(70,234,232);" class="thu" data-ytprourl="${thumb[x].url}">
<img src="${thumb[x].url}"><br>
<span style="margin-left:30px;display:flex;align-items:center;justify-content:center;"  >${downBtn}<span style="margin-left:10px;"  >${thumb[x].height} &#x2715; ${thumb[x].width}
</span></span></li>` ;
}

if(cap && cap.length){
ytproDownDiv.innerHTML+="<br>Captions<br><br><style>cp{display:flex;align-items:center;width:100%;height:30px}c{height:45px;width:50px;padding-top:5px;background:rgba(255,255,255,.1);border-radius:10px;margin-left:10px;display:block}</style>";
for(var x in cap){
ytproDownDiv.innerHTML+=`<cp><span style="width:100px;text-align:left">${cap[x]?.name?.runs[0]?.text}</span> <div style="position:absolute;right:10px;display:flex"><c onclick="downCap('${cap[x].baseUrl}&fmt=xml','${t}.xml')" >${downBtn} <br>.xml</c><c onclick="downCap('${cap[x].baseUrl}&fmt=vtt','${t}.vtt')">${downBtn} <br>.vtt</c><c onclick="downCap('${cap[x].baseUrl}&fmt=srv1','${t}.srv1')">${downBtn} <br>.srv1</c><c onclick="downCap('${cap[x].baseUrl}&fmt=ttml','${t}.ttml')">${downBtn} <br>.ttml</c></div></cp><br><br>`; 
}
}




}


/*Add the meme type and extensions lol*/
function downCap(x,t){
Android.downvid(t,`https://m.youtube.com${x}`,"plain/text");
}
function YTDownVid(o,ex){
var mtype="";
if(ex ==".png"){
mtype="image/png";
}else if(ex ==".mp4"){
mtype="video/mp4";
}
else if(ex ==".mp3"){
mtype="audio/mp3";
}

//console.log(o.getAttribute("data-ytprourl"))


Android.downvid((o.getAttribute("data-ytprotit")+ex),o.getAttribute("data-ytprourl"),mtype);
}


/*THE 0NE AND 0NLY FUNCTION*/
function pkc(){

if(window.location.href.indexOf("youtube.com/watch") > -1){


try{
var elm=document.getElementsByTagName("dislike-button-view-model")[0].children[0].children[0]; 
elm.children[0].style.width="80px";
elm.children[0].children[0].style.position="absolute";
elm.children[0].children[0].style.left="15px";
if(elm.children[0].children[2] == null){
elm.children[0].innerHTML+=`<span style="margin-left:20px">${dislikes}<span>`;
}else{elm.children[0].children[2].innerHTML=dislikes;}
}catch{}


/*Check If Element Already Exists*/
if(document.getElementById("ytproMainDivE") == null){
var ytproMainDivA=document.createElement("div");
ytproMainDivA.setAttribute("id","ytproMainDivE");
ytproMainDivA.setAttribute("style",`
height:50px;width:100%;display:block;overflow:auto;
`);

insertAfter(document.getElementsByClassName('slim-video-action-bar-actions')[0],ytproMainDivA);

var ytproMainDiv=document.createElement("div");
ytproMainDiv.setAttribute("style",`
height:50px;width:130%;display:flex;overflow:auto;
align-items:center;justify-content:center;padding-left:20px;padding-right:20px;
`);
ytproMainDivA.appendChild(ytproMainDiv);

/*Heart Button*/
var ytproFavElem=document.createElement("div");
sty(ytproFavElem);
if(!isHeart()){
ytproFavElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}" viewBox="0 0 16 16">
<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg><span style="margin-left:8px">Heart<span>`;
}else{
ytproFavElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f00" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg><span style="margin-left:8px">Heart<span>`;
}
ytproMainDiv.appendChild(ytproFavElem);
ytproFavElem.addEventListener("click",()=>{ytProHeart(ytproFavElem);});



/*Download Button*/
var ytproDownVidElem=document.createElement("div");
sty(ytproDownVidElem);
ytproDownVidElem.style.width="110px";
ytproDownVidElem.innerHTML=`${downBtn.replace('width="18"','width="24"').replace('height="18"','height="24"')}<span style="margin-left:2px">Download<span>`;
ytproMainDiv.appendChild(ytproDownVidElem);
ytproDownVidElem.addEventListener("click",
function(){
window.location.hash="download";
});

/*PIP Button*/
var ytproPIPVidElem=document.createElement("div");
sty(ytproPIPVidElem);
ytproPIPVidElem.style.width="110px";
ytproPIPVidElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}"  viewBox="0 0 16 16">
<path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
<path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z"/>
</svg>
<span style="margin-left:8px">PIP Mode<span>`;
ytproMainDiv.appendChild(ytproPIPVidElem);
ytproPIPVidElem.addEventListener("click",
function(){
isAP=false;
PIPlayer2();
});



/*Minimize Button*/
var ytproMinVidElem=document.createElement("div");
sty(ytproMinVidElem);
ytproMinVidElem.style.width="110px";
ytproMinVidElem.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-down-right" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M6.364 2.5a.5.5 0 0 1 .5-.5H13.5A1.5 1.5 0 0 1 15 3.5v10a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 2 13.5V6.864a.5.5 0 1 1 1 0V13.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5H6.864a.5.5 0 0 1-.5-.5z"/>
<path fill-rule="evenodd" d="M11 10.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h3.793L1.146 1.854a.5.5 0 1 1 .708-.708L10 9.293V5.5a.5.5 0 0 1 1 0v5z"/>
</svg>
<span style="margin-left:8px">Minimize<span>`;
ytproMainDiv.appendChild(ytproMinVidElem);
ytproMinVidElem.addEventListener("click",
function(){

var d=document.createElement("div");
d.setAttribute("style",`
height:118px;width:182px;background:rgba(130,130,130,.3);
backdrop-filter:blur(6px);
position:absolute;bottom:40px;
line-height:50px;position:fixed;
bottom:50px;
left:calc(5% / 2);padding-right:20px;
z-index:99999999999999;text-align:center;border-radius:5px;
color:white;text-align:center;
`);
d.innerHTML=`<span style="height:30px;position:absolute;right:-10px;top:-15px;display:block;z-index:999999999999999999;">
<svg onclick="this.parentElement.parentElement.remove();" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left:30px;" fill="#f24" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>
</span>`;


var v=document.createElement("video");

v.setAttribute("style",`position:fixed;top:5px;left:5px;height:108px;width:192px;z-index:999;`);
v.setAttribute("controls",``);
var f=ytplayer.config.args.raw_player_response.streamingData.formats;
if("signatureCipher" in f[0]){
v.src=ytproGetURL(f[0].signatureCipher,"sig");
}else{
v.src=ytproGetURL(f[0].url,"n");
}


v.currentTime=document.getElementsByClassName('video-stream')[0].currentTime;
d.appendChild(v);
v.play();
document.body.appendChild(d);



history.pushState({},"","https://m.youtube.com/");
history.pushState({},"","https://m.youtube.com/");
history.back();

});

/*Music Button*/
var ytproAudElem=document.createElement("div");
sty(ytproAudElem);
ytproAudElem.style.width="90px";
ytproAudElem.innerHTML=`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${c}" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"/>
</svg>
<span style="margin-left:8px">BG Play<span>`;
ytproMainDiv.appendChild(ytproAudElem);
ytproAudElem.addEventListener("click",
function(){

if(parseFloat(Android.getInfo()) < parseFloat(YTProVer)){
return updateModel();
}

window.location.hash="bgplay";
});

if(ytproNCode.length < 1 && ytproDecipher.length < 1 ){
ytproAudElem.style.opacity=".5";
ytproAudElem.style.pointerEvents="none";
}
else if(ytproNCode.length > 1 && ytproDecipher.length > 1 ){
ytproAudElem.style.opacity="1";
ytproAudElem.style.pointerEvents="auto";
}


}

/*Watch The old and New URL*/
if(ytoldV != (new URLSearchParams(window.location.search)).get('v')){
try{document.getElementById("ytproMainAudDivE").remove();}catch{console.log("No Element Found");}
isAPlaying=false;
ytoldV=(new URLSearchParams(window.location.search)).get('v');
window.location.href=window.location.href;
}


}else if(window.location.href.indexOf("youtube.com/shorts") > -1){



if(document.getElementById("ytproMainSDivE") == null){
var ys=document.createElement("div");
ys.setAttribute("id","ytproMainSDivE");
ys.setAttribute("style",`width:50px;height:100px;position:absolute;display:block;right:10px;bottom:500px;`);


/*Download Button*/
ysDown=document.createElement("div");
ysDown.setAttribute("style",`
height:50px;width:50px;text-align:center;line-height:65px;display:block;overflow:auto;
background:rgba(0,0,0,.4);border-radius:50%;margin-bottom:25px;
`);
ysDown.innerHTML=downBtn.replace(`width="18"`,`width="26"`).replace(`height="18"`,`height="26"`)+
`<span style="position:absolute;bottom:5px;color:white;font-size:14px;left:-10px">Download<span>`;
ysDown.addEventListener("click",
function(){
window.location.hash="download";
});


/*Heart Button*/
ysHeart=document.createElement("div");
ysHeart.setAttribute("style",`
height:50px;width:50px;text-align:center;line-height:65px;display:block;overflow:auto;
background:rgba(0,0,0,.4);border-radius:50%;margin-top:8px;margin-bottom:0px;
`);


if(!isHeart()){
ysHeart.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="${c}" viewBox="0 0 16 16">
<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg><span style="position:absolute;bottom:-70px;color:white;font-size:14px;left:7px">Heart<span>`;
}else{
ysHeart.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#f00" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg><span style="position:absolute;bottom:-70px;color:white;font-size:14px;left:7px">Heart<span>`;
}


ysHeart.addEventListener("click",
function(){
ytProHeart(ysHeart);
});





insertAfter(document.getElementsByClassName("carousel-wrapper")[0],ys);
ys.appendChild(ysDown);
ys.appendChild(ysHeart);
}

try{document.querySelectorAll('[aria-label="Dislike this video"]')[0].nextElementSibling.children[0].innerHTML=dislikes;}catch{}



if(document.getElementsByClassName('video-stream')[0].paused){
if(document.getElementById("ytproMainSDivE") != null) document.getElementById("ytproMainSDivE").style.bottom="510px";
}else{
if(document.getElementById("ytproMainSDivE") != null) document.getElementById("ytproMainSDivE").style.bottom="470px";
}


/*Watch The old and New URL*/
if(ytoldV != window.location.pathname){
fDislikes();
ytoldV=window.location.pathname;
}


}

}


/*SHOW HEARTS*/
async function showHearts(){
var ytproH=document.createElement("div");
var ytproHh=document.createElement("div");
ytproHh.setAttribute("id","heartytprodiv");
ytproH.setAttribute("id","outerheartsdiv");
ytproH.setAttribute("style",`
height:100%;width:100%;position:fixed;top:0;left:0;
display:flex;justify-content:center;
background:rgba(0,0,0,0.4);
z-index:99999999999999;
`);

ytproHh.setAttribute("style",`
height:50%;width:85%;overflow:auto;background:#0f0f0f;
position:absolute;bottom:20px;
z-index:99999999999999;padding:20px;text-align:center;border-radius:25px;color:white;text-align:center;
`);
ytproHh.innerHTML="<style>#heartytprodiv a{text-decoration:none;color:white;} #heartytprodiv li{list-style:none; display:flex;align-items:center;color:#fff;border-radius:5px;padding:0px;background:#000;margin:5px;}</style>";
ytproHh.innerHTML+="Hearted Videos<ul id='listurl'>";


ytproHh.innerHTML+="<style>.thum{height:70px;border-radius:5px;}.thum img{float:left;height:70px;width:125px;border-radius:5px;flex-shrink: 0;}</style>";

document.body.appendChild(ytproH);
ytproH.appendChild(ytproHh);

ytproH.addEventListener("click",
function(ev){
if(!event.composedPath().includes(ytproHh)){
history.back();
}
});



if(localStorage.getItem("hearts") == null){
ytproHh.innerHTML+="No Videos Found";
}else{

var v=JSON.parse(localStorage.getItem("hearts"));

for(var n=Object.keys(v).length - 1; n >  -1 ; n--){
var x=Object.keys(v)[n];
ytproHh.innerHTML+=`<li class="thum" >
<img onclick="window.location.href=('https://youtu.be/${x}');" src="${v[x].thumb}" ><br>
<div style="width:calc(100% - 170px);margin-left:5px;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical; -webkit-line-clamp:3;overflow:hidden;text-overflow:ellipsis;" onclick="window.location.href=('https://youtu.be/${x}');" >${v[x].title}</div>
<div style="width:calc(100% - (100% - 35px))">
<svg onclick="remHeart(this,'${x}');" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left:0px;" fill="#f24" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>
</span>
</div>
</li>`;
await new Promise(r => setTimeout(r, 1));
}
}





}





/*Dil hata diya vro*/
function remHeart(y,x){
if(localStorage.getItem("hearts")?.indexOf(x) > -1){
y.parentElement.parentElement.remove();
var j=JSON.parse(localStorage.getItem("hearts") || "{}");
delete j[x];
localStorage.setItem("hearts",JSON.stringify(j));
}

}

function ytProHeart(x){


var vid=(new URLSearchParams(window.location.search)).get('v') || window.location.pathname.replace("/shorts/","");



if(window.location.pathname.indexOf("shorts") > -1){

var video=document.getElementsByClassName('video-stream')[0];
var canvas = document.createElement('canvas');
canvas.style.width = "1600px"; 
canvas.style.height = "900px";
canvas.style.background="black";
var context = canvas.getContext('2d');
context.drawImage(video,105, 0, 90,160);
var dataURI = canvas.toDataURL('image/jpeg');



var vDetails={
thumb:dataURI,
title:document.getElementsByClassName('ReelPlayerHeaderRendererReelTitle')[0].textContent.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")
};

}else{

var vDetails={
thumb:[...ytplayer.config.args.raw_player_response?.videoDetails?.thumbnail?.thumbnails].pop().url,
title:ytplayer.config.args.raw_player_response?.videoDetails?.title.replaceAll("|","").replaceAll("\\","").replaceAll("?","").replaceAll("*","").replaceAll("<","").replaceAll("/","").replaceAll(":","").replaceAll('"',"").replaceAll(">","")
};

}


var g="16";
var h=`<span style="margin-left:8px">Heart<span>`;
(window.location.href.indexOf('youtube.com/shorts') > -1) ? h=`<span style="position:absolute;bottom:-70px;color:white;font-size:14px;left:7px">Heart<span>`:h=`<span style="margin-left:8px">Heart<span>`;
(window.location.href.indexOf('youtube.com/shorts') > -1) ? g="23" : g="16" ;

if(localStorage.getItem("hearts")?.indexOf(vid) > -1){
var j=JSON.parse(localStorage.getItem("hearts") || "{}");
delete j[vid];
localStorage.setItem("hearts",JSON.stringify(j));
x.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${g}" fill="${c}" viewBox="0 0 16 16">
<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg>${h}`;
}else{
var j=JSON.parse(localStorage.getItem("hearts") || "{}");
j[vid]=vDetails;
localStorage.setItem("hearts",JSON.stringify(j));
x.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${g}" height="${g}" fill="#f00" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
</svg>${h}`;
}

}



/*Dil diya hai ya nhi diya!!*/
function isHeart(){

if((localStorage.getItem("hearts")?.indexOf((new URLSearchParams(window.location.search)).get('v'))  > -1)  ||  (localStorage.getItem("hearts")?.indexOf(window.location.pathname.replace("/shorts/",""))  > -1)){
return true;
}else{
return false;

}
}



/*Factoring the code after months , i really don't know what miracle this piece does*/
function removePIP(){
if(!isF){
document.getElementsByClassName("fullscreen-icon")[0].click();
}
isAP=false;
}




function PIPlayer(){
if(isAP == false) PIPlayer1();
}

function PIPlayer1(){

try{stopPlayback();}catch{console.log("Audio Not Playing");}
if(window.innerWidth == screen.width && window.innerHeight == screen.height){
isF=true;
}
else{
isF=false;
}
if(!document.getElementsByClassName('video-stream')[0].paused){
if(!isF){
document.getElementsByClassName("fullscreen-icon")[0].click();
}
Android.pipvid("pip");
var o=0;
var h=setInterval(()=>{o+=1;if(o==10){clearInterval(h);}document.getElementsByClassName('video-stream')[0].play(); },10);
}
}



function PIPlayer2(){
try{stopPlayback();}catch{console.log("No Audio Playing");}
if(window.innerWidth == screen.width && window.innerHeight == screen.height){
isF=true;
}
else{
isF=false;
}
isHPIP=false;
Android.pipvid("pip");
if(!isF){
document.getElementsByClassName("fullscreen-icon")[0].click();
}
document.getElementsByClassName('video-stream')[0].play();
}






/*YTPRO Audio Player*/
/*hehe i removed this lmao*/


setInterval(pkc,0);


/*Check The Hash Change*/
window.onhashchange=()=>{
if(window.location.hash == "#download"){
ytproDownVid();
}else if(window.location.hash == "#settings"){
ytproSettings();
}
else if(window.location.hash == "#hearts"){
showHearts();
}
else if(window.location.hash == "#bgplay"){
ytproAudPlayer(new URLSearchParams(window.location.search).get("v"));
}
else{
try{stopPlayback();}catch{}
try{document.getElementById("outerdownytprodiv").remove();}catch{}
try{document.getElementById("outerheartsdiv").remove();}catch{}
try{document.getElementById("settingsprodiv").remove();}catch{}
}
}




/*YT ADS BLOCKER*/
setInterval(function(){ 

/*Block Ads*/
var ads=document.getElementsByTagName("ad-slot-renderer");
for(var x in ads){
try{ads[x].remove();}catch{}
}
try{
document.getElementsByClassName("ad-interrupting")[0].getElementsByTagName("video")[0].currentTime=document.getElementsByClassName("ad-interrupting")[0].getElementsByTagName("video")[0].duration;
document.getElementsByClassName("ytp-ad-skip-button-text")[0].click();
}catch{}



/*Block Ads*/
try{
document.getElementsByTagName("ytm-promoted-sparkles-web-renderer")[0].remove();
}catch{}
try{
document.getElementsByTagName("ytm-companion-ad-renderer")[0].remove();
}catch{}

/*Remove Open App*/
try{
document.querySelectorAll('[aria-label="Open App"]')[0].remove(); 
}catch{}
/*Remove Promotion Element*/
try{document.getElementsByTagName("ytm-paid-content-overlay-renderer")[0].style.display="none";}catch{}

/*Hide Shorts*/
if(localStorage.getItem("shorts") == "true"){

for( x in document.getElementsByTagName("ytm-reel-shelf-renderer")){
try{document.getElementsByTagName("ytm-reel-shelf-renderer")[x].remove();
}catch{}

}
}

/****** I LOVE YOU <3 *****/


/*Removing this till next update , as it causes bug in certain devices*/

//Add Maximize Button
/*
var pElem=document.getElementById('player-container-id');
if(pElem === document.fullscreenElement){

var Vv=document.getElementsByClassName('video-stream')[0];

var mE=document.createElement("div");

if((Vv.getBoundingClientRect().width / Vv.offsetWidth) > 1){
mE.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-angle-contract" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M.172 15.828a.5.5 0 0 0 .707 0l4.096-4.096V14.5a.5.5 0 1 0 1 0v-3.975a.5.5 0 0 0-.5-.5H1.5a.5.5 0 0 0 0 1h2.768L.172 15.121a.5.5 0 0 0 0 .707zM15.828.172a.5.5 0 0 0-.707 0l-4.096 4.096V1.5a.5.5 0 1 0-1 0v3.975a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 0-1h-2.768L15.828.879a.5.5 0 0 0 0-.707z"/>
</svg>`;
}else{
mE.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-angle-expand" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z"/>
</svg>`;
}


mE.setAttribute("id","mE");
mE.setAttribute("style",`position:absolute;right:60px;padding:15px;`);

if(document.getElementById("mE") == null) {
document.getElementsByClassName("player-controls-bottom")[0].appendChild(mE);
}

mE.addEventListener("click",()=>{
var scale=(Vv.videoHeight > Vv.videoWidth) ? (screen.height / Vv.videoHeight) : (screen.width / Vv.videoWidth);
if((Vv.getBoundingClientRect().width / Vv.offsetWidth) > 1){
Vv.style.transform=`scale(1)`;
}else{
Vv.style.transform=`scale(${scale})`;
}
});
}
*/



}, 1);


//Add FitScreen Button
/*
document.getElementById('player-container-id').addEventListener("fullscreenchange",(ev)=>{
if(document.fullscreenElement != null){
var Vv=document.getElementsByClassName('video-stream')[0];
var scale=(Vv.videoHeight > Vv.videoWidth) ? (screen.height / Vv.videoHeight) : (screen.width / Vv.videoWidth);
if (scale < 1) scale =1;
if(localStorage.getItem("fitS") == "true"){
setTimeout(()=>{Vv.style.transform=`scale(${scale})`;},0);
}
}
});*/



/*Update your app bruh*/
function updateModel(){


var x=document.createElement("div");

x.setAttribute("style",`height:100%;width:100%;position:fixed;display:grid;align-items:center;top:0;left:0;background:rgba(0,0,0,.2);z-index:99999;`);

x.innerHTML=`
<div style="height:140px;width:70%;padding:20px;background:rgba(0,0,0,.1);border:1px solid #888;box-shadow:0px 0px 5px black;backdrop-filter:blur(10px);border-radius:15px;margin:auto">


<img src="data:image/jpeg;base64,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" alt="Ravan YouTube Premium Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;">

<h2> Update Available</h2><br>
Latest Version ${YTProVer} of Ravan YouTube Premium is available , update the Update Ravan YouTube Premium to get latest features.
<br>- Improved Background Play<br>
- Bug fixed and updated
<br>
<br>
<div style="display:flex;">
<button style="border:0;border-radius:10px;height:30px;width:150px;background:rgba(255,50,50,.7);float:right;" onclick="Android.downvid('Ravan YouTube Premium.apk','https://nightly.link/prateek-chaubey/YTPro/workflows/gradle/main/Apk.zip','application/zip');">Download</button>
</div>

</div>
`;

document.body.appendChild(x);
}









window.onload = function(){ 
if(parseFloat(Android.getInfo()) < parseFloat(YTProVer) && (window.location.href == "https://m.youtube.com/" || window.location.href == "https://m.youtube.com") ){
updateModel();
}
};
