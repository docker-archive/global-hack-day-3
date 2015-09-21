package project

import (
	"errors"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/docker/libcompose/cli/logger"
	"github.com/docker/libcompose/docker"
	"github.com/docker/libcompose/project"
	"gopkg.in/yaml.v2"
)

type BuildConfig struct {
	ComposeFile string `yaml:"compose_file,omitempty"`
	Service     string `yaml:"service"`
	Command     string `yaml:"command"`
}

func (buildConfig *BuildConfig) CommandParts() []string {
	return strings.Split(buildConfig.Command, " ")
}

func LoadBuildConfig() (*BuildConfig, error) {
	filename, _ := filepath.Abs("./.emerald.yml")
	yamlFile, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var config BuildConfig
	err = yaml.Unmarshal(yamlFile, &config)
	if err != nil {
		return nil, err
	}

	if config.ComposeFile == "" {
		config.ComposeFile = "docker-compose.yml"
	}
	if config.Service == "" {
		return nil, errors.New("Service must not be empty in the yml config")
	}
	if config.Command == "" {
		return nil, errors.New("Command must not be empty in the yml config")
	}

	return &config, nil
}

func BuildComposeProject(composeFile string) (*project.Project, error) {
	project, err := docker.NewProject(&docker.Context{
		Context: project.Context{
			ComposeFile:   composeFile,
			ProjectName:   projectNameByGitProject(),
			LoggerFactory: logger.NewColorLoggerFactory(),
		},
	})
	if err != nil {
		return nil, err
	}
	sanitizeConfig(project)

	return project, nil
}

func sanitizeConfig(project *project.Project) {
	for _, config := range project.Configs {
		config.Volumes = nil
		config.Privileged = false
		sanitizedPorts := make([]string, len(config.Ports))
		for index, port := range config.Ports {
			sanitizedPort := port
			if strings.Contains(port, ":") {
				sanitizedPort = strings.SplitN(port, ":", 2)[1]
			}
			sanitizedPorts[index] = sanitizedPort
		}
		config.Ports = sanitizedPorts
	}
}

func projectNameByGitProject() string {
	projectName := os.Getenv("PROJECT_NAME")
	if projectName == "" {
		return "project"
	}
	return projectName
}
