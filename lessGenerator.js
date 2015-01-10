var fs = require('fs');
var path = require('path');

var classified = {
  props: {},
  varssuffix: {"min": 10, "max": 200, "step": 5, "unit": "px"},
  vars: {"default": "default"},
  sassVars: {"default": "default"},
  loops:[],
  readProps: function(){
    var data = fs.readFileSync(path.join(__dirname, "CSSProperties.json"), 'utf8') || "[]";
    return JSON.parse(data);
  },
  saveFile: function(data, name, callback){
    fs.writeFileSync(path.join(__dirname, "src", name), data);
    if(callback && typeof callback == "function") callback(null, data);
  },
  init: function(){
    this.props = this.readProps();
    this.generate();
  },
  generate: function() {
    var loopedProps = this.generateLoopedProps();
    var props = this.generateProps();
    var loopedPropsData = "";
    var vars = "";
    var sassVars = "";
    var less = "";
    var sass = "";
    for(var i in this.loops){
      var propName = this.loops[i].name;
      var propCounter = this.loops[i].counter;
      loopedPropsData += "." + propName + "s(@" + propCounter + "-min);\n\r"
    }
    for(var i in this.vars){
      var varName = this.vars[i];
      for(var k in this.varssuffix){
        suffix = this.varssuffix[k];
        vars += "@" + varName + "-" + k + ":" + suffix + ";\r\n";
      }
      vars += "\r\n";
    }

    // less files
    less = "@import \"./variables.less\";\r\n";
    less += "@import \"./increments.less\";\r\n";
    less += "@import \"./properties.less\";\r\n";

    this.saveFile(vars, "variables.less");
    this.saveFile(loopedProps, "increments.less");
    this.saveFile(loopedPropsData + props, "properties.less");
    this.saveFile(less, "classified.less");

    for(var i in this.sassVars){
      var varName = this.sassVars[i];
      for(var k in this.varssuffix){
        suffix = this.varssuffix[k];
        sassVars += "$" + varName + "-" + k + ":" + suffix + ";\r\n";
      }
      sassVars += "\r\n";
    }


    this.saveFile(sassVars, "variables.scss");
    
    // sass files
    sass += "@import \"variables\";\r\n";
    sass += "@import \"increments\";\r\n";
    sass += "@import \"properties\";\r\n";

    this.saveFile(sass, "classified.scss");
  },
  generateLoopedProps: function() {
    var less = "";
    for(var i in this.props){
      var prop = this.props[i];
      var propName = i;
      if(prop.counter){
        classified.vars[prop.counter] = prop.counter;
        classified.loops.push({counter:prop.counter, name:propName})
        less += "\r\n." + propName + "s(@" + prop.counter + ") when (@" + prop.counter + " =< @" + prop.counter + "-max){\r\n";
        less += "\t." + this.shortHand(propName) + "-@{" + prop.counter + "} ,\r\n"
        less += "\t." + propName + "-@{" + prop.counter + "} {\r\n"
        less += "\t\t" + propName + ": ~'@{"+ prop.counter + "}@{" + prop.counter + "-unit}' ;\r\n";
        less += "\t}\r\n";
        less += "\t." + propName + "s((@" + prop.counter + " + @" + prop.counter + "-step))\r\n"
        less += "}\r\n";
      }
    }
    return less;
  },
  generateProps: function() {
    var less = "";
    for(var i in this.props){
      var prop = this.props[i];
      var propName = i;
      if(prop.values && prop.values.length){
        for(var k in prop.values){
          var propValue = prop.values[k].replace("()","");
          less += "\r\n." + this.shortHand(propName) + "-" + propValue + ",";
          less += "\r\n." + propName + "-" + propValue + "{\r\n";
          less += "\t" + propName + ":" + propValue + "\r\n";
          less += "}\r\n";
        }
      }
    }
    return less;
  },
  shortHand: function(text) {
    var sections = text.split('-');
    var shortHand = [];
    if(sections.length){
      for(var i in sections){
        shortHand.push(sections[i].substring(0,1));
      }
      shortHand = shortHand.join('');
    }
    return shortHand;
  }
}

classified.init();
