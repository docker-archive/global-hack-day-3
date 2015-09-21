import six
import unittest
from traductor.translators import (cap_add, cap_drop, container_name, cpu_shares, cpuset, devices,
    dns, dns_search, entrypoint, env_file, environment, expose, hostname, labels, links,
    log_driver, mac_address, mem_limit, memswap_limit, net, pid, ports, privileged, read_only,
    restart, stdin_open, tty, user, volume_driver, volumes, volumes_from, working_dir)


class TestCapAdd(unittest.TestCase):

    def test_coversion(self):

        input=["ALL"]
        expected_output="--cap-add=ALL"

        output=cap_add.CapAdd().translate(input)

        self.assertEqual(output, expected_output)


    def test_coversion_fail(self):

        input="NOTALL"
        expected_output=""

        output=cap_add.CapAdd().translate(input)

        self.assertEqual(output, expected_output)


class TestCapDrop(unittest.TestCase):

    def test_coversion(self):

        input=["NET_ADMIN", "SYS_ADMIN"]
        expected_output="--cap-drop=NET_ADMIN --cap-drop=SYS_ADMIN"

        output=cap_drop.CapDrop().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=("NET_ADMIN", "SYS_ADMIN")
        expected_output=""

        output=cap_drop.CapDrop().translate(input)

        self.assertEqual(output, expected_output)



class TestContainerName(unittest.TestCase):

    def test_coversion(self):

        input="my-web-container"
        expected_output="--name=my-web-container"

        output=container_name.ContainerName().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=container_name.ContainerName().translate(input)

        self.assertEqual(output, expected_output)



class TestCpuShares(unittest.TestCase):

    def test_coversion(self):

        input="4"
        expected_output="--cpu-shares=4"

        output=cpu_shares.CpuShares().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=cpu_shares.CpuShares().translate(input)

        self.assertEqual(output, expected_output)



class TestCpuset(unittest.TestCase):

    def test_coversion(self):

        input="0,1"
        expected_output="--cpuset-cpus=0,1"

        output=cpuset.Cpuset().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=cpuset.Cpuset().translate(input)

        self.assertEqual(output, expected_output)



class TestDevices(unittest.TestCase):

    def test_coversion(self):

        input=["/dev/ttyUSB0:/dev/ttyUSB0", "/dev/ttyUSB1:/dev/ttyUSB1"]
        expected_output="--device=/dev/ttyUSB0:/dev/ttyUSB0 --device=/dev/ttyUSB1:/dev/ttyUSB1"

        output=devices.Devices().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=devices.Devices().translate(input)

        self.assertEqual(output, expected_output)



class TestDns(unittest.TestCase):

    def test_coversion_with_string(self):

        input="8.8.8.8"
        expected_output="--dns=8.8.8.8"

        output=dns.Dns().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_with_list(self):

        input=["8.8.8.8", "8.8.4.4"]
        expected_output="--dns=8.8.8.8 --dns=8.8.4.4"

        output=dns.Dns().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=dns.Dns().translate(input)

        self.assertEqual(output, expected_output)



class TestDnsSearch(unittest.TestCase):

    def test_coversion_with_string(self):

        input="8.8.8.8"
        expected_output="--dns-search=8.8.8.8"

        output=dns_search.DnsSearch().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_with_list(self):

        input=["8.8.8.8", "8.8.4.4"]
        expected_output="--dns-search=8.8.8.8 --dns-search=8.8.4.4"

        output=dns_search.DnsSearch().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=dns_search.DnsSearch().translate(input)

        self.assertEqual(output, expected_output)


class TestEntrypoint(unittest.TestCase):

    def test_coversion(self):

        input="/code/entrypoint.sh"
        expected_output="--entrypoint=/code/entrypoint.sh"

        output=entrypoint.Entrypoint().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=entrypoint.Entrypoint().translate(input)

        self.assertEqual(output, expected_output)



class TestEnvFile(unittest.TestCase):

    def test_coversion_with_string(self):

        input=".env"
        expected_output="--env-file=.env"

        output=env_file.EnvFile().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_with_list(self):

        input=["./common.env", "./apps/web.env"]
        expected_output="--env-file=./common.env --env-file=./apps/web.env"

        output=env_file.EnvFile().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=env_file.EnvFile().translate(input)

        self.assertEqual(output, expected_output)



class TestEnvironment(unittest.TestCase):

    def test_coversion_with_dict(self):

        input={
            "RACK_ENV": "development",
            "SESSION_SECRET": "",
        }
        expected_output="--env=RACK_ENV:development --env=SESSION_SECRET:"

        output=environment.Environment().translate(input)

        self.assertTrue(output, expected_output)

    def test_coversion_with_list(self):

        input=["RACK_ENV=development", "SESSION_SECRET"]
        expected_output="--env=RACK_ENV:development --env=SESSION_SECRET:"

        output=environment.Environment().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=environment.Environment().translate(input)

        self.assertEqual(output, expected_output)



class TestExpose(unittest.TestCase):

    def test_coversion(self):

        input=["3000", "8000"]
        expected_output="--expose=3000 --expose=8000"

        output=expose.Expose().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=expose.Expose().translate(input)

        self.assertEqual(output, expected_output)



class TestHostname(unittest.TestCase):

    def test_coversion(self):

        input="foo"
        expected_output="--hostname=foo"

        output=hostname.Hostname().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=hostname.Hostname().translate(input)

        self.assertEqual(output, expected_output)



