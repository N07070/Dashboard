<?php

// Get a list of the all the plugins in the plugins/ Directory

    // read the configuration.json file, and for each plugin name that's activated :
        $configuration_file = fopen("config.json", "r") or die("Unable to open configuration file! Is it there ?");
            $configuration = json_decode(fread($configuration_file, filesize("config.json")), true);
        fclose($configuration_file);


        foreach ($configuration as $key => $value) {
            $plugin_name = $key;
            if ($value == 1) {
                error_log("[ OK ] The plugin : ".$plugin_name." is activated !", 0);
                $valid_plugin_config = 0;
                // Read it's plugin_name.json settings file
                $plugin_config_file = fopen("plugins/".$plugin_name."/".$plugin_name.".json", "r") or die("Unable to open configuration file for ".$plugin_name."! Is it there ?");
                    $plugin_configuration = json_decode(fread($plugin_config_file, filesize("plugins/".$plugin_name."/".$plugin_name.".json")), true);
                fclose($plugin_config_file);

                print_r($plugin_configuration);

                foreach ($plugin_configuration as $plugin_config_name => $plugin_config_value) {
                    // Check for the presence of : name, version, license, author, description, settings.
                    if ($plugin_config_name == "name" || $plugin_config_name == "version" || $plugin_config_name == "license" || $plugin_config_name == "author" || $plugin_config_name == "description" || $plugin_config_name == "settings") {
                        $valid_plugin_config = $valid_plugin_config + 1;
                    }
                    // check if name is a string and the name of the plugin in the config.json file.

                    // check if the version is a number and > 0.

                    // check if the license is a string

                    // check if the author is a string

                    // check if the description is a string

                    // check if the settings is an array

                    // check if settings[height] is an int

                    // check if settings[width] is an int

                    // check if settings[auto-update] is a boolean

                }
                if ($valid_plugin_config == 6 ) {
                    error_log("[ OK ] The plugin ".$plugin_name." has been loaded and is ready for use.", 0);
                } else {
                    error_log("[ ER ] The config file of ".$plugin_name." is invalid.");
                }
                    // If it's correct, then get it's plugin_name.html file, and it's plugin_name.js include that into a <div>

                    // Render the plugin or an error message.
            } else {
                error_log("[ ER ] The plugin : ".$plugin_name." is not activated ! Skipping...", 0);
            }
        }

?>
