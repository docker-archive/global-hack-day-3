#' Loads project from the Docker Hub
#'
#' @param title title of the project
#' @param project.path full path to the projects folder. Final project folder will be \code{project.path / title}
#' @param docker command for docker, i.e. "docker" or "sudo docker"
#' @param tag tag for the image
#' @param repo Docker Hub repository
#' @param account list with three elements (corresponds to Docker Hub account)
#' - user
#' - password
#' - email
#'  
#' @return Status of completion
#'
load_project <- function(title,
                         project.path, 
                         docker = "docker",
                         tag = "", # currently unused
                         repo = "", 
                         account = list(user = "", password = "", email = "")) {
  
  if (file.exists(project.path)) {
    stop("Project folder already exists!")
  }
  
  # Pulls image from the hub
  if (account$user != "") {
    system_call(sprintf("%s login -u '%s' -p '%s' -e '%s' && %s pull %s", 
                        docker, account$user, account$password, account$email, docker, repo))
  } else {
    warning("Image is not pulled from the hub. Please, provide credentials...")
  }
  
  # Reads files from container-------------------------------------------------

  # (1) Starts daemon
  container_id <- system_call(sprintf("%s run -di %s /bin/bash", docker, repo))
  
  # (2) Copies files
  .project.path_container <- sprintf("/home/DockerDS/%s_project.DockerDS", title)
  .workspace.path_container <- sprintf("/home/DockerDS/%s_workspace.DockerDS", title)
  
  .temp.dir <- tempdir()
  .project.path <- paste0(.temp.dir, sprintf("/%s_project.DockerDS", title))
  .workspace.path <- paste0(.temp.dir, sprintf("/%s_workspace.DockerDS", title))
  
  system_call(sprintf("%s cp %s:%s %s", docker, container_id, .project.path_container, .temp.dir))
  system_call(sprintf("%s cp %s:%s %s", docker, container_id, .workspace.path_container, .temp.dir))
  
  # (3) Stops container
  system_call(sprintf("%s stop %s", docker, container_id))
  
  # Unpacks project------------------------------------------------------------
  dir.create(project.path, showWarnings = FALSE, recursive = TRUE)
  packrat::unbundle(bundle = .project.path, where = project.path)
  
  to_copy <- list.files(paste(project.path, title, sep = "/"), recursive = FALSE, 
                        all.files = TRUE, no.. = TRUE, full.names = TRUE)
  file.copy(from = to_copy, to = project.path, recursive = TRUE)
  unlink(paste(project.path, title, sep = "/"), recursive = TRUE)

  # Restores workspace---------------------------------------------------------
  load(file = .workspace.path, envir = .GlobalEnv)

  # Inits project--------------------------------------------------------------
  packrat::init(project.path, restart = FALSE)
  
  return(invisible(TRUE))
}

