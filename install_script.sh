#!/bin/bash
# Init
FILE="/tmp/out.$$"
GREP="/bin/grep"
#....
# Make sure only root can run our script
if [[ $EUID -ne 0 ]]; then
   	echo "This script must be run as root" 1>&2
   	exit 1
else
	echo -e "\n>> I will now install git, python, and run a simple HTTP server on http://localhost:8080 . \n "
	apt-get install git -y
	git clone https://github.com/N07070/Dashboard
	cd Dashboard
	echo -e "\n>> I will now run the web server. To quit it, just press CTRL-C. For futur use, DO NOT USE THIS SCRIPT. \n Just go into the Dashboard directory and run 'python -m SimpleHTTPServer 8080' "
	python -m SimpleHTTPServer 8080
fi
# ...