class TestLabels(unittest.TestCase):

    def test_coversion_with_dict(self):

        input={
            "com.example.description": "Accounting webapp",
            "com.example.department": "Finance",
            "com.example.label-with-empty-value": "",
        }
        expected_output="--label=com.example.description:Accounting webapp " \
                        "--label=com.example.department:Finance --label=com.example.label-with-empty-value:"

        output=labels.Labels().translate(input)

        self.assertTrue(output, expected_output)

    def test_coversion_with_list(self):

        input=[
            "com.example.description=Accounting webapp",
            "com.example.department=Finance",
            "com.example.label-with-empty-value",
        ]
        expected_output="--label=com.example.description:Accounting webapp " \
                        "--label=com.example.department:Finance --label=com.example.label-with-empty-value:"

        output=labels.Labels().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=labels.Labels().translate(input)

        self.assertEqual(output, expected_output)



class TestLinks(unittest.TestCase):

    def test_coversion(self):

        input=["db", "db:database", "redis"]
        expected_output="--link=db --link=db:database --link=redis"

        output=links.Links().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=links.Links().translate(input)

        self.assertEqual(output, expected_output)



class TestLogDriver(unittest.TestCase):

    def test_coversion(self):

        input="json-file"
        expected_output="--log-driver=json-file"

        output=log_driver.LogDriver().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=log_driver.LogDriver().translate(input)

        self.assertEqual(output, expected_output)



class TestMacAddress(unittest.TestCase):

    def test_coversion(self):

        input="02:42:ac:11:65:43"
        expected_output="--mac-address=02:42:ac:11:65:43"

        output=mac_address.MacAddress().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=mac_address.MacAddress().translate(input)

        self.assertEqual(output, expected_output)



class TestMemLimit(unittest.TestCase):

    def test_coversion(self):

        input="1000000000"
        expected_output="--memory=1000000000"

        output=mem_limit.MemLimit().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=mem_limit.MemLimit().translate(input)

        self.assertEqual(output, expected_output)



class TestMemswapLimit(unittest.TestCase):

    def test_coversion(self):

        input="2000000000"
        expected_output="--memory-swap=2000000000"

        output=memswap_limit.MemswapLimit().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=memswap_limit.MemswapLimit().translate(input)

        self.assertEqual(output, expected_output)



class TestNet(unittest.TestCase):

    def test_coversion(self):

        input="host"
        expected_output="--net=host"

        output=net.Net().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=net.Net().translate(input)

        self.assertEqual(output, expected_output)



class TestPid(unittest.TestCase):

    def test_coversion(self):

        input="host"
        expected_output="--pid=host"

        output=pid.Pid().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=pid.Pid().translate(input)

        self.assertEqual(output, expected_output)



class TestPorts(unittest.TestCase):

    def test_coversion(self):

        input=[
            "3000",
            "8000:8000",
            "49100:22",
            "127.0.0.1:8001:8001",
        ]
        expected_output="--publish=3000 --publish=8000:8000 --publish=49100:22 " \
                        "--publish=127.0.0.1:8001:8001"

        output=ports.Ports().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=ports.Ports().translate(input)

        self.assertEqual(output, expected_output)



class TestPrivileged(unittest.TestCase):

    def test_coversion(self):

        input="true"
        expected_output="--privileged=true"

        output=privileged.Privileged().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=privileged.Privileged().translate(input)

        self.assertEqual(output, expected_output)



class TestReadOnly(unittest.TestCase):

    def test_coversion(self):

        input="true"
        expected_output="--read-only=true"

        output=read_only.ReadOnly().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=read_only.ReadOnly().translate(input)

        self.assertEqual(output, expected_output)



class TestRestart(unittest.TestCase):

    def test_coversion(self):

        input="always"
        expected_output="--restart=always"

        output=restart.Restart().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=restart.Restart().translate(input)

        self.assertEqual(output, expected_output)



class TestStdinOpen(unittest.TestCase):

    def test_coversion(self):

        input="true"
        expected_output="--interactive=true"

        output=stdin_open.StdinOpen().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=stdin_open.StdinOpen().translate(input)

        self.assertEqual(output, expected_output)



class TestTty(unittest.TestCase):

    def test_coversion(self):

        input="true"
        expected_output="--tty=true"

        output=tty.Tty().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=tty.Tty().translate(input)

        self.assertEqual(output, expected_output)


class TestUser(unittest.TestCase):

    def test_coversion(self):

        input="postgresql:datastore"
        expected_output="--user=postgresql:datastore"

        output=user.User().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=user.User().translate(input)

        self.assertEqual(output, expected_output)


class TestVolumeDriver(unittest.TestCase):

    def test_coversion(self):

        input="mydriver"
        expected_output="--volume-driver=mydriver"

        output=volume_driver.VolumeDriver().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=volume_driver.VolumeDriver().translate(input)

        self.assertEqual(output, expected_output)


class TestVolumes(unittest.TestCase):

    def test_coversion(self):

        input=[
            "/var/lib/mysql",
            "./cache:/tmp/cache",
            "~/configs:/etc/configs/:ro",
        ]
        expected_output="--volume=/var/lib/mysql --volume=./cache:/tmp/cache " \
                        "--volume=~/configs:/etc/configs/:ro"

        output=volumes.Volumes().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=volumes.Volumes().translate(input)

        self.assertEqual(output, expected_output)


class TestVolumesFrom(unittest.TestCase):

    def test_coversion(self):

        input=["service_name", "container_name"]
        expected_output="--volumes-from=service_name --volumes-from=container_name"

        output=volumes_from.VolumesFrom().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=volumes_from.VolumesFrom().translate(input)

        self.assertEqual(output, expected_output)


class TestWorkingDir(unittest.TestCase):

    def test_coversion(self):

        input="/code"
        expected_output="--workdir=/code"

        output=working_dir.WorkingDir().translate(input)

        self.assertEqual(output, expected_output)

    def test_coversion_fail(self):

        input=""
        expected_output=""

        output=working_dir.WorkingDir().translate(input)

        self.assertEqual(output, expected_output)
