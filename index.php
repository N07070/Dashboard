<?php

// Get a list of the all the plugins in the plugins/ Directory

    // read the configuration.json file, and for each plugin name that's activated :
    $configuration = activate_plugins();

    validate_plugins($configuration);

function activate_plugins(){
    $configuration_file = fopen("config.json", "r") or die("Unable to open configuration file! Is it there ?");
        $list_of_activated_plugins = json_decode(fread($configuration_file, filesize("config.json")), true);
    fclose($configuration_file);

    return $list_of_activated_plugins;
}

function validate_plugins($configuration){

    // For each plugin listed in the config.json, we get it's name, and validate then load the shit outta him.
    foreach ($configuration as $key => $value) {

        $plugin_name = $key;

        if ($value == 1) {
            error_log("\x1b[32m\x1b[1m[ ✔️ ]\x1b[0m The plugin : ".$plugin_name." is activated !", 0);

            $valid_plugin_config = 0;

            // Read it's plugin_name.json settings file
            $plugin_config_file = fopen("plugins/".$plugin_name."/".$plugin_name.".json", "r") or die("Unable to open configuration file for ".$plugin_name."! Is it there ?");
                $plugin_configuration = json_decode(fread($plugin_config_file, filesize("plugins/".$plugin_name."/".$plugin_name.".json")), true);
            fclose($plugin_config_file);

            // We make sure that every field in the plugin config is valid.
            foreach ($plugin_configuration as $plugin_config_name => $plugin_config_value) {
                // Check for the presence of : name, version, license, author, description, settings.
                if ($plugin_config_name == "name" || $plugin_config_name == "version" || $plugin_config_name == "license" || $plugin_config_name == "author" || $plugin_config_name == "description" || $plugin_config_name == "settings") {
                    $valid_plugin_config = $valid_plugin_config + 1;
                }
            }
            if ($valid_plugin_config == 6 ) {

                // check if name is a string and the name of the plugin in the config.json file && check if the version is a number and > 0.
                if (is_string($plugin_configuration["name"]) && is_numeric($plugin_configuration["version"]) && $plugin_configuration["version"] > 0) {

                    // Check if the license, author and description are strings.
                    if (is_string($plugin_configuration["license"]) && is_string($plugin_configuration["author"]) && is_string($plugin_configuration["description"])) {

                        // Check if the settings is an array
                        if (is_array($plugin_configuration["settings"])) {

                            // check if settings[height] is an int, settings[width] is an int, settings[auto-update] is a boolean
                            if (is_int($plugin_configuration["settings"]["height"]) && is_int($plugin_configuration["settings"]["width"]) && is_bool($plugin_configuration["settings"]["auto-update"])) {

                                error_log("\x1b[32m\x1b[1m[ ✔️ ]\x1b[0m The plugin : ".$plugin_name." has been loaded and is ready for use.", 0);
                                // error_log("\n> [".$plugin_configuration['name']."]\n  [Version] > ".$plugin_configuration['version']."\n  [Author] > ".$plugin_configuration['author']."\n  [Description] > ".$plugin_configuration['description']);

                                // When we made sure that the plugin config file is okay, we load it and render it.
                                load_plugin($plugin_name);


                            } else {
                                error_log("\x1b[31m\x1b[1m[ ❌ ]\x1b[0m The plugin : ".$plugin_name." has an invalid config file : the height, width should be ints, and auto-update a boolean", 0);
                            }
                        } else {
                            error_log("\x1b[31m\x1b[1m[ ❌ ]\x1b[0m The plugin : ".$plugin_name." has an invalid config file : settings should contain the height, width and auto-update value.", 0);
                        }
                    } else {
                        error_log("\x1b[31m\x1b[1m[ ❌ ]\x1b[0m The plugin : ".$plugin_name." has an invalid config file : the license, author and description should be a string.", 0);
                    }
                } else {
                    error_log("\x1b[31m\x1b[1m[ ❌ ]\x1b[0m The plugin : ".$plugin_name." has an invalid config file : the name should be a string, the version a number.", 0);
                }
            } else {
                error_log("\x1b[31m\x1b[1m[ ❌ ]\x1b[0m The plugin : ".$plugin_name." has an invalid config file: it should be made like the core plugin.", 0);
            }

        } else {
            error_log("\x1b[31m\x1b[1m[ ❌ ]\x1b[0m The plugin : ".$plugin_name." is not activated ! Skipping...", 0);
        }
    }
}

function load_plugin($the_plugin_name){
    // If it's correct, then get it's plugin_name.html file, include that into a <div>
    $plugin_html_file = fopen("plugins/".$the_plugin_name."/".$the_plugin_name.".html", "r") or die("Unable to open configuration file for ".$the_plugin_name."! Is it there ?");
        $plugin_html_core = fread($plugin_html_file, filesize("plugins/".$the_plugin_name."/".$the_plugin_name.".html"));
    fclose($plugin_html_file);

    echo("<div>
        ".$plugin_html_core."
    </div>");
    // Render the plugin or an error message.


}

?>
