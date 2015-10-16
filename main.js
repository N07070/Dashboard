function main() {
  var xobj = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'config.json', true);
  xobj.onreadystatechange = function() {
    if(xobj.status == 404) {
      console.log('\x1b[31m\x1b[1m[ ❌ ]\x1b[0m config.json missing');
    }

    if(xobj.readyState == 4) {
      loadPlugins(JSON.parse(xobj.responseText));
    }
  }
  xobj.send(null);
}

function loadPlugins(config) {
  //For each plugin in config.json, get its name and validate it and then load it
  for(var key in config) {
    if(config.hasOwnProperty(key)) {
      validatePlugin(key,config[key]);
    }
  }
}

function validatePlugin(pluginName, pluginValue) {
  if(pluginValue == false) {
    console.log("\x1b[31m\x1b[1m[ ❌ ]\x1b[0m" + pluginName + " is not enabled");
    return;
  }

  var xobj = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'plugins/' + pluginName + '/' + pluginName + '.json', true);
  xobj.onreadystatechange = function() {
    if(xobj.status == 404) {
      console.log("\x1b[31m\x1b[1m[ ❌ ]\x1b[0m" + pluginName + ' is missing a config file');
      return;
    }

    if(xobj.readyState == 4) {
      var pluginConfig = JSON.parse(xobj.responseText);
      var checkCounter = 0;
      for(var key in pluginConfig) {
        if(pluginConfig.hasOwnProperty(key)) {
	  if(key == 'name' || key == 'version' || key == 'license' || key == 'author' || key == 'description' || key == 'settings') {
            checkCounter++;
          }
	}
      }

      if(checkCounter == 6) {
        if(pluginConfig['version'] <= 0) {
          console.log("\x1b[31m\x1b[1m[ ❌ ]\x1b[0m" + pluginName + "\'s version number is not positive: " +  pluginConfig['version']);
          return;
        }

        if(loadPlugin(pluginName, pluginConfig)) {
          return;
        }
      }
      else {
        console.log("\x1b[32m\x1b[1m[ ✔️ ]\x1b[0m" + pluginName + " has loaded!");
        return;
      }
    }
  }
  xobj.send(null);

}

//Actually load the pluginName.html file
function loadPlugin(pluginName, pluginConfig) {
  var xobj = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'plugins/' + pluginName + '/' + pluginName + '.html', true);
  xobj.onreadystatechange = function() {
    if(xobj.status == 404) {
      console.log("\x1b[31m\x1b[1m[ ❌ ]\x1b[0m" + 'Unable to open body file for ' + pluginName + '! Is it there?')
      return;
    }

    if(xobj.readyState == 4) {
      var pluginText = xobj.responseText;
      var textToInsert = "<div class='plugin card col-md-" + pluginConfig['settings'].width + "' id='" + pluginName + "'> <span class='title'>" + pluginConfig['name'] + "</span> <div class='content'>" + pluginText + " </div> </div>"
      $('#plugins').append(textToInsert);
    }
  }
  xobj.send(null);
}

window.onload = main
