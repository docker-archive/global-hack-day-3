#!/usr/bin/python -u

'''
	Program Name: Appit
	Author: 	  Ronak Kogta, Sambuddha Basu
	Description:  git for your desktop Applications
'''

import dropbox
import glob, re, pickle, math, random
import dropbox
import getpass
import hashlib
import sys
import os

AUTH_TOKEN = 'R42X2fA2rIIAAAAAAAAAC_7-3E13jb7lSq_1VgY3DTtAKh9qRsCMrDtWoxKY2qK6'
username = ''
password = ''

def get_cred():
	global username, password
	username = raw_input('Enter username: ')
	password = getpass.getpass('Enter password: ')

def recur_pull_data(details):
	# If it is a directory, recursively pull all the files.
	if details['is_dir'] == True:
		contents = client.metadata(details['path'])
		for content in contents['contents']:
			recur_pull_data(content)
	else:
		filename = details['path'].split('/')
		filename = "/".join(filename[3:])
		filename = WORK_DIR + filename
		if not os.path.exists(os.path.dirname(filename)):
			os.makedirs(os.path.dirname(filename))
		file_data = client.get_file(details['path'])
		output = open(filename, 'wb')
		output.write(file_data.read())
		output.close()

def pull_data():
	try:
		orig_pass = client.get_file(username + "/.password")
		verify_pass = hashlib.md5()
		verify_pass.update(password)
		if verify_pass.hexdigest() == orig_pass.read():
			contents = client.metadata(username + "/content")
			print "Pulling data from the server."
			for cont in contents['contents']:
				recur_pull_data(cont)
		else:
			print "Authentication failure."
			sys.exit(-1)
	except dropbox.rest.ErrorResponse:
		print "Nothing to pull from."
		sys.exit(-1)

def push_data():
	verify_pass = hashlib.md5()
	verify_pass.update(password)
	try:
		orig_pass = client.get_file(username + "/.password")
		if verify_pass.hexdigest() != orig_pass.read():
			print "Authentication failure."
			sys.exit(-1)
	except dropbox.rest.ErrorResponse:
		print "Creating new account."
		client.put_file(username + "/.password", verify_pass.hexdigest())
	try:
		client.file_delete(username + "/content")
	except:
		pass

	# Finally, push the files to the server.
	print "Pushing data to the server."
	for root, dirnames, filenames in os.walk(WORK_DIR):
		root = os.path.abspath(root) + "/"
		for filename in filenames:
			file_data = open(root + filename, 'rb')
			file_path = username + "/content/" + os.path.relpath(root + filename, WORK_DIR)
			client.put_file(file_path, file_data.read())

if __name__ == '__main__':
	if len(sys.argv) < 3:
		print "Usage: ./appit.py <push/pull/search> <app_name>"
		sys.exit(-1)

	# Set the global variables
	COMMAND = sys.argv[1]
	APP_NAME = sys.argv[2]

	if APP_NAME != "firefox":
		print "Application not supported."
		sys.exit(-1)

	# Create the directory.
	home = os.path.expanduser("~")
	app_dirs = [home + "/.appit/firefox/cache", home + "/.appit/firefox/mozilla"]
	for app_dir in app_dirs:
		if not os.path.exists(app_dir):
			os.makedirs(app_dir)

	# Execute the command
	client = dropbox.client.DropboxClient(AUTH_TOKEN)

	if COMMAND == "pull":
		os.system("docker pull appit/firefox")
		get_cred()
		orig_username = username
		# Pull .cache
		WORK_DIR = app_dirs[0]
		username = orig_username + "_cache"
		pull_data()
		# Pull .mozilla
		WORK_DIR = app_dirs[1]
		username = orig_username + "_mozilla"
		pull_data()
	elif COMMAND == "push":
		os.system("docker push appit/firefox")
		get_cred()
		orig_username = username
		# Push .cache
		WORK_DIR = app_dirs[0]
		username = orig_username + "_cache"
		push_data()
		# Push .mozilla
		WORK_DIR = app_dirs[1]
		username = orig_username + "_mozilla"
		push_data()
	elif COMMAND == "search":
		os.system("docker search appit/firefox")
	elif COMMAND == "run":
		os.system("docker run -ti --rm -e DISPLAY=$DISPLAY -v " + app_dirs[0] + ":/home/developer/.cache -v " + app_dirs[1] + ":/home/developer/.mozilla -v /tmp/.X11-unix:/tmp/.X11-unix appit/firefox")