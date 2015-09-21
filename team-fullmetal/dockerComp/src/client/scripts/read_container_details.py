from subprocess import Popen, PIPE
import json

f = open('../containers_details','rb')
cmd = ['docker','inspect']

details = []
print f.readline()

ids = []

with f as openfileobject:
    for line in openfileobject:
        ids.append(line.split()[-1])

for _id in ids:
    command = ' '.join(cmd+[_id])
    p = Popen(command, shell=True, stdout=PIPE, stderr=PIPE, close_fds=True)
    stdout, stderr = p.communicate()
    retcode = p.returncode
    details.extend(json.loads(stdout))

json.dump(details, open('../container_info.json','wb'))
