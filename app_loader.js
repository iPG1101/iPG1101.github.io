window.onerror = function(){
  var a = arguments.join('\n');
  alert(a);
};

var apps = [];
function App(name, id){
  this.id = id;
  this.name = name;
  this.image = new Image();
  this.image.src = name+'/'+name+'.png';
  this.image.title = this.image.alt = this.image.name = name;
  this.image.onload = function(){
    this.image.onclick = function(){
      document.location.href = this.name + "/index.html";
    }.bind(this);
    console.log("Loaded "+name+"'s icon, appending item id "+this.id+" to document.body");
    document.body.appendChild(this.image);
  }.bind(this);
};
function app_load(app_list){
  for(var i = 0; i < app_list.length; i ++){
    apps.push(new App(app_list[i], i));
  };
};

var stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
if( /Phone|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  stylesheet.href = stylesheet.src = 'stylesheet_mobile.css';
} else {
  stylesheet.href = stylesheet.src = 'stylesheet.css';
};
document.head.appendChild(stylesheet);
