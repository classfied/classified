var fs = require('fs');
var path = require('path');

var classified = {
  props: {},
  varssuffix: {"min": 5, "max": 200, "step": 5, "unit": "px"},
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
    var sassVars = "";
    var sass = "";


    for(var i in this.loops){
      var propName = this.loops[i].name;
      var propCounter = this.loops[i].counter;
      loopedPropsData += "." + propName + "s(@" + propCounter + "-min);\n\r"
    }
    for(var i in this.sassVars){
      var varName = this.sassVars[i];
      for(var k in this.varssuffix){
        suffix = this.varssuffix[k];
        sassVars += "$" + varName + "-" + k + ":" + suffix + ";\r\n";
      }
      sassVars += "\r\n";
    }

  
    // sass files
    sass += "@import \"variables\";\r\n";
    sass += "@import \"increments\";\r\n";
    sass += "@import \"properties\";\r\n";

    this.saveFile(sass, "classified.scss");
    this.saveFile(sassVars, "variables.scss");
    // this.saveFile(loopedProps, "increments.scss");
    // this.saveFile(loopedPropsData + props, "properties.scss");
    this.saveFile(props, "properties.scss");

  },
  generateLoopedProps: function() {
    var sass = "";
    for(var i in this.props){
      var prop = this.props[i];
      var propName = i;
      if(prop.counter){
        classified.sassVars[prop.counter] = prop.counter;
        classified.loops.push({counter:prop.counter, name:propName})
        sass += "\r\n." + propName + "s(@" + prop.counter + ") when (@" + prop.counter + " =< @" + prop.counter + "-max){\r\n";
        sass += "\t." + this.shortHand(propName) + "-@{" + prop.counter + "} ,\r\n"
        sass += "\t." + propName + "-@{" + prop.counter + "} {\r\n"
        sass += "\t\t" + propName + ": ~'@{"+ prop.counter + "}@{" + prop.counter + "-unit}' ;\r\n";
        sass += "\t}\r\n";
        sass += "\t." + propName + "s((@" + prop.counter + " + @" + prop.counter + "-step))\r\n"
        sass += "}\r\n";
      }
    }
    return sass;
  },
  generateProps: function() {
    var sass = "";
    for(var i in this.props){
      var prop = this.props[i];
      var propName = i;
      if(prop.values && prop.values.length){
        for(var k in prop.values){
          var propValue = prop.values[k].replace("()","");
          sass += "\r\n." + this.shortHand(propName) + "-" + propValue + ",";
          sass += "\r\n." + propName + "-" + propValue + "{\r\n";
          sass += "\t" + propName + ":" + propValue + "\r\n";
          sass += "}\r\n";
        }
      }
    }
    return sass;
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
