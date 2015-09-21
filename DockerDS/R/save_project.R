#' Saves project to the Docker Hub
#'
#' @param project.path full path to the projects folder. Final project folder will be \code{project.path / title}
#' @param image Docker image
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
save_project <- function(project.path = getwd(), 
                         image = "debian", 
                         docker = "docker",
                         tag = "", # currently unused
                         repo = "", 
                         account = list(user = "", password = "", email = "")) {
  
  # Reads signature------------------------------------------------------------
  title <- tryCatch({
    con <- file(paste(project.path, ".info_rdocker", sep = "/"), open = "r")
    .title <- readLines(con = con)
    close(con)
    .title
  }, error = function(err) {
    stop(err)
  })
  
  # Snapshot packages----------------------------------------------------------
  packrat::snapshot(project = "~/Documents/Data/Iris/demo_DockerDS/")
  
  # Bundles project------------------------------------------------------------
  .name.bundle <- paste0(title, "_project.DockerDS")
  .path.bundle <- paste0(tempdir(), "/", .name.bundle)
  packrat::bundle(project = project.path, 
                  include.src = TRUE, 
                  include.lib = TRUE, 
                  file = .path.bundle, 
                  overwrite = TRUE)
  
  # Saves workspace------------------------------------------------------------
  .name.workspace <- paste0(title, "_workspace.DockerDS")
  .path.workspace <- paste0(tempdir(), "/", .name.workspace)
  save.image(file = .path.workspace)
  
  # Writes files to container--------------------------------------------------
  
  # (1) Starts daemon
  container_id <- system_call(sprintf("%s run -di %s /bin/bash", docker, image))
  
  # (2) Makes folder
  system_call(sprintf("%s exec %s /bin/bash -c 'mkdir -p /home/DockerDS'", docker, container_id))
  
  # (3) Copies files
  system_call(sprintf("%s exec -i %s /bin/bash -c 'cat > /home/DockerDS/%s' < %s", docker, container_id, .name.bundle, .path.bundle))
  system_call(sprintf("%s exec -i %s /bin/bash -c 'cat > /home/DockerDS/%s' < %s", docker, container_id, .name.workspace, .path.workspace))
  
  # (4) Stops container
  system_call(sprintf("%s stop %s", docker, container_id))
  
  # (5) Commits results
  system_call(sprintf("%s commit %s %s", docker, container_id, repo))
  
  # (6) Pushes image to the hub
  if (account$user != "") {
    hub <- system_call(sprintf("%s login -u '%s' -p '%s' -e '%s' && %s push %s", 
                               docker, account$user, account$password, account$email, docker, repo))
  } else {
    hub <- "Image is not pushed to the hub. Please, provide credentials..."
  }
    
  hub
}

