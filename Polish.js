const classes=["HTMLAnchorElement","HTMLAreaElement","HTMLAudioElement","HTMLBRElement","HTMLBaseElement","HTMLBodyElement","HTMLButtonElement","HTMLCanvasElement","HTMLContentElement","HTMLDListElement","HTMLDataElement","HTMLDataListElement","HTMLDialogElement","HTMLDivElement","HTMLDocument","HTMLEmbedElement","HTMLFieldSetElement","HTMLFormControlsCollection","HTMLFrameSetElement","HTMLHRElement","HTMLHeadElement","HTMLHeadingElement","HTMLHtmlElement","HTMLIFrameElement","HTMLImageElement","HTMLInputElement","HTMLIsIndexElement","HTMLKeygenElement","HTMLLIElement","HTMLLabelElement","HTMLLegendElement","HTMLLinkElement","HTMLMapElement","HTMLMediaElement","HTMLMetaElement","HTMLMeterElement","HTMLModElement","HTMLOListElement","HTMLObjectElement","HTMLOptGroupElement","HTMLOptionElement","HTMLOptionsCollection","HTMLOutputElement","HTMLParagraphElement","HTMLParamElement","HTMLPictureElement","HTMLPreElement","HTMLProgressElement","HTMLQuoteElement","HTMLScriptElement","HTMLSelectElement","HTMLShadowElement","HTMLSourceElement","HTMLSpanElement","HTMLStyleElement","HTMLTableCaptionElement","HTMLTableCellElement","HTMLTableColElement","HTMLTableDataCellElement","HTMLTableElement","HTMLTableHeaderCellElement","HTMLTableRowElement","HTMLTableSectionElement","HTMLTemplateElement","HTMLTextAreaElement","HTMLTimeElement","HTMLTitleElement","HTMLTrackElement","HTMLUListElement","HTMLUnknownElement","HTMLVideoElement"]
    .map(x=>window[x]).filter(x=>x);
const tags=["html","base","head","link","meta","style","title","body","address","article","aside","footer","header","h1","h2","h3","h4","h5","h6","hgroup","main","nav","section","blockquote","dd","dir","div","dl","dt","figcaption","figure","hr","li","main","ol","p","pre","ul","a","abbr","b","bdi","bdo","br","cite","code","data","dfn","em","i","kbd","mark","q","rb","rp","rt","rtc","ruby","s","samp","small","span","strong","sub","sup","time","tt","u","var","wbr","area","audio","img","map","track","video","applet","embed","iframe","noembed","object","param","picture","source","canvas","noscript","script","del","ins","caption","col","colgroup","table","tbody","td","tfoot","th","thead","tr","button","datalist","fieldset","form","input","label","legend","meter","optgroup","option","output","progress","select","textarea","details","dialog","menu","menuitem","summary","content","element","shadow","slot","template","acronym","applet","basefont","bgsound","big","blink","center","command","content","dir","element","font","frame","frameset","image","isindex","keygen","listing","marquee","menuitem","multicol","nextid","nobr","noembed","noframes","plaintext","shadow","spacer","strike","tt","xmp"];
const HTMLTagMap=new Map();
for(let tag of tags){
    const elem=document.createElement(tag);
    for(let htmlElementClass of classes){
        if(elem instanceof htmlElementClass){
            HTMLTagMap.set(htmlElementClass,tag);
        }
    }
}
let elements={};
let currentAutoId=0;
const getAutoId=()=>{
    while(elements[(++currentAutoId).toString()]);
    return currentAutoId.toString();
}
const _Register=Symbol();
// This is what runs when Polish is called directly
const PolishComponent=(baseClass,name)=>{
    const baseTagName=baseClass && HTMLTagMap.get(baseClass);
    if(baseClass && !baseTagName) throw "Base class is not an HTML element";
    baseClass=baseClass||HTMLElement;
    name=name||getAutoId();
    if(elements[name]) throw "Name is already taken";
    const cls=elements[name]=class extends baseClass{
        connectedCallback(){
            console.log("Polish CC");
        }
        static Create(){
            if(baseTagName){
                return document.createElement("polish-"+name);
            } else {
                return document.createElement("polish-"+name, {is: baseTagName});
            }
        }
        static [_Register](finalClass){
            if(baseTagName){
                customElements.define("polish-"+name,finalClass,{extends:baseTagName});
            } else {
                customElements.define("polish-"+name,finalClass);
            }
        }
    };
    return cls;
}
// Static elements of polish
class Polish
{
    static Register(element){
        if(Array.isArray(element)){
            for(let el of element){
                Polish.Register(el);
            }
            return;
        }
        element[_Register](element);
    }
}
export default new Proxy(PolishComponent, {
    get(_,prop){
        return Reflect.get(Polish,prop);
    },
    set(){
        throw "Cannot set element of Polish";
    }
})