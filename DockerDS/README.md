# README

## Prerequisites

* Docker is installed
* `debian` image is installed
* `docker` can be executed without `sudo`
* Local `R` + `RStudio` installation
* Local packages are all up-to-date

## Installation

```r
devtools::install_github(repo = "ihansel/DockerDS")
```

## Usage

### Create new project

```r
# Creates project
rdocker::create_project("demo_DockerDS", "/home/user/projects")
```

### Routine

```r
install.packages("ggplot2")
library(ggplot2)

x <- data.frame(a = 1:10, b = 10:1)
g <- ggplot(data = x) +
  geom_line(aes(x = a, y = b))
g  
ggsave("demo_plot.png", g)
```

### Save project

```r
rdocker::save_project(project.path = "/home/user/projects/demo_DockerDS",
                      image = "debian",
                      repo = "ihansel/DockerDS", 
                      account = list(user = "<DOCKER-USER>", password = "<DOCKER-PASSWORD>", email = "<DOCKER-EMAIL>"))
```

### Exit session

### Load project

```r
rdocker::load_project(title = "demo_rdocker",
                      project.path = "/home/user/projects/demo_DockerDS_restored",
                      repo = "ihansel/DockerDS", 
                      account = list(user = "<DOCKER-USER>", password = "<DOCKER-PASSWORD>", email = "<DOCKER-EMAIL>"))

# Try to access variables from saved workspace
g
```

