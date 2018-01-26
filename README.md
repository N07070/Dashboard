# Dashboard

A small web dashboard for everything you need, at a glance. Free, as in Freedom.

![](./assets/img/readmeimg.png)

## Features

The Dashboard is a small website created in JS. It's supposed to be run via a command-line, at least for the moment. It works around plugins, disposed by material cards.

You want to see your twitter feed? Just make a plugin for it. You want to be able to see the forecast? Just add a plugin. You just want to display something useful? There's a plugin for that.

As making a plugin is **very** easy, I encourage you to make any plugin you think interesting. Just submit a pull request and I'll add it to the official list of plugins!

## How to run it?

Please note that this is still in development. Therefore, the only way for the moment is to run any local server in the directory where Dashboard is saved.

**Install instructions**:
* First, clone the project to the folder of your choice with git.
    * `git clone https://github.com/N07070/Dashboard`
* Then, go into the folder you just cloned.
    * `cd Dashbord`
* Adjust the config files.
    * `vim config.json` and the .json files of each plugin in `plugins/`
* Then, you should be able to run a small web server.
    * `python -m SimpleHTTPServer 8080`
* Please note that this way, you will need to keep the terminal open. If you wish to make it persistant, you need to kill any server on the port you want to serve the Dashbord ( i.e port 8080 in this case ) and then relaunch on with this command.
    * `nohup python -m SimpleHTTPServer 8080 &`
    * To kill it, type `pkill python`

Then, open your browser and go to <http://localhost:8080>.
You can also try it out at <http://n07070.github.io/Dashboard> (not updated)

## Plugins

A plugin is displayed as a card on the Dashboard. It's a small, smart and useful way to display information for your day.

### What are they for?

A plugin should be three things :

* *Smart* : It should provide useful information without me needing any interaction, or at least as little as possible.
* *Small* : It should be small enough to not monopolize the entire dashboard, yet big enough to be relevant.
* *Useful* : It should display something I want to know about. For example, I'd like to see a beautiful image of mountains display through the day. Most of the time, if it fits into the UNIX philosophies : do one one thing and do it well, then it should be okay. Can you do that ? Great !

### How should I make one?

It's so freaking easy. First of all, you need a name. Choose it carefully because it's very important. Then, create a folder with your plugin's name. In that folder, add at least theses three files :

* [plugin name].html
* [plugin name].js
* [plugin name].json

##### In the html file, the markup should be something like this:

```

<div>
    <!-- Here goes all the information you want to display. -->
</div>

<script src='./plugins/[plugin name]/[plugin name].js'></script>

<script> [plugin name](); </script>

```

In the div, you should display all your information, all the html ought to be in that div. In the script tags, you load your javascript, and in the second one, you use that one function.

##### In the js file, the markup should be something like this:

```
function [plugin name](){
    // Here goes all your code.
}
```

##### Last but not least, the json file should look alike with this markup:

```
{
  "name" : "[plugin name]",
  "version" : 0.1,
  "license" : "foo",
  "author" : "derp",
  "description" : "bar",
  "settings" : {
    "height" : 3,
    "width" : 4,
    "auto-update" : true
  }
}
```

Please make sure that your [plugin name].json file is exactly like that, otherwise, your plugin will not load.

Once all this is done, add your plugin name to the config.json file, and activate it by setting it to true.

Run the server, have fun!

### Can I do X?

Short answer : yup !

Long answer : Well, it depends ? Would you like your plugin to behave like that ? Well, do it, as long as it's still *smart, small and useful*. Also, please note that if your plugin is badly done, I may not add it to the official plugins.

### Current list of plugins

* **Core** : The first plugin, and the base of all the others. Does nothing more than display text. Use it to learn how to make your own plugins!
* **Time** : Displays the current time. More of a test in JQuery and JS than something you would like to use.
* **Weather App** : Do you want to know the current weather in your city ? Well, this app will display it for you!
* **Bananas** : And this is why I started writing guidelines.
* **Computer Information** : This plugin is more of a test than anything, and is not actived by default. It is used to display the information given by a RESTfull API, which is part of the [APy repo](https://github.com/N07070/APy).
* **Music** : A HTML5 music player that makes it easy to drap n' drop your own files to play with!
* **Twitter Search** : A plugin that displays a specific twitter search results.
